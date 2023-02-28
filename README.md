# memory-game

The memory game is a common children's game played with a set of cards. The cards have a pictures on one side and each picture appears on two (or sometimes four) cards.
The game starts with all the cards face down and players take turns to turn over two cards. If the two cards have the same picture, then they keep the cards,
otherwise they turn the cards face down again.
The winner is the person with the most cards when all the cards have been taken.

#Game-Algorithm

//Define an array to hold the game cards.
//Shuffle the array using a shuffle algorithm.
//Create a game board with a grid of cards, where each card is initially face down.
//Add click event listeners to each card, so that when a card is clicked:
//Flip the card over to reveal its symbol.
//Store the card's symbol and position.
  If another card has been flipped, compare its symbol to the current card's symbol:
  If they match, leave both cards face up and mark them as matched.
  If they do not match, flip both cards back over to face down.
//Repeat step 4 until all cards have been matched.
//Keep track of the number of moves the player makes.
//When all cards have been matched, display a message showing the player's score (number of moves) and ask if they want to play again.
  If the player chooses to play again, reset the game board and shuffle the cards.
