var strong = {"normal": ["fighting"], "fire": ["water", "ground", "rock"], "water": ["grass", "electric"], "grass": ["fire", "ice", "poison", "bug", "flying"], "electric": ["ground"], "ice": ["rock", "steel", "fire", "fighting"], "fighting": ["flying", "psychic"], "poison": ["ground", "psychic"], "ground": ["water", "grass", "ice"], "flying": ["ice", "electric", "rock"], "psychic": ["bug", "dark", "ghost"], "bug": ["rock", "fire", "flying"], "rock": ["fighting", "water", "grass", "steel", "ground"], "ghost": ["ghost", "dark"], "dragon": ["ice", "dragon"], "dark": ["fighting", "bug"], "steel": ["fighting", "fire", "ground"]}
var weak = {"normal": [], "fire": ["fire", "grass", "ice", "bug", "steel"], "water": ["water", "fire", "ice", "steel"], "grass": ["grass", "water", "electric", "ground"], "electric": ["electric", "flying", "ground", "steel"], "ice": ["ice"], "fighting": ["bug", "rock", "dark"], "poison": ["poison", "grass", "fighting", "bug"], "ground": ["rock", "poison", "bug"], "flying": ["grass", "bug", "fighting"], "psychic": ["psychic", "fighting"], "bug": ["grass", "fighting", "ground"], "rock": ["normal", "fire", "poison", "flying"], "ghost": ["poison", "bug"], "dragon": ["fire", "water", "grass", "electric"], "dark": ["ghost", "dark"], "steel": ["rock", "normal", "flying", "steel", "grass", "ice", "psychic", "bug", "dragon"]}
var immune = {"normal": ["ghost"], "ground": ["electric"], "flying": ["ground"], "ghost": ["normal", "fighting"], "dark": ["psychic"], "steel": ["poison"]}
var switchedLastTurn = false;
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

function calculateDamage(power, mode, critical, PA, SA, PD, SD, STAB, type1, type2, random, burn) {
    if (burn) {
        power /= 2;
    }
    level = 100;
    a = 0;
    d = 0;
    if (mode == "p") {
        a = PA;
        d = PD;
    } else {
        a = SA;
        d = SD;
    }
    if (critical == 1.5 && type1 * type2 < 1 && type1 * type2 > 0) {
        type1 = 1;
        type2 = 1;
    }
    return (((((2 * level / 5) + 2) * power * a / d) / 50) + 2) * critical * random * STAB * type1 * type2;
}

async function playerAttack(p, m) {
    if (p.recharge) {
        p.recharge = false;
        await slowType(p.name + " must recharge.", 1);
        return false;
    }

    if (p.status == 2) {
        if (Math.random() < 0.5) {
            statusSound = new Audio("paralyzed.mp3");
            document.getElementById("playerStatus").src = "images/paralyzed.gif";
            document.getElementById("playerStatus").hidden = false;
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            await slowType(p.name + " is paralyzed. It can't move.", 1);
            lastMove = "";
            await sleep(500);
            return false;
        }
    }
    if (p.status == 3) {
        if (Math.random() < 0.2) {
            document.getElementById("playerPokemonInfo").removeChild(document.getElementById("playerPokemonInfo").childNodes[5]);
            await slowType(p.name + " thawed out.", 1);
            p.status = 0;
        } else {
            document.getElementById("playerStatus").src = "images/frozen.gif";
            document.getElementById("playerStatus").hidden = false;
            statusSound = new Audio("frozen.mp3");
            lastMove = "";
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            await slowType(p.name + " is frozen.", 1);
            await sleep(500);
            return false;
        }
        await sleep(500);
    }
    if (p.confused > 0) {
        if (p.confused == 1) {
            p.confused = 0;
            await slowType(p.name + " snapped out of confuson.", 1);
            await sleep(500);
        } else {
            document.getElementById("playerConfused").hidden = false;
            statusSound = new Audio("confused.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            await slowType(p.name + " is confused...", 1);
            await sleep(500);
            if (Math.random() < 0.5) {
                let confusionDamage = Math.floor(calculateDamage(40, "p", 1, enemyPokemon[0].attack, 0, p.defense, 0, 1, 1, 1, 1, false));
                let temp = p.hp;
                await slowType(p.name + " hurt itself in its confusion.", 1);
                if (localStorage.mute == "unmuted") {
                    hitSound.play();
                }
                while (p.hp != temp - confusionDamage && p.hp != 0) {
                    p.hp--;
                    per = p.hp / p.maxhp * 100;
                    if (per > 50) {
                        document.getElementById("playerBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
                    } else if (per > 15) {
                        document.getElementById("playerBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
                    } else {
                        document.getElementById("playerBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
                    }
                    document.getElementById("playerRatio").innerHTML = p.hp + "/" + p.maxhp;
                    await sleep(10);
                }
                await sleep(100);
                if (p.hp == 0) {
                    await playerDead();
                    return true;
                }
                return false;
            }
        }
    }
    e = enemyPokemon[0];
    stab = 1;
    if (p.fly) {
        m = moveMap["fly"];
    }
    if (p.dig) {
        m = moveMap["dig"];
    }
    if (p.bounce) {
        m = moveMap["bounce"];
    }
    if (p.solar) {
        m = moveMap["solarbeam"];
    }
    if (p.outrage) {
        m = moveMap["outrage"];
    }
    if (p.petal) {
        m = moveMap["petaldance"];
    }
    if (twoTurn.includes(m.move) && !p.fly && !p.bounce && !p.dig && !p.solar) {
        if (m.move == "fly") {
            p.fly = true;
            await slowType(p.name + " flew up into the air.", 1);
            document.getElementById("playerPokemonImage").style.opacity = 0.5;
            document.getElementById("playerPokemonImage").style.bottom = "50%";
            await sleep(500);
            return false;
        }
        if (m.move == "bounce") {
            p.bounce = true;
            await slowType(p.name + " sprang up into the air.", 1);
            document.getElementById("playerPokemonImage").style.opacity = 0.5;
            document.getElementById("playerPokemonImage").style.bottom = "50%";
            await sleep(500);
            return false;
        }
        if (m.move == "dig") {
            p.dig = true;
            await slowType(p.name + " burrowed underground.", 1);
            document.getElementById("playerPokemonImage").style.opacity = 0.5;
            document.getElementById("playerPokemonImage").style.bottom = "-50%";
            await sleep(500);
            return false;
        }
        if (m.move == "solarbeam") {
            p.solar = true;
            await slowType(p.name + " charged up energy.", 1);
            document.getElementById("playerPokemonImage").style.opacity = 0.5;
            await sleep(500);
            return false;
        }
    }
    p.fly = false;
    p.bounce = false;
    p.dig = false;
    p.solar = false;
    document.getElementById("playerPokemonImage").style.opacity = 1;
    document.getElementById("playerPokemonImage").style.bottom = "0";

    if (m.mode == "o") {
        document.getElementById("playerPokemonImage").style.background = rainbowGradient;
        document.getElementById("playerPokemonImage").style.padding = "30px";
        if (localStorage.mute == "unmuted") {
            boostSound.play();
        }
        await slowType(p.name + " used " + m.move + ".", 1);
        await sleep(500);
        document.getElementById("playerPokemonImage").style.background = "";
        document.getElementById("playerPokemonImage").style.padding = "";
        if (m.move == "swordsdance") {
            lastMove = m.move;
            p.attackMul += 1;
            await slowType(p.name + "'s attack increased!", 1);
        } else if (m.move == "nastyplot") {
            lastMove = m.move;
            p.specialattackMul += 1;
            await slowType(p.name + "'s special attack increased!", 1);
        }
        else if (m.move == "dragondance") {
            lastMove = m.move;
            p.attackMul += 0.5;
            p.speedMul += 0.5;
            await slowType(p.name + "'s attack increased!", 1);
            await sleep(500);
            await slowType(p.name + "'s speed increased!", 1);
        }
        await sleep(500);
        return false;
    }

    if (m.type == p.t1 || m.type == p.t2) {
        stab = 1.5;
    }
    crit = 1;
    let r = 0.05;
    if (critical.includes(m.move)) {
        r = 0.25;
    }
    if (Math.random() < r) {
        crit = 1.5;
    }
    t1 = move_mult(m.type, e.t1);
    t2 = move_mult(m.type, e.t2);
    ran = ((Math.random() * 30 + 225) / 255);
    await slowType(p.name + " used " + m.move + ".", 1);
    if (Math.random() * 100 > m.accuracy || (enemyPokemon[0].fly && !canHitFly.includes(m.move)) || (enemyPokemon[0].bounce && !canHitFly.includes(m.move)) || (enemyPokemon[0].dig && !canHitDig.includes(m.move))) {
        await sleep(400);
        await slowType("The attack missed!", 1);
        lastMove = "";
    } else {
        if (t1 * t2 == 0) {
            await sleep(400);
            await slowType("It has no effect.", 1);
            lastMove = "";
            return false;
        }
        attackSound = new Audio("moves/" + m.move + ".mp3");
        if (localStorage.mute == "unmuted") {
            attackSound.play();
        }
        lastMove = m.move;
        await moveAnimations(true, m.type);
        let double = false;
        if (m.move == "facade" && p.status) {
            m.damage *= 2;
            double = true;
        }
        if (m.move == "brine" && e.hp < (e.maxhp / 2)) {
            m.damage *= 2;
            double = true;
        }
        let erup = false;
        if (m.move == "eruption") {
            m.damage *= (p.hp / p.maxhp);
            erup = true;
        }
        let dmg = Math.floor(calculateDamage(m.damage, m.mode, crit, p.attack * p.attackMul, p.specialattack * p.specialattackMul, e.defense, e.specialdefense, stab, t1, t2, ran, (p.status == 1 && m.move != "facade")));
        if (double) {
            double = false;
            m.damage /= 2;
        }
        if (erup) {
            erup = false;
            m.damage = 150;
        }
        let temp = e.hp;
        if (t1 * t2 < 1 && localStorage.mute == "unmuted") {
            notSound.play();
        } else if (t1 * t2 > 1 && localStorage.mute == "unmuted") {
            superSound.play();
        } else if (t1 * t2 == 1 && localStorage.mute == "unmuted") {
            hitSound.play();
        }
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
            await sleep(10);
        }

        if (t1 * t2 == 0) {
            await sleep(400);
            await slowType("It has no effect.", 1);
            await sleep(400);
        } else if (t1 * t2 < 1) {
            await sleep(400);
            await slowType("It's Not very effective.", 1);
            await sleep(400);
        } else if (t1 * t2 > 1) {
            await sleep(400);
            await slowType("It's Super Effective!", 1);
            await sleep(400);
        }

        if (crit == 1.5) {
            await sleep(400);
            await slowType("A critical hit!", 1);
            await sleep(400);
        }

        if (restore.includes(m.move) && p.hp < p.maxhp) {
            let gain = Math.floor(Math.min(dmg, temp) / 2);
            let restTemp = p.hp;
            while (p.hp != restTemp + gain && p.hp != p.maxhp) {
                p.hp++;
                per = p.hp / p.maxhp * 100;
                if (per > 50) {
                    document.getElementById("playerBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
                } else if (per > 15) {
                    document.getElementById("playerBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
                } else {
                    document.getElementById("playerBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
                }
                document.getElementById("playerRatio").innerHTML = p.hp + "/" + p.maxhp;
                await sleep(10);
            }
            await slowType(p.name + " regained some HP.", 1);
        }

        if (recoil.includes(m.move)) {
            let recoilDamage = Math.floor(Math.min(dmg, temp) / 3);
            let p = playerPokemon[0];
            temp = p.hp;
            if (localStorage.mute == "unmuted") {
                hitSound.play();
            }
            while (p.hp != temp - recoilDamage && p.hp != 0) {
                p.hp--;
                per = p.hp / p.maxhp * 100;
                if (per > 50) {
                    document.getElementById("playerBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
                } else if (per > 15) {
                    document.getElementById("playerBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
                } else {
                    document.getElementById("playerBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
                }
                document.getElementById("playerRatio").innerHTML = p.hp + "/" + p.maxhp;
                await sleep(10);
            }
            await slowType(p.name + " is hurt by recoil.", 1);
        }

        if (nerf.includes(m.move)) {
            if (localStorage.mute == "unmuted") {
                fallSound.play();
            }
            document.getElementById("playerPokemonImage").style.background = "linear-gradient(45deg, black, white)";
            document.getElementById("playerPokemonImage").style.padding = "30px";
            await sleep(500);
            if (m.move == "closecombat") {
                p.attackMul *= 0.75;
                p.specialattackMul *= 0.75;
                await slowType(p.name + "'s attack fell.", 1);
                await sleep(500);
                await slowType(p.name + "'s special attack fell.", 1);
            } else {
                p.specialattackMul *= 0.5;
                await slowType(p.name + "'s special attack fell.", 1);
            }
            await sleep(500);
            document.getElementById("playerPokemonImage").style.background = "";
            document.getElementById("playerPokemonImage").style.padding = "";
        }
        if (speedDrop.includes(m.move) && e.hp > 0) {
            if (localStorage.mute == "unmuted") {
                fallSound.play();
            }
            document.getElementById("enemyPokemonImage").style.background = "linear-gradient(45deg, black, white)";
            document.getElementById("enemyPokemonImage").style.padding = "30px";
            e.speedMul *= 0.75;
            await sleep(500);
            await slowType(e.name + "'s speed fell.", 1);
            await sleep(500);
            document.getElementById("enemyPokemonImage").style.background = "";
            document.getElementById("enemyPokemonImage").style.padding = "";
        }

        if (burn.includes(m.move) && e.hp > 0 && Math.random() < 0.15 && !e.status && e.t1 != "fire" && e.t2 != "fire") {
            document.getElementById("enemyStatus").src = "images/burned.gif";
            document.getElementById("enemyStatus").hidden = false;
            statusSound = new Audio("burned.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            e.status = 1;
            let img = document.createElement("img");
            img.src = "images/status/burn.png";
            img.className = "status";
            document.getElementById("enemyPokemonInfo").appendChild(img);
            await slowType(e.name + " was burned.", 1);
        }
        if (paralyzed.includes(m.move) && e.hp > 0 && Math.random() < 0.2 && !e.status && e.t1 != "electric" && e.t2 != "electric") {
            document.getElementById("enemyStatus").src = "images/paralyzed.gif";
            document.getElementById("enemyStatus").hidden = false;
            statusSound = new Audio("paralyzed.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            e.status = 2;
            let img = document.createElement("img");
            e.speedMul = 0.5;
            img.src = "images/status/paralyzed.png";
            img.className = "status";
            document.getElementById("enemyPokemonInfo").appendChild(img);
            await slowType(e.name + " was paralyzed.", 1);
        }
        if (frozen.includes(m.move) && e.hp > 0 && Math.random() < 0.1 && !e.status && e.t1 != "ice" && e.t2 != "ice") {
            document.getElementById("enemyStatus").src = "images/frozen.gif";
            document.getElementById("enemyStatus").hidden = false;
            statusSound = new Audio("frozen.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            e.status = 3;
            let img = document.createElement("img");
            img.src = "images/status/frozen.png";
            img.className = "status";
            document.getElementById("enemyPokemonInfo").appendChild(img);
            await slowType(e.name + " was frozen.", 1);
        }
        if (poisoned.includes(m.move) && e.hp > 0 && Math.random() < 0.15 && !e.status && e.t1 != "poison" && e.t2 != "poison") {
            document.getElementById("enemyStatus").src = "images/poisoned.gif";
            document.getElementById("enemyStatus").hidden = false;
            statusSound = new Audio("poisoned.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            e.status = 4;
            let img = document.createElement("img");
            img.src = "images/status/poison.png";
            img.className = "status";
            document.getElementById("enemyPokemonInfo").appendChild(img);
            await slowType(e.name + " was poisoned.", 1);
        }
        if (confused.includes(m.move) && e.hp > 0 && Math.random() < 0.15 && e.confused == 0) {
            statusSound = new Audio("confused.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            e.confused = Math.floor((Math.random() * 4)) + 3;
            document.getElementById("enemyConfused").hidden = false;
            await slowType(e.name + " became confused.", 1);
            await sleep(500);
        }
        if (recharge.includes(m.move) && p.hp > 0 && e.hp > 0) {
            playerPokemon[0].recharge = true;
        }

        if (m.move == "outrage" && p.hp > 0) {
            if (p.outrage == 0) {
                p.outrage = Math.floor(Math.random() * 2) + 2;
            } else {
                p.outrage--;
            }
        }
        if (m.move == "petaldance" && p.hp > 0) {
            if (p.petal == 0) {
                p.petal = Math.floor(Math.random() * 2) + 2;
            } else {
                p.petal--;
            }
        }

        if ((p.outrage == 1 || p.petal == 1) && !p.confused) {
            p.outrage = 0;
            p.petal = 0;
            statusSound = new Audio("confused.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            document.getElementById("playerConfused").hidden = false;
            p.confused = Math.floor((Math.random() * 4)) + 3;
            await slowType(p.name + " became confused due to fatigue.", 1);
            await sleep(500);
        }

        if (e.hp == 0 && p.hp == 0) {
            await enemyDead();
            await sleep(1000);
            await playerDead();
            return true;
        }
        if (e.hp == 0) {
            await enemyDead();
            return true;
        }
        if (p.hp == 0) {
            await playerDead();
            return true;
        }
        return false;
    }
}

async function statusDamage(player, id, type) {
    let dmg = Math.floor(player.maxhp / 10);
    let temp = player.hp;
    while (player.hp != temp - dmg && player.hp != 0) {
        player.hp--;
        per = player.hp / player.maxhp * 100;
        if (per > 50) {
            document.getElementById(id + "Bar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
        } else if (per > 15) {
            document.getElementById(id + "Bar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
        } else {
            document.getElementById(id + "Bar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
        }
        document.getElementById(id + "Ratio").innerHTML = player.hp + "/" + player.maxhp;
        await sleep(10);
    }
    await slowType(player.name + " is hurt by " + type + ".", 1);
    if (player.hp == 0) {
        if (id == "player") {
            await playerDead();
        } else {
            await enemyDead();
        }
        return false;
    }
    await sleep(500);
    return true;
}

var p;
var m;
async function attack(m) {
    let p = playerPokemon[0];
    let e = enemyPokemon[0];

    bestOption = await getBestEnemyOption();
    if (bestOption != 0) {
        document.getElementById("enemyBall").hidden = false;
        document.getElementById("enemyPokemonImage").hidden = true;
        await enemySwitch(bestOption);
        await sleep(3000);
        if (!await playerAttack(p, m)) {
            let e = enemyPokemon[0];
            await sleep(400);
            if (e.status == 1) {
                statusSound = new Audio("burned.mp3");
                if (localStorage.mute == "unmuted") {
                    statusSound.play();
                }
                document.getElementById("enemyStatus").src = "images/burned.gif";
                document.getElementById("enemyStatus").hidden = false;
                if (!await statusDamage(e, "enemy", "burn")) {
                    return;
                }
            }
            if (e.status == 4) {
                statusSound = new Audio("poisoned.mp3");
                if (localStorage.mute == "unmuted") {
                    statusSound.play();
                }
                document.getElementById("enemyStatus").src = "images/poisoned.gif";
                document.getElementById("enemyStatus").hidden = false;
                if (!await statusDamage(e, "enemy", "poison")) {
                    return;
                }
            }
            if (p.status == 1) {
                statusSound = new Audio("burned.mp3");
                if (localStorage.mute == "unmuted") {
                    statusSound.play();
                }
                document.getElementById("playerStatus").src = "images/burned.gif";
                document.getElementById("playerStatus").hidden = false;
                if (!await statusDamage(p, "player", "burn")) {
                    return;
                }
            }
            if (p.status == 4) {
                statusSound = new Audio("poisoned.mp3");
                if (localStorage.mute == "unmuted") {
                    statusSound.play();
                }
                document.getElementById("playerStatus").src = "images/poisoned.gif";
                document.getElementById("playerStatus").hidden = false;
                if (!await statusDamage(p, "player", "poison")) {
                    return;
                }
            }
            decConfusion();
            if (playerPokemon[0].fly || playerPokemon[0].dig || playerPokemon[0].solar || playerPokemon[0].bounce || playerPokemon[0].recharge || playerPokemon[0].outrage || playerPokemon[0].petal) {
                await attack();
                return;
            }
            await slowType("What will " + playerPokemon[0].name + " do?", 1);
        }
    } else {
        let picked = "";
        if (p.speed * p.speedMul == e.speed * e.speedMul) {
            if (Math.random() > 0.5) {
                picked = "player";
            } else {
                picked = "enemy";
            }
        }
        if (picked == "player" || p.speed * p.speedMul > e.speed * e.speedMul) {
            if (!await playerAttack(p, m)) {
                await sleep(500);
                if (flinch.includes(lastMove) && Math.random() < 0.2) {
                    await slowType(enemyPokemon[0].name + " flinched.", 1);
                    await sleep(400);
                    decConfusion();
                    if (playerPokemon[0].fly || playerPokemon[0].dig || playerPokemon[0].solar || playerPokemon[0].bounce || playerPokemon[0].recharge) {
                        await attack();
                        return;
                    }
                    await slowType("What will " + playerPokemon[0].name + " do?", 1);
                    if (e.hp > 0 && p.hp > 0) {
                        checkHovered();
                    }
                    typing = false;
                    return;
                }
                await enemyAttack();
            }
        } else {
            if (!await enemyAttack()) {
                await sleep(500);
                if (flinch.includes(lastMove) && Math.random() < 0.2) {
                    await slowType(playerPokemon[0].name + " flinched.", 1);
                    await sleep(400);
                    decConfusion();
                    await slowType("What will " + playerPokemon[0].name + " do?", 1);
                    if (e.hp > 0 && p.hp > 0) {
                        checkHovered();
                    }
                    typing = false;
                    return;
                }
                await playerAttack(p, m);
            }
        }
        if (e.hp > 0 && p.hp > 0) {
            await sleep(400);
            if (e.status == 1) {
                statusSound = new Audio("burned.mp3");
                if (localStorage.mute == "unmuted") {
                    statusSound.play();
                }
                document.getElementById("enemyStatus").src = "images/burned.gif";
                document.getElementById("enemyStatus").hidden = false;
                if (!await statusDamage(e, "enemy", "burn")) {
                    return;
                }
            }
            if (e.status == 4) {
                statusSound = new Audio("poisoned.mp3");
                if (localStorage.mute == "unmuted") {
                    statusSound.play();
                }
                document.getElementById("enemyStatus").src = "images/poisoned.gif";
                document.getElementById("enemyStatus").hidden = false;
                if (!await statusDamage(e, "enemy", "poison")) {
                    return;
                }
            }
            if (p.status == 1) {
                statusSound = new Audio("burned.mp3");
                if (localStorage.mute == "unmuted") {
                    statusSound.play();
                }
                document.getElementById("playerStatus").src = "images/burned.gif";
                document.getElementById("playerStatus").hidden = false;
                if (!await statusDamage(p, "player", "burn")) {
                    return;
                }
            }
            if (p.status == 4) {
                statusSound = new Audio("poisoned.mp3");
                if (localStorage.mute == "unmuted") {
                    statusSound.play();
                }
                document.getElementById("playerStatus").src = "images/poisoned.gif";
                document.getElementById("playerStatus").hidden = false;
                if (!await statusDamage(p, "player", "poison")) {
                    return;
                }
            }
            decConfusion();
            if (playerPokemon[0].fly || playerPokemon[0].dig || playerPokemon[0].solar || playerPokemon[0].bounce || playerPokemon[0].recharge || playerPokemon[0].outrage || playerPokemon[0].petal) {
                await attack();
                return;
            }
            await slowType("What will " + playerPokemon[0].name + " do?", 1);
        }
    }
    if (e.hp > 0 && p.hp > 0) {
        checkHovered();
    }
    typing = false;
}

function decConfusion() {
    if (playerPokemon[0].confused > 0) {
        playerPokemon[0].confused--;
    }
    if (enemyPokemon[0].confused > 0) {
        enemyPokemon[0].confused--;
    }
}

async function enemyDead() {
    enemyPokemon[0].recharge = false;
    await sleep(400);
    await slowType("The enemy " + enemyPokemon[0].name + " has fainted.", 1);
    if (localStorage.mute == "unmuted") {
        cry.src = "cries/" + enemyPokemon[0].name.toLowerCase() + ".ogg";
        cry.play();
    }
    document.getElementById("enemyPokemonImage").style.opacity = 1;
    document.getElementById("enemyPokemonImage").style.bottom = "0";
    document.getElementById("enemyPokemonImage").style.animation = "dead 1s ease forwards";
    await sleep(400);
    pokeballs2 = document.getElementById("pokeballs2").childNodes;
    for (let i = 0; i < pokeballs2.length; i++) {
        if (pokeballs2[i].src) {
            document.getElementById("pokeballs2").removeChild(pokeballs2[i]);
            break;
        }
    }
    if (--enemyLives == 0) {
        win();
        return;
    } 
    await sleep(500);
    newPokemon = await getBestEnemyOption();
    enemyPokemon[0].attackMul = 1;
    if (enemyPokemon[0].status == 2) {
        enemyPokemon[0].speedMul = 0.5;
    } else {
        enemyPokemon[0].speedMul = 1;
    }
    enemyPokemon[0].specialattackMul = 1;
    enemyPokemon[0].confused = 0;
    temp = enemyPokemon[0];
    enemyPokemon[0] = enemyPokemon[newPokemon];
    enemyPokemon[newPokemon] = temp;
    document.getElementById("enemyPokemonImage").hidden = true;
    document.getElementById("enemyBall").hidden = false;
    document.getElementById("enemyPokemonImage").style.animation = "";
    loadImage(2);
    intro = true;
    switchedLastTurn = true;
    switching = true;
}

async function playerDead() {
    p.recharge = false;
    await sleep(400);
    deadName = playerPokemon[0].name;
    await slowType(deadName + " has fainted.", 1);
    if (localStorage.mute == "unmuted") {
        cry.src = "cries/" + playerPokemon[0].name.toLowerCase() + ".ogg";
        cry.play();
    }
    document.getElementById("playerPokemonImage").style.opacity = 1;
    document.getElementById("playerPokemonImage").style.bottom = "0";
    document.getElementById("playerPokemonImage").style.animation = "dead 1s ease forwards";
    nullify();
    pokeballs = document.getElementById("pokeballs").childNodes;
    for (let i = 0; i < pokeballs.length; i++) {
        if (pokeballs[i].src) {
            document.getElementById("pokeballs").removeChild(pokeballs[i]);
            break;
        }
    }

    document.getElementById("mp1").style.filter = "grayscale(1)";
    document.getElementById("mp1").style.webkitFilter = "greyscale(1)";
    document.getElementById("mp1").style.backgroundImage = "linear-gradient(45deg, rgb(59, 59, 59), black)";

    if (--playerLives == 0) {
        lose();
        return;
    } 

    await sleep(500);
    await slowType("Pick a pokemon to switch into...", 1);
    typing = false;
    pick = true;
}

function hasCompatible(skip, move, moves) {
    if (enemyPokemon[0].specialattackMul != 1 || enemyPokemon[0].attackMul != 1) {
        return false;
    }
    let target;
    if (move == "nastyplot") {
        target = "s";
    } else {
        target = "p";
    }

    for (let i = 0; i < 4; i++) {
        if (i == skip) {
            continue;
        }
        if (moves[i].mode == target) {
            return true;
        }
    }
    return false;
}

function getBestEnemyMove() {
    let em = enemyPokemon[0].moves;
    if (!em || em.length === 0) {
        return 0; // Default to first move
    }
    let maxMove = 0;
    let maxDamage = 0;
    let tracker = [-999, -999, -999, -999];
    for (let i = 0; i < 4; i++) {
        if (playerPokemon[0].fly && canHitFly.includes(em[i].move)) {
            return i;
        }
        if (playerPokemon[0].dig && canHitDig.includes(em[i].move)) {
            return i;
        }
        let m1 = move_mult(em[i].type, playerPokemon[0].t1);
        let m2 = move_mult(em[i].type, playerPokemon[0].t2);
        let stab = 1;
        if (em[i].type == enemyPokemon[0].t1 || em[i].type == enemyPokemon[0].t2) {
            stab = 1.5;
        }
        let double = false;
        if (em[i].move == "facade" && enemyPokemon[0].status) {
            em[i].damage *= 2;
            double = true;
        }
        if (em[i].move == "brine" && playerPokemon[0].hp < (playerPokemon[0].maxhp / 2)) {
            em[i].damage *= 2;
            double = true;
        }
        let erup = false;
        if (em[i].move == "eruption") {
            em[i].damage *= (enemyPokemon[0].hp / enemyPokemon[0].maxhp);
            erup = true;
        }
        let dmg = calculateDamage(em[i].damage, em[i].mode, 1, enemyPokemon[0].attack * enemyPokemon[0].attackMul, enemyPokemon[0].specialattack * enemyPokemon[0].specialattackMul, playerPokemon[0].defense, playerPokemon[0].specialdefense, stab, m1, m2, (225/255), (enemyPokemon[0].status == 1 && em[i].move != "facade"));
        if (double) {
            double = false;
            em[i].damage /= 2;
        }
        if (erup) {
            erup = false;
            em[i].damage = 150;
        }
        if (dmg > playerPokemon[0].hp && em[i].accuracy == 100) {
            tracker[i] = 0;
            for (let j = 0; j < benefits.length; j++) {
                if (benefits[j].includes(em[i].move)) {
                    tracker[i] += benefits[j][benefits[j].length - 1];
                }
            }
        }
        if (dmg > maxDamage) {
            maxDamage = dmg;
            maxMove = i;
        }
    }
    if (!tracker.every(item => item == -999)) {
        let mm = -999;
        let mb = -1;
        for (let i = 0; i < 4; i++) {
            if (tracker[i] > mb) {
                mb = tracker[i];
                mm = i;
            }
        }
        return mm;
    }

    for (let i = 0; i < 4; i++) {
        let m1 = move_mult(em[i].type, playerPokemon[0].t1);
        let m2 = move_mult(em[i].type, playerPokemon[0].t2);
        if (em[i].mode == "o") {
            if (hasCompatible(i, em[i].move, em)) {
                if (em[i].move == "nastyplot" || em[i].move == "swordsdance") {
                    if ((enemyPokemon[0].speed > playerPokemon[0].speed * playerPokemon[0].speedMul || m1 * m2 >= 2) && m1 * m2 >= 1 && (enemyPokemon[0].hp / enemyPokemon[0].maxhp) >= 0.5) {
                        return i;
                    }
                } else {
                    if (enemyPokemon[0].speed * 1.5 > playerPokemon[0].speed * playerPokemon[0].speedMul && (enemyPokemon[0].hp / enemyPokemon[0].maxhp) >= 0.5) {
                        return i;
                    }
                }
            }
        }
    }
    return Math.max(0, Math.min(3, maxMove));
}

async function enemyAttack(preMove) {
    if (preMove == null) {
        maxMove = getBestEnemyMove();
    } else {
        maxMove = preMove;
    }
    e = enemyPokemon[0];

    if (maxMove < 0 || maxMove >= e.moves.length) {
        maxMove = 0;
    }
    
    if (e.recharge) {
        e.recharge = false;
        await slowType(e.name + " must recharge.", 1);
        return false;
    }
    m = e.moves[maxMove];
    if (e.status == 2) {
        if (Math.random() < 0.5) {
            document.getElementById("enemyStatus").src = "images/paralyzed.gif";
            document.getElementById("enemyStatus").hidden = false;
            statusSound = new Audio("paralyzed.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            await slowType(e.name + " is paralyzed. It can't move.", 1);
            lastMove = "";
            await sleep(500);
            return false;
        }
    }
    if (e.status == 3) {
        if (Math.random() < 0.2) {
            document.getElementById("enemyPokemonInfo").removeChild(document.getElementById("enemyPokemonInfo").childNodes[5]);
            await slowType(e.name + " thawed out.", 1);
            e.status = 0;
        } else {
            document.getElementById("enemyStatus").src = "images/frozen.gif";
            document.getElementById("enemyStatus").hidden = false;
            statusSound = new Audio("frozen.mp3");
            lastMove = "";
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            await slowType(e.name + " is frozen.", 1);
            await sleep(500);
            return false;
        }
        await sleep(500);
    }
    if (e.confused > 0) {
        if (e.confused == 1) {
            e.confused = 0;
            await slowType(e.name + " snapped out of confuson.", 1);
            await sleep(500);
        } else {
            document.getElementById("enemyConfused").hidden = false;
            statusSound = new Audio("confused.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            await slowType(e.name + " is confused...", 1);
            await sleep(500);
            if (Math.random() < 0.5) {
                let confusionDamage = Math.floor(calculateDamage(40, "p", 1, playerPokemon[0].attack, 0, e.defense, 0, 1, 1, 1, 1, false));
                let temp = e.hp;
                await slowType(e.name + " hurt itself in its confusion.", 1);
                if (localStorage.mute == "unmuted") {
                    hitSound.play();
                }
                while (e.hp != temp - confusionDamage && e.hp != 0) {
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
                    await sleep(10);
                }
                await sleep(100);
                if (e.hp == 0) {
                    await enemyDead();
                    return true;
                }
                return false;
            }
        }
    }

    if (e.fly) {
        m = moveMap["fly"];
    }
    if (e.bounce) {
        m = moveMap["bounce"];
    }
    if (e.dig) {
        m = moveMap["dig"];
    }
    if (e.solar) {
        m = moveMap["solarbeam"];
    }
    if (e.outrage) {
        m = moveMap["outrage"];
    }
    if (e.petal) {
        m = moveMap["petaldance"];
    }
    try {
        
        if (twoTurn.includes(m.move) && !e.fly && !e.bounce && !e.dig && !e.solar) {
            if (m.move == "fly") {
                e.fly = true;
                await slowType(e.name + " flew up into the air.", 1);
                document.getElementById("enemyPokemonImage").style.opacity = 0.5;
                document.getElementById("enemyPokemonImage").style.bottom = "50%";
                await sleep(500);
                return false;
            }
            if (m.move == "bounce") {
                e.bounce = true;
                await slowType(e.name + " sprang up into the air.", 1);
                document.getElementById("enemyPokemonImage").style.opacity = 0.5;
                document.getElementById("enemyPokemonImage").style.bottom = "50%";
                await sleep(500);
                return false;
            }
            if (m.move == "dig") {
                e.dig = true;
                await slowType(e.name + " burrowed underground.", 1);
                document.getElementById("enemyPokemonImage").style.opacity = 0.5;
                document.getElementById("enemyPokemonImage").style.bottom = "-50%";
                await sleep(500);
                return false;
            }
            if (m.move == "solarbeam") {
                e.solar = true;
                await slowType(e.name + " charged up energy.", 1);
                document.getElementById("enemyPokemonImage").style.opacity = 0.5;
                await sleep(500);
                return false;
            }
        }
    } catch(e) {
        
    }
    e.fly = false;
    e.bounce = false;
    e.dig = false;
    e.solar = false;
    document.getElementById("enemyPokemonImage").style.opacity = 1;
    document.getElementById("enemyPokemonImage").style.bottom = "0";

    if (m.mode == "o") {
        document.getElementById("enemyPokemonImage").style.background = rainbowGradient;
        document.getElementById("enemyPokemonImage").style.padding = "30px";
        if (localStorage.mute == "unmuted") {
            boostSound.play();
        }
        await slowType("The opponent's " + e.name + " used " + m.move + ".", 1);
        await sleep(500);
        document.getElementById("enemyPokemonImage").style.background = "";
        document.getElementById("enemyPokemonImage").style.padding = "";
        if (m.move == "swordsdance") {
            lastMove = m.move;
            e.attackMul += 1;
            await slowType("The opponent's " + e.name + "'s attack increased!", 1);
        } else if (m.move == "nastyplot") {
            lastMove = m.move;
            e.specialattackMul += 1;
            await slowType("The opponent's " + e.name + "'s special attack increased!", 1);
        }
        else if (m.move == "dragondance") {
            lastMove = m.move;
            e.attackMul += 0.5;
            e.speedMul += 0.5;
            await slowType("The opponent's " + e.name + "'s attack increased!", 1);
            await sleep(500);
            await slowType("The opponent's " + e.name + "'s speed increased!", 1);
        }
        await sleep(500);
        return false;
    }
    let pl = playerPokemon[0];
    stab = 1;
    if (m.type == enemyPokemon[0].t1 || m.type == enemyPokemon[0].t2) {
        stab = 1.5;
    }
    crit = 1;
    let r = 0.05;
    if (critical.includes(m.move)) {
        r = 0.25;
    }
    if (Math.random() < r) {
        crit = 1.5;
    }
    t1 = move_mult(m.type, pl.t1);
    t2 = move_mult(m.type, pl.t2);
    ran = ((Math.random() * 30 + 225) / 255);
    await slowType("The opponent's " + e.name + " used " + m.move + ".", 1);
    let double = false;
    if (m.move == "facade" && e.status) {
        m.damage *= 2;
        double = true;
    }
    if (m.move == "brine" && playerPokemon[0].hp < (playerPokemon[0].maxhp / 2)) {
        m.damage *= 2;
        double = true;
    }
    let erup = false;
    if (m.move == "eruption") {
        m.damage *= (enemyPokemon[0].hp / enemyPokemon[0].maxhp);
        erup = true;
    }
    let dmg = Math.floor(calculateDamage(m.damage, m.mode, crit, e.attack * e.attackMul, e.specialattack * e.specialattackMul, pl.defense, pl.specialdefense, stab, t1, t2, ran, (e.status == 1 && m.move != "facade")));
    if (double) {
        double = false;
        m.damage /= 2;
    }
    if (erup) {
        erup = false;
        m.damage = 150;
    }

    let temp = pl.hp;
    if (Math.random() * 100 > m.accuracy || (playerPokemon[0].fly && !canHitFly.includes(m.move)) || (playerPokemon[0].bounce && !canHitFly.includes(m.move)) || (playerPokemon[0].dig && !canHitDig.includes(m.move))) {
        lastMove = "";
        await sleep(400);
        await slowType("The attack missed!", 1);
    } else {
        if (t1 * t2 == 0) {
            lastMove = "";
            await sleep(400);
            await slowType("It has no effect.", 1);
            return false;
        }
        attackSound = new Audio("moves/" + m.move + ".mp3");
        if (localStorage.mute == "unmuted") {
            attackSound.play();
        }
        lastMove = m.move;
        await moveAnimations(false, m.type);
        if (t1 * t2 < 1 && localStorage.mute == "unmuted") {
            notSound.play();
        } else if (t1 * t2 > 1 && localStorage.mute == "unmuted") {
            superSound.play();
        } else if (t1 * t2 == 1 && localStorage.mute == "unmuted") {
            hitSound.play();
        }

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
            await sleep(10);
        }

        if (t1 * t2 == 0) {
            await sleep(400);
            await slowType("It has no effect.", 1);
            await sleep(400);
        } else if (t1 * t2 < 1) {
            await sleep(400);
            await slowType("It's Not very effective.", 1);
            await sleep(400);
        } else if (t1 * t2 > 1) {
            await sleep(400);
            await slowType("It's Super Effective!", 1);
            await sleep(400);
        }

        if (crit == 1.5) {
            await sleep(400);
            await slowType("A critical hit!", 1);
            await sleep(400);
        }

        if (recoil.includes(m.move)) {
            let recoilDamage = Math.floor(Math.min(dmg, temp) / 3);
            let e = enemyPokemon[0];
            temp = e.hp;
            if (localStorage.mute == "unmuted") {
                hitSound.play();
            }
            while (e.hp != temp - recoilDamage && e.hp != 0) {
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
                await sleep(10);
            }
            await slowType(e.name + " is hurt by recoil.", 1);
        }

        if (restore.includes(m.move) && e.hp < e.maxhp) {
            let gain = Math.floor(Math.min(dmg, temp) / 2);
            let restTemp = e.hp;
            while (e.hp != restTemp + gain && e.hp != e.maxhp) {
                e.hp++;
                per = e.hp / e.maxhp * 100;
                if (per > 50) {
                    document.getElementById("enemyBar").style.background = "linear-gradient(to right, rgb(17, 221, 7) " + per + "%, black " + per + "%)";
                } else if (per > 15) {
                    document.getElementById("enemyBar").style.background = "linear-gradient(to right, orange " + per + "%, black " + per + "%)";
                } else {
                    document.getElementById("enemyBar").style.background = "linear-gradient(to right, red " + per + "%, black " + per + "%)";
                }
                document.getElementById("enemyRatio").innerHTML = e.hp + "/" + e.maxhp;
                await sleep(10);
            }
            await slowType(e.name + " regained some HP.", 1);
        }

        if (nerf.includes(m.move)) {
            if (localStorage.mute == "unmuted") {
                fallSound.play();
            }
            document.getElementById("enemyPokemonImage").style.background = "linear-gradient(45deg, black, white)";
            document.getElementById("enemyPokemonImage").style.padding = "30px";
            await sleep(500);
            if (m.move == "closecombat") {
                e.attackMul *= 0.75;
                e.specialattackMul *= 0.75;
                await slowType(e.name + "'s attack fell.", 1);
                await sleep(500);
                await slowType(e.name + "'s special attack fell.", 1);
            } else {
                e.specialattackMul *= 0.5;
                await slowType(e.name + "'s special attack fell.", 1);
            }
            await sleep(500);
            document.getElementById("enemyPokemonImage").style.background = "";
            document.getElementById("enemyPokemonImage").style.padding = "";
        }
        let p = playerPokemon[0];
        if (speedDrop.includes(m.move) && p.hp > 0) {
            if (localStorage.mute == "unmuted") {
                fallSound.play();
            }
            document.getElementById("playerPokemonImage").style.background = "linear-gradient(45deg, black, white)";
            document.getElementById("playerPokemonImage").style.padding = "30px";
            p.speedMul *= 0.75;
            await sleep(500);
            await slowType(p.name + "'s speed fell.", 1);
            await sleep(500);
            document.getElementById("playerPokemonImage").style.background = "";
            document.getElementById("playerPokemonImage").style.padding = "";
        }
        if (burn.includes(m.move) && p.hp > 0 && Math.random() < 0.15 && !p.status && p.t1 != "fire" && p.t2 != "fire") {
            document.getElementById("playerStatus").src = "images/burned.gif";
            document.getElementById("playerStatus").hidden = false;
            statusSound = new Audio("burned.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            p.status = 1;
            let img = document.createElement("img");
            img.src = "images/status/burn.png";
            img.className = "status";
            document.getElementById("playerPokemonInfo").appendChild(img);
            await slowType(p.name + " was burned.", 1);
        }
        if (paralyzed.includes(m.move) && p.hp > 0 && Math.random() < 0.2 && !p.status && p.t1 != "electric" && p.t2 != "electric") {
            document.getElementById("playerStatus").src = "images/paralyzed.gif";
            document.getElementById("playerStatus").hidden = false;
            statusSound = new Audio("paralyzed.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            p.status = 2;
            let img = document.createElement("img");
            p.speedMul = 0.5;
            img.src = "images/status/paralyzed.png";
            img.className = "status";
            document.getElementById("playerPokemonInfo").appendChild(img);
            await slowType(p.name + " was paralyzed.", 1);
        }
        if (frozen.includes(m.move) && p.hp > 0 && Math.random() < 0.1 && !p.status && p.t1 != "ice" && p.t2 != "ice") {
            document.getElementById("playerStatus").src = "images/frozen.gif";
            document.getElementById("playerStatus").hidden = false;
            statusSound = new Audio("frozen.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            p.status = 3;
            let img = document.createElement("img");
            img.src = "images/status/frozen.png";
            img.className = "status";
            document.getElementById("playerPokemonInfo").appendChild(img);
            await slowType(p.name + " was frozen.", 1);
        }
        if (poisoned.includes(m.move) && p.hp > 0 && Math.random() < 0.15 && !p.status && p.t1 != "poison" && p.t2 != "poison") {
            document.getElementById("playerStatus").src = "images/poisoned.gif";
            document.getElementById("playerStatus").hidden = false;
            statusSound = new Audio("poisoned.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            p.status = 4;
            let img = document.createElement("img");
            img.src = "images/status/poison.png";
            img.className = "status";
            document.getElementById("playerPokemonInfo").appendChild(img);
            await slowType(p.name + " was poisoned.", 1);
        }
        if (confused.includes(m.move) && p.hp > 0 && Math.random() < 0.15 && p.confused == 0) {
            statusSound = new Audio("confused.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            document.getElementById("playerConfused").hidden = false;
            p.confused = Math.floor((Math.random() * 4)) + 3;
            await slowType(p.name + " became confused.", 1);
            await sleep(500);
        }
        if (recharge.includes(m.move) && p.hp > 0 && e.hp > 0) {
            enemyPokemon[0].recharge = true;
        }
        e = enemyPokemon[0];
        if (m.move == "outrage" && e.hp > 0) {
            if (e.outrage == 0) {
                e.outrage = Math.floor(Math.random() * 2) + 2;
            } else {
                e.outrage--;
            }
        }
        if (m.move == "petaldance" && e.hp > 0) {
            if (e.petal == 0) {
                e.petal = Math.floor(Math.random() * 2) + 2;
            } else {
                e.petal--;
            }
        }

        if ((e.outrage == 1 || e.petal == 1) && !e.confused) {
            e.outrage = 0;
            e.petal = 0;
            statusSound = new Audio("confused.mp3");
            if (localStorage.mute == "unmuted") {
                statusSound.play();
            }
            document.getElementById("enemyConfused").hidden = false;
            e.confused = Math.floor((Math.random() * 4)) + 3;
            await slowType(e.name + " became confused due to fatigue.", 1);
            await sleep(500);
        }
        if (e.hp == 0 && pl.hp == 0) {
            await enemyDead();
            await sleep(1000);
            await playerDead();
            return true;
        }
        if (e.hp == 0) {
            await enemyDead();
            return true;
        }
        if (pl.hp == 0) {
            await playerDead();
            return true;
        }
        return false;
    }
}

function getBestEnemyOption() {
    let pt1 = playerPokemon[0].t1;
    let pt2 = playerPokemon[0].t2;
    let ce = enemyPokemon[0];
    let pp = playerPokemon[0];

    if (ce.fly || ce.dig || ce.bounce || ce.solar) {
        return 0;
    }

    if (switchedLastTurn) {
        switchedLastTurn = false;
        return 0;
    }

    if (ce.hp > 0 && ce.speed * ce.speedMul > pp.speed * pp.speedMul) {
        for (let i = 0; i < 4; i++) {
            let m = ce.moves[i];
            let stab = 1;
            if (m.type == ce.t1 || m.type == ce.t2) {
                stab = 1.5;
            }
            let m1 = move_mult(m.type, pt1);
            let m2 = move_mult(m.type, pt2);
            let double = false;
            if (m.move == "facade" && ce.status) {
                m.damage *= 2;
                double = true;
            }
            if (m.move == "brine" && pp.hp < (pp.maxhp / 2)) {
                m.damage *= 2;
                double = true;
            }
            let erup = false;
            if (m.move == "eruption") {
                m.damage *= (ce.hp / ce.maxhp);
                erup = true;
            }
            if (Math.floor(calculateDamage(m.damage, m.mode, 1, ce.attack * ce.attackMul, ce.specialattack * ce.specialattackMul, pp.defense, pp.specialdefense, stab, m1, m2, (225/255), (ce.status == 1 && m.move != "facade"))) >= pp.hp) {
                if (double) {
                    double = false;
                    m.damage /= 2;
                }
                if (erup) {
                    erup = false;
                    m.damage = 150;
                }
                return 0;
            }
            if (double) {
                double = false;
                m.damage /= 2;
            }
            if (erup) {
                erup = false;
                m.damage = 150;
            }
        }
    }

    if (ce.hp > 0 && (ce.attackMul > 1 || ce.speedMul > 1 || ce.specialattackMul > 1)) {
        if (ce.speed * ce.speedMul > pp.speed * pp.speedMul || (move_mult(m.type, pt1) * move_mult(m.type, pt2) >= 1 && ce.hp >= (ce.maxhp / 2))) {
            return 0;
        }
    }

    if (ce.hp == 0) {
        for (let i = 1; i < 6; i++) {
            if (enemyPokemon[i].hp > 0 && enemyPokemon[i].speed > pp.speed) {
                for (let j = 0; j < 4; j++) {
                    let m = enemyPokemon[i].moves[j];
                    let stab = 1;
                    if (m.type == enemyPokemon[i].t1 || m.type == enemyPokemon[i].t2) {
                        stab = 1.5;
                    }
                    let m1 = move_mult(m.type, pt1);
                    let m2 = move_mult(m.type, pt2);
                    let double = false;
                    if (m.move == "facade" && ce.status) {
                        m.damage *= 2;
                        double = true;
                    }
                    if (m.move == "brine" && pp.hp < (pp.maxhp / 2)) {
                        m.damage *= 2;
                        double = true;
                    }
                    let erup = false;
                    if (m.move == "eruption") {
                        m.damage *= (enemyPokemon[0].hp / enemyPokemon[0].maxhp);
                        erup = true;
                    }
                    if (Math.floor(calculateDamage(m.damage, m.mode, 1, ce.attack * ce.attackMul, ce.specialattack * ce.specialattack, pp.defense, pp.specialdefense, stab, m1, m2, (225/255), (ce.status == 1 && m.move != "facade"))) >= pp.hp) {
                        if (double) {
                            double = false;
                            m.damage /= 2;
                        }
                        if (erup) {
                            erup = false;
                            m.damage = 150;
                        }
                        return i;
                    }
                    if (double) {
                        double = false;
                        m.damage /= 2;
                    }
                    if (erup) {
                        erup = false;
                        m.damage = 150;
                    }
                }
            }
        }
    }

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
    enemyPokemon[0].attackMul = 1;
    if (enemyPokemon[0].status == 2) {
        enemyPokemon[0].speedMul = 0.5;
    } else {
        enemyPokemon[0].speedMul = 1;
    }
    enemyPokemon[0].specialattackMul = 1;
    enemyPokemon[0].confused = 0;
    switching = true;
    temp = enemyPokemon[0];
    enemyPokemon[0] = enemyPokemon[n];
    enemyPokemon[n] = temp;
    loadImage(2);
    document.getElementById("enemyPokemonImage").style.animation = "";

}

async function playerSwitch(i) {
    switching = true;
    document.getElementById("playerPokemonImage").style.animation = "";
    playerPokemon[0].attackMul = 1;
    if (playerPokemon[0].status == 2) {
        playerPokemon[0].speedMul = 0.5;
    } else {
        playerPokemon[0].speedMul = 1;
    }
    playerPokemon[0].specialattackMul = 1;
    playerPokemon[0].confused = 0;
    if (pick) {
        document.getElementById("playerBall").hidden = false;
        temp = playerPokemon[i];
        playerPokemon[i] = playerPokemon[0];
        playerPokemon[0] = temp;
        loadImage(1);
        document.getElementById("playerPokemonImage").hidden = true;
    } else {
        let p = playerPokemon[0];
        let e = enemyPokemon[0];
        bestOption = await getBestEnemyOption();
        if (bestOption != 0) {
            both = true;
            enemyPokemon[0].attackMul = 1;
            if (enemyPokemon[0].status == 2) {
                enemyPokemon[0].speedMul = 0.5;
            } else {
                enemyPokemon[0].speedMul = 1;
            }
            enemyPokemon[0].specialattackMul = 1;
            enemyPokemon[0].confused = 0;
            if (p.speed * p.speedMul > e.speed * e.speedMul) {
                document.getElementById("playerBall").hidden = false;
                document.getElementById("playerPokemonImage").hidden = true;
                temp = playerPokemon[i];
                playerPokemon[i] = playerPokemon[0];
                playerPokemon[0] = temp;
                
                populateMoves();
                loadImage(1);
            } else {
                document.getElementById("enemyBall").hidden = false;
                document.getElementById("enemyPokemonImage").hidden = true;
                await enemySwitch(bestOption);
                await sleep(400);
                temp = playerPokemon[i];
                playerPokemon[i] = playerPokemon[0];
                playerPokemon[0] = temp;
                updateMP();
            }
        } else {
            em = enemyPokemon[0].moves;
            let maxMove = getBestEnemyMove();

            document.getElementById("playerBall").hidden = false;
            document.getElementById("playerPokemonImage").hidden = true;
            temp = playerPokemon[i];
            playerPokemon[i] = playerPokemon[0];
            playerPokemon[0] = temp;
            populateMoves();
            loadImage(1);
            await sleep(2500);
            if (!await enemyAttack(maxMove)) {
                await sleep(400);
                if (e.status == 1) {
                    document.getElementById("enemyStatus").src = "images/burned.gif";
                    document.getElementById("enemyStatus").hidden = false;
                    if (!await statusDamage(e, "enemy", "burn")) {
                        return;
                    }
                }
                if (e.status == 4) {
                    document.getElementById("enemyStatus").src = "images/poisoned.gif";
                    document.getElementById("enemyStatus").hidden = false;
                    if (!await statusDamage(e, "enemy", "poison")) {
                        return;
                    }
                }
                if (p.status == 1) {
                    document.getElementById("playerStatus").src = "images/burned.gif";
                    document.getElementById("playerStatus").hidden = false;
                    if (!await statusDamage(p, "player", "burn")) {
                        return;
                    }
                }
                if (p.status == 4) {
                    document.getElementById("playerStatus").src = "images/poisoned.gif";
                    document.getElementById("playerStatus").hidden = false;
                    if (!await statusDamage(p, "player", "poison")) {
                        return;
                    }
                }
                decConfusion();
                if (playerPokemon[0].fly || playerPokemon[0].dig || playerPokemon[0].solar || playerPokemon[0].bounce || playerPokemon[0].recharge || playerPokemon[0].outrage || playerPokemon[0].petal) {
                    await attack();
                    return;
                }
                await slowType("What will " + playerPokemon[0].name + " do?", 1);
            }
            typing = false;
            checkHovered();
        }
    }
}
