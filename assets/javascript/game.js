
let SWFighter = (hp, attack, counter) => {
  return {
    HP: hp,
    Attack: attack,
    Counter: counter
  };
};

let swRPG_GAME = {
  // CONSTANTS
  CHARACTERS: {
    Phasma: SWFighter(175, 10, 5),
    Chewbacca: SWFighter(100, 6, 10),
    Finn: SWFighter(150, 14, 20),
    Kylo: SWFighter(200, 12, 15)
    // Luke     : null,
    // Poe      : null,
    // Rey      : null,
    // Snoke    : null
  },

  // STEPS/STATES
  // 1. select your character -> playerCharSelected
  // 2. select an enemy -> enemyCharSelected => asDefender
  // 3. Fight! -> Fighting
  // 4. fightfinished => playerChar HP = 0 or enemydefender hp =0

  STATES: {
    initialized: false,
    playerCharSelected: false,
    enemeyCharSelected: false,
    fighting: false
  },

  init() {
    console.log("--- INITIALIZING GAME ---");
    this.STATES.initialized = true;
  }
};

