// ============================================================
// Apollo 13: Fix the Air – Score Submission Edge Function
// Deno + Supabase Edge Runtime
// ============================================================
// Deploy: supabase functions deploy submit-score --no-verify-jwt
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ---- Validation constants (must match js/game.js) ----
const ALLOWED_DURATIONS = [180, 300, 480];

// Canister is already in the cabin → not logged.
// KEEP IN SYNC with js/game.js (PART, ROLES, PREREQ)
const ROLE_OF: Record<string, string> = {
  cover: "shape", check: "shape",
  bag: "sleeve",  stow: "sleeve",
  hose: "hose",   tape: "seal",
};
const ROLES = ["shape", "sleeve", "hose", "seal"];
const PREREQ: Record<string, string[]> = {
  hose: ["shape"],
  seal: ["shape", "sleeve", "hose"],
};

const MIN_TIME_PER_STEP_MS = 900;
const MAX_HINTS = 3;
const MAX_MISTAKES = 40;
const GAME_VERSION = "2.2";                 // ← must match config.js
const RATE_LIMIT_PLAYER = 8;
const RATE_LIMIT_IP = 25;
const WINDOW_MS = 60 * 60 * 1000;

const BAD_WORDS = [
  "fuck", "shit", "asshole", "bitch", "cunt", "dick", "nigger", "nigga",
  "faggot", "retard", "whore", "slut", "piss", "crap", "damn", "bastard",
];

function cleanNickname(raw: string): string | null {
  if (typeof raw !== "string") return null;
  const n = raw.trim().replace(/\s+/g, " ");
  if (n.length < 3 || n.length > 16) return null;
  if (!/^[A-Za-z0-9 _]+$/.test(n)) return null;
  const lower = n.toLowerCase();
  for (const w of BAD_WORDS) {
    if (lower.includes(w)) return null;
  }
  return n;
}

function cleanClassCode(raw: unknown): string | null {
  if (raw === null || raw === undefined || raw === "") return null;
  if (typeof raw !== "string") return null;
  const c = raw.trim().toUpperCase();
  if (c.length < 4 || c.length > 8) return null;
  if (!/^[A-Z0-9]+$/.test(c)) return null;
  return c;
}

function computeScore(timeLeft: number, hints: number, mistakes: number): number {
  return Math.max(0, Math.round(1000 + timeLeft * 3 - hints * 100 - mistakes * 25));
}

function validateLog(log: any[], duration: number): { ok: boolean; reason?: string } {
  if (!Array.isArray(log) || log.length !== ROLES.length) {
    return { ok: false, reason: "Invalid step count" };
  }
  const filled = new Set<string>();
  let prevT = -1;
  for (let i = 0; i < log.length; i++) {
    const entry = log[i];
    if (!entry || typeof entry.step !== "string" || typeof entry.t !== "number") {
      return { ok: false, reason: "Malformed log entry" };
    }
    const role = ROLE_OF[entry.step];
    if (!role) return { ok: false, reason: "Unknown item" };
    if (filled.has(role)) return { ok: false, reason: "Duplicate job" };
    for (const need of PREREQ[role] ?? []) {
      if (!filled.has(need)) return { ok: false, reason: "Wrong step order" };
    }
    if (entry.t < prevT) {
      return { ok: false, reason: "Timestamps not increasing" };
    }
    if (i > 0 && entry.t - prevT < MIN_TIME_PER_STEP_MS) {
      return { ok: false, reason: "Implausibly fast step" };
    }
    if (entry.t < 0 || entry.t > duration * 1000 + 5000) {
      return { ok: false, reason: "Timestamp out of range" };
    }
    filled.add(role);
    prevT = entry.t;
  }
  return { ok: true };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const body = await req.json();
    const {
      nickname: rawNick,
      class_code: rawClass,
      duration_setting,
      steps_log,
      hints,
      mistakes,
      time_left,
      game_version,
      auth_uid,
    } = body;

    const nickname = cleanNickname(rawNick);
    if (!nickname) {
      return new Response(JSON.stringify({ error: "Invalid nickname" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const classCode = cleanClassCode(rawClass);

    if (!ALLOWED_DURATIONS.includes(duration_setting)) {
      return new Response(JSON.stringify({ error: "Invalid duration" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (typeof hints !== "number" || hints < 0 || hints > MAX_HINTS) {
      return new Response(JSON.stringify({ error: "Invalid hints" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (typeof mistakes !== "number" || mistakes < 0 || mistakes > MAX_MISTAKES) {
      return new Response(JSON.stringify({ error: "Invalid mistakes" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (typeof time_left !== "number" || time_left < 0 || time_left > duration_setting) {
      return new Response(JSON.stringify({ error: "Invalid time_left" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (game_version !== GAME_VERSION) {
      return new Response(JSON.stringify({ error: "Unsupported game version" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const logCheck = validateLog(steps_log, duration_setting);
    if (!logCheck.ok) {
      return new Response(JSON.stringify({ error: logCheck.reason || "Invalid log" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const score = computeScore(time_left, hints, mistakes);

    // ---- Rate limiting ----
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    const ipKey = `ip:${clientIp}`;
    const playerKey = `player:${nickname.toLowerCase()}`;

    async function checkRate(key: string, limit: number): Promise<boolean> {
      const { data } = await supabase
        .from("rate_limits")
        .select("count, window_start")
        .eq("key", key)
        .maybeSingle();

      const now = Date.now();
      if (!data) {
        await supabase.from("rate_limits").upsert({
          key,
          count: 1,
          window_start: new Date().toISOString(),
        });
        return true;
      }

      const start = new Date(data.window_start).getTime();
      if (now - start > WINDOW_MS) {
        await supabase.from("rate_limits").upsert({
          key,
          count: 1,
          window_start: new Date().toISOString(),
        });
        return true;
      }

      if (data.count >= limit) return false;

      await supabase
        .from("rate_limits")
        .update({ count: data.count + 1 })
        .eq("key", key);
      return true;
    }

    if (!(await checkRate(ipKey, RATE_LIMIT_IP))) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded (IP)" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!(await checkRate(playerKey, RATE_LIMIT_PLAYER))) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded (player)" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- Upsert player ----
    let playerId: string;

    if (auth_uid) {
      const { data: existing } = await supabase
        .from("players")
        .select("id")
        .eq("auth_uid", auth_uid)
        .maybeSingle();

      if (existing) {
        playerId = existing.id;
        await supabase.from("players").update({ nickname }).eq("id", playerId);
      } else {
        const { data: created, error } = await supabase
          .from("players")
          .insert({ auth_uid, nickname })
          .select("id")
          .single();
        if (error) throw error;
        playerId = created.id;
      }
    } else {
      const { data: existing } = await supabase
        .from("players")
        .select("id")
        .eq("nickname", nickname)
        .maybeSingle();

      if (existing) {
        playerId = existing.id;
      } else {
        const { data: created, error } = await supabase
          .from("players")
          .insert({ nickname })
          .select("id")
          .single();
        if (error) throw error;
        playerId = created.id;
      }
    }

    // ---- Insert run ----
    const { data: run, error: runErr } = await supabase
      .from("runs")
      .insert({
        player_id: playerId,
        class_code: classCode,
        duration_setting,
        steps_log,
        hints,
        mistakes,
        time_left,
        score,
        game_version,
        client_ip: clientIp,
      })
      .select("id, score, created_at")
      .single();

    if (runErr) throw runErr;

    // ---- Ranks ----
    const { count: betterAll } = await supabase
      .from("runs")
      .select("*", { count: "exact", head: true })
      .gt("score", score);

    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const { count: betterToday } = await supabase
      .from("runs")
      .select("*", { count: "exact", head: true })
      .gt("score", score)
      .gte("created_at", todayStart.toISOString());

    const weekStart = new Date();
    weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay());
    weekStart.setUTCHours(0, 0, 0, 0);
    const { count: betterWeek } = await supabase
      .from("runs")
      .select("*", { count: "exact", head: true })
      .gt("score", score)
      .gte("created_at", weekStart.toISOString());

    return new Response(
      JSON.stringify({
        ok: true,
        score,
        run_id: run.id,
        ranks: {
          all_time: (betterAll ?? 0) + 1,
          today: (betterToday ?? 0) + 1,
          week: (betterWeek ?? 0) + 1,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});