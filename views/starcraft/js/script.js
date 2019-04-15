document.querySelector("#random-button").addEventListener("click", randomizeNextGame);
document.querySelector("#play-game").addEventListener("click", chooseGame);
var selectionsAvailable = ["Zerg", "Protoss", "Terran"];

function randomizeNextGame() {

  var optionsSelections = document.querySelectorAll(".options");

  optionsSelections.forEach(optionsSelection => {
    var prevGame = optionsSelection.children[1];
    var prevGameSelected = prevGame.children[1][prevGame.children[1].options.selectedIndex].innerText
    var nextGame = randomize(prevGameSelected);
    optionsSelection.children[2].children[1].value = nextGame;
  })

  debugger;

  function randomize(prevGameInput) {
    var nextGameSelection = prevGameInput;

    while (nextGameSelection === prevGameInput) {
      var optionNumber = Math.floor(Math.random() * 3)
      nextGameSelection = selectionsAvailable[optionNumber];
    }

    return nextGameSelection
  }
}

function chooseGame(){
  var optionsSelections = document.querySelectorAll(".options");
  optionsSelections.forEach(optionsSelection => {
    optionsSelection.children[1].children[1].value = optionsSelection.children[2].children[1].value;
  })
}