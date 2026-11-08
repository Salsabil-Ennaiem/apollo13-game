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
    step2: "<b>2. Pick</b><br>Tap or drag a part from the bar. A dashed outline shows where it goes.",
    step3: "<b>3. Build</b><br>Drop it on the outline. Make an airtight path from the round port through the square canister. Several combinations work.",
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
    objCov: "<b>Flight plan cover</b> — stiff cardstock that shapes the adapter",
    objBag: "<b>LCG bag</b> — plastic sleeve for airtightness",
    objHose: "<b>Suit hose</b> — carries air between port and canister",
    objTape: "<b>Duct tape</b> — seals every joint",
    briefTip: "Tap or drag a part: a dashed outline shows exactly where it goes. Several combinations can work, but some jobs must come first.",
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
    intro1: "“Houston, we’ve had a problem.” April 13, 1970: about 56 hours into the flight, an oxygen tank explodes on Apollo 13.",
    intro2: "Lovell, Swigert and Haise move into the Lunar Module, a lifeboat built for two astronauts for about two days.",
    intro3: "Three people breathing out CO₂ overload it. The spare canisters from the Command Module are square. The Lunar Module’s receptacle is round.",
    intro4: "Houston is on the line. Use only what is on board. Go.",
    skip: "Skip intro ▶",
    objAlt: "<b>Alternatives:</b> the checklist cover is also rigid, and a stowage bag can also be the airtight sleeve.",
    roleTaken: "That job is already done by: {item}.",
    dropOnOutline: "Drop it on the dashed outline.",
    tooEarly: { hose: "The hose needs something rigid to connect to first.", seal: "Too early. Seal the joints only after the other parts are in place." },
    roleHints: { shape: "Something stiff must wrap the square canister and form a shell.", sleeve: "Something flexible and airtight must wrap the adapter.", hose: "Air must travel from the round port to the canister: connect the hose.", seal: "Tape every joint last to stop leaks." },
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
    step2: "<b>2. Choisir</b><br>Touchez ou glissez une pièce de la barre. Un contour en pointillés indique où elle va.",
    step3: "<b>3. Construire</b><br>Déposez-la sur le contour. Créez un chemin étanche de l'orifice rond à travers la cartouche carrée. Plusieurs combinaisons fonctionnent.",
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
    objCov: "<b>Couverture du plan de vol</b> — carton rigide qui forme l'adaptateur",
    objBag: "<b>Sac LCG</b> — gaine plastique pour l'étanchéité",
    objHose: "<b>Tuyau de combinaison</b> — amène l'air entre l'orifice et la cartouche",
    objTape: "<b>Ruban adhésif</b> — scelle chaque joint",
    briefTip: "Touchez ou glissez une pièce : un contour en pointillés montre où la placer. Plusieurs combinaisons peuvent fonctionner, mais certaines étapes viennent en premier.",
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
    intro1: "« Houston, nous avons eu un problème. » 13 avril 1970 : environ 56 heures après le départ, un réservoir d'oxygène explose à bord d'Apollo 13.",
    intro2: "Lovell, Swigert et Haise passent dans le module lunaire, un canot de sauvetage conçu pour deux astronautes pendant environ deux jours.",
    intro3: "Trois personnes qui expirent du CO₂ le saturent. Les cartouches de rechange du module de commande sont carrées. L'orifice du module lunaire est rond.",
    intro4: "Houston est en ligne. Utilisez seulement ce qui est à bord. Go.",
    skip: "Passer l'intro ▶",
    objAlt: "<b>Alternatives :</b> la couverture de checklist est aussi rigide, et un sac de rangement peut aussi servir de gaine étanche.",
    roleTaken: "Ce rôle est déjà rempli par : {item}.",
    dropOnOutline: "Déposez-la sur le contour en pointillés.",
    tooEarly: { hose: "Le tuyau a d'abord besoin d'une pièce rigide où se raccorder.", seal: "Trop tôt. Scellez les joints seulement quand les autres pièces sont en place." },
    roleHints: { shape: "Une pièce rigide doit envelopper la cartouche carrée et former une coque.", sleeve: "Une pièce souple et étanche doit envelopper l'adaptateur.", hose: "L'air doit aller de l'orifice rond à la cartouche : raccordez le tuyau.", seal: "Collez chaque joint en dernier pour éviter les fuites." },
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