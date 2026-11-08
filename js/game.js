// ============================================================
// Apollo 13: Fix the Air – main game module
// ============================================================
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.0/+esm";

const cfg = window.A13_CONFIG || {};
const SUPABASE_URL = cfg.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = cfg.SUPABASE_ANON_KEY || "";
const GAME_VERSION = cfg.GAME_VERSION || "1.0";
const sb = (!SUPABASE_URL || SUPABASE_URL.includes("YOUR_PROJECT"))
  ? null
  : createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const t = (k) => window.t(k);
const tItem = (id) => window.tItem(id);

/* ===== constants ===== */
const CFG = { start:15, hints:3, hintCost:15, mistakeCo2:3, stepCo2:8 };
const DIM = {
  canister: { w:18.4, h:22.9, d:18.4, src:"Smithsonian NASM A19760747000" },
  port: { r:7.5, src:"Approx. LM round port" },
  cover: { w:21, h:28, src:"Flight plan cover approx." },
  check: { w:20, h:28, src:"Checklist cover approx." },
  hose: { len:132.1, r:1.9, src:"Smithsonian hose" },
  bag: { w:18, h:26, src:"LCG bag approx." },
  stow: { w:30, h:40, src:"Stowage bag approx." },
  tape: { w:5, src:"Duct tape approx." }
};
/* The canister is already in the cabin (real start). Four JOBS must be done.
   Several parts can do the same job, so there are several valid solutions:
   shape  = rigid shell around the square canister   (flight plan cover OR checklist cover)
   sleeve = airtight flexible layer                   (LCG bag OR stowage bag)
   hose   = air path from the round port              (suit hose)
   seal   = tape on every joint, always last           (duct tape)
   hist:true marks the parts NASA really used. KEEP IN SYNC with supabase/functions/submit-score/index.ts */
const ROLES = ["shape","sleeve","hose","seal"];
const PART = {
  cover:{role:"shape", hist:true}, check:{role:"shape"},
  bag:{role:"sleeve", hist:true},  stow:{role:"sleeve"},
  hose:{role:"hose", hist:true},   tape:{role:"seal", hist:true}
};
const PREREQ = { hose:["shape"], seal:["shape","sleeve","hose"] };   // jobs that must exist first
const ITEMS = [
  {id:"cover", ic:"📘", d:"21×28 cm"},
  {id:"check", ic:"📋", d:"20×28 cm"},
  {id:"bag",   ic:"🛍️", d:"18×26 cm"},
  {id:"stow",  ic:"🎒", d:"30×40 cm"},
  {id:"hose",  ic:"🧵", d:"132 cm"},
  {id:"tape",  ic:"🩹", d:"5 cm"}
];
const CP = {x:-28, y:-2, z:18};   // centre of the canister on the bench

const $ = id => document.getElementById(id);
const clamp = (v,a,b) => Math.min(b, Math.max(a,v));
const G = {
  state:"nick", step:0, co2:15, time:300, dur:300, hints:0, mist:0,
  sel:null, solved:false, fired:{}, teams:["Player"], ti:0, results:[],
  used:{}, nickname:"", classCode:null, authUid:null,
  log:[], startTs:0, lastSubmit:null, filled:{}, hintLvl:{}
};

let reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let muted = false, vol = .6;

function fail(e){
  try{ $("eM").textContent = String(e&&e.message||e).slice(0,200); $("err").classList.remove("hide"); }
  catch(_){}
}
window.addEventListener("error", e => fail(e.error||e.message));

const BAD = ["fuck","shit","asshole","bitch","cunt","dick","nigger","nigga","faggot","retard","whore","slut"];
function cleanNick(raw){
  if(typeof raw!=="string") return null;
  const n = raw.trim().replace(/\s+/g," ");
  if(n.length<3||n.length>16) return null;
  if(!/^[A-Za-z0-9 _]+$/.test(n)) return null;
  const lower=n.toLowerCase();
  for(const w of BAD) if(lower.includes(w)) return null;
  return n;
}
function cleanClass(raw){
  if(!raw) return null;
  const c=String(raw).trim().toUpperCase();
  if(c.length<4||c.length>8||!/^[A-Z0-9]+$/.test(c)) return null;
  return c;
}

/* ===== i18n apply ===== */
window.applyLang = function applyLang(){
  const setHTML = (id, html) => { const el=$(id); if(el) el.innerHTML = html; };
  const setText = (id, txt) => { const el=$(id); if(el) el.textContent = txt; };
  const setLabel = (id, txt) => {
    const lab=$(id); if(!lab) return;
    const input=lab.querySelector("input,select");
    lab.textContent="";
    lab.appendChild(document.createTextNode(txt));
    if(input) lab.appendChild(input);
  };

  setText("tNickTitle", "🚀 "+t("nickTitle"));
  setText("tStartTitle", "🚀 "+t("nickTitle"));
  setText("tNickIntro", t("nickIntro"));
  setLabel("tNickLabel", t("nickLabel"));
  setLabel("tClassLabel", t("classLabel"));
  setText("tNickLegal", t("nickLegal"));
  setText("bNick", t("continue"));
  setHTML("tStory", t("story"));
  setHTML("tStep1", t("step1"));
  setHTML("tStep2", t("step2"));
  setHTML("tStep3", t("step3"));
  setLabel("tTimeLabel", t("timeLimit"));
  setLabel("tTeamsLabel", t("teamsLabel"));
  const teamsIn=$("sTeams"); if(teamsIn) teamsIn.placeholder=t("teamsPh");
  setLabel("tVolLabel", t("volume"));
  setText("tReduced", t("reduced"));
  setText("tWarn", t("warn"));
  setText("tPlayingAs", t("playingAs"));
  setText("tViewBoard", t("viewBoard"));
  setText("bStart", t("start"));
  setText("opt3", t("min3")); setText("opt5", t("min5")); setText("opt8", t("min8"));

  setText("tPlayer", t("player"));
  setText("tHint", t("hint"));
  setText("bPlace", t("place"));
  setText("tBriefSum", t("briefSum"));
  setHTML("tBriefSit", t("briefSit"));
  setHTML("tBriefObj", t("briefObj"));
  setHTML("tObjCan", t("objCan"));
  setHTML("tObjCov", t("objCov"));
  setHTML("tObjBag", t("objBag"));
  setHTML("tObjHose", t("objHose"));
  setHTML("tObjTape", t("objTape"));
  setHTML("tObjAlt", t("objAlt"));
  setText("bSkip", t("skip"));
  setHTML("tBriefTip", t("briefTip"));
  setText("tRealSizes", t("realSizes"));
  setText("ban", t("ban"));

  setText("tPaused", t("paused"));
  setText("tPausedMu", t("pausedMu"));
  setText("bResume", t("resume"));
  setText("tWhatBuilt", t("whatBuilt"));
  setText("tRealSolution", t("realSolution"));
  setText("tRealSteps", t("realSteps"));
  setText("tRanks", t("ranks"));
  setText("tFullBoard", t("fullBoard"));
  setText("bRetrySubmit", t("retrySubmit"));
  setText("tErrTitle", t("errTitle"));
  setText("tErrWebgl", t("errWebgl"));

  // Parts box + reference folder
  setText("tBoxLabel", t("boxLabel"));
  setText("tFolderLabel", t("folderLabel"));
  setText("tInvTitle", t("invTitle"));
  setText("tFolderTitle", t("folderTitle"));
  setText("tFolderHint", t("folderHint"));
  setText("capCabin", t("capCabin"));
  setText("capSide", t("capSide"));
  setText("capHose", t("capHose"));
  setText("capJoint", t("capJoint"));

  // Inventory button labels
  document.querySelectorAll("#inv button").forEach(b=>{
    const id=b.dataset.id;
    const it=ITEMS.find(x=>x.id===id);
    if(!it) return;
    const idx=[...b.parentNode.children].indexOf(b)+1;
    b.textContent="";
    b.appendChild(document.createTextNode(`${idx}. ${it.ic} ${tItem(id)}`));
    const sm=document.createElement("small"); sm.textContent=it.d; b.appendChild(sm);
  });

  // Lang button states
  document.querySelectorAll(".lang-bar button").forEach(btn=>{
    const isEN = btn.id.startsWith("langEN") || btn.textContent.trim()==="EN";
    const isFR = btn.id.startsWith("langFR") || btn.textContent.trim()==="FR";
    const on = (isEN && window.A13_LANG==="en") || (isFR && window.A13_LANG==="fr");
    btn.setAttribute("aria-pressed", String(on));
    btn.classList.toggle("pri", on);
  });
  document.documentElement.lang = window.A13_LANG==="fr" ? "fr" : "en";

  // Live status colors text
  if(G.state==="play"||G.state==="pause"){
    const co=G.co2;
    $("cs").textContent = co<40?t("co2Safe"):co<75?t("co2Rising"):t("co2Crit");
  }
};

/* ===== audio ===== */
let AC, master, nbuf, pbuf, tBreath, tBeep;
let breathLoopEl=null, breathCritEl=null, radioEl=null, breathMode="off";
// Separate channels: master UI vol, plus independent radio / breath levels and mutes
let volRadio=.85, volBreath=.45, muteRadio=false, muteBreath=false;
function makeAudioEl(src, loop){
  const a=new Audio(src); a.loop=!!loop; a.preload="auto"; a.volume=0; return a;
}
function audioInit(){
  if(!breathLoopEl){
    breathLoopEl=makeAudioEl("audio/breath-loop.ogg", true);
    breathCritEl=makeAudioEl("audio/breath-critical.ogg", true);
    radioEl=makeAudioEl("audio/Apollo13-wehaveaproblem.ogg", true); // loop full track as mission radio
  }
  if(AC||!(window.AudioContext||window.webkitAudioContext)) return;
  AC=new(window.AudioContext||window.webkitAudioContext)();
  master=AC.createGain(); master.gain.value=muted?0:vol; master.connect(AC.destination);
  nbuf=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);
  const d=nbuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  pbuf=makePink();
  // Soft cabin hum only (no competing voice)
  [55,110.5].forEach((f,i)=>{ const o=AC.createOscillator(),g=AC.createGain(); o.frequency.value=f; g.gain.value=i?.008:.015; o.connect(g);g.connect(master);o.start(); });
  const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();
  s.buffer=nbuf;s.loop=true;f.type="lowpass";f.frequency.value=300;g.gain.value=.02;
  s.connect(f);f.connect(g);g.connect(master);s.start();
}
function applyChannelVol(){
  const masterMul=muted?0:vol;
  if(master) master.gain.value=masterMul;
  const r=(!muteRadio&&!muted)?Math.min(1,volRadio*masterMul):0;
  const b=(!muteBreath&&!muted)?Math.min(1,volBreath*masterMul):0;
  if(radioEl) radioEl.volume=r;
  if(breathLoopEl) breathLoopEl.volume=b*0.9;
  if(breathCritEl) breathCritEl.volume=Math.min(1,b*1.15);
}
function setVol(){ applyChannelVol(); }
function setBreathMode(mode){
  // Never mix breath under intro radio
  if(G.state==="intro"||G.state==="briefing") mode="off";
  if(breathMode===mode){ applyChannelVol(); return; }
  breathMode=mode;
  try{
    if(breathLoopEl){ breathLoopEl.pause(); }
    if(breathCritEl){ breathCritEl.pause(); }
    if(muted||muteBreath||!mode||mode==="off") return;
    const el=mode==="critical"?breathCritEl:breathLoopEl;
    if(el){ applyChannelVol(); el.play().catch(()=>{}); }
  }catch(_){}
}
/** Intro: real Apollo radio ONLY (no breath). Captions stay independent. */
function playIntroRadio(){
  if(!radioEl||muted||muteRadio) return;
  try{
    stopBreathOnly();
    radioEl.loop=false;
    radioEl.currentTime=0;
    applyChannelVol();
    radioEl.play().catch(()=>{});
    // Play the opening exchange only (~28 s), then pause until play phase
    const stopAt=28;
    const checker=()=>{
      if(!radioEl||radioEl.paused) return;
      if(radioEl.currentTime>=stopAt){ radioEl.pause(); return; }
      requestAnimationFrame(checker);
    };
    requestAnimationFrame(checker);
  }catch(_){}
}
function stopIntroRadio(){
  try{ if(radioEl){ radioEl.pause(); } }catch(_){}
}
function stopBreathOnly(){
  try{
    if(breathLoopEl){ breathLoopEl.pause(); breathLoopEl.currentTime=0; }
    if(breathCritEl){ breathCritEl.pause(); breathCritEl.currentTime=0; }
    breathMode="off";
  }catch(_){}
}
/** During assembly: real radio returns louder (loop), breath is separate. */
function startPlayRadio(){
  if(!radioEl||muted||muteRadio) return;
  try{
    radioEl.loop=true;
    // Resume near the end of the problem exchange so it feels continuous
    if(radioEl.currentTime<5||radioEl.currentTime>160) radioEl.currentTime=5;
    applyChannelVol();
    radioEl.play().catch(()=>{});
  }catch(_){}
}
function stopAllSamples(){
  stopIntroRadio();
  stopBreathOnly();
}
function makePink(){                 // pink noise = softer and more natural than white noise
  const n=AC.sampleRate*3, b=AC.createBuffer(1,n,AC.sampleRate), d=b.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for(let i=0;i<n;i++){
    const w=Math.random()*2-1;
    b0=.99886*b0+w*.0555179; b1=.99332*b1+w*.0750759; b2=.96900*b2+w*.1538520;
    b3=.86650*b3+w*.3104856; b4=.55000*b4+w*.5329522; b5=-.7616*b5-w*.0168980;
    d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11; b6=w*.115926;
  }
  return b;
}
/* Breathing. Tune these by ear. (The old version sounded like ocean waves because it used slow,
   low (280-700 Hz), smooth swells of white noise. Real breath is higher, airier, faster, uneven.) */
const BREATH={calmCycle:3.2, panicCycle:1.1, inhale:.36, pause:.05, peakCalm:.22, peakPanic:.6,
              inHz:[1500,1500], outHz:[900,700], raspHz:[18,16]};
function puff(t0,dur,freq,peak,inhale,l){
  const src=AC.createBufferSource(), hp=AC.createBiquadFilter(), bp=AC.createBiquadFilter(), amp=AC.createGain();
  src.buffer=pbuf; src.loop=true;
  hp.type="highpass"; hp.frequency.value=320;
  bp.type="bandpass"; bp.frequency.value=freq; bp.Q.value=.9;
  const g=amp.gain; g.setValueAtTime(.0001,t0);
  if(inhale){                                   // swells, then stops abruptly ("shhh-k")
    g.linearRampToValueAtTime(peak*.35,t0+dur*.25); g.linearRampToValueAtTime(peak,t0+dur*.85); g.linearRampToValueAtTime(0,t0+dur);
  } else {                                      // starts fast, fades slowly ("haaa")
    g.linearRampToValueAtTime(peak*.8,t0+dur*.08); g.setTargetAtTime(0,t0+dur*.08,dur*.28);
  }
  src.connect(hp); hp.connect(bp); bp.connect(amp); amp.connect(master);
  const nodes=[src];
  if(l>.15){                                    // raspy tremor grows with CO2
    const lfo=AC.createOscillator(), lg=AC.createGain();
    lfo.frequency.value=BREATH.raspHz[0]+(BREATH.raspHz[1]-BREATH.raspHz[0])*l+Math.random()*4;
    lg.gain.value=peak*.35*l; lfo.connect(lg); lg.connect(amp.gain); nodes.push(lfo);
  }
  nodes.forEach(n=>{ n.start(t0, n===src?Math.random()*1.5:0); n.stop(t0+dur+.15); });
}
function breath(){
  if(!AC||G.state!=="play"||!pbuf) return;
  const l=G.co2/100, rnd=1+(Math.random()-.5)*.16;                  // slightly irregular, like a person
  const cycle=(BREATH.calmCycle-(BREATH.calmCycle-BREATH.panicCycle)*l)*rnd;
  const inD=cycle*BREATH.inhale, gap=cycle*BREATH.pause, outD=cycle-inD-gap;
  const peak=BREATH.peakCalm+(BREATH.peakPanic-BREATH.peakCalm)*l, t0=AC.currentTime;
  puff(t0,inD,BREATH.inHz[0]+BREATH.inHz[1]*l,peak,true,l);
  puff(t0+inD+gap,outD,BREATH.outHz[0]+BREATH.outHz[1]*l,peak*.85,false,l);
  tBreath=setTimeout(breath, cycle*1000);
}
function beep(){
  if(!AC||G.state!=="play") return;
  let wait=1000;
  if(G.co2>=50){
    const o=AC.createOscillator(),g=AC.createGain(),t0=AC.currentTime;
    o.type="square"; o.frequency.value=G.co2>=75?990:700;
    g.gain.setValueAtTime(.05,t0); g.gain.setValueAtTime(0,t0+.12);
    o.connect(g);g.connect(master);o.start(t0);o.stop(t0+.15);
    wait=G.co2>=75?800:2000;
  }
  tBeep=setTimeout(beep, wait);
}
function breathIntensity(){
  // Decreases as jobs are completed; stops when solved
  if(G.solved) return "off";
  const progress=(G.step||0)/ROLES.length; // 0..1
  if(progress>=1) return "off";
  // High CO2 or early progress → heavier; as adapter builds, calmer
  if(G.co2>=70 && progress<0.75) return "critical";
  if(progress>=0.5) return "loop"; // still present but quieter via volBreath
  return G.co2>=50?"critical":"loop";
}
function loopsOn(){
  loopsOff();
  if(AC){ AC.resume(); beep(); }
  // Assembly: real radio + breath (breath eases as player solves)
  startPlayRadio();
  setBreathMode(breathIntensity());
}
function loopsOff(){
  clearTimeout(tBreath); clearTimeout(tBeep);
  setBreathMode("off");
  // Keep radio only during play; stop samples on menus/end
  if(G.state!=="play"&&G.state!=="intro") stopIntroRadio();
  if(AC&&G.state!=="play"&&G.state!=="intro"&&G.state!=="briefing") AC.suspend();
}
function updateTelemetry(){
  const map={
    shape:["telShape","telShapeOff","telShapeOn"],
    sleeve:["telSleeve","telSleeveOff","telSleeveOn"],
    hose:["telHose","telHoseOff","telHoseOn"],
    seal:["telSeal","telSealOff","telSealOn"]
  };
  const next=nextRole();
  ROLES.forEach(r=>{
    const [id,off,on]=map[r];
    const el=$(id); if(!el) return;
    const item=document.querySelector(`.tel-item[data-role="${r}"]`);
    if(G.filled[r]){
      el.textContent=t(on);
      if(item){ item.classList.add("done"); item.classList.remove("now"); }
    } else {
      el.textContent=t(off);
      if(item){ item.classList.toggle("now", r===next); item.classList.remove("done"); }
    }
  });
}
/* ===== voice (Web Speech API, picks the best installed voice) ===== */
let VOICES=[];
function loadVoices(){ try{ VOICES=speechSynthesis.getVoices()||[]; }catch(_){ VOICES=[]; } }
if("speechSynthesis" in window){ loadVoices(); try{ speechSynthesis.addEventListener("voiceschanged", loadVoices); }catch(_){} }
function bestVoice(){
  const fr=window.A13_LANG==="fr", re=fr?/^fr/i:/^en/i;
  const pool=VOICES.filter(v=>re.test(v.lang)); if(!pool.length) return null;
  const sc=v=>{
    const n=(v.name+" "+v.voiceURI).toLowerCase(); let k=0;
    if(/neural|natural|online/.test(n)) k+=6;      // Edge / Windows "Natural" voices
    if(/premium|enhanced/.test(n)) k+=5;           // Apple
    if(/google/.test(n)) k+=4;                     // Chrome / Android
    if(/microsoft/.test(n)) k+=2;
    if(/espeak|compact|festival/.test(n)) k-=6;    // robotic
    const l=v.lang.toLowerCase();
    if(l===(fr?"fr-fr":"en-us")) k+=2; else if(!fr&&l==="en-gb") k+=1;
    return k;
  };
  return pool.sort((a,b)=>sc(b)-sc(a))[0];
}
function radioTick(open){            // short "push-to-talk" click + static, like a radio call
  if(!AC||muted||!nbuf) return;
  const t0=AC.currentTime, o=AC.createOscillator(), g=AC.createGain();
  o.type="square"; o.frequency.value=open?1700:1100;
  g.gain.setValueAtTime(.05,t0); g.gain.exponentialRampToValueAtTime(.0001,t0+.07);
  o.connect(g); g.connect(master); o.start(t0); o.stop(t0+.08);
  const s=AC.createBufferSource(), f=AC.createBiquadFilter(), gg=AC.createGain();
  s.buffer=nbuf; f.type="highpass"; f.frequency.value=2500;
  gg.gain.setValueAtTime(.06,t0); gg.gain.linearRampToValueAtTime(0,t0+.12);
  s.connect(f); f.connect(gg); gg.connect(master); s.start(t0); s.stop(t0+.13);
}
let speakTimer=0;
function speakIntroLine(msg){
  // Dedicated intro speech: cancel previous, then speak full line at clear rate
  if(muted||!("speechSynthesis" in window)) return;
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(msg), v=bestVoice();
    if(v){ u.voice=v; u.lang=v.lang; }
    else u.lang=(window.A13_LANG==="fr"?"fr-FR":"en-US");
    u.rate=.92; u.pitch=1; u.volume=Math.min(1, vol||.8);
    speechSynthesis.speak(u);
  }catch(_){}
}
function say(msg, speak){
  $("sub").textContent = msg;
  if(!speak||muted||!("speechSynthesis" in window)) return;
  try{
    clearTimeout(speakTimer); speechSynthesis.cancel();
    speakTimer=setTimeout(()=>{            // small delay: Chrome drops speak() right after cancel()
      const u=new SpeechSynthesisUtterance(msg), v=bestVoice();
      if(v){ u.voice=v; u.lang=v.lang; } else u.lang = window.A13_LANG==="fr" ? "fr-FR" : "en-US";
      u.rate=.95; u.pitch=.92; u.volume=Math.min(1,vol*1.2);
      u.onstart=()=>radioTick(true); u.onend=()=>radioTick(false);
      speechSynthesis.speak(u);
    },60);
  }catch(_){}
}
let tAlarm=0;
function alarmOn(){
  clearTimeout(tAlarm);
  const tick=()=>{
    if(G.state!=="intro"||!AC) return;
    const t0=AC.currentTime;
    [880,660].forEach((f,i)=>{
      const o=AC.createOscillator(), g=AC.createGain(), a=t0+i*.25;
      o.type="square"; o.frequency.value=f; g.gain.setValueAtTime(.04,a); g.gain.setValueAtTime(0,a+.2);
      o.connect(g); g.connect(master); o.start(a); o.stop(a+.22);
    });
    tAlarm=setTimeout(tick,1000);
  };
  tick();
}
function alarmOff(){ clearTimeout(tAlarm); }

/* ===== 3D ===== */
let renderer, scene, camera, controls, light, placed, marker, preCanister, portRing, ghost=null;
const BASE = new THREE.Vector3(-12,0,10);
const M = (c,o) => new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.7,metalness:.15},o||{}));

function initScene(){
  try{ renderer=new THREE.WebGLRenderer({canvas:$("cv"),antialias:true}); }
  catch(e){ fail("WebGL is not supported."); return false; }
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  scene=new THREE.Scene();
  scene.background=new THREE.Color(0x000208);
  scene.fog=new THREE.FogExp2(0x000208, 0.0022);
  camera=new THREE.PerspectiveCamera(55,1,1,800);
  camera.position.set(0,8,70);
  controls=new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(-8,2,10);
  controls.enableDamping=true;
  controls.minDistance=30; controls.maxDistance=120;
  controls.maxPolarAngle=Math.PI*.82;
  scene.add(new THREE.AmbientLight(0x6a7a99,.4));
  light=new THREE.PointLight(0xfff1d6,1.1,350); light.position.set(0,30,40); scene.add(light);
  const dl=new THREE.DirectionalLight(0x88aadd,.4); dl.position.set(40,20,-30); scene.add(dl);

  // Starfield
  (function addStars(){
    const n=2200, pos=new Float32Array(n*3);
    for(let i=0;i<n;i++){
      const r=220+Math.random()*400, th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1);
      pos[i*3]=r*Math.sin(ph)*Math.cos(th);
      pos[i*3+1]=r*Math.sin(ph)*Math.sin(th);
      pos[i*3+2]=r*Math.cos(ph)-80;
    }
    const g=new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos,3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({color:0xe8f0ff, size:1.15, sizeAttenuation:true, transparent:true, opacity:.95})));
  })();

  // Organized sky through the window: Sun, Earth + Moon, Mars
  function body(r, color, x,y,z, emis){
    const mat=new THREE.MeshStandardMaterial({
      color, roughness:.8, metalness:.04,
      emissive: emis||0x000000, emissiveIntensity: emis?0.7:0
    });
    const m=new THREE.Mesh(new THREE.SphereGeometry(r,28,20), mat);
    m.position.set(x,y,z); scene.add(m); return m;
  }
  body(18, 0xffc857, -95, 48, -160, 0xffaa22);  // Sun
  body(9,  0x3d7dd6,  20, -8, -150);             // Earth
  body(2.4,0xdde6f0,  32, -2, -140);             // Moon near Earth
  body(5,  0xc1440e,  70, 18, -175);             // Mars farther out

  // Open space work area — no solid wall, no giant decorative ring.
  // Stars & planets fill the sky; a soft deck holds the bench and parts.
  const deck=new THREE.Mesh(new THREE.CircleGeometry(90,48), M(0x101820,{roughness:.95,metalness:.05}));
  deck.rotation.x=-Math.PI/2; deck.position.set(-10,-14.2,20); scene.add(deck);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(88,0.55,8,64), M(0x2a3548,{metalness:.35,roughness:.55}));
  rim.rotation.x=-Math.PI/2; rim.position.set(-10,-13.9,20); scene.add(rim);

  // Work bench + round LM air port (the real problem socket)
  const bench=new THREE.Mesh(new THREE.BoxGeometry(70,2,40),M(0x2e3848,{roughness:.7})); bench.position.set(-26,-13.5,16); scene.add(bench);
  const ring=portRing=new THREE.Mesh(new THREE.TorusGeometry(DIM.port.r,1.4,12,40),M(0x9aa3b2,{metalness:.6})); ring.position.z=.8; scene.add(ring);
  const hole=new THREE.Mesh(new THREE.CircleGeometry(DIM.port.r,40),new THREE.MeshBasicMaterial({color:0x000000})); hole.position.z=.4; scene.add(hole);

  const c=DIM.canister;
  // Physical canister already in cabin (Smithsonian-like starting state)
  preCanister=new THREE.Group();
  preCanister.add(new THREE.Mesh(new THREE.BoxGeometry(c.w,c.h,c.d),M(0x8d949e,{metalness:.7})));
  for(let i=-2;i<=2;i++){
    const band=new THREE.Mesh(new THREE.BoxGeometry(c.w+.4,.8,c.d+.4),M(0x4b5260));
    band.position.y=i*4.5; preCanister.add(band);
  }
  preCanister.position.set(CP.x,CP.y,CP.z);
  scene.add(preCanister);

  placed=new THREE.Group(); scene.add(placed);

  // Arrow marker
  marker=new THREE.Group();
  const arrowMat=new THREE.MeshBasicMaterial({color:0xffb020,transparent:true,opacity:.92});
  const cone=new THREE.Mesh(new THREE.ConeGeometry(3.2,7,12),arrowMat); cone.rotation.x=Math.PI; cone.position.y=4;
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,8,8),arrowMat); shaft.position.y=10;
  marker.add(cone); marker.add(shaft); marker.visible=false; scene.add(marker);

  resize(); return true;
}
function resize(){ if(!renderer)return; renderer.setSize(innerWidth,innerHeight); camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); }
addEventListener("resize", resize);

const MAT = {
  cover:()=>M(0xe8d9b0,{transparent:true,opacity:.92,roughness:.9}),
  check:()=>M(0xaebfd6,{transparent:true,opacity:.92,roughness:.9}),
  bag:()=>M(0x9fc4e8,{transparent:true,opacity:.55,depthWrite:false}),
  stow:()=>M(0xe3e8ee,{transparent:true,opacity:.5,depthWrite:false}),
  tape:()=>M(0x7a7f86)
};
function hoseCurve(){
  const v=(x,y,z)=>new THREE.Vector3(x,y,z);
  return new THREE.CatmullRomCurve3([v(CP.x,CP.y+DIM.canister.h/2,CP.z), v(CP.x+4,CP.y+22,CP.z-1), v(-10,14,10), v(0,0,3)]);
}
function roleParts(role){            // box parts of each job, in world cm (null = hose, a tube)
  const c=DIM.canister;
  if(role==="shape")  return [{s:[c.w+3,14,c.d+3],  p:[CP.x,CP.y+2,CP.z]}];
  if(role==="sleeve") return [{s:[c.w+6,17,c.d+6],  p:[CP.x,CP.y+1,CP.z]}];
  if(role==="seal")   return [-6,0,6].map(dy=>({s:[c.w+6.8,1.4,c.d+6.8], p:[CP.x,CP.y+dy,CP.z]}));
  return null;
}
function disposeObj(o){
  o.traverse(x=>{
    if(x.geometry) x.geometry.dispose();
    if(x.material) (Array.isArray(x.material)?x.material:[x.material]).forEach(m=>m.dispose());
  });
}
function build(id){
  const role=PART[id].role, g=new THREE.Group(); g.userData.itemId=id;
  if(role==="hose") g.add(new THREE.Mesh(new THREE.TubeGeometry(hoseCurve(),40,DIM.hose.r,10),M(0xf2f2f2)));
  else roleParts(role).forEach(pt=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(...pt.s),MAT[id]()); m.position.set(...pt.p); g.add(m);
  });
  placed.add(g); return g;
}
function clearPlaced(){ placed.children.slice().forEach(o=>{ disposeObj(o); placed.remove(o); }); }

/* Ghost = dashed outline + soft fill ("shadow") showing where the selected part goes */
function clearGhost(){ if(ghost){ scene.remove(ghost); disposeObj(ghost); ghost=null; } }
function showGhost(role){
  clearGhost();
  const g=new THREE.Group(), hits=[], lines=[], fills=[], invis=new THREE.MeshBasicMaterial({visible:false});
  const lineMat=()=>{ const m=new THREE.LineDashedMaterial({color:0xffb020,dashSize:2,gapSize:1.5}); lines.push(m); return m; };
  const fillMat=()=>{ const m=new THREE.MeshBasicMaterial({color:0xffb020,transparent:true,opacity:.14,depthWrite:false}); fills.push(m); return m; };
  let anchor; const c=DIM.canister, parts=roleParts(role);
  if(parts){
    parts.forEach(pt=>{
      const geo=new THREE.BoxGeometry(...pt.s);
      const fill=new THREE.Mesh(geo,fillMat()); fill.position.set(...pt.p); g.add(fill);
      const ln=new THREE.LineSegments(new THREE.EdgesGeometry(geo),lineMat()); ln.position.set(...pt.p); ln.computeLineDistances(); g.add(ln);
    });
    const hit=new THREE.Mesh(new THREE.BoxGeometry(c.w+10,c.h+2,c.d+10),invis); hit.position.set(CP.x,CP.y,CP.z); g.add(hit); hits.push(hit);
    anchor=new THREE.Vector3(CP.x,CP.y+c.h/2+2,CP.z);
  } else {
    const cu=hoseCurve();
    g.add(new THREE.Mesh(new THREE.TubeGeometry(cu,40,DIM.hose.r,10),fillMat()));
    const ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints(cu.getPoints(48)),lineMat()); ln.computeLineDistances(); g.add(ln);
    const hit=new THREE.Mesh(new THREE.TubeGeometry(cu,24,7,8),invis); g.add(hit); hits.push(hit);
    anchor=cu.getPoint(.5).clone();
  }
  g.userData={hits,lines,fills,anchor}; g.updateMatrixWorld(true);
  scene.add(g); ghost=g;
}
function setGhostHot(on){
  if(!ghost) return;
  const col=on?0x3ddc97:0xffb020;
  ghost.userData.lines.forEach(m=>m.color.set(col)); ghost.userData.fills.forEach(m=>m.color.set(col));
}
const ray=new THREE.Raycaster(), v2=new THREE.Vector2();
function overGhost(x,y){
  if(!ghost) return false;
  v2.set(x/innerWidth*2-1, -(y/innerHeight)*2+1); ray.setFromCamera(v2,camera);
  return ray.intersectObjects(ghost.userData.hits,false).length>0;
}
const isCanvasAt=(x,y)=>document.elementFromPoint(x,y)===$("cv");
function orbit(dt,dp){
  const o=camera.position.clone().sub(controls.target);
  const s=new THREE.Spherical().setFromVector3(o);
  s.theta+=dt; s.phi=clamp(s.phi+dp,.2,Math.PI*.85);
  o.setFromSpherical(s); camera.position.copy(controls.target).add(o); controls.update();
}
function zoom(f){
  const o=camera.position.clone().sub(controls.target);
  o.setLength(clamp(o.length()*f,25,160));
  camera.position.copy(controls.target).add(o); controls.update();
}
function resetView(){ camera.position.set(0,8,70); controls.target.set(-8,2,10); controls.update(); }

/* ===== UI / inventory + drag (pointer events: mouse, pen and touch) ===== */
let drag=null, suppressClick=false;
function buildUI(){
  const inv=$("inv"); inv.textContent="";
  ITEMS.forEach((it,i)=>{
    const b=document.createElement("button");
    b.dataset.id=it.id; b.type="button";
    b.setAttribute("aria-pressed","false");
    b.textContent=`${i+1}. ${it.ic} ${tItem(it.id)}`;
    const sm=document.createElement("small"); sm.textContent=it.d; b.appendChild(sm);
    b.onclick=()=>{ if(!suppressClick) select(it.id); };
    b.addEventListener("pointerdown", e=>{
      if(G.state!=="play"||G.used[it.id]||b.disabled) return;
      drag={id:it.id,x:e.clientX,y:e.clientY,pid:e.pointerId,active:false};
    });
    inv.appendChild(b);
  });
  window.addEventListener("pointermove", dragMove);
  window.addEventListener("pointerup", dragEnd);
  window.addEventListener("pointercancel", dragEnd);
  const facts=$("facts"); facts.textContent="";
  Object.keys(DIM).forEach(k=>{
    const d=DIM[k];
    const p=document.createElement("div");
    p.textContent = k+": "+(d.w?`${d.w}×${d.h||d.d} cm`:d.r?`Ø${d.r*2} cm`:`${d.len} cm`)+" ("+d.src+")";
    facts.appendChild(p);
  });
}
function dragMove(e){
  if(!drag||e.pointerId!==drag.pid) return;
  const dx=e.clientX-drag.x, dy=e.clientY-drag.y;
  if(!drag.active){
    // touch: only an upward gesture starts a drag (sideways still scrolls the bar)
    const start = e.pointerType==="touch" ? (dy<-10&&Math.abs(dy)>Math.abs(dx)) : Math.hypot(dx,dy)>8;
    if(!start) return;
    drag.active=true; select(drag.id); document.body.classList.add("dragging");
    const it=ITEMS.find(x=>x.id===drag.id), gh=$("dragGhost");
    if(gh){ gh.style.display="block"; gh.textContent=`${it.ic} ${tItem(it.id)}`; }
  }
  const gh=$("dragGhost"); if(gh){ gh.style.left=(e.clientX+14)+"px"; gh.style.top=(e.clientY-44)+"px"; }
  setGhostHot(isCanvasAt(e.clientX,e.clientY)&&overGhost(e.clientX,e.clientY));   // turns green over the target
}
function dragEnd(e){
  if(!drag||e.pointerId!==drag.pid) return;
  const was=drag.active; drag=null;
  document.body.classList.remove("dragging");
  const gh=$("dragGhost"); if(gh) gh.style.display="none";
  if(!was) return;
  suppressClick=true; setTimeout(()=>{ suppressClick=false; },60);
  if(e.type==="pointercancel"||G.state!=="play"){ setGhostHot(false); return; }
  if(isCanvasAt(e.clientX,e.clientY)&&overGhost(e.clientX,e.clientY)) attempt();
  else { setGhostHot(false); say(t("dropOnOutline")); }
}
function select(id){
  if(G.state!=="play"||G.used[id]) return;
  const role=PART[id].role;
  if(G.filled[role]){ say(t("roleTaken").replace("{item}",tItem(G.filled[role]))); return; }
  G.sel=id;
  document.querySelectorAll("#inv button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.id===id)));
  showGhost(role);
  say(t("dropOnOutline"));
}

/* ===== game logic ===== */
function setState(s){
  G.state=s;
  $("nick").classList.toggle("hide", s!=="nick");
  $("start").classList.toggle("hide", s!=="menu");
  $("intro").classList.toggle("hide", s!=="intro");
  $("briefing")?.classList.toggle("hide", s!=="briefing");
  $("pause").classList.toggle("hide", s!=="pause");
  $("end").classList.toggle("hide", s!=="won"&&s!=="lost");
  $("hud").classList.toggle("hide", s==="nick"||s==="menu"||s==="intro"||s==="briefing"||s==="won"||s==="lost");
  if(s==="intro"){ if(AC) AC.resume(); }
  else if(s==="play") loopsOn(); else loopsOff();
}

/* ----- Apollo 13 opening: explosion, alarm, lifeboat, the square-vs-round problem ----- */
const INTRO=[["intro1",3800],["intro2",3800],["intro3",4500]];
const INTRO_TOTAL=INTRO.reduce((a,x)=>a+x[1],0);
let introTimers=[], introStart=0;
function startIntro(){
  Object.assign(G,{step:0,co2:CFG.start,time:G.dur,sel:null,solved:false,filled:{},used:{},log:[],hintLvl:{}});
  clearPlaced(); clearGhost();
  if(marker) marker.visible=false;
  if(preCanister){ preCanister.visible=true; preCanister.position.set(CP.x,CP.y,CP.z); }
  controls.enabled=false;
  // Intro: clear fiction voice (TTS) + captions only — no real radio mix
  stopAllSamples();
  setState("intro"); introStart=performance.now(); alarmOn();
  let acc=0;
  // Speak each line fully; schedule next only after duration (TTS needs time)
  INTRO.forEach(([k,ms],i)=>{
    introTimers.push(setTimeout(()=>{
      $("introTxt").textContent=t(k);
      speakIntroLine(t(k));
      if(i===INTRO.length-1) alarmOff();
    },acc));
    acc+=ms;
  });
  // Small buffer after last line so the final sentence is not cut
  introTimers.push(setTimeout(()=>endIntro(),acc+600));
}
function endIntro(){
  if(G.state!=="intro") return;
  introTimers.forEach(clearTimeout); introTimers=[]; alarmOff();
  stopAllSamples();
  try{ speechSynthesis.cancel(); }catch(_){}
  startBriefing();
}

/* Phase 1: Think – freeze with MCQ before assembly */
function startBriefing(){
  setState("briefing");
  const alert=$("briefAlert"), title=$("briefTitle"), prompt=$("briefPrompt");
  const choices=$("briefChoices"), fb=$("briefFeedback");
  if(alert) alert.textContent=t("briefAlert");
  if(title) title.textContent=t("briefTitle");
  if(prompt) prompt.textContent=t("briefExplain");
  if(fb) fb.textContent="";
  if(choices){
    choices.innerHTML="";
    const opts=[
      {txt:t("briefQ1"), ok:false},
      {txt:t("briefQ2"), ok:true}
    ];
    // Shuffle so correct answer is not always second
    if(Math.random()<.5) opts.reverse();
    opts.forEach(o=>{
      const b=document.createElement("button");
      b.type="button";
      b.textContent=o.txt;
      b.onclick=()=>{
        if(o.ok){
          b.classList.add("correct");
          choices.querySelectorAll("button").forEach(x=>x.disabled=true);
          if(fb) fb.textContent=t("briefRight");
          fb && (fb.style.color="var(--ok)");
          setTimeout(()=>startRound(true), 900);
        } else {
          b.classList.add("wrong");
          b.disabled=true;
          if(fb){ fb.textContent=t("briefWrong"); fb.style.color="var(--bd)"; }
        }
      };
      choices.appendChild(b);
    });
  }
}

function startRound(fromIntro){
  Object.assign(G,{
    step:0, co2:CFG.start, time:G.dur, hints:0, mist:0,
    sel:null, solved:false, fired:{}, used:{}, log:[],
    startTs:performance.now(), filled:{}, hintLvl:{}
  });
  clearPlaced(); clearGhost();
  if(preCanister){ preCanister.visible=true; preCanister.position.set(CP.x,CP.y,CP.z); }
  if(portRing) portRing.material.color.set(0x9aa3b2);
  if(marker) marker.visible=false;
  controls.enabled=true;
  resetView();
  document.querySelectorAll("#inv button").forEach(b=>{ b.disabled=false; b.setAttribute("aria-pressed","false"); });
  $("tn").textContent=G.teams[G.ti];
  $("hl").textContent=CFG.hints;
  $("bHint").disabled=false;
  updateTelemetry();
  setState("play");
  say(t("missionStart"), !fromIntro);
}
function attempt(){
  if(G.state!=="play"||G.solved) return;
  if(!G.sel){ say(t("selectFirst")); return; }
  if(G.used[G.sel]){ say(t("already")); return; }
  const id=G.sel, role=PART[id].role;
  if(G.filled[role]){ say(t("roleTaken").replace("{item}",tItem(G.filled[role]))); return; }
  const missing=(PREREQ[role]||[]).filter(r=>!G.filled[r]);
  if(missing.length){                       // right part, wrong moment
    G.mist++; G.co2=Math.min(100,G.co2+CFG.mistakeCo2);
    say(t("tooEarly")[role]||t("wrongOrder")); return;
  }
  build(id);
  G.filled[role]=id; G.used[id]=true;
  G.log.push({step:id, t:Math.round(performance.now()-G.startTs)});
  G.step=Object.keys(G.filled).length;
  G.co2=Math.max(5,G.co2-CFG.stepCo2);
  // this job is done: grey out the part used and its alternatives
  ITEMS.filter(it=>PART[it.id].role===role).forEach(it=>{
    const b=document.querySelector(`#inv button[data-id="${it.id}"]`); if(b) b.disabled=true;
  });
  G.sel=null; clearGhost();
  document.querySelectorAll("#inv button").forEach(b=>b.setAttribute("aria-pressed","false"));
  updateTelemetry();
  // Breathing eases as the adapter is built; stops when complete
  if(G.step>=ROLES.length){
    G.solved=true; if(marker) marker.visible=false;
    setBreathMode("off");
    say(t("complete"), true);
  } else {
    setBreathMode(breathIntensity());
    // Soften breath volume as progress increases
    const ease=1-0.55*((G.step||0)/ROLES.length);
    if(breathLoopEl) breathLoopEl.volume=Math.min(1,(muteBreath||muted?0:volBreath*vol)*0.9*ease);
    if(breathCritEl) breathCritEl.volume=Math.min(1,(muteBreath||muted?0:volBreath*vol)*1.1*ease);
    say(t("good")+" "+t("keepBuilding"));
  }
}
function nextRole(){ return ROLES.find(r=>!G.filled[r]&&(PREREQ[r]||[]).every(p=>G.filled[p])); }
function hint(){
  if(G.state!=="play"||G.hints>=CFG.hints||G.solved) return;
  G.hints++; G.time=Math.max(0,G.time-CFG.hintCost);
  $("hl").textContent=CFG.hints-G.hints;
  const r=nextRole();
  if(r){
    // Each hint on the same job goes one level deeper: 1 = a question, 2 = the property needed, 3 = the object
    const arr=t("roleHints")[r], lvl=Math.min(G.hintLvl[r]||0, arr.length-1);
    G.hintLvl[r]=(G.hintLvl[r]||0)+1;
    say(`${t("hint")} ${lvl+1}/${arr.length} (−${CFG.hintCost}s) : ${arr[lvl]}`);
  } else say(t("keepBuilding"));
  if(G.hints>=CFG.hints) $("bHint").disabled=true;
}

async function submitScore(win){
  if(!sb||!win){ return null; }
  if(G.teams.length>1){ $("submitStatus").textContent=t("teamLocal"); return null; }
  $("submitStatus").textContent=t("submitting");
  $("bRetrySubmit").classList.add("hide");
  const payload={
    nickname:G.nickname, class_code:G.classCode, duration_setting:G.dur,
    steps_log:G.log, hints:G.hints, mistakes:G.mist, time_left:G.time,
    game_version:GAME_VERSION, auth_uid:G.authUid
  };
  try{
    const {data,error}=await sb.functions.invoke("submit-score",{body:payload});
    if(error) throw error;
    if(data&&data.error) throw new Error(data.error);
    G.lastSubmit={payload,result:data};
    $("submitStatus").textContent=t("submitted");
    if(data.ranks){
      $("rankBox").classList.remove("hide");
      $("rankText").textContent=`Today #${data.ranks.today} · Week #${data.ranks.week} · All-time #${data.ranks.all_time}`;
    }
    return data;
  }catch(e){
    console.error(e);
    $("submitStatus").textContent=t("submitFail");
    $("bRetrySubmit").classList.remove("hide");
    G.lastSubmit={payload,result:null};
    return null;
  }
}

function endRound(win){
  const score=win?Math.max(0,Math.round(1000+G.time*3-G.hints*100-G.mist*25)):0;
  G.results.push({n:G.teams[G.ti], r:win?"Success":"Failed", s:score});
  setState(win?"won":"lost");
  $("eT").textContent=win?t("win"):t("lose");
  $("eS").textContent=win
    ? `${t("winDetail")} Score ${score} · ${Math.round(G.time)}s · hints ${G.hints} · mistakes ${G.mist}.`
    : t("loseDetail");
  $("eF").textContent=t("fact");
  $("rankBox").classList.add("hide");
  $("submitStatus").textContent="";
  $("bRetrySubmit").classList.add("hide");

  const endChk=$("endChk");
  if(endChk){
    endChk.textContent="";
    ROLES.forEach(r=>{
      const id=G.filled[r], li=document.createElement("li");
      li.textContent=`${id?"✓":"○"} ${t("roles")[r]} — ${id?tItem(id):t("notPlaced")}`;
      li.style.color=id?"var(--ok)":"var(--mu)";
      endChk.appendChild(li);
    });
  }
  const asm=$("endAssembly");
  if(asm){
    const seq=G.log.map(x=>tItem(x.step));
    const hist=ROLES.every(r=>G.filled[r]&&PART[G.filled[r]].hist);
    asm.textContent = win
      ? `${t("finalOrder")} ${seq.join(" → ")}. ${hist?t("sameAsNasa"):t("altSolution")}`
      : (seq.length ? seq.join(" → ")+" — "+t("incomplete") : t("nothing"));
  }
  $("tRealSteps").textContent=t("realSteps");
  // Phase 3: Historical comparison bullets + NASM photo
  const bullets=$("debriefBullets");
  if(bullets){
    bullets.innerHTML="";
    [t("debriefProblem"), t("debriefSolution")].forEach(txt=>{
      const li=document.createElement("li");
      li.innerHTML=txt.replace(/^(Problem|Solution|Problème|Solution)\s*:/, m=>`<strong>${m}</strong>`);
      bullets.appendChild(li);
    });
  }
  const cabin=$("cabinPhoto");
  if(cabin) cabin.alt=t("nasmCaption");
  const cap=$("cabinCaption");
  if(cap) cap.textContent=t("cabinCaption");

  const tb=$("eB"); tb.textContent="";
  G.results.slice(-12).forEach(r=>{
    const tr=document.createElement("tr");
    [r.n,r.r,String(r.s)].forEach(v=>{ const td=document.createElement("td"); td.textContent=v; tr.appendChild(td); });
    tb.appendChild(tr);
  });
  const nx=(G.ti+1)%G.teams.length;
  $("bNext").textContent = G.teams.length>1 ? `${t("nextTeam")} ${G.teams[nx]}` : t("playAgain");
  $("bNext").onclick=()=>{ G.ti=nx; startBriefing(); };
  $("bNext").focus();
  if(win) submitScore(true);
}
function pause(){ if(G.state==="play"){ setState("pause"); $("bResume").focus(); } }
function resume(){ if(G.state==="pause") setState("play"); }

/* ===== frame ===== */
let last=performance.now(), nextFl=0;
function frame(now){
  requestAnimationFrame(frame);
  const dt=Math.min(.1,(now-last)/1000); last=now;
  try{
    if(G.state==="play"){
      if(G.solved){
        G.co2=Math.max(0,G.co2-25*dt);
        if(G.co2<=CFG.start*.8) return endRound(true);
      } else {
        G.time-=dt;
        G.co2=Math.min(100,G.co2+((100-CFG.start)/G.dur)*.95*(1-.15*G.step)*dt);
        if(G.time<=0||G.co2>=100){ G.time=Math.max(0,G.time); return endRound(false); }
      }
      [[50,"CO2"],[75,"crit"],[90,"crew"]].forEach((a,i)=>{
        if(G.co2>=a[0]&&!G.fired[a[0]]){
          G.fired[a[0]]=1;
          const msgs=window.A13_LANG==="fr"
            ? ["Niveau de CO₂ en hausse.","Attention. CO₂ critique.","Équipage, vérifiez l'adaptateur."]
            : ["CO2 level rising.","Warning. CO2 critical.","Crew, check the adapter now."];
          say(msgs[i], true);
        }
      });
    }
    const co=G.co2, l=co/100, m=Math.max(0,Math.ceil(G.time));
    $("tm").textContent=`${Math.floor(m/60)}:${String(m%60).padStart(2,"0")}`;
    $("cp").textContent=`${Math.round(co)}%`;
    $("cs").textContent=co<40?t("co2Safe"):co<75?t("co2Rising"):t("co2Crit");
    $("fill").style.width=co+"%";
    $("fill").style.background=co<40?"#3ddc97":co<75?"#ffb020":"#ff4d4f";
    $("cp").parentNode.parentNode.querySelector("[role=progressbar]").setAttribute("aria-valuenow",Math.round(co));
    const crit=co>=75&&G.state==="play";
    $("ban").classList.toggle("hide",!crit);
    // Switch breathing sample as pressure rises
    if(G.state==="play"&&!muted) setBreathMode(breathIntensity());
    else if(G.state!=="play") setBreathMode("off");
    const ef=!reduced&&G.state!=="menu"&&G.state!=="nick";
    $("cv").style.filter=ef&&co>45?`blur(${(((co-45)/55)*6).toFixed(1)}px)`:"none";
    $("vig").style.opacity=ef?clamp((co-35)/65,0,.9):0;
    $("red").className=crit?(reduced?"st":"on"):"";
    if(ef&&co>50&&G.state==="play"){ if(now>nextFl){ light.intensity=.55+Math.random()*.45; nextFl=now+500+Math.random()*700; } }
    else if(light) light.intensity=1;
    controls.target.y=BASE.y+(ef&&G.state==="play"?Math.sin(now/(1400-800*l))*.6*l:0);
    if(marker){
      if(ghost&&G.state==="play"){
        const a=ghost.userData.anchor;
        marker.visible=true; marker.position.set(a.x,a.y+3,a.z); marker.scale.setScalar(1+.12*Math.sin(now/280));
        ghost.userData.fills.forEach(m=>{ m.opacity=.12+.08*Math.sin(now/260); });
      } else marker.visible=false;
    }
    if(G.state==="intro"){
      const el=performance.now()-introStart, p=clamp(el/INTRO_TOTAL,0,1);
      camera.position.set(-12, 15+(1-p)*22, 95+(1-p)*70); controls.target.copy(BASE);
      if(!reduced&&el<1800){ const k=(1-el/1800)*1.6; camera.position.x+=(Math.random()-.5)*k; camera.position.y+=(Math.random()-.5)*k; }
      if(!reduced&&el<7500){ if(now>nextFl){ light.intensity=.2+Math.random()*.8; nextFl=now+500+Math.random()*400; } }
      else light.intensity=1;
      const u=(el-7800)/4200;                       // the square canister will not fit the round port
      if(u>0&&u<1){
        const sn=Math.sin(Math.PI*u);
        preCanister.position.set(CP.x+(0-CP.x)*sn*.9, CP.y+(0-CP.y)*sn*.9, CP.z+(12-CP.z)*sn);
        portRing.material.color.set(sn>.6?0xff4d4f:0x9aa3b2);
      } else { preCanister.position.set(CP.x,CP.y,CP.z); portRing.material.color.set(0x9aa3b2); }
    }
    controls.update();
    renderer.render(scene,camera);
  }catch(e){ fail(e); }
}

/* ===== init ===== */
async function initAuth(){
  if(!sb) return;
  try{
    const {data,error}=await sb.auth.signInAnonymously();
    if(error){ console.warn("Anon auth skipped:", error.message||error); return; }
    if(data?.user) G.authUid=data.user.id;
  }catch(e){ console.warn("Anon auth failed", e); }
}

function wireLangButtons(){
  document.querySelectorAll(".lang-bar button").forEach(btn=>{
    btn.onclick=()=>{
      const fr = btn.id.includes("FR") || btn.textContent.trim()==="FR";
      window.setLang(fr?"fr":"en");
    };
  });
}

function init(){
  if(!initScene()) return;
  buildUI();
  wireLangButtons();
  window.applyLang();
  $("sRed").checked=reduced;
  const ver=$("ver"); if(ver) ver.textContent="v"+GAME_VERSION;

  try{ const prev=localStorage.getItem("a13_nick"); if(prev) $("sNick").value=prev; }catch(_){}

  $("bNick").onclick=async()=>{
    const n=cleanNick($("sNick").value);
    if(!n){ $("nickErr").textContent=t("nickInvalid"); return; }
    G.nickname=n; G.classCode=cleanClass($("sClass").value);
    try{ localStorage.setItem("a13_nick",n); }catch(_){}
    $("dispNick").textContent=n+(G.classCode?" · "+G.classCode:"");
    $("nickErr").textContent="";
    await initAuth();
    setState("menu");
  };

  $("bStart").onclick=()=>{
    reduced=$("sRed").checked; vol=+$("sVol").value; G.dur=+$("sDur").value;
    const teamStr=$("sTeams").value.trim();
    if(teamStr){
      G.teams=teamStr.split(",").map(s=>s.trim().slice(0,20)).filter(Boolean).slice(0,4);
      if(!G.teams.length) G.teams=[G.nickname||"Player"];
    } else G.teams=[G.nickname||"Player"];
    G.ti=0; G.results=[];
    // User gesture: unlock WebAudio + HTMLAudio so intro radio / breathing can play
    audioInit();
    if(AC) AC.resume().catch(()=>{});
    setVol();
    startIntro();
  };

  $("bPlace").onclick=attempt;

  // Folder photos: click to enlarge, click again / backdrop to close
  const lb=$("imgLightbox");
  const lbImg=$("lbImg");
  document.querySelectorAll(".folder-grid img, .photo-gallery img, #cabinPhoto").forEach(img=>{
    img.style.cursor="zoom-in";
    img.addEventListener("click", ()=>{
      if(!lb||!lbImg) return;
      lbImg.src=img.currentSrc||img.src;
      lbImg.alt=img.alt||"";
      lb.classList.remove("hide");
    });
  });
  if(lb){
    lb.addEventListener("click", e=>{ if(e.target===lb||e.target.id==="lbClose") lb.classList.add("hide"); });
    addEventListener("keydown", e=>{ if(e.key==="Escape"&&lb&&!lb.classList.contains("hide")) lb.classList.add("hide"); });
  }

  // Parts box + reference folder panels
  function openPanel(which){
    const invP=$("invPanel"), folP=$("folderPanel"), bBox=$("bBox"), bFol=$("bFolder");
    const openInv=which==="inv", openFol=which==="folder";
    if(invP) invP.classList.toggle("hide", !openInv);
    if(folP) folP.classList.toggle("hide", !openFol);
    if(bBox) bBox.setAttribute("aria-expanded", String(openInv));
    if(bFol) bFol.setAttribute("aria-expanded", String(openFol));
  }
  $("bBox")&&($("bBox").onclick=()=>{
    const open=$("invPanel")&&$("invPanel").classList.contains("hide");
    openPanel(open?"inv":null);
  });
  $("bFolder")&&($("bFolder").onclick=()=>{
    const open=$("folderPanel")&&$("folderPanel").classList.contains("hide");
    openPanel(open?"folder":null);
  });
  $("bBoxClose")&&($("bBoxClose").onclick=()=>openPanel(null));
  $("bFolderClose")&&($("bFolderClose").onclick=()=>openPanel(null));
  $("bHint").onclick=hint;
  $("bPause").onclick=pause;
  $("bResume").onclick=resume;
  $("bView").onclick=resetView;
  $("bMute").onclick=()=>{
    muted=!muted;
    $("bMute").setAttribute("aria-pressed",String(muted)); setVol();
    if(muted){ stopAllSamples(); }
    else if(G.state==="play"){ startPlayRadio(); setBreathMode(G.co2>=70?"critical":"loop"); }
    else if(G.state==="intro") playIntroRadio();
    if(muted&&"speechSynthesis"in window) speechSynthesis.cancel();
  };
  // Separate radio / breath controls (start screen + live HUD if present)
  const wireChan=(id,fn)=>{ const el=$(id); if(el) el.oninput=el.onchange=fn; };
  wireChan("sVol",()=>{ vol=+$("sVol").value; applyChannelVol(); });
  wireChan("sVolRadio",()=>{ volRadio=+$("sVolRadio").value; applyChannelVol(); });
  wireChan("sVolBreath",()=>{ volBreath=+$("sVolBreath").value; applyChannelVol(); });
  // Sync initial channel levels from the start-screen sliders
  if($("sVolRadio")) volRadio=+$("sVolRadio").value;
  if($("sVolBreath")) volBreath=+$("sVolBreath").value;
  const wireMuteBtn=(id,get,set,apply)=>{
    const el=$(id); if(!el) return;
    // Keep the same icon glyph; only light/dim via aria-pressed class
    el.onclick=()=>{ set(!get()); el.setAttribute("aria-pressed",String(get())); apply(); };
  };
  wireMuteBtn("bMuteRadio",()=>muteRadio,v=>{muteRadio=v;},()=>{
    applyChannelVol();
    if(muteRadio) stopIntroRadio();
    else if(G.state==="intro") playIntroRadio();
    else if(G.state==="play") startPlayRadio();
  });
  wireMuteBtn("bMuteBreath",()=>muteBreath,v=>{muteBreath=v;},()=>{
    if(muteBreath) stopBreathOnly();
    else if(G.state==="play") setBreathMode(G.co2>=70?"critical":"loop");
    applyChannelVol();
  });
  // HUD quick toggles mirror start-screen channel mutes
  wireMuteBtn("bMuteRadioHud",()=>muteRadio,v=>{muteRadio=v;},()=>{
    applyChannelVol();
    const b=$("bMuteRadio"); if(b) b.setAttribute("aria-pressed",String(muteRadio));
    if(muteRadio) stopIntroRadio();
    else if(G.state==="intro") playIntroRadio();
    else if(G.state==="play") startPlayRadio();
  });
  wireMuteBtn("bMuteBreathHud",()=>muteBreath,v=>{muteBreath=v;},()=>{
    const b=$("bMuteBreath"); if(b) b.setAttribute("aria-pressed",String(muteBreath));
    if(muteBreath) stopBreathOnly();
    else if(G.state==="play") setBreathMode(G.co2>=70?"critical":"loop");
    applyChannelVol();
  });
  $("bFs").onclick=()=>{ try{ document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen(); }catch(_){} };
  $("bRetrySubmit").onclick=()=>{ if(G.lastSubmit?.payload) submitScore(true); };

  const cv=$("cv");
  let down=null;
  cv.addEventListener("pointerdown", e=>{ down=[e.clientX,e.clientY]; });
  cv.addEventListener("pointerup", e=>{
    if(!down||G.state!=="play") return;
    if(Math.hypot(e.clientX-down[0], e.clientY-down[1])>14) return;   // it was a camera drag
    if(!G.sel){ say(t("selectFirst")); return; }
    if(overGhost(e.clientX,e.clientY)) attempt(); else say(t("dropOnOutline"));
  });
  $("bSkip").onclick=endIntro;
  addEventListener("keydown", e=>{
    const tag=e.target.tagName;
    if(tag==="INPUT"||tag==="SELECT") return;
    if(G.state==="intro"&&(e.key==="Escape"||e.key==="Enter"||e.key===" ")){ e.preventDefault(); endIntro(); return; }
    if(G.state!=="play") return;
    const k=e.key, s=.12;
    if(k==="ArrowLeft") orbit(-s,0);
    else if(k==="ArrowRight") orbit(s,0);
    else if(k==="ArrowUp") orbit(0,-s);
    else if(k==="ArrowDown") orbit(0,s);
    else if(k==="+"||k==="=") zoom(.9);
    else if(k==="-") zoom(1.1);
    else if(k==="Enter"&&tag!=="BUTTON") attempt();
    else if(k==="p"||k==="P") pause();
    else if(/^[1-9]$/.test(k)&&ITEMS[+k-1]) select(ITEMS[+k-1].id);
    else return;
    if(k.startsWith("Arrow")) e.preventDefault();
  });
  document.addEventListener("visibilitychange", ()=>{ if(document.hidden) pause(); });
  requestAnimationFrame(frame);
}

try{ init(); }catch(e){ fail(e); }