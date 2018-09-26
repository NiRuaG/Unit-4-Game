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
      fighter2: SWFighter("Chewbacca", 100, 10, 10),
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
      //   initialized: false,
      playerCharSelected: false,
      defenderSelected: false,
      fighting: false,
      gameOver: false
    },

    // init() {
    //   console.log("--- INITIALIZING GAME ---");
    //   this.States.initialized = true;
    // },

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
    },

    reset() {
      // all states to false
      Object.keys(this.States).forEach(k => {
        this.States[k] = false;
      });

      // TODO: make a reset object to copy from? avoid
      this.CHARACTERS.fighter1 = SWFighter("Captain Phasma", 100, 10, 10);
      this.CHARACTERS.fighter2 = SWFighter("Chewbacca", 100, 10, 10);
      this.CHARACTERS.fighter3 = SWFighter("Finn", 100, 10, 10);
      this.CHARACTERS.fighter4 = SWFighter("Kylo Ren", 100, 10, 10);

      this.playerCharKey = "";
      this.defenderCharKey = "";
    }
  };

  //// DOM Elements by ID
  let DOM_IDs = {
    instructions: null,
    fighterLineup: null,
    fighter1: null,
    fighter2: null,
    fighter3: null,
    fighter4: null,
    player: null,
    enemies: null,
    defender: null,
    defeated: null,
    attack: null,
    restart: null,
    fightSummary: null
  };

  const DOM_FIGHTERS = ["fighter1", "fighter2", "fighter3", "fighter4"];

  // DOM classes
  const DOM_CLASS_Fighter = "fighter";
  const DOM_CLASS_Fighter_Name = "fighterName";
  const DOM_CLASS_Fighter_HP = "fighterHP";

  const DOM_CLASS_VisHide = "visHide";
  const DOM_CLASS_Lock = "locked";
  const DOM_CLASS_Defeated = "defeated";
  const DOM_CLASS_ShowOn_PlayerSelect = "showOnPlayerSelect";
  const DOM_CLASS_ShowOn_DefenderSelect = "showOnDefenderSelect";
  const DOM_CLASS_ShowOn_GameOver = "showOnGameOver";

  let stateToggle = (classSelector, doHide) => {
    $(`.${classSelector}`).toggleClass(DOM_CLASS_VisHide, doHide);
  };

  let showInstr = text => {
    $(DOM_IDs.instructions).text(text);
  };

  let addToFightSummary = text => {
    $(DOM_IDs.fightSummary).append($("<p>").text(text));
  };

  function chosePlayerCharacter(ele) {
    // show sections/elements related to this state
    stateToggle(DOM_CLASS_ShowOn_PlayerSelect, false);

    // move the fighters from the line up into either the player's character or enemies section
    $(DOM_IDs.fighterLineup)
      .find(`.${DOM_CLASS_Fighter}`)
      .each(function(_, v) {
        $(v.id === ele.id ? DOM_IDs.player : DOM_IDs.enemies).append(v);
      });

    // lock in the selected player's character
    $(ele).addClass(DOM_CLASS_Lock);
  }

  function choseDefenderCharacter(ele) {
    // show sections/elements related to this step state
    stateToggle(DOM_CLASS_ShowOn_DefenderSelect, false);

    // move this fighter to the defender area
    $(DOM_IDs.defender).append(ele);

    // Lock all enemies until fight is over
    $(DOM_IDs.enemies)
      .find(`.${DOM_CLASS_Fighter}`)
      .addClass(DOM_CLASS_Lock);

    // remove any lock from attack button
    $(DOM_IDs.attack).removeClass(DOM_CLASS_Lock);

    // clear any previous fight summary
    $(DOM_IDs.fightSummary).empty();
  }

  function updateFightSummary(fightResult, playerAttack) {
    $(DOM_IDs.fightSummary).empty();
    // "You attacked {defender} for {atk} damage"
    addToFightSummary(
      `You attacked ${swRPG_GAME.CHARACTERS[swRPG_GAME.defenderCharKey].Name} 
        for ${playerAttack} damage.`
    );

    if (fightResult !== swRPG_GAME.FIGHT_RESULTS.WIN) {
      // either loss or still fighting
      // "{defender} attacked you back for {counter} damage"
      addToFightSummary(
        `${
          swRPG_GAME.CHARACTERS[swRPG_GAME.defenderCharKey].Name
        } attacked you back for 
         ${swRPG_GAME.CHARACTERS[swRPG_GAME.defenderCharKey].Counter} damage.`
      );
    }

    if (fightResult === swRPG_GAME.FIGHT_RESULTS.WIN) {
      // console.log("Fight WIN!");
      // "You have defeated {defender}"
      addToFightSummary(
        `You have defeated 
                  ${swRPG_GAME.CHARACTERS[swRPG_GAME.defenderCharKey].Name}!`
      );
    }
    if (fightResult === swRPG_GAME.FIGHT_RESULTS.LOSS) {
      // "You have been defeated by {defender}"
      addToFightSummary(
        `You have been defeated by
              ${swRPG_GAME.CHARACTERS[swRPG_GAME.defenderCharKey].Name}!`
      );
    }
  }

  function clickCharacter(ele) {
    // console.log("--- Clicking Character ---");
    if (!swRPG_GAME.States.playerCharSelected) {
      // update game state
      swRPG_GAME.States.playerCharSelected = true;
      swRPG_GAME.playerCharKey = ele.id;

      // update DOM elements related this new state
      chosePlayerCharacter(ele);

      showInstr("Choose a Defender from the Enemies left.");
    } else if (!swRPG_GAME.States.defenderSelected) {
      if (ele.id === swRPG_GAME.playerCharKey) {
        // can't select yourself as defender - shouldn't be able to happen with locked class, but just in case
        return;
      }

      // update game state
      swRPG_GAME.States.defenderSelected = true;
      swRPG_GAME.defenderCharKey = ele.id;

      // update DOM elements related to this new state
      choseDefenderCharacter(ele);

      showInstr(
        "[Attack] the Defender until only one of you is left standing!"
      );
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

      updateFightSummary(fightResult, playersAtkValueThisRound); // TODO: fix logic to avoid second parameter?

      if (fightResult !== swRPG_GAME.FIGHT_RESULTS.WIP) {
        // was a WIN OR LOSS
        swRPG_GAME.States.defenderSelected = false;
        $(DOM_IDs.attack).addClass(DOM_CLASS_Lock);
      }

      if (fightResult === swRPG_GAME.FIGHT_RESULTS.LOSS) {
        $(DOM_IDs.player)
          .find(`.${DOM_CLASS_Fighter}`)
          .addClass(DOM_CLASS_Defeated);

        swRPG_GAME.States.gameOver = true;
      }

      if (fightResult === swRPG_GAME.FIGHT_RESULTS.WIN) {
        // WIN
        //   $(DOM_IDs.defender).find(`.${DOM_CLASS_Fighter}`).addClass(DOM_CLASS_Defeated);
        $(DOM_IDs.defeated).append(DOM_IDs[swRPG_GAME.defenderCharKey]);

        // check if any enemies left
        if ($(DOM_IDs.enemies).find(`.${DOM_CLASS_Fighter}`).length === 0) {
          addToFightSummary(
            "You have defeated all your enemies and are victorious!!"
          );
          swRPG_GAME.States.gameOver = true;
        } else {
          // there are enemies left
          // unlock remaining enemies
          $(DOM_IDs.enemies)
            .find(`.${DOM_CLASS_Fighter}`)
            .removeClass(DOM_CLASS_Lock);

          showInstr("Choose a new Defender from the Enemies left.");
        }
      }

      if (swRPG_GAME.States.gameOver) {
        addToFightSummary("Game Over");
        showInstr("Press [Restart] to play again.");
        // show elements related to this state
        stateToggle(DOM_CLASS_ShowOn_GameOver, false);
      }
    }
  }

  function clickRestart() {
    swRPG_GAME.reset();

    $(DOM_IDs.fightSummary).empty();

    // update fighter stats, move them all back to the lineup and make sure they're visible
    DOM_FIGHTERS.forEach(f => {
      $(`#${f} .${DOM_CLASS_Fighter_Name}`).text(swRPG_GAME.CHARACTERS[f].Name);
      $(`#${f} .${DOM_CLASS_Fighter_HP}`).text(swRPG_GAME.CHARACTERS[f].HP);
      $(`#${f}`).removeClass(DOM_CLASS_VisHide);
      $(DOM_IDs.fighterLineup).append($(`#${f}`));
    });

    // remove lock and defeated from everything
    $(`.${DOM_CLASS_Lock}`).removeClass(DOM_CLASS_Lock);
    $(`.${DOM_CLASS_Defeated}`).removeClass(DOM_CLASS_Defeated);

    // hide all the DOM classes that start out hidden
    [
      DOM_CLASS_ShowOn_PlayerSelect,
      DOM_CLASS_ShowOn_DefenderSelect,
      DOM_CLASS_ShowOn_GameOver
    ].forEach(c => {
      stateToggle(c, true);
    });

    showInstr("Choose your Character!");
  }

  ////// START of EXECUTION //////
  //   swRPG_GAME.init();

  // link up the DOM elements by their ids
  for (let k of Object.keys(DOM_IDs)) {
    DOM_IDs[k] = document.getElementById(k);
  }

  // Show Fighter Stats
  DOM_FIGHTERS.forEach(f => {
    $(`#${f} .${DOM_CLASS_Fighter_Name}`).text(swRPG_GAME.CHARACTERS[f].Name);
    $(`#${f} .${DOM_CLASS_Fighter_HP}`).text(swRPG_GAME.CHARACTERS[f].HP);
  });

  showInstr("Choose your Character!");

  ////// CLICK FUNCTIONS //////
  $(`.${DOM_CLASS_Fighter}`).on("click", function() {
    clickCharacter(this);
  });

  $(DOM_IDs.attack).on("click", function() {
    clickAttack();
  });

  $(DOM_IDs.restart).on("click", function() {
    clickRestart();
  });
});
