$(document).ready(function() {
  "use strict";

  let SWFighter = (name, hp, attack, counter) => {
    return {
      Name: name,
      HP: hp,
      Attack: attack,
      Counter: counter
    };
  };

  let swRPG_GAME = {
    // CONSTANTS
    CHARACTERS: {
      fighter1: SWFighter("Captain Phasma", 175, 10, 5),
      fighter2: SWFighter("Chewbacca", 100, 6, 10),
      fighter3: SWFighter("Finn", 150, 14, 20),
      fighter4: SWFighter("Kylo Ren", 200, 12, 15)
      // Luke     : null,
      // Poe      : null,
      // Rey      : null,
      // Snoke    : null
    },

    // STEPS/STATES
    // 1. select your character -> playerCharSelected
    // 2. select an enemy as defender -> enemyCharSelected => asDefender
    // 3. Fight! -> Fighting
    // 4. fightfinished => playerChar HP = 0 or enemydefender hp =0

    STATES: {
      initialized: false,
      playerCharSelected: false,
      defenderSelected: false,
      fighting: false
    },

    playerChar: "",
    defenderChar: "",

    init() {
      console.log("--- INITIALIZING GAME ---");
      this.STATES.initialized = true;
    }
  };

  //.fighterName
  //.fighterHP

  let DOM_IDs = {
    fighterLineup: null,
    fighter1: null,
    fighter2: null,
    fighter3: null,
    fighter4: null,
    player: null,
    enemies: null,
    defender: null,
    attack: null
  };

  const DOM_FIGHTERS = ["fighter1", "fighter2", "fighter3", "fighter4"];
  const DOM_CLASS_FIGHTER = "fighter";
  const DOM_CLASS_FIGHTER_NAME = "fighterName";
  const DOM_CLASS_FIGHTER_HP = "fighterHP";
  const DOM_CLASS_LOCK = "locked";

  function clickCharacter(ele) {
    console.log("--- Clicking Character ---");
    // console.log(`You are clicking: ${ele.id}`);
    if (
      swRPG_GAME.STATES.initialized &&
      !swRPG_GAME.STATES.playerCharSelected
    ) {
    //   console.log(
    //     "State indicates this click means selecting player character"
    //   );
      swRPG_GAME.STATES.playerCharSelected = true;
      swRPG_GAME.playerChar = ele.id;
      // move the fighters from the line up into either the player's character or enemies section
      $(DOM_IDs.fighterLineup)
        .children() //.children(":not(.placeHolder)")
        .each(function(_, v) {
          $(v.id === ele.id ? DOM_IDs.player : DOM_IDs.enemies).append(this);
        });

      // lock in the player's character
      $(ele).addClass(DOM_CLASS_LOCK);

      // toggle on first step state
      $(".toggle1").toggleClass("toggleVisible");
    } else if (
      swRPG_GAME.STATES.playerCharSelected &&
      !swRPG_GAME.STATES.defenderSelected
    ) {
    //   console.log(
    //     "State indicates this click means selecting an enemy as the defender"
    //   );
      if (ele.id === swRPG_GAME.playerChar) {
        // can't select yourself as defender - shouldn't be able to happen with locked class but just in case
        return;
      }

      // Lock all enemies until fight is over
      $(DOM_IDs.enemies)
        .find(`.${DOM_CLASS_FIGHTER}`)
        .addClass(DOM_CLASS_LOCK);

      swRPG_GAME.STATES.defenderSelected = true;
      swRPG_GAME.defenderChar = ele.id;
      $(DOM_IDs.defender).append(ele);
    }
  }

  function attackChar() {
    console.log("--- Fighting ---");

    if (swRPG_GAME.STATES.defenderSelected) {
    //   console.log("STATE says defender is selected.");
      swRPG_GAME.STATES.fighting = true;
      console.log(`${swRPG_GAME.playerChar} attacking ${swRPG_GAME.defenderChar}`);
      
    }
  }

  ////// START of EXECUTION //////
  swRPG_GAME.init();

  // link up the DOM elements by their ids
  for (let k of Object.keys(DOM_IDs)) {
    DOM_IDs[k] = document.getElementById(k);
  }

  DOM_FIGHTERS.forEach(f => {
    $(`#${f} .${DOM_CLASS_FIGHTER_NAME}`).text(swRPG_GAME.CHARACTERS[f].Name);
    $(`#${f} .${DOM_CLASS_FIGHTER_HP}`).text(swRPG_GAME.CHARACTERS[f].HP);
  });

  // console.log(DOM_IDs);

  ////// CLICK FUNCTIONS //////
  $(".char li").on("click", function() {
    // console.log(".char li clicked!");
    // console.log("Cur states:", swRPG_GAME.STATES, "Cur Characters:", swRPG_GAME.CHARACTERS ); 
    clickCharacter(this);
  });

  $("#attack").on("click", function() {
    // console.log("attack clicked!");
    // console.log(
    //   "Cur states:",
    //   swRPG_GAME.STATES,
    //   "Cur Characters:",
    //   swRPG_GAME.CHARACTERS
    // );

    attackChar(this);
  });
});
