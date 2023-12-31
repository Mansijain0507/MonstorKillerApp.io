const ATTACK_VALUE = 5;
const MONSTER_ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 15;

const MODE_ATTACK = 'ATTACK'; // MODE_ATTACK = 0
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'; // MODE_STRONG_ATTACK = 1
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';
const enteredValue = prompt('Enter the maximum life for you and the monster.', '100');

let chooseMaxLife = parseInt(enteredValue);
let battleLog = [];
let lastloggedEntry;
if (isNaN(chooseMaxLife) || chooseMaxLife <= 0) {
    chooseMaxLife = 100;
}

let currentMonsterHealth = chooseMaxLife;
let currentPlayerHealth = chooseMaxLife;
let hasBonusLife = true;

adjustHealthBars(chooseMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };
    if (ev === LOG_EVENT_PLAYER_ATTACK) {
        logEntry.target = 'MONSTER';

    }
    else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    }
    else if (ev === LOG_EVENT_MONSTER_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    }
    else if (ev === LOG_EVENT_PLAYER_HEAL) {
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    }
    else if (ev === LOG_EVENT_GAME_OVER) {
        logEntry = {
            event: ev,
            value: val,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    }
    battleLog.push(logEntry);

}

function reset() {
    currentMonsterHealth = chooseMaxLife;
    currentPlayerHealth = chooseMaxLife;
    resetGame(chooseMaxLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You would be dead but bonus life saved you!");
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('Congrats, You Yon!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('Opps, You Lost!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );

    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert('You have Draw');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'DRAW',
            currentMonsterHealth,
            currentPlayerHealth
        );
    }
    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
    }
}

function attackMonster(mode) {
    let maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    let logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
    // if (mode === MODE_ATTACK) {
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;
    // }
    // else if (mode === MODE_STRONG_ATTACK) {
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(
        logEvent,
        damage,
        currentMonsterHealth,
        currentPlayerHealth
    );

    endRound();

}
function attackHandler() {
    attackMonster(MODE_ATTACK);

}
function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}
function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chooseMaxLife - HEAL_VALUE) {
        alert("You can't heal to more than you max initial health");
        healValue = chooseMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );

    endRound();
}

function printLogHandler() {
    // for (let i = 0; i < battleLog.length; i++) {

    //     console.log(battleLog[i]);
    // }

    let i = 0;
    for (const logEntry of battleLog) {
        if (!lastloggedEntry && lastloggedEntry !== 0 || lastloggedEntry < i) {
            console.log(`#${i}`);
            for (const key in logEntry) {
                console.log(`${key} : ${logEntry[key]}`)
            }
            lastloggedEntry = i;
            break;
        }
        i++;

    }


}




attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler)
logBtn.addEventListener('click', printLogHandler)