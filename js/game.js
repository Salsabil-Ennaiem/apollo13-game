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
  hose: { len:132.1, r:1.9, src:"Smithsonian hose" },
  tape: { w:5, src:"Duct tape approx." },
  bag: { w:18, h:26, src:"LCG bag approx." }
};
// Canister is already in the cabin at start → not in inventory; sequence starts after it
const VALID_ORDERS = [
  ["cover","bag","hose","tape"],
  ["bag","cover","hose","tape"]
];
const REQUIRED = new Set(["cover","bag","hose","tape"]);
const STEPS = {
  cover: ["Shape adapter from flight-plan cover","Stiff cardstock forms an arch around the square canister."],
  bag: ["Add LCG bag sleeve","Flexible airtight plastic around the adapter."],
  hose: ["Connect suit hose to round port","Air must flow from port through the canister."],
  tape: ["Seal with duct tape","Tape every joint — leaks defeat the fix."]
};
// Inventory WITHOUT canister (already in scene)
const ITEMS = [
  {id:"cover", ic:"📘", d:"21×28 cm"},
  {id:"sock", ic:"🧦", d:"30 cm"},
  {id:"bag", ic:"🛍️", d:"18×26 cm"},
  {id:"pen", ic:"🖊️", d:"14 cm"},
  {id:"hose", ic:"🧵", d:"132 cm"},
  {id:"helmet", ic:"🪖", d:"30 cm"},
  {id:"tape", ic:"🩹", d:"5 cm"},
  {id:"check", ic:"📋", d:"20×28 cm"}
];
const SLOT = {
  cover:[-28,8,18], bag:[-28,4,18], hose:[-14,8,14], tape:[-28,0,18]
};

const $ = id => document.getElementById(id);
const clamp = (v,a,b) => Math.min(b, Math.max(a,v));
const G = {
  state:"nick", step:0, co2:15, time:300, dur:300, hints:0, mist:0,
  sel:null, solved:false, fired:{}, teams:["Player"], ti:0, results:[],
  used:{}, nickname:"", classCode:null, authUid:null,
  log:[], startTs:0, lastSubmit:null, placedSeq:["canister"] // canister already present
};

let reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let muted = false, vol = .6;
let lastDropPos = null;

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
let AC, master, nbuf, tBreath, tBeep;
function audioInit(){
  if(AC||!(window.AudioContext||window.webkitAudioContext)) return;
  AC=new(window.AudioContext||window.webkitAudioContext)();
  master=AC.createGain(); master.gain.value=muted?0:vol; master.connect(AC.destination);
  nbuf=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);
  const d=nbuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  [55,110.5].forEach((f,i)=>{ const o=AC.createOscillator(),g=AC.createGain(); o.frequency.value=f; g.gain.value=i?.008:.02; o.connect(g);g.connect(master);o.start(); });
  const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();
  s.buffer=nbuf;s.loop=true;f.type="lowpass";f.frequency.value=300;g.gain.value=.03;
  s.connect(f);f.connect(g);g.connect(master);s.start();
}
function setVol(){ if(master) master.gain.value=muted?0:vol; }
function breath(){
  if(!AC||G.state!=="play") return;
  const l=G.co2/100, cycle=3.4-1.6*l, inDur=cycle*.38, hold=cycle*.08, outDur=cycle*.54;
  const t0=AC.currentTime, peak=.12+.55*l;
  const s1=AC.createBufferSource(),f1=AC.createBiquadFilter(),g1=AC.createGain();
  s1.buffer=nbuf;f1.type="bandpass";f1.frequency.value=280+420*l;f1.Q.value=.9;
  g1.gain.setValueAtTime(0,t0); g1.gain.linearRampToValueAtTime(peak,t0+inDur*.7); g1.gain.linearRampToValueAtTime(peak*.85,t0+inDur);
  s1.connect(f1);f1.connect(g1);g1.connect(master); s1.start(t0);s1.stop(t0+inDur+.05);
  const s2=AC.createBufferSource(),f2=AC.createBiquadFilter(),g2=AC.createGain();
  s2.buffer=nbuf;f2.type="bandpass";f2.frequency.value=180+250*l;f2.Q.value=.7;
  const tOut=t0+inDur+hold;
  g2.gain.setValueAtTime(0,tOut); g2.gain.linearRampToValueAtTime(peak*.7,tOut+outDur*.25); g2.gain.linearRampToValueAtTime(0,tOut+outDur);
  s2.connect(f2);f2.connect(g2);g2.connect(master); s2.start(tOut);s2.stop(tOut+outDur+.05);
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
function loopsOn(){ loopsOff(); if(AC){ AC.resume(); breath(); beep(); } }
function loopsOff(){ clearTimeout(tBreath); clearTimeout(tBeep); if(AC&&G.state!=="play") AC.suspend(); }
function say(msg, speak){
  $("sub").textContent = msg;
  if(speak && !muted && "speechSynthesis" in window){
    try{
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(msg);
      u.rate=1.05; u.volume=vol; u.lang = window.A13_LANG==="fr" ? "fr-FR" : "en-US";
      speechSynthesis.speak(u);
    }catch(_){}
  }
}

/* ===== 3D ===== */
let renderer, scene, camera, controls, light, placed, marker, problem, dropPlane, preCanister;
const BASE = new THREE.Vector3(-12,0,10);
const M = (c,o) => new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.7,metalness:.15},o||{}));

function initScene(){
  try{ renderer=new THREE.WebGLRenderer({canvas:$("cv"),antialias:true}); }
  catch(e){ fail("WebGL is not supported."); return false; }
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  scene=new THREE.Scene();
  scene.background=new THREE.Color(0x05070d);
  scene.fog=new THREE.Fog(0x05070d,140,300);
  camera=new THREE.PerspectiveCamera(50,1,1,500);
  camera.position.set(-12,15,95);
  controls=new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.copy(BASE);
  controls.enableDamping=true;
  controls.minDistance=25; controls.maxDistance=160;
  controls.maxPolarAngle=Math.PI*.85;
  scene.add(new THREE.AmbientLight(0x8899bb,.5));
  light=new THREE.PointLight(0xfff1d6,1,400); light.position.set(-10,40,70); scene.add(light);
  const dl=new THREE.DirectionalLight(0x6688cc,.35); dl.position.set(50,30,50); scene.add(dl);
  const wall=new THREE.Mesh(new THREE.PlaneGeometry(320,200),M(0x2a3140)); wall.position.set(-20,10,0); scene.add(wall);
  const gh=new THREE.GridHelper(320,32,0x3a465c,0x252d3c); gh.rotation.x=Math.PI/2; gh.position.set(-20,10,.2); scene.add(gh);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(320,200),M(0x1b212c)); fl.rotation.x=-Math.PI/2; fl.position.set(-20,-14,90); scene.add(fl);
  // Round port
  const ring=new THREE.Mesh(new THREE.TorusGeometry(DIM.port.r,1.4,12,40),M(0x9aa3b2,{metalness:.6})); ring.position.z=.8; scene.add(ring);
  const hole=new THREE.Mesh(new THREE.CircleGeometry(DIM.port.r,40),new THREE.MeshBasicMaterial({color:0x000000})); hole.position.z=.4; scene.add(hole);
  const bench=new THREE.Mesh(new THREE.BoxGeometry(70,2,40),M(0x3b4558)); bench.position.set(-26,-13.5,16); scene.add(bench);

  const c=DIM.canister;
  // Ghost: square does not fit round port
  problem=new THREE.Mesh(new THREE.BoxGeometry(c.w,c.h,c.d),new THREE.MeshBasicMaterial({color:0xff4d4f,wireframe:true}));
  problem.position.set(0,0,9); scene.add(problem);

  // Physical canister already in cabin (Smithsonian-like starting state)
  preCanister=new THREE.Group();
  preCanister.add(new THREE.Mesh(new THREE.BoxGeometry(c.w,c.h,c.d),M(0x8d949e,{metalness:.7})));
  for(let i=-2;i<=2;i++){
    const band=new THREE.Mesh(new THREE.BoxGeometry(c.w+.4,.8,c.d+.4),M(0x4b5260));
    band.position.y=i*4.5; preCanister.add(band);
  }
  preCanister.position.set(-28,-2,18);
  scene.add(preCanister);

  dropPlane=new THREE.Mesh(new THREE.PlaneGeometry(220,220), new THREE.MeshBasicMaterial({visible:false,side:THREE.DoubleSide}));
  dropPlane.rotation.x=-Math.PI/2; dropPlane.position.set(-20,-12,20); scene.add(dropPlane);

  placed=new THREE.Group(); scene.add(placed);

  // Arrow marker
  marker=new THREE.Group();
  const arrowMat=new THREE.MeshBasicMaterial({color:0xffb020,transparent:true,opacity:.92});
  const cone=new THREE.Mesh(new THREE.ConeGeometry(3.2,7,12),arrowMat); cone.rotation.x=Math.PI; cone.position.y=4;
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,8,8),arrowMat); shaft.position.y=10;
  marker.add(cone); marker.add(shaft); scene.add(marker);

  resize(); return true;
}
function resize(){ if(!renderer)return; renderer.setSize(innerWidth,innerHeight); camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); }
addEventListener("resize", resize);

function build(id, worldPos){
  const c=DIM.canister;
  const fb=SLOT[id]||[-20,0,16];
  const px=worldPos?worldPos.x:fb[0], py=worldPos?worldPos.y:fb[1], pz=worldPos?worldPos.z:fb[2];
  const g=new THREE.Group(); g.userData.itemId=id;
  if(id==="cover"){
    g.add(new THREE.Mesh(new THREE.BoxGeometry(c.w+3,14,c.d+3),M(0xe8d9b0,{transparent:true,opacity:.92,roughness:.9})));
  } else if(id==="bag"){
    g.add(new THREE.Mesh(new THREE.BoxGeometry(DIM.bag.w,1.5,DIM.bag.h),M(0x9fc4e8,{transparent:true,opacity:.6})));
  } else if(id==="hose"){
    const start=new THREE.Vector3(px,py,pz);
    const end=new THREE.Vector3(0,0,3);
    const mid=start.clone().lerp(end,.5).add(new THREE.Vector3(0,12,0));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([start,mid,end]),32,DIM.hose.r,10),M(0xf2f2f2)));
    placed.add(g); return g;
  } else if(id==="tape"){
    [-6,0,6].forEach(y=>{
      const tor=new THREE.Mesh(new THREE.TorusGeometry(10,.8,8,24),M(0x7a7f86));
      tor.rotation.x=Math.PI/2; tor.position.set(px,py+y,pz); placed.add(tor);
    });
    return null;
  } else {
    g.add(new THREE.Mesh(new THREE.BoxGeometry(8,8,8),M(0x555555)));
  }
  g.position.set(px,py,pz); placed.add(g); return g;
}
function clearPlaced(){
  placed.traverse(o=>{ if(o.geometry)o.geometry.dispose(); if(o.material)o.material.dispose(); });
  placed.clear();
}
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
function resetView(){ camera.position.set(-12,15,95); controls.target.copy(BASE); controls.update(); }

/* ===== UI / inventory + drag ===== */
function buildUI(){
  const inv=$("inv"); inv.textContent="";
  ITEMS.forEach((it,i)=>{
    const b=document.createElement("button");
    b.dataset.id=it.id;
    b.setAttribute("aria-pressed","false");
    b.draggable=true;
    b.textContent=`${i+1}. ${it.ic} ${tItem(it.id)}`;
    const s=document.createElement("small"); s.textContent=it.d; b.appendChild(s);
    b.onclick=()=>select(it.id);
    // HTML5 drag from inventory
    b.addEventListener("dragstart", e=>{
      if(G.state!=="play"||G.used[it.id]){ e.preventDefault(); return; }
      e.dataTransfer.setData("text/plain", it.id);
      e.dataTransfer.effectAllowed="copy";
      b.classList.add("dragging");
      select(it.id);
      const ghost=$("dragGhost");
      if(ghost){ ghost.style.display="block"; ghost.textContent=`${it.ic} ${tItem(it.id)}`; }
    });
    b.addEventListener("dragend", ()=>{
      b.classList.remove("dragging");
      const ghost=$("dragGhost"); if(ghost) ghost.style.display="none";
    });
    inv.appendChild(b);
  });
  const facts=$("facts"); facts.textContent="";
  Object.keys(DIM).forEach(k=>{
    const d=DIM[k];
    const p=document.createElement("div");
    p.textContent = k+": "+(d.w?`${d.w}×${d.h||d.d} cm`:d.r?`Ø${d.r*2} cm`:`${d.len} cm`)+" ("+d.src+")";
    facts.appendChild(p);
  });
}
function select(id){
  if(G.state!=="play"||G.used[id]) return;
  G.sel=id;
  document.querySelectorAll("#inv button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.id===id)));
}

/* ===== game logic ===== */
function setState(s){
  G.state=s;
  $("nick").classList.toggle("hide", s!=="nick");
  $("start").classList.toggle("hide", s!=="menu");
  $("pause").classList.toggle("hide", s!=="pause");
  $("end").classList.toggle("hide", s!=="won"&&s!=="lost");
  $("hud").classList.toggle("hide", s==="nick"||s==="menu"||s==="won"||s==="lost");
  if(s==="play") loopsOn(); else loopsOff();
}
function startRound(){
  Object.assign(G,{
    step:0, co2:CFG.start, time:G.dur, hints:0, mist:0,
    sel:null, solved:false, fired:{}, used:{}, log:[],
    startTs:performance.now(), placedSeq:["canister"]
  });
  clearPlaced();
  if(problem) problem.visible=true;
  if(preCanister) preCanister.visible=true;
  if(marker) marker.visible=true;
  lastDropPos=null;
  resetView();
  document.querySelectorAll("#inv button").forEach(b=>{ b.disabled=false; b.setAttribute("aria-pressed","false"); });
  $("tn").textContent=G.teams[G.ti];
  $("hl").textContent=CFG.hints;
  $("bHint").disabled=false;
  setState("play");
  say(t("missionStart"), true);
}
function attempt(){
  if(G.state!=="play"||G.solved) return;
  if(!G.sel){ say(t("selectFirst")); return; }
  if(G.used[G.sel]){ say(t("already")); return; }
  if(!Array.isArray(G.placedSeq)) G.placedSeq=["canister"];

  const trial=G.placedSeq.filter(x=>x!=="canister").concat([G.sel]);
  // Compare against VALID_ORDERS (which do not include canister)
  const stillPossible=VALID_ORDERS.some(ord=>
    Array.isArray(ord) && trial.every((id,i)=>ord[i]===id)
  );

  if(stillPossible && REQUIRED.has(G.sel)){
    build(G.sel, lastDropPos);
    G.used[G.sel]=true;
    G.placedSeq.push(G.sel);
    G.log.push({step:G.sel, t:Math.round(performance.now()-G.startTs)});
    G.step=G.placedSeq.length;
    G.co2=Math.max(5,G.co2-CFG.stepCo2);
    const btn=document.querySelector(`#inv button[data-id="${G.sel}"]`);
    if(btn) btn.disabled=true;
    const just=G.sel; G.sel=null; lastDropPos=null;
    document.querySelectorAll("#inv button").forEach(b=>b.setAttribute("aria-pressed","false"));

    const core=G.placedSeq.filter(x=>x!=="canister");
    const done=VALID_ORDERS.some(ord=>
      Array.isArray(ord)&&ord.length===core.length&&ord.every((id,i)=>core[i]===id)
    );
    if(done){
      G.solved=true; marker.visible=false;
      if(problem) problem.visible=false;
      say(t("complete"), true);
    } else {
      say(t("good")+" "+t("keepBuilding"));
    }
  } else {
    if(lastDropPos && !REQUIRED.has(G.sel)){
      build(G.sel, lastDropPos);
      G.used[G.sel]=true;
      const btn=document.querySelector(`#inv button[data-id="${G.sel}"]`);
      if(btn) btn.disabled=true;
      G.sel=null; lastDropPos=null;
      document.querySelectorAll("#inv button").forEach(b=>b.setAttribute("aria-pressed","false"));
    }
    G.mist++; G.co2=Math.min(100,G.co2+CFG.mistakeCo2);
    say(REQUIRED.has(G.sel)?t("wrongOrder"):t("useless"));
  }
}
function hint(){
  if(G.state!=="play"||G.hints>=CFG.hints||G.solved) return;
  G.hints++; G.time=Math.max(0,G.time-CFG.hintCost);
  $("hl").textContent=CFG.hints-G.hints;
  const core=G.placedSeq.filter(x=>x!=="canister");
  let nextId=null;
  for(const ord of VALID_ORDERS){
    if(!Array.isArray(ord)) continue;
    if(core.every((id,i)=>ord[i]===id) && ord.length>core.length){ nextId=ord[core.length]; break; }
  }
  const msg = nextId && STEPS[nextId] ? STEPS[nextId][1] : t("keepBuilding");
  say(`Hint (−${CFG.hintCost}s): ${msg}`);
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
    ["cover","bag","hose","tape"].forEach(id=>{
      const li=document.createElement("li");
      const done=Array.isArray(G.placedSeq)&&G.placedSeq.includes(id);
      li.textContent=`${done?"✓":"○"} ${tItem(id)} — ${done?t("placed"):t("notPlaced")}`;
      li.style.color=done?"var(--ok)":"var(--mu)";
      endChk.appendChild(li);
    });
  }
  const asm=$("endAssembly");
  if(asm){
    const core=(G.placedSeq||[]).filter(x=>x!=="canister");
    asm.textContent = win
      ? `${t("finalOrder")} ${core.map(tItem).join(" → ")}`
      : (core.length ? core.map(tItem).join(" → ")+" — "+t("incomplete") : t("nothing"));
  }
  $("tRealSteps").textContent=t("realSteps");

  const tb=$("eB"); tb.textContent="";
  G.results.slice(-12).forEach(r=>{
    const tr=document.createElement("tr");
    [r.n,r.r,String(r.s)].forEach(v=>{ const td=document.createElement("td"); td.textContent=v; tr.appendChild(td); });
    tb.appendChild(tr);
  });
  const nx=(G.ti+1)%G.teams.length;
  $("bNext").textContent = G.teams.length>1 ? `${t("nextTeam")} ${G.teams[nx]}` : t("playAgain");
  $("bNext").onclick=()=>{ G.ti=nx; startRound(); };
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
        G.co2=Math.min(100,G.co2+((100-CFG.start)/G.dur)*.95*(1-.15*Math.max(0,G.step-1))*dt);
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
    const ef=!reduced&&G.state!=="menu"&&G.state!=="nick";
    $("cv").style.filter=ef&&co>45?`blur(${(((co-45)/55)*6).toFixed(1)}px)`:"none";
    $("vig").style.opacity=ef?clamp((co-35)/65,0,.9):0;
    $("red").className=crit?(reduced?"st":"on"):"";
    if(ef&&co>50&&G.state==="play"){ if(now>nextFl){ light.intensity=.55+Math.random()*.45; nextFl=now+500+Math.random()*700; } }
    else if(light) light.intensity=1;
    controls.target.y=BASE.y+(ef&&G.state==="play"?Math.sin(now/(1400-800*l))*.6*l:0);
    if(marker&&marker.visible&&!G.solved){
      const core=Array.isArray(G.placedSeq)?G.placedSeq.filter(x=>x!=="canister"):[];
      let nextId=null;
      for(const ord of VALID_ORDERS){
        if(!Array.isArray(ord)) continue;
        if(core.every((id,i)=>ord[i]===id)&&ord.length>core.length){ nextId=ord[core.length]; break; }
      }
      if(nextId&&SLOT[nextId]){
        const p=SLOT[nextId];
        marker.position.set(p[0],p[1]+10,p[2]);
        marker.scale.setScalar(1+.12*Math.sin(now/280));
      }
    }
    controls.update();
    renderer.render(scene,camera);
  }catch(e){ fail(e); }
}

/* ===== raycast drop ===== */
const ray=new THREE.Raycaster(), v2=new THREE.Vector2();
function hitDrop(clientX, clientY){
  v2.set(clientX/innerWidth*2-1, -(clientY/innerHeight)*2+1);
  ray.setFromCamera(v2, camera);
  if(dropPlane){
    const hits=ray.intersectObject(dropPlane);
    if(hits.length){
      const pt=hits[0].point;
      lastDropPos={x:pt.x,y:Math.max(pt.y,-10),z:pt.z};
      return true;
    }
  }
  const plane=new THREE.Plane(new THREE.Vector3(0,1,0),12);
  const pt2=new THREE.Vector3();
  if(ray.ray.intersectPlane(plane, pt2)){
    lastDropPos={x:pt2.x,y:-10,z:pt2.z};
    return true;
  }
  return false;
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
    audioInit(); setVol(); startRound();
  };

  $("bPlace").onclick=attempt;
  $("bHint").onclick=hint;
  $("bPause").onclick=pause;
  $("bResume").onclick=resume;
  $("bView").onclick=resetView;
  $("bMute").onclick=()=>{
    muted=!muted; $("bMute").textContent=muted?"🔇":"🔊";
    $("bMute").setAttribute("aria-pressed",String(muted)); setVol();
    if(muted&&"speechSynthesis"in window) speechSynthesis.cancel();
  };
  $("bFs").onclick=()=>{ try{ document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen(); }catch(_){} };
  $("bRetrySubmit").onclick=()=>{ if(G.lastSubmit?.payload) submitScore(true); };

  const cv=$("cv");
  let down=null;
  cv.addEventListener("pointerdown", e=>{ down=[e.clientX,e.clientY]; });
  cv.addEventListener("pointerup", e=>{
    if(!down||G.state!=="play") return;
    if(Math.hypot(e.clientX-down[0], e.clientY-down[1])>14) return;
    if(!G.sel){ say(t("selectFirst")); return; }
    if(hitDrop(e.clientX,e.clientY)) attempt();
  });
  // HTML5 drop on canvas
  cv.addEventListener("dragover", e=>{ e.preventDefault(); e.dataTransfer.dropEffect="copy";
    const ghost=$("dragGhost"); if(ghost){ ghost.style.display="block"; ghost.style.left=(e.clientX+12)+"px"; ghost.style.top=(e.clientY+12)+"px"; }
  });
  cv.addEventListener("drop", e=>{
    e.preventDefault();
    const ghost=$("dragGhost"); if(ghost) ghost.style.display="none";
    if(G.state!=="play") return;
    const id=e.dataTransfer.getData("text/plain");
    if(!id) return;
    select(id);
    if(hitDrop(e.clientX,e.clientY)) attempt();
  });

  addEventListener("keydown", e=>{
    const tag=e.target.tagName;
    if(tag==="INPUT"||tag==="SELECT") return;
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
