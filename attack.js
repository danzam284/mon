var strong = {"normal": ["fighting"], "fire": ["water", "ground", "rock"], "water": ["grass", "electric"], "grass": ["fire", "ice", "poison", "bug", "flying"], "electric": ["ground"], "ice": ["rock", "steel", "fire", "fighting"], "fighting": ["flying", "psychic"], "poison": ["ground", "psychic"], "ground": ["water", "grass", "ice"], "flying": ["ice", "electric", "rock"], "psychic": ["bug", "dark", "ghost"], "bug": ["rock", "fire", "flying"], "rock": ["fighting", "water", "grass", "steel", "ground"], "ghost": ["ghost", "dark"], "dragon": ["ice", "dragon"], "dark": ["fighting", "bug"], "steel": ["fighting", "fire", "ground"]}
var weak = {"normal": [], "fire": ["fire", "grass", "ice", "bug", "steel"], "water": ["water", "fire", "ice", "steel"], "grass": ["grass", "water", "electric", "ground"], "electric": ["electric", "flying", "ground", "steel"], "ice": ["ice"], "fighting": ["bug", "rock", "dark"], "poison": ["poison", "grass", "fighting", "bug"], "ground": ["rock", "poison", "bug"], "flying": ["grass", "bug", "fighting"], "psychic": ["psychic", "fighting"], "bug": ["grass", "fighting", "ground"], "rock": ["normal", "fire", "poison", "flying"], "ghost": ["poison", "bug"], "dragon": ["fire", "water", "grass", "electric"], "dark": ["ghost", "dark"], "steel": ["rock", "normal", "flying", "steel", "grass", "ice", "psychic", "bug", "dragon"]}
var immune = {"normal": ["ghost"], "ground": ["electric"], "flying": ["ground"], "ghost": ["normal", "fighting"], "dark": ["psychic"], "steel": ["poison"]}

function move_mult(tmove, t) {
    mult = 1
    if (t != "none" && tmove != "none") {
        if (t in strong && strong[t].includes(tmove)) {
            mult *= 2;
        }
        else if (t in weak && weak[t].includes(tmove)) {
            mult /= 2;
        }
        else if (t in immune && immune[t].includes(tmove)) {
            mult = 0;
        }
    }
    return mult
}

function calculateDamage(m, power, mode, critical, PA, SA, PD, SD, STAB, type1, type2, random) {
    level = 100;
    a = 0;
    if (mode == "p") {
        a = PA;
        d = PD;
    } else {
        a = SA;
        d = SD;
    }
    return (((((2 * level / 5) + 2) * power * a / d) / 50) + 2) * critical * random * STAB * type1 * type2;
}

async function playerAttack(p, m) {
    e = enemyPokemon[0];
    stab = 1;
    if (m.type == p.t1 || m.type == p.t2) {
        stab = 1.5;
    }
    crit = 1;
    if (Math.random() < 0.02) {
        crit = 1.5;
    }
    t1 = move_mult(m.type, e.t1);
    t2 = move_mult(m.type, e.t2);
    ran = ((Math.random() * 30 + 225) / 255);
    await slowType(p.name + " used " + m.move + ".", 1);
    if (Math.random() * 100 > m.accuracy) {
        await sleep(400);
        await slowType("The attack missed!", 1);
        return;
    }
    moveAnimations(true, m.type);
    dmg = Math.floor(calculateDamage(m, m.damage, m.mode, crit, p.attack, p.specialattack, e.defense, e.specialdefense, stab, t1, t2, ran));
    temp = e.hp;
    while (e.hp != temp - dmg && e.hp != 0) {
        e.hp--;
        per = e.hp / e.maxhp * 100;
        if (per > 50) {
            document.getElementById("enemyBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
        } else if (per > 15) {
            document.getElementById("enemyBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
        } else {
            document.getElementById("enemyBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
        }
        document.getElementById("enemyRatio").innerHTML = e.hp + "/" + e.maxhp;
        await sleep(20);
    }

    if (t1 * t2 == 0) {
        await sleep(400);
        await slowType("It has no effect.", 1);
    } else if (t1 * t2 < 1) {
        await sleep(400);
        await slowType("It's Not very effective.", 1);
    } else if (t1 * t2 > 1) {
        await sleep(400);
        await slowType("It's Super Effective!", 1);
    }

    if (crit == 1.5) {
        await sleep(400);
        await slowType("A critical hit!", 1);
    }
}

var p;
var m;
async function attack(m) {
    p = playerPokemon[0];
    e = enemyPokemon[0];

    bestOption = getBestEnemyOption();
    if (bestOption != 0) {
        document.getElementById("enemyBall").hidden = false;
        document.getElementById("enemyPokemonImage").hidden = true;
        await enemySwitch(bestOption);
        await sleep(3000);
        await playerAttack(p, m);
        if (e.hp <= 0) {
            await enemyDead();
        } else {
            await sleep(400);
            await slowType("Pick a move...", 1);
        }
    } else {
        if (p.speed >= e.speed) {
            await playerAttack(p, m);
            if (e.hp > 0) {
                await sleep(500);
                await enemyAttack();
                if (p.hp <= 0) {
                    await playerDead();
                }
            } else {
                await enemyDead();
            }
        } else {
            await enemyAttack();
            if (p.hp > 0) {
                await sleep(400);
                await playerAttack(p, m);
                if (e.hp <= 0) {
                    await enemyDead();
                }
            } else {
                await playerDead();
            }
        }
        if (e.hp > 0 && p.hp > 0) {
            await sleep(400);
            await slowType("Pick a move...", 1);
        }
    }
    typing = false;
}

async function enemyDead() {
    await sleep(400);
    await slowType("The enemy " + enemyPokemon[0].name + " has fainted.", 1);
    document.getElementById("enemyPokemonImage").style.animation = "dead 1s ease forwards";
    await sleep(400);
    pokeballs = document.getElementById("pokeballs2").childNodes;
    for (let i = 0; i < pokeballs.length; i++) {
        if (pokeballs[i].src) {
            document.getElementById("pokeballs2").removeChild(pokeballs[i]);
            if (i == 6) {
                win();
                return;
            }
            break;
        }
    }
    await sleep(500);
    newPokemon = getBestEnemyOption();
    temp = enemyPokemon[0];
    enemyPokemon[0] = enemyPokemon[newPokemon];
    enemyPokemon[newPokemon] = temp;
    document.getElementById("enemyPokemonImage").hidden = true;
    document.getElementById("enemyBall").hidden = false;
    document.getElementById("enemyPokemonImage").style.animation = "";
    loadImage();
    intro = true;
}

async function playerDead() {
    await sleep(400);
    deadName = playerPokemon[0].name;
    await slowType(deadName + " has fainted.", 1);
    document.getElementById("playerPokemonImage").style.animation = "dead 1s ease forwards";
    nullify();
    pokeballs = document.getElementById("pokeballs").childNodes;
    for (let i = pokeballs.length - 1; i >= 0; i--) {
        if (pokeballs[i].src) {
            document.getElementById("pokeballs").removeChild(pokeballs[i]);
            if (i == 1) {
                lose();
                return;
            }
            break;
        }
    }

    for (let i = 0; i < ogpp.length; i++) {
        if (ogpp[i] == deadName) {
            document.getElementById("mp" + (i + 1)).style.filter = "grayscale(1)";
            document.getElementById("mp" + (i + 1)).style.webkitFilter = "greyscale(1)";
        }
    }
    await sleep(500);
    await slowType("Pick a pokemon to switch into...", 1);
    pick = true;
}

async function enemyAttack(preMove) {
    if (!preMove) {
        em = enemyPokemon[0].moves;
        maxMove = 0;
        maxDamage = 0;
        for (let i = 0; i < 4; i++) {
            stab = 1;
            if (em[i].type == p.t1 || em[i].type == p.t2) {
                stab = 1.5;
            }
            cm = em[i];
            m1 = move_mult(cm.type, playerPokemon[0].t1);
            m2 = move_mult(cm.type, playerPokemon[0].t2);
            a = 0;
            b = 0;
            if (cm.mode == "p") {
                a = enemyPokemon[0].attack;
                d = playerPokemon[0].defense;
            } else {
                a = enemyPokemon[0].specialattack;
                d = playerPokemon[0].specialdefense;
            }
            curDamage = cm.damage * stab * m1 * m2 * a / d;
            if (curDamage > maxDamage) {
                maxDamage = curDamage;
                maxMove = i;
            }
        }
    } else {
        maxMove = preMove;
    }
    e = enemyPokemon[0];
    m = em[maxMove];
    pl = playerPokemon[0];
    stab = 1;
    if (m.type == p.t1 || m.type == p.t2) {
        stab = 1.5;
    }
    crit = 1;
    if (Math.random() < 0.05) {
        crit = 1.5;
    }
    t1 = move_mult(m.type, pl.t1);
    t2 = move_mult(m.type, pl.t2);
    ran = ((Math.random() * 30 + 225) / 255);
    await slowType("The opponent's " + e.name + " used " + m.move + ".", 1);
    dmg = Math.floor(calculateDamage(m, m.damage, m.mode, crit, e.attack, e.specialattack, pl.defense, pl.specialdefense, stab, t1, t2, ran));
    temp = pl.hp;
    if (Math.random() * 100 > m.accuracy) {
        await sleep(400);
        await slowType("The attack missed!", 1);
        return;
    }
    
    moveAnimations(false, m.type);
    while (pl.hp != temp - dmg && pl.hp != 0) {
        pl.hp--;
        per = pl.hp / pl.maxhp * 100;
        if (per > 50) {
            document.getElementById("playerBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
        } else if (per > 15) {
            document.getElementById("playerBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
        } else {
            document.getElementById("playerBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
        }
        document.getElementById("playerRatio").innerHTML = pl.hp + "/" + pl.maxhp;
        await sleep(20);
    }

    if (t1 * t2 == 0) {
        await sleep(400);
        await slowType("It has no effect.", 1);
    } else if (t1 * t2 < 1) {
        await sleep(400);
        await slowType("It's Not very effective.", 1);
    } else if (t1 * t2 > 1) {
        await sleep(400);
        await slowType("It's Super Effective!", 1);
    }

    if (crit == 1.5) {
        await sleep(400);
        await slowType("A critical hit!", 1);
    }
}

function getBestEnemyOption() {
    pt1 = playerPokemon[0].t1;
    pt2 = playerPokemon[0].t2;
    ce = enemyPokemon[0];
    bestOption = 0;
    bestMult = 0;
    if (ce.hp > 0) {
        offense1 = move_mult(ce.t1, pt1) * move_mult(ce.t1, pt2) + move_mult(ce.t2, pt1) * move_mult(ce.t2, pt2)
        defense1 = move_mult(pt1, ce.t1) * move_mult(pt2, ce.t1) + move_mult(pt1, ce.t2) * move_mult(pt2, ce.t2);
        bestOption = 0;
        bestMult = offense1 / defense1;
        if (bestMult > 1) {
            return bestOption;
        }
    }
    
    for (let i = 1; i < enemyPokemon.length; i++) {
        ce = enemyPokemon[i];
        if (ce.hp > 0) {
            offense = move_mult(ce.t1, pt1) * move_mult(ce.t1, pt2) + move_mult(ce.t2, pt1) * move_mult(ce.t2, pt2);
            defense = move_mult(pt1, ce.t1) * move_mult(pt2, ce.t1) + move_mult(pt1, ce.t2) * move_mult(pt2, ce.t2);
            curMult = offense / defense;
            if (curMult > bestMult) {
                bestMult = curMult;
                bestOption = i;
            }
        }
    }
    return bestOption;
}

async function enemySwitch(n) {
    temp = enemyPokemon[0];
    enemyPokemon[0] = enemyPokemon[n];
    enemyPokemon[n] = temp;
    loadImage();
    document.getElementById("enemyPokemonImage").style.animation = "";

}

async function playerSwitch(i) {
    document.getElementById("playerPokemonImage").style.animation = "";
    if (pick) {
        document.getElementById("playerBall").hidden = false;
        temp = playerPokemon[i];
        playerPokemon[i] = playerPokemon[0];
        playerPokemon[0] = temp;
        loadImage();
        document.getElementById("playerPokemonImage").hidden = true;
    } else {
        p = playerPokemon[0];
        e = enemyPokemon[0];
        bestOption = getBestEnemyOption();
        if (bestOption != 0) {
            both = true;
            if (p.speed > e.speed) {
                document.getElementById("playerBall").hidden = false;
                document.getElementById("playerPokemonImage").hidden = true;
                temp = playerPokemon[i];
                playerPokemon[i] = playerPokemon[0];
                playerPokemon[0] = temp;
                populateMoves();
                loadImage();
            } else {
                document.getElementById("enemyBall").hidden = false;
                document.getElementById("enemyPokemonImage").hidden = true;
                await enemySwitch(bestOption);
                await sleep(400);
                temp = playerPokemon[i];
                playerPokemon[i] = playerPokemon[0];
                playerPokemon[0] = temp;
            }
        } else {
            em = enemyPokemon[0].moves;
            maxMove = 0;
            maxDamage = 0;
            for (let i = 0; i < 4; i++) {
                stab = 1;
                if (em[i].type == p.t1 || em[i].type == p.t2) {
                    stab = 1.5;
                }
                cm = em[i];
                m1 = move_mult(cm.type, playerPokemon[0].t1);
                m2 = move_mult(cm.type, playerPokemon[0].t2);
                a = 0;
                b = 0;
                if (cm.mode == "p") {
                    a = enemyPokemon[0].attack;
                    d = playerPokemon[0].defense;
                } else {
                    a = enemyPokemon[0].specialattack;
                    d = playerPokemon[0].specialdefense;
                }
                curDamage = cm.damage * stab * m1 * m2 * a / d;
                if (curDamage > maxDamage) {
                    maxDamage = curDamage;
                    maxMove = i;
                }
            }

            document.getElementById("playerBall").hidden = false;
            document.getElementById("playerPokemonImage").hidden = true;
            temp = playerPokemon[i];
            playerPokemon[i] = playerPokemon[0];
            playerPokemon[0] = temp;
            populateMoves();
            loadImage();
            await sleep(2500);

            await enemyAttack(maxMove);
            if (p.hp <= 0) {
                await playerDead();
            } else {
                await sleep(400);
                await slowType("Pick a move...", 1);
            }
            typing = false;
        }
    }
}