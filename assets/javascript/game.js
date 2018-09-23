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

let DOM_IDs = {
  fighterLineup: null,
  fighter1: null,
  fighter2: null,
  fighter3: null,
  fighter4: null,
  playerChar: null,
  enemyChars: null
};

function clickCharacter(ele) {
  console.log("--- Clicking Character ---");
  console.log(`You are clicking: ${ele.id}`);
  if (swRPG_GAME.STATES.initialized && !swRPG_GAME.STATES.playerCharSelected) {
    console.log("State indicates this click means selecting player character");
    swRPG_GAME.STATES.playerCharSelected = true;

    $(DOM_IDs.fighterLineup)
      .children(":not(.placeHolder)")
      .each(function(_, v) {
        // move the fighters from the line up into either the player's character or enemies section
        $(v.id === ele.id ? DOM_IDs.playerChar : DOM_IDs.enemyChars).append(
          this
        );
      });
    // show
    console.log($(".toggle1"));
    $(".toggle1").toggleClass("toggleVisible");
  } else if (
     swRPG_GAME.STATES.playerCharSelected &&
    !swRPG_GAME.STATES.enemeyCharSelected) {
    console.log(
      "State indicates this click means selecting an enemy character"
    );
    swRPG_GAME.STATES.enemeyCharSelected = true;
  }
}

$(document).ready(function() {
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

  // $(".class").on("click", function () {
  // var opToChar = {
  //   plus  : "+",
  //   minus : "-",
  //   times : "*",
  //   divide: "/",
  //   power : "^",
  // };
  // $(".operator").on("click", function () {
  //   // if ($("#first-number").text() && operator === "") {
  //   //   firstNum = +$("#first-number").text(); // capture the first number for our variable, make it number type
  //   //   operator = $(this).val(); // possible values: plus minus times divide power

  //   //   $("#operator").text(opToChar[operator]);

  //   if (operator && $("#second-number").text()) {

  //     // link up operators to their math functions, that return the result on two operands
  //     const opToMath = {
  //       plus  : function (a,b) { return a + b;          },
  //       minus : function (a,b) { return a - b;          },
  //       times : function (a,b) { return a * b;          },
  //       divide: function (a,b) { return a / b;          },
  //       power : function (a,b) { return Math.pow(a, b); },
  //     };

  //     // look up math function in our object, and call it with our variables
  //     resultNum = opToMath[operator](firstNum, secondNum);

  //     $("#result").text(resultNum);

  // // click Clear
  // $(".clear").on("click", function () {
  //   console.log("clicking the clear");
  //   // clear DOM elements
  //   $("#first-number" ).empty();
  //   $("#operator"     ).empty();
  //   $("#second-number").empty();
  //   $("#result"       ).empty();
  //   // reset variables
  //   firstNum  = "";
  //   secondNum = "";
  //   operator  = "";
  //   resultNum = "";
  // });
});
