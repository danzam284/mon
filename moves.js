var s = "s";
var p = "p";

var moves = [
    ["swordsdance", 0, 100, "o", "normal"],
    ["nastyplot", 0, 100, "o", "dark"],
    ["dragondance", 0, 100, "o", "dragon"],
    ["acrobatics", 110, 100, p, "flying"],
    ["hurricane", 110, 70, s, "flying"],
    ["overheat", 130, 90, s, "fire"],
    ["facade", 70, 100, p, "normal"],
    ["scald", 80, 100, s, "water"],
    ["surf", 95, 100, s, "water"],
    ["waterfall", 90, 100, p, "water"],
    ["liquidation", 85, 100, p, "water"],
    ["waterpulse", 75, 100, s, "water"],
    ["aquatail", 90, 90, p, "water"],
    ["brine", 65, 100, s, "water"],
    ["hydropump", 125, 85, s, "water"],
    ["icebeam", 90, 100, s, "ice"],
    ["avalanche", 60, 100, p, "ice"],
    ["aurorabeam", 65, 100, s, "ice"],
    ["slash", 65, 100, p, "normal"],
    ["rocktomb", 55, 95, p, "rock"],
    ["faintattack", 60, 100, s, "dark"],
    ["blizzard", 125, 80, s, "ice"],
    ["iciclespear", 75, 100, p, "ice"],
    ["gunkshot", 130, 85, p, "poison"],
    ["icefang", 65, 95, p, "ice"],
    ["energyball", 90, 100, s, "grass"],
    ["petaldance", 120, 100, s, "grass"],
    ["leafblade", 90, 100, p, "grass"],
    ["leaftornado", 65, 95, s, "grass"],
    ["seedbomb", 80, 100, p, "grass"],
    ["woodhammer", 110, 100, p, "grass"],
    ["magicalleaf", 60, 100, s, "grass"],
    ["gigaimpact", 150, 90, p, "normal"],
    ["hyperbeam", 150, 90, s, "normal"],
    ["bugbuzz", 90, 100, s, "bug"],
    ["leechlife", 90, 100, p, "bug"],
    ["attackorder", 95, 100, p, "bug"],
    ["megahorn", 120, 85, p, "bug"],
    ["x-scissor", 90, 100, p, "bug"],
    ["silverwind", 75, 100, s, "bug"],
    ["signalbeam", 65, 100, s, "bug"],
    ["solarbeam", 120, 100, s, "grass"],
    ["eruption", 100, 100, s, "fire"],
    ["flamethrower", 95, 100, s, "fire"],
    ["fireblast", 125, 85, s, "fire"],
    ["flareblitz", 110, 100, p, "fire"],
    ["firepunch", 75, 100, p, "fire"],
    ["thunderpunch", 75, 100, p, "electric"],
    ["magnetbomb", 60, 100, p, "steel"],
    ["psychocut", 70, 100, p, "psychic"],
    ["drainpunch", 90, 100, p, "fighting"],
    ["icepunch", 75, 100, p, "ice"],
    ["flamewheel", 75, 100, p, "fire"],
    ["firefang", 65, 95, p, "fire"],
    ["heatwave", 95, 90, s, "fire"],
    ["airslash", 75, 90, s, "flying"],
    ["ancientpower", 75, 100, s, "rock"],
    ["headsmash", 120, 100, p, "rock"],
    ["powergem", 70, 100, s, "rock"],
    ["rockslide", 85, 95, p, "rock"],
    ["rockwrecker", 150, 90, p, "rock"],
    ["stoneedge", 110, 90, p, "rock"],
    ["rollout", 60, 95, p, "rock"],
    ["confusion", 60, 100, s, "psychic"],
    ["psychic", 90, 100, s, "psychic"],
    ["psybeam", 75, 100, s, "psychic"],
    ["psychocut", 75, 100, p, "psychic"],
    ["zenheadbutt", 95, 95, p, "psychic"],
    ["extrasensory", 80, 100, s, "psychic"],
    ["doublehit", 70, 100, s, "normal"],
    ["astonish", 40, 100, p, "ghost"],
    ["ominouswind", 75, 100, s, "ghost"],
    ["shadowball", 80, 100, s, "ghost"],
    ["shadowclaw", 75, 100, p, "ghost"],
    ["icywind", 55, 95, s, "ice"],
    ["shadowpunch", 65, 100, p, "ghost"],
    ["mirrorshot", 65, 85, s, "steel"],
    ["aircutter", 60, 95, s, "flying"],
    ["phantomforce", 95, 95, p, "ghost"],
    ["dracometeor", 120, 95, s, "dragon"],
    ["dragonbreath", 65, 100, s, "dragon"],
    ["dragonclaw", 95, 100, p, "dragon"],
    ["dragonpulse", 80, 100, s, "dragon"],
    ["outrage", 120, 100, p, "dragon"],
    ["dragonrush", 105, 90, p, "dragon"],
    ["bulldoze", 70, 100, p, "ground"],
    ["earthquake", 100, 100, p, "ground"],
    ["earthpower", 90, 100, s, "ground"],
    ["dig", 80, 100, p, "ground"],
    ["mudbomb", 60, 100, s, "ground"],
    ["mudshot", 65, 100, p, "ground"],
    ["flashcannon", 85, 100, s, "steel"],
    ["steelwing", 75, 90, p, "steel"],
    ["irontail", 100, 75, p, "steel"],
    ["ironhead", 80, 100, p, "steel"],
    ["metalclaw", 60, 100, p, "steel"],
    ["steelbeam", 120, 100, s, "steel"],
    ["gigadrain", 75, 100, s, "grass"],
    ["anchorshot", 80, 100, p, "steel"],
    ["spark", 65, 100, p, "electric"],
    ["thunder", 125, 70, s, "electric"],
    ["thunderfang", 65, 95, p, "electric"],
    ["discharge", 80, 100, s, "electric"],
    ["thunderbolt", 95, 100, s, "electric"],
    ["wildcharge", 120, 100, p, "electric"],
    ["shockwave", 60, 100, s, "electric"],
    ["aerialace", 65, 100, p, "flying"],
    ["fly", 90, 95, p, "flying"],
    ["bravebird", 120, 100, p, "flying"],
    ["gust", 50, 100, s, "flying"],
    ["drillpeck", 80, 100, p, "flying"],
    ["bounce", 90, 95, p, "flying"],
    ["bite", 60, 100, p, "dark"],
    ["crunch", 80, 100, p, "dark"],
    ["darkpulse", 80, 100, s, "dark"],
    ["knockoff", 70, 100, p, "dark"],
    ["nightslash", 70, 100, p, "dark"],
    ["pursuit", 50, 100, p, "dark"],
    ["aurasphere", 90, 100, s, "fighting"],
    ["brickbreak", 75, 100, p, "fighting"],
    ["closecombat", 120, 100, p, "fighting"],
    ["karatechop", 65, 100, p, "fighting"],
    ["focusblast", 125, 70, s, "fighting"],
    ["revenge", 70, 100, p, "fighting"],
    ["poisonjab", 90, 100, p, "poison"],
    ["sludgebomb", 90, 100, s, "poison"],
    ["acid", 50, 100, s, "poison"],
    ["crosspoison", 75, 100, p, "poison"],
    ["sludge", 75, 95, s, "poison"],
    ["poisonfang", 65, 95, p, "poison"],
    ["sludgewave", 95, 100, s, "poison"],
    ["needlearm", 60, 100, p, "grass"],
    ["bodyslam", 85, 100, p, "normal"],
    ["doubleedge", 110, 100, p, "normal"],
    ["swift", 60, 100, s, "normal"],
    ["tackle", 35, 100, p, "normal"],
    ["triattack", 90, 100, s, "normal"],
    ["wingattack", 60, 100, p, "flying"]
]

var recoil = ["bravebird", "doubleedge", "flareblitz", "headsmash", "wildcharge", "woodhammer"];
var nerf = ["overheat", "dracometeor", "leafstorm", "closecombat"];
moveMap = {};
for (let i = 0; i < moves.length; i++) {
    moveMap[moves[i][0]] = {move: moves[i][0], damage: moves[i][1], accuracy: moves[i][2], mode: moves[i][3], type: moves[i][4]};
}
