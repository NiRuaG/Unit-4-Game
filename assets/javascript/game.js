$(document).ready(function() {
  "use strict";

  let SWFighter = (name, hp, attack, counter) => {
    return {
      Name: name,
      HP: hp,
      Attack_Base: attack,
      Attack: attack,
      Counter: counter
    };
  };

  let swRPG_GAME = {
    // CONSTANTS
    CHARACTERS: {
      fighter1: SWFighter("Captain Phasma", 100, 10, 10  ),
      fighter2: SWFighter("Chewbacca"     , 100, 10, 10 ),
      fighter3: SWFighter("Finn"          , 100, 10, 10 ),
      fighter4: SWFighter("Kylo Ren"      , 100, 10, 10 ),
      // Luke     : null,
      // Poe      : null,
      // Rey      : null,
      // Snoke    : null
    },

    playerCharKey: "",
    defenderCharKey: "",

    // STEPS/STATES
    // 1. select your character -> playerCharSelected
    // 2. select an enemy as defender -> enemyCharSelected => asDefender
    // 3. Fight! -> Fighting
    // 4. fightfinished => playerChar HP = 0 or enemydefender hp =0

    States: {
      initialized: false,
      playerCharSelected: false,
      defenderSelected: false,
      fighting: false
    },

    init() {
      console.log("--- INITIALIZING GAME ---");
      this.States.initialized = true;
    },

    FIGHT_RESULTS: {
        WIN : "win",
        LOSS: "loss",
        WIP : "wip",
    },

      fight() {
            player = this.CHARACTERS[this.playerCharKey  ];
          defender = this.CHARACTERS[this.defenderCharKey];

          defender.HP     -= player.Attack
            player.Attack += player.Attack_Base
          if (defender.HP <= 0) { return swRPG_GAME.FIGHT_RESULTS.WIN; }

          player.HP -= defender.Counter
          if (player.HP <= 0) { return swRPG_GAME.FIGHT_RESULTS.LOSS; }

          return swRPG_GAME.FIGHT_RESULTS.WIP;
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
      swRPG_GAME.States.initialized &&
      !swRPG_GAME.States.playerCharSelected
    ) {
    //   console.log(
    //     "State indicates this click means selecting player character"
    //   );
      swRPG_GAME.States.playerCharSelected = true;
      swRPG_GAME.playerCharKey = ele.id;
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
      swRPG_GAME.States.playerCharSelected &&
      !swRPG_GAME.States.defenderSelected
    ) {
    //   console.log(
    //     "State indicates this click means selecting an enemy as the defender"
    //   );
      if (ele.id === swRPG_GAME.playerCharKey) {
        // can't select yourself as defender - shouldn't be able to happen with locked class but just in case
        return;
      }

      // Lock all enemies until fight is over
      $(DOM_IDs.enemies)
        .find(`.${DOM_CLASS_FIGHTER}`)
        .addClass(DOM_CLASS_LOCK);

      swRPG_GAME.States.defenderSelected = true;
      swRPG_GAME.defenderCharKey = ele.id;
      $(DOM_IDs.defender).append(ele);
    }
  }

  function attackChar() {
    console.log("--- Fighting ---");

    if (swRPG_GAME.States.defenderSelected) {
    //   console.log("STATE says defender is selected.");
      swRPG_GAME.States.fighting = true;
      console.log(`${swRPG_GAME.playerCharKey} attacking ${swRPG_GAME.defenderCharKey}`);
      let result = swRPG_GAME.fight();

      // Update DOM
      [swRPG_GAME.playerCharKey, swRPG_GAME.defenderCharKey].forEach(f => {
        $(`#${f} .${DOM_CLASS_FIGHTER_HP}`).text(swRPG_GAME.CHARACTERS[f].HP);
      });


      if (result !== swRPG_GAME.FIGHT_RESULTS.WIP) {
          swRPG_GAME.States.defenderSelected = false;
      }

      if (result === swRPG_GAME.FIGHT_RESULTS.WIN){
          console.log("WIN!")
      }
      else if (result === swRPG_GAME.FIGHT_RESULTS.LOSS){
          console.log("LOSS")
      }
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
    // console.log("Cur states:", swRPG_GAME.States, "Cur Characters:", swRPG_GAME.CHARACTERS ); 
    clickCharacter(this);
  });

  $("#attack").on("click", function() {
    // console.log("attack clicked!");
    // console.log(
    //   "Cur states:",
    //   swRPG_GAME.States,
    //   "Cur Characters:",
    //   swRPG_GAME.CHARACTERS
    // );

    attackChar(this);
  });
});
