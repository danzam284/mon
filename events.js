var rainbowGradient = "linear-gradient(45deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%)";
document.getElementById("move1").onmouseover = function() {
    if (!typing && !pick) {
        this.style.background = rainbowGradient;
    }
}
document.getElementById("move1").onmouseleave = function() {
    if (!pick && this.style.background != "") {
        this.style.background = getColor(playerPokemon[0].moves[0].type);
    }
}
document.getElementById("move2").onmouseover = function() {
    if (!typing && !pick) {
        this.style.background = rainbowGradient;
    }
}
document.getElementById("move2").onmouseleave = function() {
    if (!pick && this.style.background != "") {
        this.style.background = getColor(playerPokemon[0].moves[1].type);
    }
}
document.getElementById("move3").onmouseover = function() {
    if (!typing && !pick) {
        this.style.background = rainbowGradient;
    }
}
document.getElementById("move3").onmouseleave = function() {
    if (!pick && this.style.background != "") {
        this.style.background = getColor(playerPokemon[0].moves[2].type);
    }
}
document.getElementById("move4").onmouseover = function() {
    if (!typing && !pick) {
        this.style.background = rainbowGradient;
    }
}
document.getElementById("move4").onmouseleave = function() {
    if (!pick && this.style.background != "") {
        this.style.background = getColor(playerPokemon[0].moves[3].type);
    }
}

document.getElementById("move1").onclick = function() {
    if (!typing && !pick) {
        this.style.background = getColor(playerPokemon[0].moves[0].type);
        attack(playerPokemon[0].moves[0]);
    }
}
document.getElementById("move2").onclick = function() {
    if (!typing && !pick) {
        this.style.background = getColor(playerPokemon[0].moves[1].type);
        attack(playerPokemon[0].moves[1]);
    }
}
document.getElementById("move3").onclick = function() {
    if (!typing && !pick) {
        this.style.background = getColor(playerPokemon[0].moves[2].type);
        attack(playerPokemon[0].moves[2]);
    }
}
document.getElementById("move4").onclick = function() {
    if (!typing && !pick) {
        this.style.background = getColor(playerPokemon[0].moves[3].type);
        attack(playerPokemon[0].moves[3]);
    }
}

var typing = false;

async function slowType(s, i) {
    if (i <= s.length) {
        typing = true;
        var dest = document.getElementById("textPortion");
        dest.innerHTML = s.substring(0, i);
        await sleep(20).then(async () => {
            await slowType(s, i + 1);
        });
    }
}



function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

document.getElementById("playerPokemon").onmouseenter = function() {
    if (playerPokemon.length == 0) {
        return;
    }
    document.getElementById("hover").hidden = false;
    document.getElementById("hoverName").innerHTML = playerPokemon[0].name + "'s stats";
    document.getElementById("hoverHP").innerHTML = "HP: " + playerPokemon[0].hp;
    document.getElementById("hoverAttack").innerHTML = "Attack: " + playerPokemon[0].attack;
    document.getElementById("hoverDefense").innerHTML = "Defense: " + playerPokemon[0].defense;
    document.getElementById("hoverSpecialAttack").innerHTML = "Special Attack: " + playerPokemon[0].specialattack;
    document.getElementById("hoverSpecialDefense").innerHTML = "Special Defense: " + playerPokemon[0].specialdefense;
    document.getElementById("hoverSpeed").innerHTML = "Speed: " + playerPokemon[0].speed;
    pFound = playerPokemon[0];
    if (pFound.t2 == "none") {
        document.getElementById("hoverName").style.backgroundImage = getColor(pFound.t1);
    } else {
        cd1 = getColorDepth(pFound.t1);
        cd2 = getColorDepth(pFound.t2);
        document.getElementById("hoverName").style.backgroundImage = "linear-gradient(to left, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
    }
}

document.getElementById("playerPokemon").onmouseleave = function() {
    document.getElementById("hover").hidden = true;
}

document.getElementById("enemyPokemon").onmouseenter = function() {
    if (enemyPokemon.length == 0) {
        return;
    }
    document.getElementById("hover").hidden = false;
    document.getElementById("hoverName").innerHTML = enemyPokemon[0].name + "'s stats";
    document.getElementById("hoverHP").innerHTML = "HP: " + enemyPokemon[0].hp;
    document.getElementById("hoverAttack").innerHTML = "Attack: " + enemyPokemon[0].attack;
    document.getElementById("hoverDefense").innerHTML = "Defense: " + enemyPokemon[0].defense;
    document.getElementById("hoverSpecialAttack").innerHTML = "Special Attack: " + enemyPokemon[0].specialattack;
    document.getElementById("hoverSpecialDefense").innerHTML = "Special Defense: " + enemyPokemon[0].specialdefense;
    document.getElementById("hoverSpeed").innerHTML = "Speed: " + enemyPokemon[0].speed;
    pFound = enemyPokemon[0];
    if (pFound.t2 == "none") {
        document.getElementById("hoverName").style.backgroundImage = getColor(pFound.t1);
    } else {
        cd1 = getColorDepth(pFound.t1);
        cd2 = getColorDepth(pFound.t2);
        document.getElementById("hoverName").style.backgroundImage = "linear-gradient(to left, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
    }
}

document.getElementById("enemyPokemon").onmouseleave = function() {
    document.getElementById("hover").hidden = true;
}

document.getElementById("mp1").onmouseenter = function() {
    plookup = ogpp[0];
    if (document.getElementById("mp1").src != "") {
        document.getElementById("info").style.display = "flex";
        document.getElementById("info").hidden = false;
        for (let i = 0; i < 6; i++) {
            if (playerPokemon[i].name == plookup) {
                p = playerPokemon[i];
                document.getElementById("infoName").innerHTML = p.name;
                document.getElementById("infoHP").innerHTML = p.hp + "/" + p.maxhp;
                if (p.t2 == "none") {
                    document.getElementById("infoName").style.backgroundImage = getColor(p.t1);
                } else {
                    cd1 = getColorDepth(p.t1);
                    cd2 = getColorDepth(p.t2);
                    document.getElementById("infoName").style.backgroundImage = "linear-gradient(to left, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
                }
                per = p.hp / p.maxhp * 100;
                if (per > 50) {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
                } else if (per > 15) {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
                } else {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
                }
                for (let j = 0; j < 4; j++) {
                    document.getElementById("infoMove" + (j + 1)).innerHTML = p.moves[j].move;
                    document.getElementById("infoMove" + (j + 1)).style.background = getColor(p.moves[j].type);
                }
                break;
            }
        }
    }
    for (let i = 1; i < 6; i++) {
        if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0 && !typing) {
            this.style.background = rainbowGradient;
            break;
        }
    }
}
document.getElementById("mp1").onmouseleave = function() {
    this.style.background = "linear-gradient(45deg, white, black)";
    document.getElementById("info").style.display = "none";
    document.getElementById("info").hidden = true;
}
document.getElementById("mp2").onmouseenter = function() {
    plookup = ogpp[1];
    if (document.getElementById("mp1").src != "") {
        document.getElementById("info").style.display = "flex";
        document.getElementById("info").hidden = false;
        for (let i = 0; i < 6; i++) {
            if (playerPokemon[i].name == plookup) {
                p = playerPokemon[i];
                document.getElementById("infoName").innerHTML = p.name;
                document.getElementById("infoHP").innerHTML = p.hp + "/" + p.maxhp;
                if (p.t2 == "none") {
                    document.getElementById("infoName").style.backgroundImage = getColor(p.t1);
                } else {
                    cd1 = getColorDepth(p.t1);
                    cd2 = getColorDepth(p.t2);
                    document.getElementById("infoName").style.backgroundImage = "linear-gradient(to left, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
                }
                per = p.hp / p.maxhp * 100;
                if (per > 50) {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
                } else if (per > 15) {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
                } else {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
                }
                for (let j = 0; j < 4; j++) {
                    document.getElementById("infoMove" + (j + 1)).innerHTML = p.moves[j].move;
                    document.getElementById("infoMove" + (j + 1)).style.background = getColor(p.moves[j].type);
                }
                break;
            }
        }
    }
    for (let i = 1; i < 6; i++) {
        if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0 && !typing) {
            this.style.background = rainbowGradient;
            break;
        }
    }
}
document.getElementById("mp2").onmouseleave = function() {
    this.style.background = "linear-gradient(45deg, white, black)";
    document.getElementById("info").style.display = "none";
    document.getElementById("info").hidden = true;
}
document.getElementById("mp3").onmouseenter = function() {
    plookup = ogpp[2];
    if (document.getElementById("mp1").src != "") {
        document.getElementById("info").style.display = "flex";
        document.getElementById("info").hidden = false;
        for (let i = 0; i < 6; i++) {
            if (playerPokemon[i].name == plookup) {
                p = playerPokemon[i];
                document.getElementById("infoName").innerHTML = p.name;
                document.getElementById("infoHP").innerHTML = p.hp + "/" + p.maxhp;
                if (p.t2 == "none") {
                    document.getElementById("infoName").style.backgroundImage = getColor(p.t1);
                } else {
                    cd1 = getColorDepth(p.t1);
                    cd2 = getColorDepth(p.t2);
                    document.getElementById("infoName").style.backgroundImage = "linear-gradient(to left, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
                }
                per = p.hp / p.maxhp * 100;
                if (per > 50) {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
                } else if (per > 15) {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
                } else {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
                }
                for (let j = 0; j < 4; j++) {
                    document.getElementById("infoMove" + (j + 1)).innerHTML = p.moves[j].move;
                    document.getElementById("infoMove" + (j + 1)).style.background = getColor(p.moves[j].type);
                }
                break;
            }
        }
    }
    for (let i = 1; i < 6; i++) {
        if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0 && !typing) {
            this.style.background = rainbowGradient;
            break;
        }
    }
}
document.getElementById("mp3").onmouseleave = function() {
    this.style.background = "linear-gradient(45deg, white, black)";
    document.getElementById("info").style.display = "none";
    document.getElementById("info").hidden = true;
}
document.getElementById("mp4").onmouseenter = function() {
    plookup = ogpp[3];
    if (document.getElementById("mp1").src != "") {
        document.getElementById("info").style.display = "flex";
        document.getElementById("info").hidden = false;
        for (let i = 0; i < 6; i++) {
            if (playerPokemon[i].name == plookup) {
                p = playerPokemon[i];
                document.getElementById("infoName").innerHTML = p.name;
                document.getElementById("infoHP").innerHTML = p.hp + "/" + p.maxhp;
                if (p.t2 == "none") {
                    document.getElementById("infoName").style.backgroundImage = getColor(p.t1);
                } else {
                    cd1 = getColorDepth(p.t1);
                    cd2 = getColorDepth(p.t2);
                    document.getElementById("infoName").style.backgroundImage = "linear-gradient(to left, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
                }
                per = p.hp / p.maxhp * 100;
                if (per > 50) {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
                } else if (per > 15) {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
                } else {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
                }
                for (let j = 0; j < 4; j++) {
                    document.getElementById("infoMove" + (j + 1)).innerHTML = p.moves[j].move;
                    document.getElementById("infoMove" + (j + 1)).style.background = getColor(p.moves[j].type);
                }
                break;
            }
        }
    }
    for (let i = 1; i < 6; i++) {
        if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0 && !typing) {
            this.style.background = rainbowGradient;
            break;
        }
    }
}
document.getElementById("mp4").onmouseleave = function() {
    this.style.background = "linear-gradient(45deg, white, black)";
    document.getElementById("info").style.display = "none";
    document.getElementById("info").hidden = true;
}
document.getElementById("mp5").onmouseenter = function() {
    plookup = ogpp[4];
    if (document.getElementById("mp1").src != "") {
        document.getElementById("info").style.display = "flex";
        document.getElementById("info").hidden = false;
        for (let i = 0; i < 6; i++) {
            if (playerPokemon[i].name == plookup) {
                p = playerPokemon[i];
                document.getElementById("infoName").innerHTML = p.name;
                document.getElementById("infoHP").innerHTML = p.hp + "/" + p.maxhp;
                if (p.t2 == "none") {
                    document.getElementById("infoName").style.backgroundImage = getColor(p.t1);
                } else {
                    cd1 = getColorDepth(p.t1);
                    cd2 = getColorDepth(p.t2);
                    document.getElementById("infoName").style.backgroundImage = "linear-gradient(to left, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
                }
                per = p.hp / p.maxhp * 100;
                if (per > 50) {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
                } else if (per > 15) {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
                } else {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
                }
                for (let j = 0; j < 4; j++) {
                    document.getElementById("infoMove" + (j + 1)).innerHTML = p.moves[j].move;
                    document.getElementById("infoMove" + (j + 1)).style.background = getColor(p.moves[j].type);
                }
                break;
            }
        }
    }
    for (let i = 1; i < 6; i++) {
        if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0 && !typing) {
            this.style.background = rainbowGradient;
            break;
        }
    }
}
document.getElementById("mp5").onmouseleave = function() {
    this.style.background = "linear-gradient(45deg, white, black)";
    document.getElementById("info").style.display = "none";
    document.getElementById("info").hidden = true;
}
document.getElementById("mp6").onmouseenter = function() {
    plookup = ogpp[5];
    if (document.getElementById("mp1").src != "") {
        document.getElementById("info").style.display = "flex";
        document.getElementById("info").hidden = false;
        for (let i = 0; i < 6; i++) {
            if (playerPokemon[i].name == plookup) {
                p = playerPokemon[i];
                document.getElementById("infoName").innerHTML = p.name;
                document.getElementById("infoHP").innerHTML = p.hp + "/" + p.maxhp;
                if (p.t2 == "none") {
                    document.getElementById("infoName").style.backgroundImage = getColor(p.t1);
                } else {
                    cd1 = getColorDepth(p.t1);
                    cd2 = getColorDepth(p.t2);
                    document.getElementById("infoName").style.backgroundImage = "linear-gradient(to left, " + cd1[0] + ", 25%, " + cd1[1] + ", 50%, " + cd2[0] + ", " + cd2[0] + ", 50%, " + cd2[1] + ")";
                }
                per = p.hp / p.maxhp * 100;
                if (per > 50) {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
                } else if (per > 15) {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
                } else {
                    document.getElementById("infoBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
                }
                for (let j = 0; j < 4; j++) {
                    document.getElementById("infoMove" + (j + 1)).innerHTML = p.moves[j].move;
                    document.getElementById("infoMove" + (j + 1)).style.background = getColor(p.moves[j].type);
                }
                break;
            }
        }
    }
    for (let i = 1; i < 6; i++) {
        if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0 && !typing) {
            this.style.background = rainbowGradient;
            break;
        }
    }
}
document.getElementById("mp6").onmouseleave = function() {
    this.style.background = "linear-gradient(45deg, white, black)";
    document.getElementById("info").style.display = "none";
    document.getElementById("info").hidden = true;
}

document.getElementById("mp1").onclick = function() {
    if (!typing) {
        plookup = ogpp[0];
        for (let i = 1; i < 6; i++) {
            if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0) {
                this.style.background = "linear-gradient(45deg, white, black)";
                playerSwitch(i);
            }
        }
    }
}
document.getElementById("mp2").onclick = function() {
    if (!typing) {
        plookup = ogpp[1];
        for (let i = 1; i < 6; i++) {
            if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0) {
                this.style.background = "linear-gradient(45deg, white, black)";
                playerSwitch(i);
            }
        }
    }
}
document.getElementById("mp3").onclick = function() {
    if (!typing) {
        plookup = ogpp[2];
        for (let i = 1; i < 6; i++) {
            if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0) {
                this.style.background = "linear-gradient(45deg, white, black)";
                playerSwitch(i);
            }
        }
    }
}
document.getElementById("mp4").onclick = function() {
    if (!typing) {
        plookup = ogpp[3];
        for (let i = 1; i < 6; i++) {
            if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0) {
                this.style.background = "linear-gradient(45deg, white, black)";
                playerSwitch(i);
            }
        }
    }
}
document.getElementById("mp5").onclick = function() {
    if (!typing) {
        plookup = ogpp[4];
        for (let i = 1; i < 6; i++) {
            if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0) {
                this.style.background = "linear-gradient(45deg, white, black)";
                playerSwitch(i);
            }
        }
    }
}
document.getElementById("mp6").onclick = function() {
    if (!typing) {
        plookup = ogpp[5];
        for (let i = 1; i < 6; i++) {
            if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0) {
                this.style.background = "linear-gradient(45deg, white, black)";
                playerSwitch(i);
            }
        }
    }
}

document.getElementById("playerBall").addEventListener("animationend", function() {
    document.getElementById("playerBall").hidden = true;
    document.getElementById("playerExplosion").hidden = false;
    document.getElementById("playerPokemonImage").hidden = false;
    populateMoves();
});

document.getElementById("enemyBall").addEventListener("animationend", function() {
    document.getElementById("enemyBall").hidden = true;
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
        await sleep(500);
        await slowType("Pick a move...", 1);
        pick = false;
        typing = false;
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
        await slowType("Pick a move...", 1);
        typing = false;
        checkHovered();
    } else {
        document.getElementById("playerPokemonImage").hidden = false;
        await slowType("You switched to " + playerPokemon[0].name + "!", 1);
        await sleep(500);
    }
});

document.getElementById("enemyExplosion").addEventListener("animationend", async function() {
    document.getElementById("enemyExplosion").hidden = true;
    if (intro) {
        await slowType("The enemy sent out " + enemyPokemon[0].name, 1);
        await sleep(500);
        await slowType("Pick a move...", 1);
        typing = false;
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
        await slowType("Pick a move...", 1);
        typing = false;
        checkHovered();
    } else {
        document.getElementById("enemyPokemonImage").hidden = false;
        await slowType("The enemy switched to " + enemyPokemon[0].name + "!", 1);
        await sleep(500);
    }
});

document.getElementById("mute").onclick = function() {
    if (this.src.endsWith("images/mute.png")) {
        sound.muted = false;
        this.src = "images/volume.png";
    } else {
        sound.muted = true;
        this.src = "images/mute.png";
    }
}

document.getElementById("rock").addEventListener("animationend", async function() {
    await sleep(490);
    document.getElementById("rock").hidden = true;
});
document.getElementById("n1").addEventListener("animationend", async function() {
    document.getElementById("n1").hidden = true;
    document.getElementById("n2").hidden = true;
    document.getElementById("n3").hidden = true;
});
document.getElementById("en1").addEventListener("animationend", async function() {
    document.getElementById("en1").hidden = true;
    document.getElementById("en2").hidden = true;
    document.getElementById("en3").hidden = true;
});
document.getElementById("steel").addEventListener("animationend", async function() {
    document.getElementById("steel").hidden = true;
});
document.getElementById("esteel").addEventListener("animationend", async function() {
    document.getElementById("esteel").hidden = true;
});
document.getElementById("fighting").addEventListener("animationend", async function() {
    document.getElementById("fighting").hidden = true;
});
document.getElementById("efighting").addEventListener("animationend", async function() {
    document.getElementById("efighting").hidden = true;
});
document.getElementById("grass").addEventListener("animationend", async function() {
    document.getElementById("grass").hidden = true;
});
document.getElementById("egrass").addEventListener("animationend", async function() {
    document.getElementById("egrass").hidden = true;
});
document.getElementById("dragon1").addEventListener("animationend", async function() {
    document.getElementById("dragon1").hidden = true;
});
document.getElementById("dragon2").addEventListener("animationend", async function() {
    document.getElementById("dragon2").hidden = true;
});
document.getElementById("dragon3").addEventListener("animationend", async function() {
    document.getElementById("dragon3").hidden = true;
});
document.getElementById("edragon1").addEventListener("animationend", async function() {
    document.getElementById("edragon1").hidden = true;
});
document.getElementById("edragon2").addEventListener("animationend", async function() {
    document.getElementById("edragon2").hidden = true;
});
document.getElementById("edragon3").addEventListener("animationend", async function() {
    document.getElementById("edragon3").hidden = true;
});
document.getElementById("dark").addEventListener("animationend", async function() {
    document.getElementById("dark").hidden = true;
});
document.getElementById("edark").addEventListener("animationend", async function() {
    document.getElementById("edark").hidden = true;
});
document.getElementById("psychic").addEventListener("animationend", async function() {
    document.getElementById("psychic").hidden = true;
});
document.getElementById("epsychic").addEventListener("animationend", async function() {
    document.getElementById("epsychic").hidden = true;
});
document.getElementById("ground").addEventListener("animationend", async function() {
    document.getElementById("ground").hidden = true;
});
document.getElementById("eground").addEventListener("animationend", async function() {
    document.getElementById("eground").hidden = true;
});
document.getElementById("fire1").addEventListener("animationend", async function() {
    document.getElementById("fire1").hidden = true;
    document.getElementById("fire2").hidden = true;
    document.getElementById("fire3").hidden = true;
    document.getElementById("fire4").hidden = true;
});
document.getElementById("efire1").addEventListener("animationend", async function() {
    document.getElementById("efire1").hidden = true;
    document.getElementById("efire2").hidden = true;
    document.getElementById("efire3").hidden = true;
    document.getElementById("efire4").hidden = true;
});
document.getElementById("flying").addEventListener("animationend", async function() {
    document.getElementById("flying").hidden = true;
});
document.getElementById("eflying").addEventListener("animationend", async function() {
    document.getElementById("eflying").hidden = true;
});
document.getElementById("water").addEventListener("animationend", async function() {
    await sleep(700);
    document.getElementById("water").hidden = true;
});
document.getElementById("ewater").addEventListener("animationend", async function() {
    await sleep(700);
    document.getElementById("ewater").hidden = true;
});
document.getElementById("electric").addEventListener("animationend", async function() {
    document.getElementById("electric").hidden = true;
    document.getElementById("flash").hidden = true;
});
document.getElementById("eelectric").addEventListener("animationend", async function() {
    document.getElementById("eelectric").hidden = true;
    document.getElementById("flash").hidden = true;
});
document.getElementById("epoison1").addEventListener("animationend", async function() {
    document.getElementById("epoison1").hidden = true;
    document.getElementById("epoison2").hidden = true;
});
document.getElementById("poison1").addEventListener("animationend", async function() {
    document.getElementById("poison1").hidden = true;
    document.getElementById("poison2").hidden = true;
});
document.getElementById("ice").addEventListener("animationend", async function() {
    document.getElementById("ice").hidden = true;
});
document.getElementById("eice").addEventListener("animationend", async function() {
    document.getElementById("eice").hidden = true;
});
document.getElementById("bug").addEventListener("animationend", async function() {
    document.getElementById("bug").hidden = true;
});
document.getElementById("ebug").addEventListener("animationend", async function() {
    document.getElementById("ebug").hidden = true;
});
document.getElementById("ghost").addEventListener("animationend", async function() {
    document.getElementById("ghost").hidden = true;
});
document.getElementById("eghost").addEventListener("animationend", async function() {
    document.getElementById("eghost").hidden = true;
});

function checkHovered() {
    for (let i = 0; i < 4; i++) {
        if (document.querySelector("#move" + (i + 1) + ":hover") != null && document.getElementById("move" + (i + 1)).style.background != "" && !pick) {
            document.getElementById("move" + (i + 1)).style.background = rainbowGradient;
            break;
        }
    }

    for (let i = 0; i < 6; i++) {
        if (document.querySelector("#mp" + (i + 1) + ":hover") != null) {
            plookup = ogpp[i];
            for (let i = 1; i < 6; i++) {
                if (playerPokemon[i].name == plookup && playerPokemon[i].hp > 0) {
                    document.getElementById("mp" + (i + 1)).style.background = rainbowGradient;
                    break;
                }
            }
        }
    }
}
