document.querySelectorAll(".play-choice").forEach(player => {
    player.addEventListener("click", function () {
        if (player.firstElementChild.firstElementChild.classList.contains("must-play")) {
            player.firstElementChild.innerHTML = `<i class="fas fa-user fa-4x"></i>`;
            player.firstElementChild.firstElementChild.classList.remove("must-play");

        }
        else if (player.firstElementChild.firstElementChild.classList.contains("active-player")) {
            player.firstElementChild.innerHTML = `<i class="fab fa-accessible-icon fa-4x"></i>`;
            player.firstElementChild.firstElementChild.classList.remove("active-player");
            player.firstElementChild.firstElementChild.classList.add("must-play");
        } else {
            player.firstElementChild.innerHTML = `<i class="fas fa-user-secret fa-4x"></i>`;
            player.firstElementChild.firstElementChild.classList.add("active-player");
        }
    })
})

document.querySelector("#slump-btn").addEventListener("click", createGame)

function createGame(){
    var matcher = getPlayers();
    console.log(matcher);
    document.querySelector(".contain").innerHTML = `
    <div class="game-section" id="first-game">
<div class="player-field">
    <div id="game1player1">${matcher.firstGame[0]}</div>
    <div>&</div>
    <div id="game1player2">${matcher.firstGame[1]}</div>
</div>
<div class="fosball-div">
    <img id="foosball-image" src="img/foosball_field.png">
</div>
<div class="player-field">
    <div id="game2player1">${matcher.firstGame[2]}</div>
    <div>&</div>
    <div id="game2player2">${matcher.firstGame[3]}</div>
</div>
</div>
<hr>
<div class="game-section" id="second-game">
<div class="player-field">
<div id="game1player1">${matcher.secondGame[0]}</div>
<div>&</div>
<div id="game1player2">${matcher.secondGame[1]}</div>
</div>
<div class="fosball-div">
<img id="foosball-image" src="img/foosball_field.png">
</div>
<div class="player-field">
<div id="game2player1">${matcher.secondGame[2]}</div>
<div>&</div>
<div id="game2player2">${matcher.secondGame[3]}</div>
</div>
</div>
    `
}

/* <div class="game-section" id="first-game">
<div class="player-field">
    <div id="game1player1">${matcher.firstGame[0]}</div>
    <div>&</div>
    <div id="game1player2">${matcher.firstGame[1]}</div>
</div>
<div class="fosball-div">
    <img id="foosball-image" src="img/foosball_field.png">
</div>
<div class="player-field">
    <div id="game2player1">${matcher.firstGame[2]}</div>
    <div>&</div>
    <div id="game2player2">${matcher.firstGame[3]}</div>
</div>
</div>
<hr>
<div class="game-section" id="second-game">
<div class="player-field">
<div id="game1player1">${matcher.secondGame[0]}</div>
<div>&</div>
<div id="game1player2">${matcher.secondGame[1]}</div>
</div>
<div class="fosball-div">
<img id="foosball-image" src="img/foosball_field.png">
</div>
<div class="player-field">
<div id="game2player1">${matcher.secondGame[2]}</div>
<div>&</div>
<div id="game2player2">${matcher.secondGame[3]}</div>
</div>
</div> */

function getPlayers(){
    var activePlayers = [];
    document.querySelectorAll(".active-player").forEach(player => {
        activePlayers.push(player.parentNode.parentNode.children[1].innerText)
    })
    var mustPlay = [];
    document.querySelectorAll(".must-play").forEach(player => {
        mustPlay.push(player.parentNode.parentNode.children[1].innerText)
    })
    var allPlayers = activePlayers.concat(mustPlay);
    var matcher = makeSlump(shuffle(mustPlay), shuffle(activePlayers), shuffle(allPlayers));
    return matcher;
}

function makeSlump(mustPlay, activePlayers, allPlayers){
    var firstGame = [], secondGame = [], mustPlayCounter = 0, activePlayerCounter = 0, searchCounter = 0;
    //Loop to randomize first game
    for (let i = 0; i < 4; i++) {
        if (mustPlay[i] !== undefined) {
            firstGame[i] = mustPlay[mustPlayCounter]
            mustPlayCounter += 1;
        } else {
            firstGame[i] = activePlayers[activePlayerCounter];
            activePlayerCounter += 1;
        }
    }
    firstGame = shuffle(firstGame);
    //Loop to randomize second game
    for (let i = 4; i < 9; i++) {
        if (mustPlay[i] !== undefined) {
            secondGame[i-4] = mustPlay[mustPlayCounter]
            mustPlayCounter += 1;
        } else if (activePlayers[i-mustPlayCounter] !== undefined){
            secondGame[i-4] = activePlayers[activePlayerCounter];
            activePlayerCounter += 1;
        } else {
            if(secondGame.includes(activePlayers[searchCounter])){
                searchCounter +=1;
            } else {
                secondGame[i-4] = activePlayers[searchCounter];
                searchCounter +=1;
            }
        }
    }
    secondGame = shuffle(secondGame);
    var matcher = {};
    matcher['firstGame'] = firstGame;
    matcher['secondGame'] = secondGame;
    return matcher;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}