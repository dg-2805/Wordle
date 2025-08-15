# Wordle Game

A modern Wordle clone built with HTML, CSS, and JavaScript. This game includes classic Wordle gameplay and supports multiple boards (Duordle, Quordle, Octordle) with a responsive, animated UI.

## Features

- **Classic Wordle Gameplay**: Guess a 5-letter word in 6 attempts
- **Multi-Board Modes**: Play Wordle (1 board), Duordle (2 boards), Quordle (4 boards), or Octordle (8 boards) with extra attempts
- **Setup Modal**: Choose board count before starting
- **Visual Feedback**: Color-coded tiles (green for correct, yellow for present, gray for absent)
- **Virtual Keyboard**: On-screen keyboard with color feedback
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Tile flip and pop effects
- **Game State Management**: Tracks attempts, win/lose conditions, and completed boards
- **New Game Button**: Instantly start a new game

## How to Play

1. **Open the Game**: Open `index.html` in your web browser.
2. **Choose Mode**: Select the number of boards (Wordle, Duordle, Quordle, Octordle) in the setup modal and click "Start Game".
3. **Guess the Word(s)**: Type a 5-letter word using the on-screen or physical keyboard.
4. **Submit Your Guess**: Press Enter or click the ENTER button.
5. **Interpret the Colors**:
   - 🟩 **Green**: Letter is correct and in the right position
   - 🟨 **Yellow**: Letter is in the word but in the wrong position
   - ⬛ **Gray**: Letter is not in the word
6. **Win or Lose**: You have a limited number of attempts (varies by mode) to guess all words correctly.
7. **New Game**: Click "New Game" to restart at any time.

## Controls

- **Keyboard**: Type letters, press Enter to submit, Backspace to delete
- **Mouse**: Click on-screen keyboard buttons
- **New Game**: Click "New Game" button to start over

## File Structure

```
Wordle/
├── index.html      # Main HTML file (includes setup modal and game UI)
├── style.css       # CSS styling, layout, and animations
├── script.js       # JavaScript game logic (multi-board, keyboard, game state)
└── README.md       # Project documentation
```

## Quick Start

1. Download or clone this repository.
2. Open `index.html` in your browser (no server required).
3. Play and enjoy!

## Credits

Created by dg-2805. Inspired by the original Wordle game.

## How to Run

1. Download or clone all files to a folder
2. Open `index.html` in any modern web browser
3. Start playing!

## Technical Details

- **Word List**: Contains 60+ 5-letter words for variety
- **Responsive Design**: Adapts to different screen sizes
- **Modern CSS**: Uses CSS Grid, Flexbox, and animations
- **ES6 JavaScript**: Uses classes and modern JavaScript features
- **No Dependencies**: Pure HTML, CSS, and JavaScript

## Browser Compatibility

Works in all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Customization

You can easily customize the game by:
- Adding more words to the `words` array in `script.js`
- Changing colors in `style.css`
- Modifying the word length or number of attempts
- Adding new features like statistics or sharing

Enjoy playing Wordle! 