var playerPokemon = [];
var enemyPokemon = [];
var custom = [];
var customTeam = [[-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1]];
var pick = false;
var intro = true;
var typing = true;
var both = false;
var both2 = false;
var switching = false;
var cry;
var playerLives = 6;
var enemyLives = 6;
var background = "url(images/battleScene" + Math.floor(Math.random() * 9) + ".jpeg)";
document.getElementById("battleStage").style.backgroundImage = background;

if (!localStorage.mute) {
    localStorage.mute = "unmuted";
} else if (localStorage.mute == "muted") {
    document.getElementById("mute").src = "images/mute.png";
}

function check(pk, pokemon) {
    for (let i = 0; i < pokemon.length; i++) {
        if (pokemon[i].name == pk.name) {
            return true;
        }
    }
    return false;
}

function customBattle(team1, team2) {
    if (team1 == "random") {
        for (let i = 0; i < 6; i++) {
            option = pokemon[Math.floor(Math.random() * (pokemon.length - 35))];
            hp = Math.floor(option[3] + Math.random() * 30 - 15);
            pk = {name: option[0], t1: option[1], t2: option[2], hp: hp, maxhp: hp, attack: option[4], attackMul: 1, defense: option[5], specialattack: option[6], specialattackMul: 1, specialdefense: option[7], speed: option[8], speedMul: 1, availablemoves: option[9], moves: []};
            if (check(pk, playerPokemon)) {
                i--;
            } else {
                playerPokemon.push(pk);
            }
            cnt = 1;
            mtemp = [];
            option = moveMap[playerPokemon[i].availablemoves[Math.floor(Math.random() * playerPokemon[i].availablemoves.length)]];
            while (option.type != playerPokemon[i].t1) {
                option = moveMap[playerPokemon[i].availablemoves[Math.floor(Math.random() * playerPokemon[i].availablemoves.length)]];
            }
            playerPokemon[i].moves.push(option);
            mtemp.push(option.move);
            if (playerPokemon[i].t2 != "none") {
                cnt++;
                option = moveMap[playerPokemon[i].availablemoves[Math.floor(Math.random() * playerPokemon[i].availablemoves.length)]];
                while (option.type != playerPokemon[i].t2) {
                    option = moveMap[playerPokemon[i].availablemoves[Math.floor(Math.random() * playerPokemon[i].availablemoves.length)]];
                }
                playerPokemon[i].moves.push(option);
                mtemp.push(option.move);
            }
            for (let j = cnt; j < 4; j++) {
                option = moveMap[playerPokemon[i].availablemoves[Math.floor(Math.random() * playerPokemon[i].availablemoves.length)]];
                if (mtemp.includes(option.move)) {
                    j--;
                } else {
                    playerPokemon[i].moves.push(option);
                    mtemp.push(option.move);
                }
            }
            playerPokemon[i].moves = playerPokemon[i].moves
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
        }
            
    } else {
        if (team1 == "custom") {
            team1 = custom;
        }
        for (let i = 0; i < 6; i++) {
            option = pokemon[team1[i * 5]];
            hp = Math.floor(option[3] + Math.random() * 30 - 15);
            pk = {name: option[0], t1: option[1], t2: option[2], hp: hp, maxhp: hp, attack: option[4], attackMul: 1, defense: option[5], specialattack: option[6], specialattackMul: 1, specialdefense: option[7], speed: option[8], speedMul: 1, availablemoves: option[9], moves: []};
            playerPokemon.push(pk);
            document.getElementById("mp" + (i + 1)).src = "images/pokemon/" + pk.name + ".png"
            for (let j = 0; j < 4; j++) {
                playerPokemon[i].moves.push(moveMap[team1[i * 5 + (j + 1)]]);
            }
        }
    }

    if (team2 == "random") {
        for (let i = 0; i < 6; i++) {
            option = pokemon[Math.floor(Math.random() * (pokemon.length - 35))];
            hp = Math.floor(option[3] + Math.random() * 30 - 15);
            pk = {name: option[0], t1: option[1], t2: option[2], hp: hp, maxhp: hp, attack: option[4], attackMul: 1, defense: option[5], specialattack: option[6], specialattackMul: 1, specialdefense: option[7], speed: option[8], speedMul: 1, availablemoves: option[9], moves: []};
            if (check(pk, enemyPokemon)) {
                i--;
            } else {
                enemyPokemon.push(pk);
            }
            cnt = 1;
            mtemp = [];
            option = moveMap[enemyPokemon[i].availablemoves[Math.floor(Math.random() * enemyPokemon[i].availablemoves.length)]];
            while (option.type != enemyPokemon[i].t1) {
                option = moveMap[enemyPokemon[i].availablemoves[Math.floor(Math.random() * enemyPokemon[i].availablemoves.length)]];
            }
            enemyPokemon[i].moves.push(option);
            mtemp.push(option.move);
            if (enemyPokemon[i].t2 != "none") {
                cnt++;
                option = moveMap[enemyPokemon[i].availablemoves[Math.floor(Math.random() * enemyPokemon[i].availablemoves.length)]];
                while (option.type != enemyPokemon[i].t2) {
                    option = moveMap[enemyPokemon[i].availablemoves[Math.floor(Math.random() * enemyPokemon[i].availablemoves.length)]];
                }
                enemyPokemon[i].moves.push(option);
                mtemp.push(option.move);
            }
            for (let j = cnt; j < 4; j++) {
                option = moveMap[enemyPokemon[i].availablemoves[Math.floor(Math.random() * enemyPokemon[i].availablemoves.length)]];
                if (mtemp.includes(option.move)) {
                    j--;
                } else {
                    enemyPokemon[i].moves.push(option);
                    mtemp.push(option.move);
                }
            }
            enemyPokemon[i].moves = enemyPokemon[i].moves
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
            }
    } else {
        if (team2 == "custom") {
            team2 = custom;
        }
        for (let i = 0; i < 6; i++) {
            option = pokemon[team2[i * 5]];
            hp = Math.floor(option[3] + Math.random() * 30 - 15);
            pk = {name: option[0], t1: option[1], t2: option[2], hp: hp, maxhp: hp, attack: option[4], attackMul: 1, defense: option[5], specialattack: option[6], specialattackMul: 1, specialdefense: option[7], speed: option[8], speedMul: 1, availablemoves: option[9], moves: []};
            enemyPokemon.push(pk);
            for (let j = 0; j < 4; j++) {
                enemyPokemon[i].moves.push(moveMap[team2[i * 5 + (j + 1)]]);
            }
        }
    }
}

function updateMP() {
    for (let i = 0; i < 6; i++) {
        document.getElementById("mp" + (i + 1)).src = "images/pokemon/" + playerPokemon[i].name + ".png";
        if (playerPokemon[i].hp == 0) {
            document.getElementById("mp" + (i + 1)).style.filter = "grayscale(1)";
            document.getElementById("mp" + (i + 1)).style.webkitFilter = "greyscale(1)";
            document.getElementById("mp" + (i + 1)).style.backgroundImage = "linear-gradient(45deg, rgb(59, 59, 59), black)";
        } else {
            document.getElementById("mp" + (i + 1)).style.filter = "";
            document.getElementById("mp" + (i + 1)).style.webkitFilter = "";
            document.getElementById("mp" + (i + 1)).style.backgroundImage = "linear-gradient(45deg, white, black)";
        }
    }
}
function populateMoves() {
    document.getElementById("move1").innerHTML = playerPokemon[0].moves[0].move;
    document.getElementById("move1").style.background = getColor(playerPokemon[0].moves[0].type);
    document.getElementById("move2").innerHTML = playerPokemon[0].moves[1].move;
    document.getElementById("move2").style.background = getColor(playerPokemon[0].moves[1].type);
    document.getElementById("move3").innerHTML = playerPokemon[0].moves[2].move;
    document.getElementById("move3").style.background = getColor(playerPokemon[0].moves[2].type);
    document.getElementById("move4").innerHTML = playerPokemon[0].moves[3].move;
    document.getElementById("move4").style.background = getColor(playerPokemon[0].moves[3].type);
}

function getColor(type) {
    if (type == "electric") {
        return "linear-gradient(45deg, rgba(252,255,139,1), rgba(207,201,0,1))";
    }
    else if (type == "grass") {
        return "linear-gradient(45deg, rgba(0,161,2,1), rgba(199,255,111,1))";
    }
    else if (type == "normal") {
        return "linear-gradient(45deg, rgba(171,171,171,1), rgba(255,255,255,1))";
    }
    else if (type == "rock") {
        return "linear-gradient(45deg, rgba(75,65,21,1), rgba(176,150,0,1))";
    }
    else if (type == "psychic") {
        return "linear-gradient(45deg, rgba(149,4,150,1), rgba(255,168,240,1))";
    }
    else if (type == "dragon") {
        return "linear-gradient(45deg, rgba(144,0,0,1), rgba(9,29,170,1))";
    }
    else if (type == "flying") {
        return "linear-gradient(45deg, rgba(0,232,255,1), rgba(218,222,255,1))";
    }
    else if (type == "ground") {
        return "linear-gradient(45deg, rgba(223,172,0,1), rgba(158,143,67,1))";
    }
    else if (type == "water") {
        return "linear-gradient(45deg, rgba(0,255,231,1), rgba(0,19,223,1))";
    }
    else if (type == "steel") {
        return "linear-gradient(45deg, rgba(208,208,208,1), rgba(112,112,112,1))";
    }
    else if (type == "ice") {
        return "linear-gradient(45deg, white, turquoise)";
    }
    else if (type == "ghost") {
        return "linear-gradient(45deg, rgba(209,0,255,1), rgba(128,0,255,1))";
    }
    else if (type == "fighting") {
        return "linear-gradient(45deg, rgba(117,78,27,1), rgba(232,155,0,1))";
    }
    else if (type == "bug") {
        return "linear-gradient(45deg, rgba(164,201,80,1), rgba(89,119,11,1))";
    }
    else if (type == "fire") {
        return "linear-gradient(45deg, rgba(245,255,0,1), rgba(255,12,0,1))";
    }
    else if (type == "dark") {
        return "linear-gradient(45deg, rgba(50,50,50,1), rgba(20,20,20,1))";
    }
    else if (type == "poison") {
        return "linear-gradient(45deg, rgba(231,93,255,1), rgba(137,0,171,1))";
    }
}
function getColorDepth(type) {
    if (type == "electric") {
        return ["rgba(252,255,139,1)", "rgba(207,201,0,1)"];
    }
    else if (type == "grass") {
        return ["rgba(0,161,2,1)", "rgba(199,255,111,1)"];
    }
    else if (type == "normal") {
        return ["rgba(171,171,171,1)", "rgba(255,255,255,1)"];
    }
    else if (type == "rock") {
        return ["rgba(75,65,21,1)", "rgba(176,150,0,1)"];
    }
    else if (type == "psychic") {
        return ["rgba(149,4,150,1)", "rgba(255,168,240,1)"];
    }
    else if (type == "dragon") {
        return ["rgba(144,0,0,1)", "rgba(9,29,170,1)"];
    }
    else if (type == "flying") {
        return ["rgba(0,232,255,1)", "rgba(218,222,255,1)"];
    }
    else if (type == "ground") {
        return ["rgba(223,172,0,1)", "rgba(158,143,67,1)"];
    }
    else if (type == "water") {
        return ["rgba(0,255,231,1)", "rgba(0,19,223,1)"];
    }
    else if (type == "steel") {
        return ["rgba(208,208,208,1)", "rgba(112,112,112,1)"];
    }
    else if (type == "ice") {
        return ["white", "turquoise"];
    }
    else if (type == "ghost") {
        return ["rgba(209,0,255,1)", "rgba(128,0,255,1)"];
    }
    else if (type == "fighting") {
        return ["rgba(117,78,27,1)", "rgba(232,155,0,1)"];
    }
    else if (type == "bug") {
        return ["rgba(164,201,80,1)", "rgba(89,119,11,1)"];
    }
    else if (type == "fire") {
        return ["rgba(245,255,0,1)", "rgba(255,12,0,1)"];
    }
    else if (type == "dark") {
        return ["rgba(50,50,50,1)", "rgba(20,20,20,1)"];
    }
    else if (type == "poison") {
        return ["rgba(231,93,255,1)", "rgba(137,0,171,1)"];
    }
}

function loadImage(ch) {
    if (document.getElementById("playerPokemonName").innerHTML != playerPokemon[0].name) {
        document.getElementById("playerPokemonImage").style.opacity = 1;
        document.getElementById("playerPokemonImage").src = "images/Back/" + playerPokemon[0].name.toLowerCase() + ".gif";
        document.getElementById("playerPokemonName").innerHTML = playerPokemon[0].name;
    }
    if (document.getElementById("enemyPokemonName").innerHTML != enemyPokemon[0].name) {
        document.getElementById("enemyPokemonImage").style.opacity = 1;
        document.getElementById("enemyPokemonImage").src = "images/Front/" + enemyPokemon[0].name + ".gif";
        document.getElementById("enemyPokemonName").innerHTML = enemyPokemon[0].name;
    }
    if (playerPokemon[0].t2 == "none") {
        document.getElementById("playerPokemonName").style.backgroundImage = getColor(playerPokemon[0].t1);
    } else {
        cd1 = getColorDepth(playerPokemon[0].t1);
        cd2 = getColorDepth(playerPokemon[0].t2);
        document.getElementById("playerPokemonName").style.backgroundImage = "linear-gradient(to right, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
    }
    if (enemyPokemon[0].t2 == "none") {
        document.getElementById("enemyPokemonName").style.backgroundImage = getColor(enemyPokemon[0].t1);
    } else {
        cd1 = getColorDepth(enemyPokemon[0].t1);
        cd2 = getColorDepth(enemyPokemon[0].t2);
        document.getElementById("enemyPokemonName").style.backgroundImage = "linear-gradient(to right, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
    }
    document.getElementById("playerRatio").innerHTML = playerPokemon[0].hp + "/" + playerPokemon[0].maxhp;
    document.getElementById("enemyRatio").innerHTML = enemyPokemon[0].hp + "/" + enemyPokemon[0].maxhp;
    per = enemyPokemon[0].hp / enemyPokemon[0].maxhp * 100;
    if (per > 50) {
        document.getElementById("enemyBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
    } else if (per > 15) {
        document.getElementById("enemyBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
    } else {
        document.getElementById("enemyBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
    }
    per = playerPokemon[0].hp / playerPokemon[0].maxhp * 100;
    if (per > 50) {
        document.getElementById("playerBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
    } else if (per > 15) {
        document.getElementById("playerBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
    } else {
        document.getElementById("playerBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
    }
    updateMP();
}

var sound = new Audio("battle.mp3"); 
var sound2 = new Audio("win.mp3");
var attackSound = new Audio();
var hitSound = new Audio("normal.mp3");
var superSound = new Audio("superEffective.mp3");
var notSound = new Audio("notVeryEffective.mp3");
var boostSound = new Audio("boost.mp3");

sound.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

sound2.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

document.getElementById("start").onclick = async function() {

    document.getElementById("flame").hidden = false;
    document.getElementById("vs").style.animation = "start 1s linear 1";
    document.getElementById("start").hidden = true;
    document.getElementById("build").hidden = true;
    sound2.currentTime = 0;
    if (localStorage.mute == "unmuted") {
        sound.muted = false;
        sound.play();
    }
    if (document.getElementById("playerCur").childNodes.length == 3) {
        pimg = document.getElementById("playerCur").childNodes[1].src;
    } else {
        pimg = document.getElementById("playerCur").childNodes[3].src;
    }
    if (document.getElementById("enemyCur").childNodes.length == 3) {
        eimg = document.getElementById("enemyCur").childNodes[1].src;
    } else {
        eimg = document.getElementById("enemyCur").childNodes[3].src;
    }
    document.getElementById("playerText").hidden = true;
    document.getElementById("enemyText").hidden = true;
    document.getElementById("textPortion").hidden = true;
    document.getElementById("playerCur").style.display = "none";
    document.getElementById("enemyCur").style.display = "none";
    if (pimg.endsWith("random.png")) {
        document.getElementById("pimg").style.filter = "invert(1)";
    }
    if (eimg.endsWith("random.png")) {
        document.getElementById("eimg").style.filter = "invert(1)";
    }
    document.getElementById("pimg").src = pimg;
    document.getElementById("pimg").style.animation = "imgFall 1s linear 1";
    document.getElementById("eimg").src = eimg;
    document.getElementById("eimg").style.animation = "eimgFall 1s linear 1";
}

document.getElementById("vs").onanimationend = async function() {
    document.getElementById("flame").hidden = true;
    document.getElementById("pimg").hidden = true;
    document.getElementById("eimg").hidden = true;
    document.getElementById("vs").hidden = true;
    document.getElementById("playerBall").hidden = false;
    document.getElementById("battleStage").hidden = false;
    document.getElementById("textPortion").hidden = false;
    if (document.getElementById("playerCur").childNodes.length == 3) {
        playerTeam = teamMap[document.getElementById("playerCur").childNodes[0].innerHTML.toLowerCase()];
    } else {
        playerTeam = teamMap[document.getElementById("playerCur").childNodes[1].innerHTML.toLowerCase()];
    }
    if (document.getElementById("enemyCur").childNodes.length == 3) {
        enemyTeam = teamMap[document.getElementById("enemyCur").childNodes[0].innerHTML.toLowerCase()];
    } else {
        enemyTeam = teamMap[document.getElementById("enemyCur").childNodes[1].innerHTML.toLowerCase()];
    }
    await customBattle(playerTeam, enemyTeam);
    await loadImage();
}


async function win() {
    document.getElementById("pyro").hidden = false;
    await slowType("You win!!!     Press Menu to play again", 1);
    document.getElementById("battleStage").style.backgroundImage = "url(images/win.gif)";
    document.getElementById("menuImg").hidden = false;
    sound.pause();
    sound2.play();
}

async function lose() {
    await slowType("You lose...      Press menu to play again", 1);
    document.getElementById("battleStage").style.backgroundImage = "url(images/lose.gif)";
    document.getElementById("menuImg").hidden = false;
    sound.pause();
}

function nullify() {
    document.getElementById("playerPokemonName").innerHTML = "";
    document.getElementById("playerRatio").innerHTML = "0/0";
    document.getElementById("move1").innerHTML = "";
    document.getElementById("move1").style.background = "rgb(31, 29, 29)";
    document.getElementById("move2").innerHTML = "";
    document.getElementById("move2").style.background = "rgb(31, 29, 29)";
    document.getElementById("move3").innerHTML = "";
    document.getElementById("move3").style.background = "rgb(31, 29, 29)";
    document.getElementById("move4").innerHTML = "";
    document.getElementById("move4").style.background = "rgb(31, 29, 29)";
}

async function moveAnimations(player, type) {
    if (type == "bug" || type == "dragon" || type == "fighting" || type == "steel" || type == "poison") {
        if (player) {
            document.getElementById("battleStage").style.backgroundImage = "url(images/Moves/" + type + "1.png)";
        } else {
            document.getElementById("battleStage").style.backgroundImage = "url(images/Moves/" + type + "2.png)";
        }
    } else {
        document.getElementById("battleStage").style.backgroundImage = "url(images/Moves/" + type + ".png)";
    }
    await sleep(1000);
    document.getElementById("battleStage").style.backgroundImage = background;
}

async function start() {
    await slowType("Welcome to Dan's Pokemon. Pick your team and press battle!", 1);
}

start();

$(document).ready(function () {
    var $select = $('#name1').selectize({ sortField: 'text' });
    var selectize = $select[0].selectize;
    for (let i = 0; i < pokemon.length - 35; i++) {
        selectize.addOption({value: pokemon[i][0], text: pokemon[i][0]});
    }
});

for (let j = 0; j < 6; j++) {
    for (let i = 0; i < 4; i++) {
        document.getElementById("build" + (j + 1) + "Move" + (i + 1)).onchange = function() {
            customTeam[j][i + 1] = this.value;
            let t = moveMap[this.value].type;

            if (formulateSquadrine()) {
                document.getElementById("check").hidden = false;
            }

            document.getElementById("build" + (j + 1) + "m" + (i + 1)).src = "images/types/" + t + ".png";
            document.getElementById("build" + (j + 1) + "m" + (i + 1)).hidden = false;
            if (i < 3) {
                document.getElementById("build" + (j + 1) + "Move" + (i + 2)).innerHTML = this.innerHTML;
                document.getElementById("build" + (j + 1) + "Move" + (i + 2)).hidden = false;
            } else if (j < 5) {
                var $select = $('#name' + (j + 2)).selectize({ sortField: 'text' });
                var selectize = $select[0].selectize;
                for (let j = 0; j < pokemon.length - 35; j++) {
                    selectize.addOption({value: pokemon[j][0], text: pokemon[j][0]});
                }
                document.getElementById("name" + (j + 2)).hidden = false;
                document.getElementById("pokeImage" + (j + 2)).hidden = false;
            }
        }
    }
}
