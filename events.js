var rainbowGradient = "linear-gradient(45deg, rgb(255, 0, 0) 0%, rgb(255, 154, 0) 10%, rgb(208, 222, 33) 20%, rgb(79, 220, 74) 30%, rgb(63, 218, 216) 40%, rgb(47, 201, 226) 50%, rgb(28, 127, 238) 60%, rgb(95, 21, 242) 70%, rgb(186, 12, 248) 80%, rgb(251, 7, 217) 90%, rgb(255, 0, 0) 100%)";
for (let i = 0; i < 4; i++) {
    document.getElementById("move" + (i + 1)).onmouseover = function() {
        if (!typing && !pick && !switching && !isMobile()) {
            this.style.background = rainbowGradient;
            document.getElementById("moveHover").hidden = false;
            let move = playerPokemon[0].moves[i];
            document.getElementById("moveHoverName").innerHTML = move.move;
            document.getElementById("moveHoverType").src = "images/types/" + move.type + ".png";
            document.getElementById("moveHoverDamage").innerHTML = "Damage: " + move.damage;
            document.getElementById("moveHoverAccuracy").innerHTML = move.accuracy + "% Accuracy";
            if (move.mode == "p") {
                document.getElementById("moveHoverMode").innerHTML = "physical";
            } else if (move.mode == "s"){
                document.getElementById("moveHoverMode").innerHTML = "special";
            } else {
                document.getElementById("moveHoverMode").innerHTML = "boost";
            }
            document.getElementById("moveHoverExtra").innerHTML = "";
            if (recoil.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Does 33% in recoil</li>";
            }
            if (nerf.includes(move.move)) {
                if (move.move == "closecombat") {
                    document.getElementById("moveHoverExtra").innerHTML += "<li>Reduces Attack</li><li>Reduces Special Attack</li>";
                } else {
                    document.getElementById("moveHoverExtra").innerHTML += "<li>Reduces Special Attack</li>";
                }
            }
            if (move.move == "swordsdance") {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Increases Attack</li>";
            }
            if (move.move == "nastyplot") {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Increases Special Attack</li>";
            }
            if (move.move == "dragondance") {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Increases Speed</li><li>Increases Attack</li>";
            }
            if (burn.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>15% chance to burn</li>";
            }
            if (frozen.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>10% chance to freeze</li>";
            }
            if (paralyzed.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>20% chance to paralyze</li>";
            }
            if (poisoned.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>15% chance to poison</li>";
            }
            if (flinch.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>20% chance to flinch</li>";
            }
            if (confused.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>15% chance to confuse</li>";
            }
            if (critical.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>25% chance of critical hit</li>";
            }
            if (speedDrop.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Lowers opponents speed</li>";
            }
            if (restore.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Restores 50% of damage</li>";
            }
            if (canHitDig.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Hits underground pokemon</li>";
            }
            if (twoTurn.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Takes 2 turns</li>";
            }
            if (recharge.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Must recharge if no KO</li>";
            }
            if (move.move == "facade") {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Double power if statused</li>";
            }
            if (move.move == "brine") {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Double power if enemy HP below half</li>";
            }
            if (move.move == "outrage" || move.move == "petaldance") {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Move goes for 2-3 turns</li><li>Causes confusion after done</li>";
            }
        }
    }
    document.getElementById("move" + (i + 1)).onmouseleave = function() {
        if (!pick && this.style.background == rainbowGradient) {
            this.style.background = getColor(playerPokemon[0].moves[i].type);
            document.getElementById("moveHover").hidden = true;
        }
    }
    document.getElementById("move" + (i + 1)).onclick = function() {
        if (!typing && !pick && !switching) {
            this.style.background = getColor(playerPokemon[0].moves[i].type);
            document.getElementById("moveHover").hidden = true;
            attack(playerPokemon[0].moves[i]);
        }
    }
}

async function slowType(s, i) {
    if (i <= s.length) {
        typing = true;
        var dest = document.getElementById("textPortion");
        dest.innerHTML = s.substring(0, i);
        await sleep().then(async () => {
            await slowType(s, i + 1);
        });
    }
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

document.getElementById("playerPokemon").onmouseenter = function() {
    if (playerPokemon.length == 0 || playerLives == 0 || enemyLives == 0 || isMobile()) {
        return;
    }
    document.getElementById("hover").hidden = false;
    document.getElementById("hoverName").innerHTML = playerPokemon[0].name + "'s stats";
    document.getElementById("hoverHP").innerHTML = "HP: " + playerPokemon[0].hp;
    if (playerPokemon[0].attackMul == 1) {
        document.getElementById("hoverAttack").style.color = "black";
        document.getElementById("hoverAttack").innerHTML = "Attack: " + playerPokemon[0].attack;
    } else if (playerPokemon[0].attackMul > 1) {
        document.getElementById("hoverAttack").style.color = "green";
        document.getElementById("hoverAttack").innerHTML = "Attack: " + (playerPokemon[0].attack * playerPokemon[0].attackMul);
    } else {
        document.getElementById("hoverAttack").style.color = "red";
        document.getElementById("hoverAttack").innerHTML = "Attack: " + (playerPokemon[0].attack * playerPokemon[0].attackMul);
    }
    document.getElementById("hoverDefense").innerHTML = "Defense: " + playerPokemon[0].defense;
    if (playerPokemon[0].specialattackMul == 1) {
        document.getElementById("hoverSpecialAttack").style.color = "black";
        document.getElementById("hoverSpecialAttack").innerHTML = "Special Attack: " + playerPokemon[0].specialattack;
    } else if (playerPokemon[0].specialattackMul > 1) {
        document.getElementById("hoverSpecialAttack").style.color = "green";
        document.getElementById("hoverSpecialAttack").innerHTML = "Specal Attack: " + (playerPokemon[0].specialattack * playerPokemon[0].specialattackMul);
    } else {
        document.getElementById("hoverSpecialAttack").style.color = "red";
        document.getElementById("hoverSpecialAttack").innerHTML = "Specal Attack: " + (playerPokemon[0].specialattack * playerPokemon[0].specialattackMul);
    }
    document.getElementById("hoverSpecialDefense").innerHTML = "Special Defense: " + playerPokemon[0].specialdefense;
    if (playerPokemon[0].speedMul == 1) {
        document.getElementById("hoverSpeed").style.color = "black";
        document.getElementById("hoverSpeed").innerHTML = "Speed: " + playerPokemon[0].speed;
    } else if (playerPokemon[0].speedMul > 1) {
        document.getElementById("hoverSpeed").style.color = "green";
        document.getElementById("hoverSpeed").innerHTML = "Speed: " + (playerPokemon[0].speed * playerPokemon[0].speedMul);
    } else {
        document.getElementById("hoverSpeed").style.color = "red";
        document.getElementById("hoverSpeed").innerHTML = "Speed: " + (playerPokemon[0].speed * playerPokemon[0].speedMul);
    }
    pFound = playerPokemon[0];
    if (pFound.t2 == "none") {
        document.getElementById("hoverName").style.backgroundImage = getColor(pFound.t1);
    } else {
        cd1 = getColorDepth(pFound.t1);
        cd2 = getColorDepth(pFound.t2);
        document.getElementById("hoverName").style.backgroundImage = "linear-gradient(to right, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
    }
}

document.getElementById("playerPokemon").onmouseleave = function() {
    document.getElementById("hover").hidden = true;
}

document.getElementById("enemyPokemon").onmouseenter = function() {
    if (enemyPokemon.length == 0 || playerLives == 0 || enemyLives == 0 || isMobile()) {
        return;
    }
    document.getElementById("hover").hidden = false;
    document.getElementById("hoverName").innerHTML = enemyPokemon[0].name + "'s stats";
    document.getElementById("hoverHP").innerHTML = "HP: " + enemyPokemon[0].hp;
    if (enemyPokemon[0].attackMul == 1) {
        document.getElementById("hoverAttack").style.color = "black";
        document.getElementById("hoverAttack").innerHTML = "Attack: " + enemyPokemon[0].attack;
    } else if (enemyPokemon[0].attackMul > 1) {
        document.getElementById("hoverAttack").style.color = "green";
        document.getElementById("hoverAttack").innerHTML = "Attack: " + (enemyPokemon[0].attack * enemyPokemon[0].attackMul);
    } else {
        document.getElementById("hoverAttack").style.color = "red";
        document.getElementById("hoverAttack").innerHTML = "Attack: " + (enemyPokemon[0].attack * enemyPokemon[0].attackMul);
    }
    document.getElementById("hoverDefense").innerHTML = "Defense: " + enemyPokemon[0].defense;
    if (enemyPokemon[0].specialattackMul == 1) {
        document.getElementById("hoverSpecialAttack").style.color = "black";
        document.getElementById("hoverSpecialAttack").innerHTML = "Special Attack: " + enemyPokemon[0].specialattack;
    } else if (enemyPokemon[0].specialattackMul > 1) {
        document.getElementById("hoverSpecialAttack").style.color = "green";
        document.getElementById("hoverSpecialAttack").innerHTML = "Special Attack: " + (enemyPokemon[0].specialattack * enemyPokemon[0].specialattackMul);
    } else {
        document.getElementById("hoverSpecialAttack").style.color = "red";
        document.getElementById("hoverSpecialAttack").innerHTML = "Special Attack: " + (enemyPokemon[0].specialattack * enemyPokemon[0].specialattackMul);
    }
    document.getElementById("hoverSpecialDefense").innerHTML = "Special Defense: " + enemyPokemon[0].specialdefense;
    if (enemyPokemon[0].speedMul == 1) {
        document.getElementById("hoverSpeed").style.color = "black";
        document.getElementById("hoverSpeed").innerHTML = "Speed: " + enemyPokemon[0].speed;
    } else if (enemyPokemon[0].speedMul > 1) {
        document.getElementById("hoverSpeed").style.color = "green";
        document.getElementById("hoverSpeed").innerHTML = "Speed: " + (enemyPokemon[0].speed * enemyPokemon[0].speedMul);
    } else {
        document.getElementById("hoverSpeed").style.color = "red";
        document.getElementById("hoverSpeed").innerHTML = "Speed: " + (enemyPokemon[0].speed * enemyPokemon[0].speedMul);
    }
    pFound = enemyPokemon[0];
    if (pFound.t2 == "none") {
        document.getElementById("hoverName").style.backgroundImage = getColor(pFound.t1);
    } else {
        cd1 = getColorDepth(pFound.t1);
        cd2 = getColorDepth(pFound.t2);
        document.getElementById("hoverName").style.backgroundImage = "linear-gradient(to right, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
    }
}

document.getElementById("enemyPokemon").onmouseleave = function() {
    document.getElementById("hover").hidden = true;
}

for (let i = 0; i < 6; i++) {
    document.getElementById("mp" + (i + 1)).onmouseenter = function() {
        if (isMobile()) {
            return;
        }
        if (document.getElementById("mp" + (i + 1)).src != "") {
            document.getElementById("info").style.display = "flex";
            document.getElementById("info").hidden = false;
            pFound = playerPokemon[i];
            document.getElementById("infoName").innerHTML = pFound.name;
            document.getElementById("infoHP").innerHTML = pFound.hp + "/" + pFound.maxhp;
            if (pFound.t2 == "none") {
                document.getElementById("infoName").style.backgroundImage = getColor(pFound.t1);
            } else {
                cd1 = getColorDepth(pFound.t1);
                cd2 = getColorDepth(pFound.t2);
                document.getElementById("infoName").style.backgroundImage = "linear-gradient(to right, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
            }
            per = pFound.hp / pFound.maxhp * 100;
            if (per > 50) {
                document.getElementById("infoBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
            } else if (per > 15) {
                document.getElementById("infoBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
            } else {
                document.getElementById("infoBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
            }
            for (let j = 0; j < 4; j++) {
                document.getElementById("infoMove" + (j + 1)).innerHTML = pFound.moves[j].move;
                document.getElementById("infoMove" + (j + 1)).style.background = getColor(pFound.moves[j].type);
            }
            if (document.getElementById("info").childNodes.length == 16) {
                document.getElementById("info").removeChild(document.getElementById("info").childNodes[15]);
            }
            if (pFound.status == 1) {
                let img = document.createElement("img");
                img.src = "images/status/burn.png";
                img.className = "status";
                document.getElementById("info").appendChild(img);
            }
            if (pFound.status == 2) {
                let img = document.createElement("img");
                img.src = "images/status/paralyzed.png";
                img.className = "status";
                document.getElementById("info").appendChild(img);
            }
            if (pFound.status == 3) {
                let img = document.createElement("img");
                img.src = "images/status/frozen.png";
                img.className = "status";
                document.getElementById("info").appendChild(img);
            }
            if (pFound.status == 4) {
                let img = document.createElement("img");
                img.src = "images/status/poison.png";
                img.className = "status";
                document.getElementById("info").appendChild(img);
            }
        }
        if (i != 0 && playerPokemon[i].hp > 0 && !typing && !switching) {
            this.style.background = rainbowGradient;
        }
        document.getElementById("hover").hidden = false;
        document.getElementById("hoverName").innerHTML = playerPokemon[i].name + "'s stats";
        document.getElementById("hoverHP").innerHTML = "HP: " + playerPokemon[i].hp;
        if (playerPokemon[i].attackMul == 1) {
            document.getElementById("hoverAttack").style.color = "black";
            document.getElementById("hoverAttack").innerHTML = "Attack: " + playerPokemon[i].attack;
        } else if (playerPokemon[i].attackMul > 1) {
            document.getElementById("hoverAttack").style.color = "green";
            document.getElementById("hoverAttack").innerHTML = "Attack: " + (playerPokemon[i].attack * playerPokemon[i].attackMul);
        } else {
            document.getElementById("hoverAttack").style.color = "red";
            document.getElementById("hoverAttack").innerHTML = "Attack: " + (playerPokemon[i].attack * playerPokemon[i].attackMul);
        }
        document.getElementById("hoverDefense").innerHTML = "Defense: " + playerPokemon[i].defense;
        if (playerPokemon[i].specialattackMul == 1) {
            document.getElementById("hoverSpecialAttack").style.color = "black";
            document.getElementById("hoverSpecialAttack").innerHTML = "Special Attack: " + playerPokemon[i].specialattack;
        } else if (playerPokemon[i].specialattackMul > 1) {
            document.getElementById("hoverSpecialAttack").style.color = "green";
            document.getElementById("hoverSpecialAttack").innerHTML = "Specal Attack: " + (playerPokemon[i].specialattack * playerPokemon[i].specialattackMul);
        } else {
            document.getElementById("hoverSpecialAttack").style.color = "red";
            document.getElementById("hoverSpecialAttack").innerHTML = "Specal Attack: " + (playerPokemon[i].specialattack * playerPokemon[i].specialattackMul);
        }
        document.getElementById("hoverSpecialDefense").innerHTML = "Special Defense: " + playerPokemon[i].specialdefense;
        if (playerPokemon[i].speedMul == 1) {
            document.getElementById("hoverSpeed").style.color = "black";
            document.getElementById("hoverSpeed").innerHTML = "Speed: " + playerPokemon[i].speed;
        } else if (playerPokemon[i].speedMul > 1) {
            document.getElementById("hoverSpeed").style.color = "green";
            document.getElementById("hoverSpeed").innerHTML = "Speed: " + (playerPokemon[i].speed * playerPokemon[i].speedMul);
        } else {
            document.getElementById("hoverSpeed").style.color = "red";
            document.getElementById("hoverSpeed").innerHTML = "Speed: " + (playerPokemon[i].speed * playerPokemon[i].speedMul);
        }
        pFound = playerPokemon[i];
        if (pFound.t2 == "none") {
            document.getElementById("hoverName").style.backgroundImage = getColor(pFound.t1);
        } else {
            cd1 = getColorDepth(pFound.t1);
            cd2 = getColorDepth(pFound.t2);
            document.getElementById("hoverName").style.backgroundImage = "linear-gradient(to right, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
        }
    }

    document.getElementById("mp" + (i + 1)).onmouseleave = function() {
        if (playerPokemon[i].hp > 0) {
            this.style.background = "linear-gradient(45deg, white, black)";
        } else {
            this.style.backgroundImage = "linear-gradient(45deg, rgb(59, 59, 59), black)";
        }
        document.getElementById("info").style.display = "none";
        document.getElementById("info").hidden = true;
        document.getElementById("playerPokemon").onmouseleave();
    }

    document.getElementById("mp" + (i + 1)).onclick = function() {
        if (i != 0 && !typing && playerPokemon[i].hp > 0 && !switching) {
            this.style.background = "linear-gradient(45deg, white, black)";
            playerSwitch(i);
        }
    }
}

document.getElementById("playerExplosion").onmouseenter = function() {
    document.getElementById("playerPokemon").onmouseenter();
}
document.getElementById("enemyExplosion").onmouseenter = function() {
    document.getElementById("enemyPokemon").onmouseenter();
}
document.getElementById("playerExplosion").onmouseleave = function() {
    document.getElementById("playerPokemon").onmouseleave();
}
document.getElementById("enemyExplosion").onmouseleave = function() {
    document.getElementById("enemyPokemon").onmouseleave();
}

document.getElementById("playerBall").addEventListener("animationend", function() {
    if (localStorage.mute == "unmuted") {
        cry = new Audio("cries/" + playerPokemon[0].name.toLowerCase() + ".ogg");
        cry.play();
    }
    document.getElementById("playerBall").hidden = true;
    document.getElementById("playerExplosion").src = "images/pokeballs/pokeballOpen" + playerPokemon[0].t1 + ".gif";
    document.getElementById("playerExplosion").hidden = false;
    document.getElementById("playerPokemonImage").hidden = false;
    populateMoves();
});

document.getElementById("enemyBall").addEventListener("animationend", function() {
    if (localStorage.mute == "unmuted") {
        cry = new Audio("cries/" + enemyPokemon[0].name.toLowerCase() + ".ogg");
        cry.play();
    }
    document.getElementById("enemyBall").hidden = true;
    document.getElementById("enemyExplosion").src = "images/pokeballs/pokeballOpen" + enemyPokemon[0].t1 + ".gif";
    document.getElementById("enemyExplosion").hidden = false;
    document.getElementById("enemyPokemonImage").hidden = false;
});

document.getElementById("playerExplosion").addEventListener("animationend", async function() {
    populateMoves();
    document.getElementById("playerExplosion").hidden = true;
    if (intro) {
        await slowType("You sent out " + playerPokemon[0].name, 1);
        document.getElementById("enemyBall").hidden = false;
    }
    else if (pick) {
        await slowType("You sent out " + playerPokemon[0].name + "!", 1);
        await sleep(100);
        let e = enemyPokemon[0];
        if (e.status == 1) {
            statusSound = new Audio("burned.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            if (!await statusDamage(e, "enemy", "burn")) {
                return;
            }
        }
        if (e.status == 4) {
            statusSound = new Audio("poisoned.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            if (!await statusDamage(e, "enemy", "poison")) {
                return;
            }
        }
        await sleep(500);
        decConfusion();
        if (playerPokemon[0].fly || playerPokemon[0].dig || playerPokemon[0].solar || playerPokemon[0].bounce) {
            await attack();
            return;
        }
        await slowType("What will " + playerPokemon[0].name + " do?", 1);
        pick = false;
        typing = false;
        switching = false;
        checkHovered();
    }
    else if (both) {
        both = false;
        both2 = true;
        await slowType("You switched to " + playerPokemon[0].name + "!", 1);
        await sleep(500);
        document.getElementById("enemyBall").hidden = false;
        document.getElementById("enemyPokemonImage").hidden = true;
        await enemySwitch(bestOption);
    }
    else if (both2) {
        document.getElementById("playerPokemonImage").hidden = false;
        both2 = false;
        await slowType("You switched to " + playerPokemon[0].name + "!", 1);
        await sleep(500);
        decConfusion();
        if (playerPokemon[0].fly || playerPokemon[0].dig || playerPokemon[0].solar || playerPokemon[0].bounce) {
            await attack();
            return;
        }
        await slowType("What will " + playerPokemon[0].name + " do?", 1);
        typing = false;
        switching = false;
        checkHovered();
    } else {
        document.getElementById("playerPokemonImage").hidden = false;
        await slowType("You switched to " + playerPokemon[0].name + "!", 1);
        await sleep(500);
        switching = false;
    }
});

document.getElementById("enemyExplosion").addEventListener("animationend", async function() {
    document.getElementById("enemyExplosion").hidden = true;
    if (intro) {
        await slowType("The enemy sent out " + enemyPokemon[0].name, 1);
        await sleep(500);
        let p = playerPokemon[0];
        if (p.status == 1) {
            statusSound = new Audio("burned.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            if (!await statusDamage(p, "player", "burn")) {
                return;
            }
        }
        if (p.status == 4) {
            statusSound = new Audio("poisoned.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            if (!await statusDamage(p, "player", "poison")) {
                return;
            }
        }
        decConfusion();
        if (playerPokemon[0].fly || playerPokemon[0].dig || playerPokemon[0].solar || playerPokemon[0].bounce) {
            await attack();
            return;
        }
        await slowType("What will " + playerPokemon[0].name + " do?", 1);
        typing = false;
        switching = false;
        intro = false;
        checkHovered();
    }
    else if (both) {
        both = false;
        both2 = true;
        await slowType("The enemy switched to " + enemyPokemon[0].name + "!", 1);
        await sleep(500);
        document.getElementById("playerBall").hidden = false;
        document.getElementById("playerPokemonImage").hidden = true;
        populateMoves();
        loadImage();
    }
    else if (both2) {
        document.getElementById("enemyPokemonImage").hidden = false;
        both2 = false;
        await slowType("The enemy switched to " + enemyPokemon[0].name + "!", 1);
        await sleep(500);
        decConfusion();
        if (playerPokemon[0].fly || playerPokemon[0].dig || playerPokemon[0].solar || playerPokemon[0].bounce) {
            await attack();
            return;
        }
        await slowType("What will " + playerPokemon[0].name + " do?", 1);
        typing = false;
        switching = false;
        checkHovered();
    } else {
        document.getElementById("enemyPokemonImage").hidden = false;
        await slowType("The enemy switched to " + enemyPokemon[0].name + "!", 1);
        await sleep(500);
        switching = false;
    }
});

document.getElementById("mute").onclick = function() {
    if (this.src.endsWith("images/mute.png")) {
        this.src = "images/volume.png";
        localStorage.setItem("mute", "unmuted");
        if (!document.getElementById("battleStage").hidden && enemyLives > 0 && playerLives > 0) {
            sound.muted = false;
            sound.play();
        }
        if (!document.getElementById("battleStage").hidden && enemyLives == 0) {
            sound2.muted = false;
            sound2.play();
        }
        if (!document.getElementById("battleStage").hidden && playerLives == 0) {
            sound3.muted = false;
            sound3.play();
        }
    } else {
        sound.muted = true;
        sound2.muted = true;
        sound3.muted = true;
        hitSound.muted = true;
        superSound.muted = true;
        notSound.muted = true;
        attackSound.muted = true;
        statusSound.muted = true;
        boostSound.muted = true;
        fallSound.muted = true;
        cry.muted = true;
        this.src = "images/mute.png";
        localStorage.setItem("mute", "muted");
    }
}


function checkHovered() {
    for (let i = 0; i < 4; i++) {
        if (document.querySelector("#move" + (i + 1) + ":hover") != null && document.getElementById("move" + (i + 1)).style.background != "" && !pick && !isMobile()) {
            document.getElementById("move" + (i + 1)).style.background = rainbowGradient;
            document.getElementById("moveHover").hidden = false;
            let move = playerPokemon[0].moves[i];
            document.getElementById("moveHoverName").innerHTML = move.move;
            document.getElementById("moveHoverType").src = "images/types/" + move.type + ".png";
            document.getElementById("moveHoverDamage").innerHTML = "Damage: " + move.damage;
            document.getElementById("moveHoverAccuracy").innerHTML = move.accuracy + "% Accuracy";
            if (move.mode == "p") {
                document.getElementById("moveHoverMode").innerHTML = "physical";
            } else if (move.mode == "s"){
                document.getElementById("moveHoverMode").innerHTML = "special";
            } else {
                document.getElementById("moveHoverMode").innerHTML = "boost";
            }
            document.getElementById("moveHoverExtra").innerHTML = "";
            if (recoil.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Does 33% in recoil</li>";
            }
            if (nerf.includes(move.move)) {
                if (move.move == "closecombat") {
                    document.getElementById("moveHoverExtra").innerHTML += "<li>Reduces Attack</li><li>Reduces Special Attack</li>";
                } else {
                    document.getElementById("moveHoverExtra").innerHTML += "<li>Reduces Special Attack</li>";
                }
            }
            if (move.move == "swordsdance") {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Increases Attack</li>";
            }
            if (move.move == "nastyplot") {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Increases Special Attack</li>";
            }
            if (move.move == "dragondance") {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Increases Speed</li><li>Increases Attack</li>";
            }
            if (burn.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>15% chance to burn</li>";
            }
            if (frozen.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>10% chance to freeze</li>";
            }
            if (paralyzed.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>20% chance to paralyze</li>";
            }
            if (poisoned.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>15% chance to poison</li>";
            }
            if (flinch.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>20% chance to flinch</li>";
            }
            if (confused.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>15% chance to confuse</li>";
            }
            if (critical.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>25% chance of critical hit</li>";
            }
            if (speedDrop.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Lowers opponents speed</li>";
            }
            if (restore.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Restores 50% of damage</li>";
            }
            if (canHitFly.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Hits airborn pokemon</li>";
            }
            if (canHitDig.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Hits underground pokemon</li>";
            }
            if (twoTurn.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Takes 2 turns</li>";
            }
            if (recharge.includes(move.move)) {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Must recharge if no KO</li>";
            }
            if (move.move == "facade") {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Double power if statused</li>";
            }
            if (move.move == "brine") {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Double power if enemy HP below half</li>";
            }
            if (move.move == "outrage" || move.move == "petaldance") {
                document.getElementById("moveHoverExtra").innerHTML += "<li>Move goes for 2-3 turns</li><li>Causes confusion after done</li>";
            }
            break;
        }
    }

    for (let i = 0; i < 6; i++) {
        if (document.querySelector("#mp" + (i + 1) + ":hover") != null && !isMobile()) {
            plookup = playerPokemon[i];
            for (let i = 1; i < 6; i++) {
                if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0) {
                    document.getElementById("mp" + (i + 1)).style.background = rainbowGradient;
                    break;
                }
            }
        }
    }
}

for (let i = 0; i < 6; i++) {
    document.getElementById("name" + (i + 1)).onchange = async function() {
        document.getElementById("pokeImage" + (i + 1)).src = "images/pokemon/" + this.value + ".png";
        let types = await getInfo(this.value);
        customTeam[i][0] = types[3];
        if (formulateSquadrine()) {
            document.getElementById("check").hidden = false;
        }
        document.getElementById("build" + (i + 1) + "t1").src = "images/types/" + types[0] + ".png";
        document.getElementById("build" + (i + 1) + "t1").hidden = false;
        if (types[1] != "none") {
            document.getElementById("build" + (i + 1) + "t2").src = "images/types/" + types[1] + ".png";
            document.getElementById("build" + (i + 1) + "t2").hidden = false;
        } else {
            document.getElementById("build" + (i + 1) + "t2").hidden = true;
        }
        document.getElementById("build" + (i + 1) + "Move1").hidden = false;
        let am = types[2];
        for (let j = 0; j < am.length; j++) {
            document.getElementById("build" + (i + 1) + "Move1").innerHTML += "<option>" + am[j] + "</option>";
        }
        $("#build" + (i + 1) + "Move1").html($("#build" + (i + 1) + "Move1 option").sort(function (a, b) {
            return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
        }))
    }
}

function getInfo(pok) {
    for (let i = 0; i < pokemon.length; i++) {
        if (pokemon[i][0] == pok) {
            return [pokemon[i][1], pokemon[i][2], pokemon[i][9], i];
        }
    }
}

function formulateSquadrine() {
    custom = [];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            custom.push(customTeam[i][j]);
        }
    }
    return !custom.includes(-1);
}

document.getElementById("menuImg").onclick = async function() {
    this.hidden = true;
    document.getElementById("wins").innerHTML = "Wins Against AI: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + localStorage.pokemonWins;
    document.getElementById("losses").innerHTML = "Losses Against AI: &nbsp&nbsp" + localStorage.pokemonLosses;
    document.getElementById("winLoss").hidden = false;
    document.getElementById("pyro").hidden = true;
    document.getElementById("battleStage").hidden = true;
    document.getElementById("playerCur").style.display = "flex";
    document.getElementById("enemyCur").style.display = "flex";
    document.getElementById("start").hidden = false;
    document.getElementById("build").hidden = false;
    document.getElementById("playerText").hidden = false;
    document.getElementById("enemyText").hidden = false;
    document.getElementById("vs").style.animation = "";
    document.getElementById("vs").hidden = false;
    document.getElementById("battleStage").style.backgroundImage = background;
    pick = false
    intro = true;
    typing = true;
    both = false;
    both2 = false;
    switching = false;
    switchedLastTurn = false;
    document.getElementById("pokeballs").innerHTML = "<img class='pokeball' src='images/pokeball.png'><img class='pokeball' src='images/pokeball.png'><img class='pokeball' src='images/pokeball.png'><img class='pokeball' src='images/pokeball.png'><img class='pokeball' src='images/pokeball.png'><img class='pokeball' src='images/pokeball.png'>";
    document.getElementById("pokeballs2").innerHTML = "<img class='pokeball2' src='images/pokeball.png'><img class='pokeball2' src='images/pokeball.png'><img class='pokeball2' src='images/pokeball.png'><img class='pokeball2' src='images/pokeball.png'><img class='pokeball2' src='images/pokeball.png'><img class='pokeball2' src='images/pokeball.png'>";
    playerPokemon = [];
    enemyPokemon = [];
    sound.currentTime = 0;
    sound.pause();
    sound2.currentTime = 0;
    sound2.pause();
    sound3.currentTime = 0;
    sound3.pause();
    document.getElementById("playerPokemonImage").style.animation = "";
    document.getElementById("enemyPokemonImage").style.animation = "";
    ogpp = [];
    ogep = [];
    document.getElementById("vs").style.animation = "";
    document.getElementById("pimg").style.animation = "";
    document.getElementById("eimg").style.animation = "";
    document.getElementById("pimg").hidden = true;
    document.getElementById("eimg").hidden = true;
    document.getElementById("pimg").src = "";
    document.getElementById("eimg").src = "";
    document.getElementById("pimg").style.filter = "";
    document.getElementById("eimg").style.filter = "";
    document.getElementById("pimg").hidden = false;
    document.getElementById("eimg").hidden = false;
    document.getElementById("playerPokemonImage").hidden = true;
    document.getElementById("enemyPokemonImage").hidden = true;
    playerLives = 6;
    enemyLives = 6;
    document.getElementById("mp1").style.filter = "";
    document.getElementById("mp2").style.filter = "";
    document.getElementById("mp3").style.filter = "";
    document.getElementById("mp4").style.filter = "";
    document.getElementById("mp5").style.filter = "";
    document.getElementById("mp6").style.filter = "";
    start();
}

document.getElementById("playerStatus").onanimationend = function() {
    this.src = "";
    this.hidden = true;
}
document.getElementById("enemyStatus").onanimationend = function() {
    this.src = "";
    this.hidden = true;
}
document.getElementById("playerConfused").onanimationend = function() {
    this.hidden = true;
}
document.getElementById("enemyConfused").onanimationend = function() {
    this.hidden = true;
}

