// ---------- Game config ----------
const emojis = ["🍒", "🍋", "🍇", "💎", "⭐", "🔔"];
const STARTING_BALANCE = 100;
const SPIN_COST = 10;
const JACKPOT = 100;
const SHUFFLE_SPEED = 75;    // ms between emoji swaps (the animation tick)
const SPIN_DURATION = 1500;  // ms before the reels stop (the game conductor)

// ---------- DOM references ----------
const reels = [
    document.getElementById("reel-1"),
    document.getElementById("reel-2"),
    document.getElementById("reel-3")
];
const balanceEl = document.getElementById("balance");
const messageEl = document.getElementById("message");
const spinBtn = document.getElementById("spin-btn");
const resetBtn = document.getElementById("reset-btn");

// ---------- State ----------
let score = STARTING_BALANCE;

function getRandomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function setMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = "message" + (type ? " " + type : "");
}

function spin() {
    // Step 1: Concurrency lock - this MUST be the first thing spin() does,
    // otherwise rapid clicks start several overlapping intervals.
    spinBtn.disabled = true;

    if (score < SPIN_COST) {
        gameOver();
        return;
    }

    score -= SPIN_COST;
    balanceEl.textContent = score;
    setMessage("Spinning...");
    reels.forEach((reel) => reel.classList.remove("win"));

    // Step 2: Interval shuffling - blur the reels and swap emojis every 75ms
    reels.forEach((reel) => reel.classList.add("rolling"));
    const shuffle = setInterval(() => {
        reels.forEach((reel) => {
            reel.textContent = getRandomEmoji();
        });
    }, SHUFFLE_SPEED);

    // Step 3: Halt & reveal - fires once after 1500ms
    setTimeout(() => {
        clearInterval(shuffle);

        const results = reels.map((reel) => {
            const emoji = getRandomEmoji();
            reel.textContent = emoji;
            reel.classList.remove("rolling");
            return emoji;
        });

        checkJackpot(results);
    }, SPIN_DURATION);
}

// Step 4: Jackpot audit
function checkJackpot([r1, r2, r3]) {
    if (r1 === r2 && r2 === r3) {
        score += JACKPOT;
        balanceEl.textContent = score;
        reels.forEach((reel) => reel.classList.add("win"));
        setMessage(`JACKPOT! ${r1}${r2}${r3}  +${JACKPOT} points!`, "win");
    } else {
        setMessage("No match. Try again!", "lose");
    }

    // Only re-enable the button inside this callback, and only if the player can afford a spin
    if (score >= SPIN_COST) {
        spinBtn.disabled = false;
    } else {
        gameOver();
    }
}

function gameOver() {
    spinBtn.disabled = true;
    setMessage(`Game over! Your balance is below ${SPIN_COST} points.`, "lose");
    resetBtn.classList.remove("hidden");
}

function resetGame() {
    score = STARTING_BALANCE;
    balanceEl.textContent = score;
    reels.forEach((reel) => reel.classList.remove("win", "rolling"));
    setMessage(`Press SPIN to play. Each spin costs ${SPIN_COST} points.`);
    resetBtn.classList.add("hidden");
    spinBtn.disabled = false;
    spinBtn.focus();
}

// ---------- Event listeners ----------
spinBtn.addEventListener("click", spin);
resetBtn.addEventListener("click", resetGame);
