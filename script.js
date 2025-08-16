class WordleGame {
    constructor() {
        this.wordLength = 5;
        this.boardCount = 1;
        this.maxAttempts = 6;
        this.words = ['APPLE', 'BEACH', 'CHAIR', 'DREAM', 'EARTH', 'FLAME', 'GRAPE', 'HEART', 'IMAGE', 'JUICE', 'KNIFE', 'LEMON', 'MUSIC', 'NIGHT', 'OCEAN', 'PEACE', 'QUEEN', 'RADIO', 'SMILE', 'TABLE', 'UNITY', 'VOICE', 'WATER', 'YOUTH', 'ZEBRA', 'BRAIN', 'CLOUD', 'DANCE', 'EAGLE', 'FROST', 'GHOST', 'HAPPY', 'IVORY', 'JOKER', 'KARMA', 'LIGHT', 'MAGIC', 'NORTH', 'OPERA', 'PIANO', 'QUIET', 'RIVER', 'SPACE', 'TIGER', 'UNITY', 'VIBES', 'WINDY', 'YACHT', 'ZESTY'];

        this.currentWords = [];
        this.currentRow = 0;
        this.currentCol = 0;
        this.gameOver = false;
        this.completedBoards = new Set();

        this.setupModal = document.getElementById('setup-modal');
        this.boardsContainer = document.getElementById('boards-container');
        this.keyboard = document.getElementById('keyboard');
        this.message = document.getElementById('message');
        this.attemptsDisplay = document.getElementById('attempts');
        this.gameOverModal = document.getElementById('game-over');
        this.gameOverTitle = document.getElementById('game-over-title');
        this.gameOverWord = document.getElementById('game-over-word');
        this.gameTitle = document.getElementById('game-title');

        this.showSetupModal();
        this.setupEventListeners();
    }

    showSetupModal() {
        this.hideGameOverModal(); // Hide game over modal first
        this.setupModal.style.display = 'flex';
        this.updateAttemptsInfo();
    }

    hideSetupModal() {
        this.setupModal.style.display = 'none';
    }

    setupEventListeners() {
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.showSetupModal();
        });

        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.showSetupModal();
        });

        // Update attempts info when selections change
        document.getElementById('board-count').addEventListener('change', () => {
            this.updateAttemptsInfo();
        });

        document.addEventListener('keydown', (e) => {
            const key = e.key.toUpperCase();

            // Handle game over modal
            if (this.gameOver && this.gameOverModal.style.display === 'flex') {
                if (key === 'ENTER') {
                    this.showSetupModal();
                }
                return;
            }

            // Handle setup modal
            if (this.setupModal.style.display === 'flex') {
                if (key === 'ENTER') {
                    this.startGame();
                }
                return;
            }

            // Handle game input
            if (this.gameOver) return;

            if (key === 'ENTER') {
                this.handleKeyPress('ENTER');
            } else if (key === 'BACKSPACE' || key === 'DELETE') {
                this.handleKeyPress('BACKSPACE');
            } else if (/^[A-Z]$/.test(key)) {
                this.handleKeyPress(key);
            }
        });
    }

    updateAttemptsInfo() {
        const boardCount = parseInt(document.getElementById('board-count').value);

        // Base attempts for 5-letter words
        let attempts = 6;

        if (boardCount === 2) {
            attempts += 2;
        } else if (boardCount === 4) {
            attempts += 4;
        } else if (boardCount === 8) {
            attempts += 6;
        }

        document.getElementById('attempts-info').textContent = `Total attempts: ${attempts}`;
    }

    async startGame() {
        this.wordLength = 5; // Fixed to 5 letters
        this.boardCount = parseInt(document.getElementById('board-count').value);

        // Calculate max attempts based on board count
        this.maxAttempts = this.calculateMaxAttempts();

        this.currentWords = [];
        for (let i = 0; i < this.boardCount; i++) {
            this.currentWords.push(await this.getValidRandomWord());
        }

        this.currentRow = 0;
        this.currentCol = 0;
        this.gameOver = false;
        this.completedBoards.clear();

        this.updateGameTitle();
        this.createBoards();
        this.createKeyboard();
        this.updateAttemptsDisplay();
        this.clearMessage();
        this.hideGameOverModal();
        this.hideSetupModal();

        console.log('Target words:', this.currentWords); // For debugging
    }

    calculateMaxAttempts() {
        // Base attempts for 5-letter words
        let attempts = 6;

        // Add extra attempts for multiple boards
        if (this.boardCount === 2) {
            attempts += 2; // Duordle: +2 attempts
        } else if (this.boardCount === 4) {
            attempts += 4; // Quordle: +4 attempts
        } else if (this.boardCount === 8) {
            attempts += 6; // Octordle: +6 attempts
        }

        return attempts;
    }

    updateGameTitle() {
        const titles = {
            1: 'Wordle',
            2: 'Duordle',
            4: 'Quordle',
            8: 'Octordle'
        };
        this.gameTitle.textContent = titles[this.boardCount] || 'Wordle';
    }

    async getValidRandomWord() {
        while (true) {
            try {
                // Get a random 5-letter word from Random Word API
                const res = await fetch('https://random-word-api.herokuapp.com/word?length=5&number=1');
                const data = await res.json();
                const word = data[0].toUpperCase();

                // Check with dictionary API
                const valid = await this.isValidWord(word);
                if (valid) {
                    return word; // ✅ Only return if it’s actually in the dictionary
                }
            } catch (err) {
                console.error("API failed, using fallback word");
                // Fallback to a safe word from your list
                const fallbackList = ["APPLE", "MANGO", "GRAPE", "BERRY", "PEACH"];
                return fallbackList[Math.floor(Math.random() * fallbackList.length)];
            }
        }
    }


    createBoards() {
        this.boardsContainer.innerHTML = '';

        // Add CSS class based on board count
        this.boardsContainer.className = 'boards-container';
        if (this.boardCount === 1) {
            this.boardsContainer.classList.add('single-board');
        } else if (this.boardCount === 2) {
            this.boardsContainer.classList.add('two-boards');
        } else if (this.boardCount === 4) {
            this.boardsContainer.classList.add('four-boards');
        } else if (this.boardCount === 8) {
            this.boardsContainer.classList.add('eight-boards');
        }

        for (let boardIndex = 0; boardIndex < this.boardCount; boardIndex++) {
            const board = document.createElement('div');
            board.className = 'board-grid';
            board.dataset.boardIndex = boardIndex;
            board.dataset.boardNumber = `Board ${boardIndex + 1}`;
            board.style.gridTemplateColumns = `repeat(${this.wordLength}, 1fr)`;

            for (let row = 0; row < this.maxAttempts; row++) {
                for (let col = 0; col < this.wordLength; col++) {
                    const tile = document.createElement('div');
                    tile.className = 'tile';
                    tile.dataset.row = row;
                    tile.dataset.col = col;
                    tile.dataset.boardIndex = boardIndex;
                    board.appendChild(tile);
                }
            }

            this.boardsContainer.appendChild(board);
        }
    }

    createKeyboard() {
        this.keyboard.innerHTML = '';

        const keyboardLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
        ];

        keyboardLayout.forEach(row => {
            const keyboardRow = document.createElement('div');
            keyboardRow.className = 'keyboard-row';

            row.forEach(key => {
                const keyElement = document.createElement('button');
                keyElement.className = 'key';
                keyElement.textContent = key;

                if (key === 'ENTER' || key === 'BACKSPACE') {
                    keyElement.classList.add('special');
                }

                keyElement.addEventListener('click', () => this.handleKeyPress(key));
                keyboardRow.appendChild(keyElement);
            });

            this.keyboard.appendChild(keyboardRow);
        });
    }

    handleKeyPress(key) {
        if (this.gameOver) return;

        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.deleteLetter();
        } else if (/^[A-Z]$/.test(key) && this.currentCol < this.wordLength) {
            this.addLetter(key);
        }
    }

    addLetter(letter) {
        if (this.currentCol < this.wordLength) {
            // Add letter to all active boards
            for (let boardIndex = 0; boardIndex < this.boardCount; boardIndex++) {
                if (!this.completedBoards.has(boardIndex)) {
                    const tile = this.getTile(this.currentRow, this.currentCol, boardIndex);
                    tile.textContent = letter;
                    tile.classList.add('filled');
                }
            }
            this.currentCol++;
        }
    }

    deleteLetter() {
        if (this.currentCol > 0) {
            this.currentCol--;
            // Delete letter from all active boards
            for (let boardIndex = 0; boardIndex < this.boardCount; boardIndex++) {
                if (!this.completedBoards.has(boardIndex)) {
                    const tile = this.getTile(this.currentRow, this.currentCol, boardIndex);
                    tile.textContent = '';
                    tile.classList.remove('filled');
                }
            }
        }
    }

    async submitGuess() {
        if (this.currentCol !== this.wordLength) {
            this.showMessage('Not enough letters!', 'error');
            return;
        }

        const guess = this.getCurrentGuess();
        if (!(await this.isValidWord(guess))) {
            this.showMessage('Not in dictionary!', 'error');
            return;
        }

        // Evaluate guess for all active boards
        for (let boardIndex = 0; boardIndex < this.boardCount; boardIndex++) {
            if (!this.completedBoards.has(boardIndex)) {
                this.evaluateGuess(guess, boardIndex);
            }
        }

        this.updateKeyboard(guess);

        // Check if any boards are completed
        let allCompleted = true;
        for (let boardIndex = 0; boardIndex < this.boardCount; boardIndex++) {
            if (guess === this.currentWords[boardIndex]) {
                this.completedBoards.add(boardIndex);
            }
            if (!this.completedBoards.has(boardIndex)) {
                allCompleted = false;
            }
        }

        if (allCompleted) {
            this.gameOver = true;
            const attemptsUsed = this.currentRow + 1;
            this.showGameOverModal('Congratulations!', `You won all boards in ${attemptsUsed} attempts!`);
        } else if (this.currentRow === this.maxAttempts - 1) {
            this.gameOver = true;
            const completedCount = this.completedBoards.size;
            const totalBoards = this.boardCount;

            if (completedCount > 0) {
                // Partial win - show completed and remaining words
                const completedWords = this.currentWords.filter((_, index) => this.completedBoards.has(index));
                const remainingWords = this.currentWords.filter((_, index) => !this.completedBoards.has(index));
                this.showGameOverModal('Game Over!', `You completed ${completedCount}/${totalBoards} boards. Completed: ${completedWords.join(', ')}. Remaining: ${remainingWords.join(', ')}`);
            } else {
                // Complete loss - show all words
                this.showGameOverModal('Game Over!', `The words were: ${this.currentWords.join(', ')}`);
            }
        } else {
            this.currentRow++;
            this.currentCol = 0;
            this.updateAttemptsDisplay();
        }
    }

    getCurrentGuess() {
        let guess = '';
        for (let col = 0; col < this.wordLength; col++) {
            const tile = this.getTile(this.currentRow, col, 0); // Use first board for guess
            guess += tile.textContent;
        }
        return guess;
    }

    async isValidWord(word) {
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
            return res.ok;
        } catch {
            return false;
        }
    }

    evaluateGuess(guess, boardIndex) {
        const targetWord = this.currentWords[boardIndex];
        const targetArray = targetWord.split('');
        const guessArray = guess.split('');
        const result = new Array(this.wordLength).fill('absent');

        // First pass: mark correct letters
        for (let i = 0; i < this.wordLength; i++) {
            if (guessArray[i] === targetArray[i]) {
                result[i] = 'correct';
                targetArray[i] = null; // Mark as used
            }
        }

        // Second pass: mark present letters
        for (let i = 0; i < this.wordLength; i++) {
            if (result[i] === 'correct') continue;

            const targetIndex = targetArray.indexOf(guessArray[i]);
            if (targetIndex !== -1) {
                result[i] = 'present';
                targetArray[targetIndex] = null; // Mark as used
            }
        }

        // Apply results to tiles
        for (let i = 0; i < this.wordLength; i++) {
            const tile = this.getTile(this.currentRow, i, boardIndex);
            tile.classList.add(result[i]);
        }
    }

    updateKeyboard(guess) {
        // Update keyboard based on all active boards
        const letterStates = {};

        for (let boardIndex = 0; boardIndex < this.boardCount; boardIndex++) {
            if (this.completedBoards.has(boardIndex)) continue;

            const targetWord = this.currentWords[boardIndex];
            const guessArray = guess.split('');

            for (let i = 0; i < this.wordLength; i++) {
                const letter = guessArray[i];
                if (!letterStates[letter]) {
                    letterStates[letter] = 'absent';
                }

                if (guessArray[i] === targetWord[i]) {
                    letterStates[letter] = 'correct';
                } else if (targetWord.includes(guessArray[i]) && letterStates[letter] !== 'correct') {
                    letterStates[letter] = 'present';
                }
            }
        }

        // Apply states to keyboard
        Object.keys(letterStates).forEach(letter => {
            const key = this.getKeyElement(letter);
            if (key) {
                key.classList.remove('correct', 'present', 'absent');
                key.classList.add(letterStates[letter]);
            }
        });
    }

    getTile(row, col, boardIndex) {
        return document.querySelector(`[data-row="${row}"][data-col="${col}"][data-board-index="${boardIndex}"]`);
    }

    getKeyElement(letter) {
        const keys = this.keyboard.querySelectorAll('.key');
        for (let key of keys) {
            if (key.textContent === letter) {
                return key;
            }
        }
        return null;
    }

    updateAttemptsDisplay() {
        this.attemptsDisplay.textContent = `Attempts: ${this.currentRow + 1}/${this.maxAttempts}`;
    }

    showMessage(text, type = 'info') {
        this.message.textContent = text;
        this.message.className = `message ${type}`;

        setTimeout(() => {
            this.clearMessage();
        }, 3000);
    }

    clearMessage() {
        this.message.textContent = '';
        this.message.className = 'message';
    }

    showGameOverModal(title, message) {
        this.gameOverTitle.textContent = title;
        this.gameOverWord.textContent = message;
        this.gameOverModal.style.display = 'flex';
    }

    hideGameOverModal() {
        this.gameOverModal.style.display = 'none';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WordleGame();
});
