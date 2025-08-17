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

        // Game statistics
        this.stats = this.loadStats();

        // Settings
        this.settings = this.loadSettings();
        console.log('Loaded settings:', this.settings);

        this.setupModal = document.getElementById('setup-modal');
        this.boardsContainer = document.getElementById('boards-container');
        this.keyboard = document.getElementById('keyboard');
        this.message = document.getElementById('message');
        this.attemptsDisplay = document.getElementById('attempts');
        this.gameOverModal = document.getElementById('game-over');
        this.gameOverTitle = document.getElementById('game-over-title');
        this.gameOverWord = document.getElementById('game-over-word');
        this.gameTitle = document.getElementById('game-title');

        // Modal elements
        this.statsModal = document.getElementById('stats-modal');
        this.helpModal = document.getElementById('help-modal');

        this.showSetupModal();
        this.setupEventListeners();
        this.updateNavbarButtons();
        console.log('Constructor completed. Theme should be applied.');
    }

    loadStats() {
        const saved = localStorage.getItem('wordle-stats');
        return saved ? JSON.parse(saved) : {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            maxStreak: 0,
            guessDistribution: {}
        };
    }

    saveStats() {
        localStorage.setItem('wordle-stats', JSON.stringify(this.stats));
    }

    loadSettings() {
        const saved = localStorage.getItem('wordle-settings');
        return saved ? JSON.parse(saved) : {
            hardMode: false
        };
    }

    saveSettings() {
        localStorage.setItem('wordle-settings', JSON.stringify(this.settings));
    }

    showSetupModal() {
        this.hideAllModals();
        this.setupModal.style.display = 'flex';
        this.updateAttemptsInfo();
    }

    hideSetupModal() {
        this.setupModal.style.display = 'none';
    }

    hideAllModals() {
        this.setupModal.style.display = 'none';
        this.statsModal.style.display = 'none';
        this.helpModal.style.display = 'none';
        this.gameOverModal.style.display = 'none';
    }

    setupEventListeners() {
        // Setup modal events
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.resetGame();
            this.showSetupModal();
        });

        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.resetGame();
            this.showSetupModal();
        });

        // Navbar button events
        document.getElementById('stats-btn').addEventListener('click', () => {
            this.showStatsModal();
        });

        document.getElementById('help-btn').addEventListener('click', () => {
            this.showHelpModal();
        });

        // Toggle button events
        document.getElementById('hard-mode-btn').addEventListener('click', () => {
            this.toggleHardMode();
        });

        // Modal close events
        document.getElementById('close-stats').addEventListener('click', () => {
            this.hideAllModals();
        });

        document.getElementById('close-help').addEventListener('click', () => {
            this.hideAllModals();
        });

        // Update attempts info when selections change
        document.getElementById('board-count').addEventListener('change', () => {
            this.updateAttemptsInfo();
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('setup-modal')) {
                this.hideAllModals();
            }
        });

        document.addEventListener('keydown', (e) => {
            const key = e.key.toUpperCase();

            // Handle modals
            if (this.isAnyModalOpen()) {
                if (key === 'ESCAPE') {
                    this.hideAllModals();
                } else if (key === 'ENTER' && this.setupModal.style.display === 'flex') {
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

        // Apply initial settings
        this.applySettings();
    }

    resetGame() {
        // Reset all game state
        this.currentWords = [];
        this.currentRow = 0;
        this.currentCol = 0;
        this.gameOver = false;
        this.completedBoards.clear();
        
        // Clear UI
        this.clearMessage();
        this.hideAllModals();
        
        // Clear boards and keyboard
        if (this.boardsContainer) {
            this.boardsContainer.innerHTML = '';
        }
        if (this.keyboard) {
            this.keyboard.innerHTML = '';
        }
    }

    isAnyModalOpen() {
        return this.setupModal.style.display === 'flex' ||
               this.statsModal.style.display === 'flex' ||
               this.helpModal.style.display === 'flex' ||
               this.gameOverModal.style.display === 'flex';
    }

    showStatsModal() {
        this.hideAllModals();
        this.updateStatsDisplay();
        this.statsModal.style.display = 'flex';
    }

    showHelpModal() {
        this.hideAllModals();
        this.helpModal.style.display = 'flex';
    }

    updateStatsDisplay() {
        document.getElementById('games-played').textContent = this.stats.gamesPlayed;
        document.getElementById('win-rate').textContent = this.stats.gamesPlayed > 0 
            ? Math.round((this.stats.gamesWon / this.stats.gamesPlayed) * 100) + '%'
            : '0%';
        document.getElementById('current-streak').textContent = this.stats.currentStreak;
        document.getElementById('max-streak').textContent = this.stats.maxStreak;
    }

    applySettings() {
        this.updateNavbarButtons();
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
        try {
            // Show loading state
            this.showMessage('Loading new game...', 'info');
            
            this.wordLength = 5; // Fixed to 5 letters
            this.boardCount = parseInt(document.getElementById('board-count').value);

            // Validate board count
            if (![1, 2, 4, 8].includes(this.boardCount)) {
                this.showMessage('Invalid game mode selected!', 'error');
                return;
            }

            // Calculate max attempts based on board count
            this.maxAttempts = this.calculateMaxAttempts();

            // Reset game state
            this.currentWords = [];
            this.currentRow = 0;
            this.currentCol = 0;
            this.gameOver = false;
            this.completedBoards.clear();

            // Generate words for all boards
            const wordPromises = [];
            for (let i = 0; i < this.boardCount; i++) {
                wordPromises.push(this.getValidRandomWord());
            }

            // Wait for all words to be generated
            this.currentWords = await Promise.all(wordPromises);

            // Update UI
            this.updateGameTitle();
            this.createBoards();
            this.createKeyboard();
            this.updateAttemptsDisplay();
            this.clearMessage();
            this.hideAllModals();

            // Clear any previous game state
            this.clearKeyboardState();

            console.log('Target words:', this.currentWords); // For debugging
            console.log('Game mode:', this.getGameModeName());
            console.log('Max attempts:', this.maxAttempts);
            
        } catch (error) {
            console.error('Error starting game:', error);
            this.showMessage('Error starting game. Please try again.', 'error');
        }
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
        const maxAttempts = 10; // Prevent infinite loops
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            try {
                // Get a random 5-letter word from Random Word API
                const res = await fetch('https://random-word-api.herokuapp.com/word?length=5&number=1');
                
                if (!res.ok) {
                    throw new Error('API request failed');
                }
                
                const data = await res.json();
                const word = data[0].toUpperCase();

                // Basic validation
                if (!word || word.length !== 5 || !/^[A-Z]{5}$/.test(word)) {
                    attempts++;
                    continue;
                }

                // Check with dictionary API
                const valid = await this.isValidWord(word);
                if (valid) {
                    return word;
                }
                
                attempts++;
            } catch (err) {
                console.warn("API failed, using fallback word");
                attempts++;
                
                // Use fallback after a few failed attempts
                if (attempts >= 3) {
                    const fallbackList = [
                        "APPLE", "BEACH", "CHAIR", "DREAM", "EARTH", 
                        "FLAME", "GRAPE", "HEART", "IMAGE", "JUICE", 
                        "KNIFE", "LEMON", "MUSIC", "NIGHT", "OCEAN", 
                        "PEACE", "QUEEN", "RADIO", "SMILE", "TABLE"
                    ];
                    return fallbackList[Math.floor(Math.random() * fallbackList.length)];
                }
            }
        }
        
        // Final fallback if all else fails
        const finalFallback = ["APPLE", "BEACH", "CHAIR", "DREAM", "EARTH"];
        return finalFallback[Math.floor(Math.random() * finalFallback.length)];
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

            // Add board title for multi-board games
            if (this.boardCount > 1) {
                const boardTitle = document.createElement('div');
                boardTitle.className = 'board-title';
                boardTitle.textContent = `Board ${boardIndex + 1}`;
                board.appendChild(boardTitle);
            }

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

        // Add some visual feedback
        console.log(`Created ${this.boardCount} board(s) with ${this.maxAttempts} attempts each`);
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

        // Check hard mode if enabled
        if (this.settings.hardMode && !this.isValidHardModeGuess(guess)) {
            this.showMessage('Must use revealed hints!', 'error');
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
            this.updateStats(true, attemptsUsed);
            this.showGameOverModal('Congratulations!', `You won all boards in ${attemptsUsed} attempts!`);
        } else if (this.currentRow === this.maxAttempts - 1) {
            this.gameOver = true;
            const completedCount = this.completedBoards.size;
            const totalBoards = this.boardCount;

            this.updateStats(completedCount > 0, this.maxAttempts);

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

    isValidHardModeGuess(guess) {
        // Check if the guess uses all revealed hints from previous rows
        for (let row = 0; row < this.currentRow; row++) {
            for (let boardIndex = 0; boardIndex < this.boardCount; boardIndex++) {
                if (this.completedBoards.has(boardIndex)) continue;

                for (let col = 0; col < this.wordLength; col++) {
                    const tile = this.getTile(row, col, boardIndex);
                    if (tile.classList.contains('correct')) {
                        // Letter must be in the same position
                        if (guess[col] !== tile.textContent) {
                            return false;
                        }
                    } else if (tile.classList.contains('present')) {
                        // Letter must be used somewhere
                        if (!guess.includes(tile.textContent)) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    updateStats(won, attempts) {
        this.stats.gamesPlayed++;
        
        if (won) {
            this.stats.gamesWon++;
            this.stats.currentStreak++;
            this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.currentStreak);
            
            // Update guess distribution
            if (!this.stats.guessDistribution[attempts]) {
                this.stats.guessDistribution[attempts] = 0;
            }
            this.stats.guessDistribution[attempts]++;
        } else {
            this.stats.currentStreak = 0;
        }
        
        this.saveStats();
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
        // Basic validation first
        if (!word || word.length !== 5 || !/^[A-Z]{5}$/.test(word)) {
            return false;
        }

        // Check against our fallback list first (faster)
        const fallbackList = [
            "APPLE", "BEACH", "CHAIR", "DREAM", "EARTH", 
            "FLAME", "GRAPE", "HEART", "IMAGE", "JUICE", 
            "KNIFE", "LEMON", "MUSIC", "NIGHT", "OCEAN", 
            "PEACE", "QUEEN", "RADIO", "SMILE", "TABLE",
            "UNITY", "VOICE", "WATER", "YOUTH", "ZEBRA", 
            "BRAIN", "CLOUD", "DANCE", "EAGLE", "FROST", 
            "GHOST", "HAPPY", "IVORY", "JOKER", "KARMA", 
            "LIGHT", "MAGIC", "NORTH", "OPERA", "PIANO", 
            "QUIET", "RIVER", "SPACE", "TIGER", "VIBES", 
            "WINDY", "YACHT", "ZESTY"
        ];
        
        if (fallbackList.includes(word)) {
            return true;
        }

        try {
            // Check with dictionary API with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
            
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return res.ok;
        } catch (error) {
            console.warn(`Dictionary API check failed for "${word}":`, error.message);
            // If API fails, we'll be more permissive and accept the word
            // This prevents the game from breaking due to API issues
            return true;
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
        this.attemptsDisplay.textContent = `Attempts: ${this.currentRow}/${this.maxAttempts}`;
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

    getGameModeName() {
        const modes = {
            1: 'Wordle',
            2: 'Duordle', 
            4: 'Quordle',
            8: 'Octordle'
        };
        return modes[this.boardCount] || 'Unknown';
    }

    clearKeyboardState() {
        // Clear keyboard colors
        const keys = this.keyboard.querySelectorAll('.key');
        keys.forEach(key => {
            key.classList.remove('correct', 'present', 'absent');
        });
    }

    toggleHardMode() {
        this.settings.hardMode = !this.settings.hardMode;
        this.saveSettings();
        this.updateNavbarButtons();
        
        // Show feedback
        const message = this.settings.hardMode ? 'Hard Mode enabled!' : 'Hard Mode disabled!';
        this.showMessage(message, 'info');
    }

    updateNavbarButtons() {
        const hardModeBtn = document.getElementById('hard-mode-btn');
        
        // Update hard mode button
        if (this.settings.hardMode) {
            hardModeBtn.classList.add('active');
            hardModeBtn.querySelector('.nav-icon').textContent = '🎯';
        } else {
            hardModeBtn.classList.remove('active');
            hardModeBtn.querySelector('.nav-icon').textContent = '🎯';
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WordleGame();
});
