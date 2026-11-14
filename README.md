# 🎰 EmojiSlots Arcade

A 3-reel emoji slot machine with an arcade-cabinet look. Each spin costs 10 points, the reels blur and shuffle for 1.5 seconds, and lining up three matching emojis wins the 100-point jackpot.

Built with plain HTML, CSS and JavaScript: no frameworks, libraries, CDNs or image files.

**Live demo:** _add your Vercel link here_

## Features

- Starting balance of 100 points
- Each spin costs 10 points
- Reels blur and shuffle while spinning, then stop on a random result
- Jackpot: +100 points when all three emojis match, with a glowing win animation
- Spin button locks during each spin, so rapid clicks can't start overlapping spins
- Game over when your balance drops below 10, with a **New Game** button to start again
- Uses standard emoji characters (🍒 🍋 🍇 💎 ⭐ 🔔), so there are no images to load
- Works on phones and desktops

## How to run

No install needed. Double-click `index.html` to open it in any browser.

## How it works

Each spin uses two timers:

- **`setInterval` (the animation):** every 75 ms it puts a random emoji on each reel while the `.rolling` class blurs them.
- **`setTimeout` (the conductor):** fires once after 1500 ms. It stops the interval, sets the final three emojis, removes the blur and checks for a jackpot.

The steps of a spin:

1. **Lock:** the first line of `spin()` is `spinBtn.disabled = true`. The 10-point cost is then deducted.
2. **Shuffle:** the reels get the `.rolling` class and the interval starts swapping emojis.
3. **Stop and reveal:** the timeout clears the interval and picks the final emojis.
4. **Jackpot check:** `if (r1 === r2 && r2 === r3)` adds 100 points. The button is only re-enabled here, and only if the balance is still at least 10.

A random emoji is picked with:

```js
emojis[Math.floor(Math.random() * emojis.length)]
```

With 6 symbols, a jackpot comes up about once in every 36 spins.

**Customise it:** edit the `emojis` array at the top of `script.js` to use your own symbols.

## Concepts covered

`Math.random()` · `setInterval` / `setTimeout` / `clearInterval` · disabling buttons to prevent race conditions · array destructuring · `Array.map()` · CSS `filter: blur()` and `transform` · CSS `@keyframes` · media queries

## Files

```
emoji-slots/
├── index.html   # cabinet, scoreboard, three reels, spin and new-game buttons
├── style.css    # arcade styling, blur effect, win glow, button press
└── script.js    # emoji list, spin logic, timers, jackpot check, game over
```
