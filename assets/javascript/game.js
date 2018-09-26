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
      fighter1: SWFighter("Captain Phasma", 100, 10, 10),
      fighter2: SWFighter("Chewbacca", 100, 10, 100),
      fighter3: SWFighter("Finn", 100, 10, 10),
      fighter4: SWFighter("Kylo Ren", 100, 10, 10)
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
      fighting: false,
      gameOver: false
    },

    init() {
      console.log("--- INITIALIZING GAME ---");
      this.States.initialized = true;
    },

    FIGHT_RESULTS: {
      WIN: "win",
      LOSS: "loss",
      WIP: "wip"
    },

    fight() {
      player = this.CHARACTERS[this.playerCharKey];
      defender = this.CHARACTERS[this.defenderCharKey];

      defender.HP -= player.Attack;
      player.Attack += player.Attack_Base;
      if (defender.HP <= 0) {
        return swRPG_GAME.FIGHT_RESULTS.WIN;
      }

      player.HP -= defender.Counter;
      if (player.HP <= 0) {
        return swRPG_GAME.FIGHT_RESULTS.LOSS;
      }

      return swRPG_GAME.FIGHT_RESULTS.WIP;
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
    attack: null,
    fightSummary: null
  };

  const DOM_FIGHTERS = ["fighter1", "fighter2", "fighter3", "fighter4"];

  // DOM classes
  const DOM_CLASS_Fighter = "fighter";
  const DOM_CLASS_Fighter_Name = "fighterName";
  const DOM_CLASS_Fighter_HP = "fighterHP";

  const DOM_CLASS_Lock = "locked";
  const DOM_CLASS_ShowOn_PlayerSelect = "showOnPlayerSelect";
  const DOM_CLASS_ShowOn_DefenderSelect = "showOnDefenderSelect";

  function choosePlayerCharacter(ele) {
    // console.log(ele.id);

    // set the game's player character to this fighter
    swRPG_GAME.playerCharKey = ele.id;

    // move the fighters from the line up into either the player's character or enemies section
    $(DOM_IDs.fighterLineup)
      .find(`.${DOM_CLASS_Fighter}`)
      .each(function(_, v) {
        $(v.id === ele.id ? DOM_IDs.player : DOM_IDs.enemies).append(this);
      });

    // lock in the selected player's character
    $(ele).addClass(DOM_CLASS_Lock);

    // toggle elements related to this step state
    $(`.${DOM_CLASS_ShowOn_PlayerSelect}`).toggleClass("toggleVisible");
  }

  function chooseDefenderCharacter(ele) {
    // Lock all enemies until fight is over
    $(DOM_IDs.enemies)
      .find(`.${DOM_CLASS_Fighter}`)
      .addClass(DOM_CLASS_Lock);

    swRPG_GAME.defenderCharKey = ele.id;
    $(DOM_IDs.defender).append(ele);

    // toggle elements related to this step state
    $(`.${DOM_CLASS_ShowOn_DefenderSelect}`).toggleClass("toggleVisible");
  }

  function clickCharacter(ele) {
    console.log("--- Clicking Character ---");
    // console.log(`You are clicking: ${ele.id}`);
    if (
      swRPG_GAME.States.initialized &&
      !swRPG_GAME.States.playerCharSelected
    ) {
      swRPG_GAME.States.playerCharSelected = true;
      //console.log("State indicates this click means selecting player character");
      choosePlayerCharacter(ele);
    } else if (
      swRPG_GAME.States.playerCharSelected &&
      !swRPG_GAME.States.defenderSelected
    ) {
      // console.log("State indicates this click means selecting an enemy as the defender");
      if (ele.id === swRPG_GAME.playerCharKey) {
        // can't select yourself as defender - shouldn't be able to happen with locked class, but just in case
        return;
      }
      swRPG_GAME.States.defenderSelected = true;
      chooseDefenderCharacter(ele);
    }
  }

  let addToFightSummary = text => {
    $(DOM_IDs.fightSummary).append($("<p>").text(text));
  };

  function updateFightSummary(fightResult, playerAttack) {
    $(DOM_IDs.fightSummary).empty();
    // "You attacked {defender} for {atk} damage"
    addToFightSummary(
        `You attacked ${swRPG_GAME.CHARACTERS[swRPG_GAME.defenderCharKey].Name} 
        for ${playerAttack} damage.`);

    if (fightResult !== swRPG_GAME.FIGHT_RESULTS.WIN) {
      // "{defender} attacked you back for {counter} damage"
      addToFightSummary(
        `${swRPG_GAME.CHARACTERS[swRPG_GAME.defenderCharKey].Name   } attacked you back for 
         ${swRPG_GAME.CHARACTERS[swRPG_GAME.defenderCharKey].Counter} damage.`);
    }

    if (fightResult !== swRPG_GAME.FIGHT_RESULTS.WIP) {
      // was a WIN OR LOSS
      swRPG_GAME.States.defenderSelected = false;

      if (fightResult === swRPG_GAME.FIGHT_RESULTS.WIN) {
        // console.log("Fight WIN!");
        // "You have defeated {defender}"
        addToFightSummary(
          `You have defeated 
                  ${swRPG_GAME.CHARACTERS[swRPG_GAME.defenderCharKey].Name}!`);

        // any left? " Now choose another enemy"
      } else if (fightResult === swRPG_GAME.FIGHT_RESULTS.LOSS) {
          swRPG_GAME.States.gameOver = true;

        // "You have been defeated by {defender}"
        addToFightSummary(
          `You have been defeated by
                    ${swRPG_GAME.CHARACTERS[swRPG_GAME.defenderCharKey].Name}!`);
        
        addToFightSummary("Game Over");

        // show restart
      }
    }
  }

  function clickAttack() {
    console.log("--- Fighting ---");

    if (swRPG_GAME.States.defenderSelected) {
      //   console.log("STATE says defender is selected.");
      swRPG_GAME.States.fighting = true;
      //   console.log(
      //     `${swRPG_GAME.playerCharKey} attacking ${swRPG_GAME.defenderCharKey}`
      //   );

      let playersAtkValueThisRound =
        swRPG_GAME.CHARACTERS[swRPG_GAME.playerCharKey].Attack;

      let fightResult = swRPG_GAME.fight();

      // Update fighter HP DOMs
      [swRPG_GAME.playerCharKey, swRPG_GAME.defenderCharKey].forEach(f => {
        $(`#${f} .${DOM_CLASS_Fighter_HP}`).text(swRPG_GAME.CHARACTERS[f].HP);
      });

      updateFightSummary(fightResult, playersAtkValueThisRound);
    }
  }

  ////// START of EXECUTION //////
  swRPG_GAME.init();

  // link up the DOM elements by their ids
  for (let k of Object.keys(DOM_IDs)) {
    DOM_IDs[k] = document.getElementById(k);
  }

  DOM_FIGHTERS.forEach(f => {
    $(`#${f} .${DOM_CLASS_Fighter_Name}`).text(swRPG_GAME.CHARACTERS[f].Name);
    $(`#${f} .${DOM_CLASS_Fighter_HP}`).text(swRPG_GAME.CHARACTERS[f].HP);
  });

  // console.log(DOM_IDs);

  ////// CLICK FUNCTIONS //////
  $(".fighter").on("click", function() {
    clickCharacter(this);
  });

  $("#attack").on("click", function() {
    clickAttack(this);
  });
});
