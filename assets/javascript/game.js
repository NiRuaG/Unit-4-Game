$(document).ready(function() {
  "use strict";

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
    // 2. select an enemy as defender -> enemyCharSelected => asDefender
    // 3. Fight! -> Fighting
    // 4. fightfinished => playerChar HP = 0 or enemydefender hp =0

    STATES: {
      initialized: false,
      playerCharSelected: false,
      defenderSelected: false,
      fighting: false
    },

    init() {
      console.log("--- INITIALIZING GAME ---");
      this.STATES.initialized = true;
    }
  };

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

  function clickCharacter(ele) {
    console.log("--- Clicking Character ---");
    console.log(`You are clicking: ${ele.id}`);
    if (
      swRPG_GAME.STATES.initialized &&
      !swRPG_GAME.STATES.playerCharSelected
    ) {
      console.log(
        "State indicates this click means selecting player character"
      );
      swRPG_GAME.STATES.playerCharSelected = true;

      // move the fighters from the line up into either the player's character or enemies section
      $(DOM_IDs.fighterLineup)
        .children() //.children(":not(.placeHolder)")
        .each(function(_, v) {
          console.log(`v: ${v.id}, ele: ${ele.id}`);
          $(v.id === ele.id ? DOM_IDs.player : DOM_IDs.enemies).append(this);
        });
      // toggle on first step state
      $(".toggle1").toggleClass("toggleVisible");
    } else if (
      swRPG_GAME.STATES.playerCharSelected &&
      !swRPG_GAME.STATES.defenderSelected
    ) {
      console.log(
        "State indicates this click means selecting an enemy as the defender"
      );
      swRPG_GAME.STATES.defenderSelected = true;
      $(DOM_IDs.defender).append(ele);
    }
  }

  swRPG_GAME.init();

  // link up the DOM elements by their ids
  for (let k of Object.keys(DOM_IDs)) {
    DOM_IDs[k] = document.getElementById(k);
  }

  // console.log(DOM_IDs);

  $(".char li").on("click", function() {
    console.log(".char li clicked!");
    console.log(
      "Cur states:",
      swRPG_GAME.STATES,
      "Cur Characters:",
      swRPG_GAME.CHARACTERS
    );
    clickCharacter(this);
  });

  $("#attack").on("click", function() {
    console.log("attack clicked!");
    console.log(
      "Cur states:",
      swRPG_GAME.STATES,
      "Cur Characters:",
      swRPG_GAME.CHARACTERS
    );
    if (swRPG_GAME.STATES.defenderSelected) {
      console.log("STATE says defender is selected.");
    }
  });
});
