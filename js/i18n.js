// ============================================================
// Apollo 13 – i18n (English / Français)
// ============================================================
window.A13_I18N = {
  en: {
    // Nickname
    nickTitle: "Apollo 13: Fix the Air",
    nickIntro: "Enter a nickname to appear on the public leaderboard. No email or real name required.",
    nickLabel: "Nickname (3–16 chars, letters / numbers / spaces / _)",
    classLabel: "Class code (optional, 4–8 letters/digits – private board)",
    nickLegal: "By continuing you agree that your nickname and score may be shown publicly. Data can be deleted on request.",
    continue: "Continue",
    nickInvalid: "Invalid nickname (3–16 chars, letters/numbers/spaces/_ only).",

    // Start / settings
    story: "An explosion crippled the spacecraft. The crew moved into the Lunar Module as a lifeboat. The Command Module's <b>square</b> CO₂ canisters do not fit the Lunar Module's <b>round</b> port. CO₂ is rising. Build an adapter with what is on board — as the crew did in 1970.",
    step1: "<b>1. Look</b><br>Drag to rotate, scroll or pinch to zoom.",
    step2: "<b>2. Drag</b><br>Drag an item from the inventory into the cabin.",
    step3: "<b>3. Build</b><br>Drop parts where you need them. Seal an airtight path from the round port through the square canister.",
    timeLimit: "Time limit",
    teamsLabel: "Teams (local only, comma-separated, max 4 – not ranked)",
    teamsPh: "Leave empty for ranked solo",
    volume: "Volume",
    reduced: "Reduced stress effects (no blur, flicker or sway)",
    warn: "Contains simulated stress: breathing sounds, alarms, blur and light flicker. Effects can be reduced above. No flashing over 2 times per second.",
    playingAs: "Playing as:",
    viewBoard: "View leaderboard",
    start: "Start mission",
    min3: "3 min", min5: "5 min", min8: "8 min",

    // HUD
    player: "Player",
    hint: "Hint",
    place: "Place ⏎",
    briefSum: "Mission brief & objects",
    briefSit: "<b>Situation:</b> The LM is the lifeboat. Square CM LiOH canisters do not fit the round LM port. CO₂ is rising — build an adapter (the real “mailbox”).",
    briefObj: "<b>Objects you may need:</b>",
    objCan: "<b>LiOH canister</b> — already in the cabin (square scrubber)",
    objCov: "<b>Flight plan cover</b> — stiff cardstock for an arch / seal",
    objBag: "<b>LCG bag</b> — plastic sleeve for airtightness",
    objHose: "<b>Suit hose</b> — carries air between port and canister",
    objTape: "<b>Duct tape</b> — seals every joint",
    briefTip: "Drag items from the bar into the cabin. Distractors will not help. More than one order can work.",
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

    // Item names (inventory)
    items: {
      cover: "Flight plan cover",
      bag: "LCG bag",
      hose: "Suit hose",
      tape: "Duct tape",
      sock: "Sock",
      pen: "Pen",
      helmet: "Helmet",
      check: "Checklist"
    }
  },

  fr: {
    nickTitle: "Apollo 13 : Réparer l'air",
    nickIntro: "Entrez un pseudo pour apparaître au classement public. Aucun e-mail ni vrai nom requis.",
    nickLabel: "Pseudo (3–16 caractères, lettres / chiffres / espaces / _)",
    classLabel: "Code de classe (optionnel, 4–8 lettres/chiffres – classement privé)",
    nickLegal: "En continuant, vous acceptez que votre pseudo et votre score puissent être affichés publiquement. Les données peuvent être supprimées sur demande.",
    continue: "Continuer",
    nickInvalid: "Pseudo invalide (3–16 caractères, lettres/chiffres/espaces/_ uniquement).",

    story: "Une explosion a endommagé le vaisseau. L'équipage a utilisé le module lunaire comme canot de sauvetage. Les cartouches de CO₂ <b>carrées</b> du module de commande ne rentrent pas dans l'orifice <b>rond</b> du module lunaire. Le CO₂ monte. Construisez un adaptateur avec ce qui est à bord — comme l'équipage en 1970.",
    step1: "<b>1. Observer</b><br>Glisser pour tourner, molette ou pincer pour zoomer.",
    step2: "<b>2. Glisser</b><br>Glissez un objet de l'inventaire dans la cabine.",
    step3: "<b>3. Construire</b><br>Déposez les pièces où il faut. Scellez un chemin étanche de l'orifice rond à travers la cartouche carrée.",
    timeLimit: "Durée",
    teamsLabel: "Équipes (local seulement, séparées par des virgules, max 4 – non classé)",
    teamsPh: "Laisser vide pour solo classé",
    volume: "Volume",
    reduced: "Effets de stress réduits (pas de flou, clignotement ni balancement)",
    warn: "Contient un stress simulé : respiration, alarmes, flou et clignotement. Réductible ci-dessus. Pas de flash plus de 2 fois par seconde.",
    playingAs: "Vous jouez :",
    viewBoard: "Voir le classement",
    start: "Démarrer la mission",
    min3: "3 min", min5: "5 min", min8: "8 min",

    player: "Joueur",
    hint: "Indice",
    place: "Placer ⏎",
    briefSum: "Briefing & objets",
    briefSit: "<b>Situation :</b> Le LM est le canot de sauvetage. Les cartouches LiOH carrées du CM ne rentrent pas dans l'orifice rond du LM. Le CO₂ monte — construisez l'adaptateur (le vrai « mailbox »).",
    briefObj: "<b>Objets utiles :</b>",
    objCan: "<b>Cartouche LiOH</b> — déjà dans la cabine (épurateur carré)",
    objCov: "<b>Couverture du plan de vol</b> — carton rigide pour une arche / joint",
    objBag: "<b>Sac LCG</b> — gaine plastique pour l'étanchéité",
    objHose: "<b>Tuyau de combinaison</b> — amène l'air entre l'orifice et la cartouche",
    objTape: "<b>Ruban adhésif</b> — scelle chaque joint",
    briefTip: "Glissez les objets de la barre dans la cabine. Les leurres n'aident pas. Plusieurs ordres peuvent fonctionner.",
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

    items: {
      cover: "Couverture plan de vol",
      bag: "Sac LCG",
      hose: "Tuyau de combinaison",
      tape: "Ruban adhésif",
      sock: "Chaussette",
      pen: "Stylo",
      helmet: "Casque",
      check: "Checklist"
    }
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
