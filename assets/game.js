// This object defines selectors for various elements in the document
const selectors = {
    boardContainer: document.querySelector('.board-container'), // The element with the class 'board-container'
    board: document.querySelector('.board'), // The element with the class 'board'
    moves: document.querySelector('.moves'), // The element with the class 'moves'
    timer: document.querySelector('.timer'), // The element with the class 'timer'
    start: document.querySelector('button'), // The first <button> element in the document
    win: document.querySelector('.win') // The element with the class 'win'
}

// This object defines the initial state of the game
const state = {
    gameStarted: false, // Whether or not the game has started
    flippedCards: 0, // The number of flipped cards
    totalFlips: 0, // The total number of flips
    totalTime: 0, // The total time elapsed
    loop: null // A variable to store the interval ID for the game loop
}

//This function shuffles an array by creating a copy of the original array
const shuffle = array => {
const clonedArray = [...array]; // Create a shallow copy of the input array
for (let index = clonedArray.length - 1; index > 0; index--) {
const randomIndex = Math.floor(Math.random() * (index + 1));
const original = clonedArray[index];
clonedArray[index] = clonedArray[randomIndex];
clonedArray[randomIndex] = original;
}
return clonedArray;
};

//This function called pickRandom which takes in two parameters - an array and a number of items to pick from that array. It returns an array containing items number of randomly picked items from the original array.
const pickRandom = (array, items) => {
    const clonedArray = [...array];
    const randomPicks = [];
    for (let index = 0; index < items; index++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length);
    randomPicks.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
    }
    return randomPicks;
    };
    
    //This function called generateGame which takes no parameters. It retrieves the dimension of the game board using an attribute on a selectors.board object. If the dimension is not an even number, it throws an error with a message stating that the dimension must be an even number.
    const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension');
    if (dimensions % 2 !== 0) {
    throw new Error("The dimension of the board must be an even number.");
    }
    };
    
    //This line declares a constant variable named emojis and assigns it an array of ten strings, each representing an emoji.
    const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍'];
    
    //This line declares a constant variable named dimensions and assigns it the dimension of the board.
    const dimensions = selectors.board.getAttribute('data-dimension');
    
    //This line declares a constant variable named picks and assigns it the result of a function pickRandom, which takes two arguments: the emojis array and the number (dimensions * dimensions) / 2.
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2);
    
    //This line declares a constant variable named items and assigns it the result of a function shuffle, which takes an array created by concatenating picks with itself, then shuffles the resulting array.
    const items = shuffle([...picks, ...picks]);


/*This line declares a constant variable named cards and assigns it a template literal that creates an HTML string representing a game board. The number of columns in the board is determined by the dimensions variable. Each item in the items array is used to populate a card element with a front and back, with the back displaying the item.*/
const cards = `
    <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
        ${items.map(item => `
            <div class="card">
                <div class="card-front"></div>
                <div class="card-back">${item}</div>
            </div>
        `).join('')}
   </div>
`

/*This line declares a constant variable named parser and assigns it a new instance of the DOMParser object, which is used to parse the cards HTML string. */
const parser = new DOMParser().parseFromString(cards, 'text/html')


/*This line replaces the existing game board element, selected by the selectors.board query, with the new game board element that was created by parsing the cards HTML string. */
selectors.board.replaceWith(parser.querySelector('.board'))



/*This function startGame sets the gameStarted state to true, adds a disabled class to the selectors.start element, and sets an interval to run every second. Within the interval, it increments the totalTime state, updates the selectors.moves and selectors.timer elements with the current state values. */
const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled')

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.moves.innerText = `${state.totalFlips} moves`
        selectors.timer.innerText = `time: ${state.totalTime} sec`
    }, 1000)
}



/*This function flipBackCards selects all cards that do not have a matched class and removes the flipped class from each of them. It then sets the flippedCards state to 0.*/
const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}


const flipCard = card => {
    // Increase the count of flipped cards and total flips
    state.flippedCards++
    state.totalFlips++

    // If the game has not yet started, start the game
    if (!state.gameStarted) {
        startGame()
    }

    // If there are less than or equal to two flipped cards, flip the current card
    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    // If two cards have been flipped, check if they match
    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        // If the two flipped cards match, mark them as matched
        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        // Flip the cards back after a delay of 1 second
        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // If there are no more cards that can be flipped, the game has been won
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            // Flip the board over and display the win message
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `

            // Stop the timer
            clearInterval(state.loop)
        }, 1000)
    }
}


const attachEventListeners = () => {
    // Listen for click events on the document
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        // If the clicked element is a card and its parent is not flipped, flip the card
        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            // If the clicked element is a button and it is not disabled, start the game
            startGame()
        }
    })
}

// Generate the game and attach event listeners
generateGame()
attachEventListeners()






