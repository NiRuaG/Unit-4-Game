$(document).ready(function () {
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
        Fighters: {
            fighter1: null,
            fighter2: null,
            fighter3: null,
            fighter4: null,
        },

          playerCharKey: "", // will be of fighter{#} (eg fighter1)
        defenderCharKey: "",

        States: {
            //   initialized: false,
            playerCharSelected: false,
            defenderSelected  : false,
            gameOver          : false
            //   fighting: false,
        },

        // init() {
        //   console.log("--- INITIALIZING GAME ---");
        //   this.States.initialized = true;
        // },

        FIGHT_RESULTS: {
            WIN : "win",
            LOSS: "loss",
            WIP : "wip",
        },

        fight() {
            let   playerFighter = this.Fighters[this.playerCharKey  ];
            let defenderFighter = this.Fighters[this.defenderCharKey];

            // Player attacks Defender
            defenderFighter.HP -= playerFighter.Attack;

            // Player's attack increases by base amount
            playerFighter.Attack += playerFighter.Attack_Base;

            // Defender defeated?
            if (defenderFighter.HP <= 0) {
                return swRPG_GAME.FIGHT_RESULTS.WIN;
            }

            // Defender counter attacks Player
            playerFighter.HP -= defenderFighter.Counter;

            // Player defeated?
            if (playerFighter.HP <= 0) {
                return swRPG_GAME.FIGHT_RESULTS.LOSS;
            }

            // No winner yet, fight is 'Work In Progress'
            return swRPG_GAME.FIGHT_RESULTS.WIP;
        },

        reset() {
            // all states to false
            Object.keys(this.States).forEach(k => {
                this.States[k] = false;
            });

            // Reset fighter stats
            this.Fighters.fighter1 = SWFighter("Captain Phasma", 125, 11,  5);
            this.Fighters.fighter2 = SWFighter("Chewbacca"     , 215,  4, 10);
            this.Fighters.fighter3 = SWFighter("Kylo Ren"      , 180,  2, 20);
            this.Fighters.fighter4 = SWFighter("Finn"          ,  65, 12, 30);

            // Reset keys to player & defender fighters
            this.playerCharKey = "";
            this.defenderCharKey = "";
        }
    };

    //// DOM Elements by ID
    let DOM_IDs = {
        instructions : null,

        fighterLineup: null,
        fighter1     : null,
        fighter2     : null,
        fighter3     : null,
        fighter4     : null,

          playerArea : null,
         enemiesArea : null,
        defenderArea : null,
        defeatedArea : null,

         attackBtn   : null,
        restartBtn   : null,

        fightSummary : null
    };

    const DOM_FIGHTERS = ["fighter1", "fighter2", "fighter3", "fighter4"];

    // DOM classes
    const DOM_CLASS_Fighter      = "fighter"    ;
    const DOM_CLASS_Fighter_Name = "fighterName";
    const DOM_CLASS_Fighter_HP   = "fighterHP"  ;

    const DOM_CLASS_VisHide = "visHide";
    const DOM_CLASS_Lock    = "locked";
    
    const DOM_CLASS_ShowOn_PlayerSelect   = "showOnPlayerSelect"  ;
    const DOM_CLASS_ShowOn_DefenderSelect = "showOnDefenderSelect";
    const DOM_CLASS_ShowOn_GameOver       = "showOnGameOver"      ;


    let hideThisClass = (classSelector, doHide) => {
        $(`.${classSelector}`).toggleClass(DOM_CLASS_VisHide, doHide);
    };

    let showInstr = text => {
        $(DOM_IDs.instructions).text(text);
    };

    let addToFightSummary = text => {
        $(DOM_IDs.fightSummary).append($("<p>").text(text));
    };

    function chosePlayer(ele) {
        // Show sections/elements related to this state
        hideThisClass(DOM_CLASS_ShowOn_PlayerSelect, false);

        // Move the fighters from the line up into either the Player area or Enemies area
        $(DOM_IDs.fighterLineup)
            .find(`.${DOM_CLASS_Fighter}`)
            .each(function (_, v) {
                $(v.id === ele.id ? DOM_IDs.playerArea : DOM_IDs.enemiesArea).append(v);
            });

        // Lock in the selected player's character
        $(ele).addClass(DOM_CLASS_Lock);
    }

    function choseDefender(ele) {
        // Show sections/elements related to this step state
        hideThisClass(DOM_CLASS_ShowOn_DefenderSelect, false);

        // Lock all enemies until fight is over
        $(DOM_IDs.enemiesArea)
            .find(`.${DOM_CLASS_Fighter}`)
            .addClass(DOM_CLASS_Lock);

        // Move this fighter to the defender area
        $(DOM_IDs.defenderArea).append(ele);

        // Remove any lock from attack button
        $(DOM_IDs.attackBtn).removeClass(DOM_CLASS_Lock);
        // Clear any previous fight summary
        $(DOM_IDs.fightSummary).empty();
    }

    function updateFightSummary(fightResult, playerAttack) {
        $(DOM_IDs.fightSummary).empty();

        let defenderName = swRPG_GAME.Fighters[swRPG_GAME.defenderCharKey].Name;

        // "You attacked {defender} for {atk} damage"
        addToFightSummary(
            `You attacked ${defenderName} for ${playerAttack} damage.` );

        if (fightResult !== swRPG_GAME.FIGHT_RESULTS.WIN) { // either a loss or still fighting
            // "{defender} attacked you back for {counter} damage"
            addToFightSummary(
                `${defenderName} attacked you back for 
                 ${swRPG_GAME.Fighters[swRPG_GAME.defenderCharKey].Counter} damage.` );
        }

        if (fightResult === swRPG_GAME.FIGHT_RESULTS.WIN) {
            // "You have defeated {defender}"
            addToFightSummary(
                `You have defeated ${defenderName}!` );
        }

        else if (fightResult === swRPG_GAME.FIGHT_RESULTS.LOSS) {
            // "You have been defeated by {defender}"
            addToFightSummary(
                `You have been defeated by ${defenderName}!` );
        }

    }

    function clickCharacter(ele) {
        // console.log("--- Clicking Character ---");
        if (!swRPG_GAME.States.playerCharSelected) {
            // Update game state
            swRPG_GAME.States.playerCharSelected = true;
            swRPG_GAME.playerCharKey = ele.id;

            // Update DOM elements related this new state
            chosePlayer(ele);

            showInstr("Choose a Defender from the Enemies left.");
            
        } else if (!swRPG_GAME.States.defenderSelected) {
            if (ele.id === swRPG_GAME.playerCharKey) { // can't select yourself as defender - shouldn't be able to happen with locked class, but just in case
                return;
            }

            // Update game state
            swRPG_GAME.States.defenderSelected = true;
            swRPG_GAME.defenderCharKey = ele.id;

            // Update DOM elements related to this new state
            choseDefender(ele);

            showInstr(
                "[Attack] the Defender until only one of you is left standing!"
            );
        }
    }

    function clickAttack() {
        // console.log("--- Clicking Attack / Fighting ---");

        // Gate condition that defender is selected
        if (swRPG_GAME.States.defenderSelected) {
            // Store the player's attack value pre-fight
            let playersAtkValueThisRound =
                swRPG_GAME.Fighters[swRPG_GAME.playerCharKey].Attack;

            // Call the game's fight method and get the result
            let fightResult = swRPG_GAME.fight();

            // Update fighter HP DOMs
            [swRPG_GAME.playerCharKey, swRPG_GAME.defenderCharKey].forEach(f => {
                $(`#${f} .${DOM_CLASS_Fighter_HP}`).text(swRPG_GAME.Fighters[f].HP);
            });

            updateFightSummary(fightResult, playersAtkValueThisRound); // TODO: fix logic to avoid second parameter?

            if (fightResult !== swRPG_GAME.FIGHT_RESULTS.WIP) { // was a WIN OR LOSS
                swRPG_GAME.States.defenderSelected = false;
                $(DOM_IDs.attackBtn).addClass(DOM_CLASS_Lock);
            }

            if (fightResult === swRPG_GAME.FIGHT_RESULTS.LOSS) {
                // $(DOM_IDs.playerArea)
                //     .find(`.${DOM_CLASS_Fighter}`)
                //     .addClass(DOM_CLASS_Defeated);
                swRPG_GAME.States.gameOver = true;
            }

            if (fightResult === swRPG_GAME.FIGHT_RESULTS.WIN) {
                // Move the defender to the defeated area
                $(DOM_IDs.defeatedArea).append(DOM_IDs[swRPG_GAME.defenderCharKey]);

                // Check if there are any enemies left
                if ($(DOM_IDs.enemiesArea).find(`.${DOM_CLASS_Fighter}`).length === 0) {
                    addToFightSummary(
                        "You have defeated all your enemies and are victorious!!"
                    );
                    swRPG_GAME.States.gameOver = true;
                } else { // there are enemies left
                    // Unlock remaining enemies to choose from
                    $(DOM_IDs.enemiesArea)
                        .find(`.${DOM_CLASS_Fighter}`)
                        .removeClass(DOM_CLASS_Lock);

                    showInstr("Choose a new Defender from the Enemies left.");
                }
            }

            if (swRPG_GAME.States.gameOver) {
                addToFightSummary("Game Over");
                showInstr("Press [Restart] to play again.");
                // Show elements related to this state
                hideThisClass(DOM_CLASS_ShowOn_GameOver, false);
            }
        }
    }

    function clickRestart() {
        swRPG_GAME.reset();

        // For all the Fighter# elements
        DOM_FIGHTERS.forEach(f => {
            // Update display of the reset stats, 
            $(`#${f} .${DOM_CLASS_Fighter_Name}`).text(swRPG_GAME.Fighters[f].Name);
            $(`#${f} .${DOM_CLASS_Fighter_HP  }`).text(swRPG_GAME.Fighters[f].HP  );
            // make sure they're visible
            $(`#${f}`).removeClass(DOM_CLASS_VisHide);
            // and move them all back to the lineup,
            $(DOM_IDs.fighterLineup).append($(`#${f}`));
        });

        // Clear Fight Summary text
        $(DOM_IDs.fightSummary).empty();

        // Remove Lock class from everything
        $(`.${DOM_CLASS_Lock}`).removeClass(DOM_CLASS_Lock);

        // Hide all the DOM classes that start out hidden
        [ DOM_CLASS_ShowOn_PlayerSelect  ,
          DOM_CLASS_ShowOn_DefenderSelect,
          DOM_CLASS_ShowOn_GameOver       ].forEach(c => {
            hideThisClass(c, true);
        });

        showInstr("Choose your Character!");
    }


    ////// START of EXECUTION //////
    swRPG_GAME.reset();

    // Link up the DOM elements by their ids
    for (let k of Object.keys(DOM_IDs)) {
        DOM_IDs[k] = document.getElementById(k);
    }

    // Show Fighter Stats
    DOM_FIGHTERS.forEach(f => {
        $(`#${f} .${DOM_CLASS_Fighter_Name}`).text(swRPG_GAME.Fighters[f].Name);
        $(`#${f} .${DOM_CLASS_Fighter_HP}`  ).text(swRPG_GAME.Fighters[f].HP  );
    });

    showInstr("Choose your Character!");
    console.log(
        "For testing, here are the paths to victory:",
        "\n\n[    Easiest] Captain Phasma = Any path EXCEPT Finn > Kylo Ren > Chewbacca.",
        "\n\n[2nd Easiest]      Chewbacca = Any path EXCEPT one that STARTS with Finn.",
        "\n\n[2nd Hardest]       Kylo Ren = Only the paths that START with Captain Phasma.",
        "\n\n[    Hardest]           Finn = Only the path Captain Phasma > Chewbacca > Kylo Ren."
    );

    ////// CLICK FUNCTIONS //////
    $(`.${DOM_CLASS_Fighter}`).on("click", function () {
        clickCharacter(this);
    });

    $(DOM_IDs.attackBtn).on("click", function () {
        clickAttack();
    });

    $(DOM_IDs.restartBtn).on("click", function () {
        clickRestart();
    });
});
