// ============================================================
// Apollo 13 – i18n (English / Français)
// ============================================================
window.A13_I18N = {
  en: {
    // Nickname
    nickTitle: "Apollo 13: Fix the Air",
    nickIntro: "Pick a nickname for the leaderboard.",
    nickLabel: "Nickname",
    classLabel: "Class code (optional, 4–8 letters/digits)",
    nickLegal: "Your nickname and score may be shown publicly. Deletable on request.",
    continue: "Continue",
    nickInvalid: "Invalid nickname (3–16 chars, letters/numbers/spaces/_ only).",

    // Start / settings
    story: "An explosion crippled Apollo 13. CO₂ is rising: the <b>square</b> filters do not fit the <b>round</b> port. Build an adapter from what is on board.",
    step1: "👀 <b>Look</b><br>Drag to rotate, pinch to zoom.",
    step2: "✋ <b>Pick</b><br>Take a part from the box.",
    step3: "🔧 <b>Build</b><br>Drop it on the dashed outline.",
    timeLimit: "Time",
    teamsLabel: "Teams (optional, max 4)",
    teamsPh: "Empty = ranked solo",
    volume: "Volume",
    reduced: "Reduced effects",
    warn: "Simulated stress: breathing, alarms, flicker.",
    playingAs: "Playing as:",
    viewBoard: "Leaderboard",
    start: "Start",
    min3: "3 min", min5: "5 min", min8: "8 min",

    // HUD
    player: "Player",
    hint: "Hint",
    place: "Place ⏎",
    briefSum: "Brief",
    briefSit: "<b>Goal:</b> square filters, round port. Build an adapter.",
    briefObj: "<b>Parts on board:</b>",
    objCan: "<b>LiOH canister</b> — already in the cabin (square scrubber)",
    objCov: "<b>Flight plan cover</b> — stiff cardstock that shapes the adapter",
    objBag: "<b>LCG bag</b> — plastic sleeve for airtightness",
    objHose: "<b>Suit hose</b> — carries air between port and canister",
    objTape: "<b>Duct tape</b> — seals every joint",
    briefTip: "Tap a part: a dashed outline shows where it goes.",
    realSizes: "Real sizes (Smithsonian / approx.)",
    co2Safe: "SAFE", co2Rising: "RISING", co2Crit: "CRITICAL",
    ban: "⚠ CO₂ CRITICAL",

    // Dialogue
    missionStart: "Mission start. The square canister is already here — it does not fit the round port. Build the adapter around it.",
    selectFirst: "Select or drag an item first.",
    already: "Already used.",
    good: "Good.",
    wrongOrder: "Useful part, wrong moment. Rethink the order.",
    useless: "That will not help with CO₂.",
    complete: "Adapter complete. CO₂ is dropping.",
    keepBuilding: "Keep building the airtight path.",

    // Pause / end
    paused: "Paused",
    pausedMu: "Timer and CO₂ are stopped.",
    resume: "Resume",
    win: "✅ Mission success",
    lose: "❌ Mission failed",
    winDetail: "Air is safe again.",
    loseDetail: "CO₂ reached a dangerous level.",
    fact: "Real history: Houston engineers designed and tested the “mailbox” on the ground, then talked the crew through building it. Smithsonian mock-up: 18.4×18.4×22.9 cm.",
    whatBuilt: "Your assembly",
    realSolution: "Historical solution",
    realSteps: "Canister → cardstock cover (arch) → LCG bag → suit hose to round port → duct tape on every joint.",
    placed: "placed",
    notPlaced: "not placed",
    finalOrder: "Your order:",
    incomplete: "Adapter incomplete.",
    nothing: "No adapter parts were placed.",
    ranks: "Your ranks",
    playAgain: "Play again",
    nextTeam: "Next:",
    fullBoard: "Full leaderboard",
    retrySubmit: "Retry submit",
    submitting: "Submitting score…",
    submitted: "Score submitted ✓",
    submitFail: "Could not submit (offline or server error). You can retry.",
    teamLocal: "Team mode is local-only (not ranked).",
    errTitle: "Something went wrong",
    errWebgl: "Reload the page. WebGL must be enabled in your browser.",

    // Intro, roles, placement (v1.1)
    intro1: "Life support is failing in the Lunar Module.",
    intro2: "The square canisters won't fit the round slots.",
    intro3: "Tape together an emergency filter adapter—save Apollo 13!",
    skip: "Skip intro ▶",
    objAlt: "<b>Alternatives:</b> the checklist cover is also rigid, and a stowage bag can also be the airtight sleeve.",
    roleTaken: "That job is already done by: {item}.",
    dropOnOutline: "Drop it on the dashed outline.",
    tooEarly: { hose: "The hose needs something rigid to connect to first.", seal: "Too early. Seal the joints only after the other parts are in place." },
    roleHints: {
      shape: ["Look at the problem: a square canister and a round port. What could you wrap around the canister to give it a firm, shaped body?", "You need something stiff but bendable, like cardstock. Which items are rigid?", "Try the flight plan cover or the checklist cover."],
      sleeve: ["Air must not leak through the walls of the adapter. What should the adapter be wrapped in?", "Look for a flexible plastic bag that holds air.", "Try the LCG bag or the stowage bag."],
      hose: ["The air has to travel somewhere. What links the round port to the canister?", "You need a flexible tube that can bend between the two.", "Use the suit hose, from the canister to the port."],
      seal: ["Even a small gap lets CO₂ escape. How do you close every joint?", "Something sticky that holds plastic and cardboard together.", "Use the duct tape on every joint, last."]
    },
    roles: { shape: "Rigid adapter", sleeve: "Airtight sleeve", hose: "Air path (hose)", seal: "Seal (tape)" },
    sameAsNasa: "Same parts as NASA’s real “mailbox”.",
    altSolution: "A different combination from NASA’s, valid in this game.",

    // Item names (inventory)
    items: {
      cover: "Flight plan cover",
      check: "Checklist cover",
      bag: "LCG bag",
      stow: "Stowage bag",
      hose: "Suit hose",
      tape: "Duct tape"
    },

    // Phase 1: Think – briefing MCQ
    briefAlert: "Emergency: 3 astronauts, a cabin for 2. CO₂ is rising.",
    briefTitle: "Choose the best plan.",
    briefExplain: "The spare filters are square. The sockets are round. You cannot force it: invent an adapter from what is on board.",
    briefQ1: "Force the square filter into the round socket.",
    briefQ2: "Build a sealed adapter from onboard materials.",
    briefWrong: "No. Forcing it damages the socket and lets CO₂ leak.",
    briefRight: "Yes. Build it step by step, like the crew in 1970.",
    briefContinue: "Begin",

    // Telemetry labels
    telShapeOff: "Body: —",
    telShapeOn: "Body: SHAPED",
    telSleeveOff: "Envelope: —",
    telSleeveOn: "Envelope: CREATED",
    telHoseOff: "Airflow: —",
    telHoseOn: "Airflow: REROUTED",
    telSealOff: "Seal: —",
    telSealOn: "Seal: AIRTIGHT",

    // Phase 3: Compare debrief
    debriefProblem: "Problem: 3 crew in a 2-person cabin; square CM canisters would not fit the round LM ports.",
    debriefSolution: "Solution: Ground engineers improvised a sealed adapter from flight-plan covers, an LCG bag, a suit hose, and duct tape — the “mailbox”.",
    nasmCaption: "Smithsonian NASM A19760747000 — the real adapter.",
    cabinCaption: "Installed in the LM cabin (historical photo).",
    boxLabel: "Parts box",
    folderLabel: "Reference folder",
    invTitle: "Onboard parts",
    folderTitle: "Real objects",
    folderHint: "The real objects behind each part of your box.",
    capCabin: "In the LM cabin",
    capSide: "Side view",
    capHose: "Hose path",
    capJoint: "Sealed joint",
    research: "Research",
    researchTitle: "Research: the real adapter (costs time)",
    more: "More", settings: "Settings",
    capBag: "Plastic bag (LCG bag)", capCard: "Cardboard (what the covers are made of)", capTape: "Duct tape", capHoseM: "Suit hose",
    capCanSq: "Square LiOH canister (already placed)", capCanRd: "Round LiOH canister (the round port)",
    classInvalid: "Class code must be 4–8 letters/digits (or leave it empty).",
    tutOpt: "Tutorial", tutNext: "Next", tutSkip: "Skip", tutDone: "Got it", tutPaused: "Timer paused during the tutorial.",
    tut1: "1. Read the brief: your goal and the parts on board.",
    tut2: "2. Open the Parts box.",
    tut3: "3. Select a part. A dashed outline shows where it goes.",
    tut4: "4. Not sure? The folder shows the real objects.",
    tut5: "5. Then press Place (or tap the outline). Order matters!",
  },

  fr: {
    nickTitle: "Apollo 13 : Réparer l'air",
    nickIntro: "Choisissez un pseudo pour le classement.",
    nickLabel: "Pseudo",
    classLabel: "Code de classe (facultatif, 4–8 lettres/chiffres)",
    nickLegal: "Votre pseudo et votre score peuvent être affichés publiquement. Suppression sur demande.",
    continue: "Continuer",
    nickInvalid: "Pseudo invalide (3–16 caractères, lettres/chiffres/espaces/_ uniquement).",

    story: "Une explosion a mutilé Apollo 13. Le CO₂ monte : les filtres <b>carrés</b> ne vont pas dans l'orifice <b>rond</b>. Construisez un adaptateur avec ce qu'il y a à bord.",
    step1: "👀 <b>Observer</b><br>Glissez pour tourner, pincez pour zoomer.",
    step2: "✋ <b>Choisir</b><br>Prenez une pièce dans la caisse.",
    step3: "🔧 <b>Construire</b><br>Posez-la sur le contour en pointillés.",
    timeLimit: "Durée",
    teamsLabel: "Équipes (facultatif, max 4)",
    teamsPh: "Vide = solo classé",
    volume: "Volume",
    reduced: "Effets réduits",
    warn: "Stress simulé : respiration, alarmes, scintillement.",
    playingAs: "Vous jouez :",
    viewBoard: "Classement",
    start: "Démarrer",
    min3: "3 min", min5: "5 min", min8: "8 min",

    player: "Joueur",
    hint: "Indice",
    place: "Placer ⏎",
    briefSum: "Briefing",
    briefSit: "<b>But :</b> filtres carrés, orifice rond. Construisez un adaptateur.",
    briefObj: "<b>Pièces à bord :</b>",
    objCan: "<b>Cartouche LiOH</b> — déjà dans la cabine (épurateur carré)",
    objCov: "<b>Couverture du plan de vol</b> — carton rigide qui forme l'adaptateur",
    objBag: "<b>Sac LCG</b> — gaine plastique pour l'étanchéité",
    objHose: "<b>Tuyau de combinaison</b> — amène l'air entre l'orifice et la cartouche",
    objTape: "<b>Ruban adhésif</b> — scelle chaque joint",
    briefTip: "Touchez une pièce : un contour en pointillés montre où la placer.",
    realSizes: "Dimensions réelles (Smithsonian / approx.)",
    co2Safe: "SÛR", co2Rising: "EN HAUSSE", co2Crit: "CRITIQUE",
    ban: "⚠ CO₂ CRITIQUE",

    missionStart: "Mission démarrée. La cartouche carrée est déjà là — elle ne rentre pas dans l'orifice rond. Construisez l'adaptateur autour.",
    selectFirst: "Sélectionnez ou glissez d'abord un objet.",
    already: "Déjà utilisé.",
    good: "Bien.",
    wrongOrder: "Pièce utile, mauvais moment. Repensez l'ordre.",
    useless: "Cela n'aidera pas contre le CO₂.",
    complete: "Adaptateur terminé. Le CO₂ baisse.",
    keepBuilding: "Continuez le chemin étanche.",

    paused: "Pause",
    pausedMu: "Le minuteur et le CO₂ sont arrêtés.",
    resume: "Reprendre",
    win: "✅ Mission réussie",
    lose: "❌ Mission échouée",
    winDetail: "L'air est de nouveau sûr.",
    loseDetail: "Le CO₂ a atteint un niveau dangereux.",
    fact: "Histoire vraie : les ingénieurs de Houston ont conçu et testé le « mailbox » au sol, puis ont guidé l'équipage. Maquette Smithsonian : 18,4×18,4×22,9 cm.",
    whatBuilt: "Votre assemblage",
    realSolution: "Solution historique",
    realSteps: "Cartouche → couverture carton (arche) → sac LCG → tuyau vers l'orifice rond → ruban sur chaque joint.",
    placed: "placé",
    notPlaced: "non placé",
    finalOrder: "Votre ordre :",
    incomplete: "Adaptateur incomplet.",
    nothing: "Aucune pièce d'adaptateur placée.",
    ranks: "Vos rangs",
    playAgain: "Rejouer",
    nextTeam: "Suivant :",
    fullBoard: "Classement complet",
    retrySubmit: "Réessayer l'envoi",
    submitting: "Envoi du score…",
    submitted: "Score envoyé ✓",
    submitFail: "Envoi impossible (hors ligne ou erreur serveur). Vous pouvez réessayer.",
    teamLocal: "Mode équipe local uniquement (non classé).",
    errTitle: "Une erreur est survenue",
    errWebgl: "Rechargez la page. WebGL doit être activé dans le navigateur.",

    // Intro, rôles, placement (v1.1)
    intro1: "Le système de survie du module lunaire tombe en panne.",
    intro2: "Les cartouches carrées ne s'adaptent pas aux prises rondes.",
    intro3: "Fabriquez un adaptateur de filtre d'urgence avec du ruban adhésif — sauvez Apollo 13 !",
    skip: "Passer l'intro ▶",
    objAlt: "<b>Alternatives :</b> la couverture de checklist est aussi rigide, et un sac de rangement peut aussi servir de gaine étanche.",
    roleTaken: "Ce rôle est déjà rempli par : {item}.",
    dropOnOutline: "Déposez-la sur le contour en pointillés.",
    tooEarly: { hose: "Le tuyau a d'abord besoin d'une pièce rigide où se raccorder.", seal: "Trop tôt. Scellez les joints seulement quand les autres pièces sont en place." },
    roleHints: {
      shape: ["Observez le problème : une cartouche carrée et un orifice rond. Que pourriez-vous enrouler autour de la cartouche pour lui donner un corps ferme et façonné ?", "Il faut quelque chose de rigide mais pliable, comme du carton. Quels objets sont rigides ?", "Essayez la couverture du plan de vol ou celle de la checklist."],
      sleeve: ["L'air ne doit pas fuir par les parois de l'adaptateur. Dans quoi faut-il l'envelopper ?", "Cherchez un sac plastique souple qui retient l'air.", "Essayez le sac LCG ou le sac de rangement."],
      hose: ["L'air doit circuler quelque part. Qu'est-ce qui relie l'orifice rond à la cartouche ?", "Il faut un tube souple capable de se plier entre les deux.", "Utilisez le tuyau de combinaison, de la cartouche vers l'orifice."],
      seal: ["Même une petite fente laisse échapper le CO₂. Comment fermer chaque joint ?", "Quelque chose d'adhésif qui tient le plastique et le carton ensemble.", "Utilisez le ruban adhésif sur chaque joint, en dernier."]
    },
    roles: { shape: "Adaptateur rigide", sleeve: "Gaine étanche", hose: "Circuit d'air (tuyau)", seal: "Étanchéité (ruban)" },
    sameAsNasa: "Mêmes pièces que le vrai « mailbox » de la NASA.",
    altSolution: "Une combinaison différente de celle de la NASA, valide dans ce jeu.",

    items: {
      cover: "Couverture plan de vol",
      check: "Couverture de checklist",
      bag: "Sac LCG",
      stow: "Sac de rangement",
      hose: "Tuyau de combinaison",
      tape: "Ruban adhésif"
    },

    briefAlert: "Urgence : 3 astronautes, une cabine pour 2. Le CO₂ monte.",
    briefTitle: "Choisissez le meilleur plan.",
    briefExplain: "Les filtres de rechange sont carrés. Les prises sont rondes. Impossible de forcer : inventez un adaptateur avec ce qu'il y a à bord.",
    briefQ1: "Forcer le filtre carré dans la prise ronde.",
    briefQ2: "Construire un adaptateur étanche avec le matériel de bord.",
    briefWrong: "Non. Forcer abîme la prise et laisse fuir le CO₂.",
    briefRight: "Oui. Étape par étape, comme l'équipage en 1970.",
    briefContinue: "Commencer",

    telShapeOff: "Corps : —",
    telShapeOn: "Corps : FORMÉ",
    telSleeveOff: "Enveloppe : —",
    telSleeveOn: "Enveloppe : CRÉÉE",
    telHoseOff: "Flux d'air : —",
    telHoseOn: "Flux d'air : RÉORIENTÉ",
    telSealOff: "Joint : —",
    telSealOn: "Joint : ÉTANCHE",

    debriefProblem: "Problème : 3 astronautes dans une cabine pour 2 ; les cartouches carrées du CM ne rentraient pas dans les orifices ronds du LM.",
    debriefSolution: "Solution : les ingénieurs au sol ont improvisé un adaptateur étanche avec des couvertures de plan de vol, un sac LCG, un tuyau de combinaison et du ruban adhésif — le « mailbox ».",
    nasmCaption: "Smithsonian NASM A19760747000 — le vrai adaptateur.",
    cabinCaption: "Installé dans la cabine du LM (photo historique).",
    boxLabel: "Caisse de pièces",
    folderLabel: "Dossier de référence",
    invTitle: "Pièces à bord",
    folderTitle: "Objets réels",
    folderHint: "Les vrais objets derrière chaque pièce de votre caisse.",
    capCabin: "Dans la cabine du LM",
    capSide: "Vue de côté",
    capHose: "Chemin du tuyau",
    capJoint: "Joint scellé",
    research: "Recherche",
    researchTitle: "Recherche : le vrai adaptateur (coûte du temps)",
    more: "Plus", settings: "Réglages",
    capBag: "Sac plastique (sac LCG)", capCard: "Carton (matière des couvertures)", capTape: "Ruban adhésif", capHoseM: "Tuyau de combinaison",
    capCanSq: "Cartouche LiOH carrée (déjà en place)", capCanRd: "Cartouche LiOH ronde (la prise ronde)",
    classInvalid: "Le code de classe doit faire 4–8 lettres/chiffres (ou laissez vide).",
    tutOpt: "Tutoriel", tutNext: "Suivant", tutSkip: "Passer", tutDone: "Compris", tutPaused: "Chrono en pause pendant le tutoriel.",
    tut1: "1. Lisez le briefing : votre but et les pièces à bord.",
    tut2: "2. Ouvrez la caisse de pièces.",
    tut3: "3. Choisissez une pièce. Un contour en pointillés montre où la placer.",
    tut4: "4. Un doute ? Le dossier montre les vrais objets.",
    tut5: "5. Puis appuyez sur Placer (ou touchez le contour). L'ordre compte !",
  }
};

window.A13_LANG = (function(){
  try { return localStorage.getItem("a13_lang") === "fr" ? "fr" : "en"; }
  catch(_){ return "en"; }
})();

window.t = function(key){
  const pack = window.A13_I18N[window.A13_LANG] || window.A13_I18N.en;
  const en = window.A13_I18N.en;
  return (pack && pack[key] != null) ? pack[key] : (en[key] != null ? en[key] : key);
};

window.tItem = function(id){
  const pack = window.A13_I18N[window.A13_LANG] || window.A13_I18N.en;
  const en = window.A13_I18N.en;
  return (pack.items && pack.items[id]) || (en.items && en.items[id]) || id;
};

window.setLang = function(l){
  window.A13_LANG = (l === "fr") ? "fr" : "en";
  try { localStorage.setItem("a13_lang", window.A13_LANG); } catch(_){}
  if (typeof window.applyLang === "function") window.applyLang();
};