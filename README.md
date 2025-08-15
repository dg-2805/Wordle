# Wordle Game

A fully functional Wordle game built with HTML, CSS, and JavaScript. This game replicates the popular word-guessing game with a modern, responsive design.

## Features

- **Classic Wordle Gameplay**: Guess a 5-letter word in 6 attempts
- **Visual Feedback**: Color-coded tiles (green for correct, yellow for present, gray for absent)
- **Virtual Keyboard**: On-screen keyboard with color feedback
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Tile flip animations and pop effects
- **Game State Management**: Track attempts and handle win/lose conditions
- **New Game Functionality**: Start a new game at any time

## How to Play

1. **Open the Game**: Open `index.html` in your web browser
2. **Guess the Word**: Type a 5-letter word using the on-screen keyboard or your physical keyboard
3. **Submit Your Guess**: Press Enter or click the ENTER button
4. **Interpret the Colors**:
   - 🟩 **Green**: Letter is correct and in the right position
   - 🟨 **Yellow**: Letter is in the word but in the wrong position
   - ⬛ **Gray**: Letter is not in the word
5. **Win or Lose**: You have 6 attempts to guess the word correctly

## Controls

- **Keyboard**: Type letters, press Enter to submit, Backspace to delete
- **Mouse**: Click on-screen keyboard buttons
- **New Game**: Click "New Game" button to start over

## File Structure

```
Wordle/
├── index.html      # Main HTML file
├── style.css       # CSS styling and animations
├── script.js       # JavaScript game logic
└── README.md       # This file
```

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