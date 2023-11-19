// script.js
const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let dealerHand = [];

const playerHandElement = document.getElementById('player-hand');
const dealerHandElement = document.getElementById('dealer-hand');
const dealButton = document.getElementById('deal-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');

const cardContainer = document.querySelector('.card'); // 追加

dealButton.addEventListener('click', deal);
hitButton.addEventListener('click', hit);
standButton.addEventListener('click', stand);

function createDeck() {
  const deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function stand() {
  while (calculateHandValue(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }

  renderHands();
  endGame(calculateWinner()); // ここで calculateWinner を呼び出す
}


function deal() {
  deck = createDeck();
  shuffleDeck(deck);

  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];

  renderHands();
  toggleButtons(true);
}

function hit() {
  playerHand.push(deck.pop());
  renderHands();

  if (calculateHandValue(playerHand) > 21) {
    endGame(false);
  }
}

function stand() {
  while (calculateHandValue(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }

  renderHands();
  endGame(calculateWinner());
}

function calculateHandValue(hand) {
  let sum = 0;
  let hasAce = false;

  for (let card of hand) {
    if (card.value === 'A') {
      hasAce = true;
    }
    sum += cardValue(card.value);
  }

  if (hasAce && sum + 10 <= 21) {
    sum += 10;
  }

  return sum;
}

function calculateWinner() {
  const playerScore = calculateHandValue(playerHand);
  const dealerScore = calculateHandValue(dealerHand);

  if (playerScore > 21) {
    return false; // Dealer wins, player busted
  }

  if (dealerScore > 21) {
    return true; // Player wins, dealer busted
  }

  return playerScore > dealerScore; // Compare scores
}


function cardValue(value) {
  return (value === 'K' || value === 'Q' || value === 'J') ? 10 : parseInt(value) || 11;
}

function renderHands() {
  renderHand(playerHand, playerHandElement);
  renderHand(dealerHand, dealerHandElement, true);

}



function renderHand(hand, element, hideFirstCard) {
  element.innerHTML = '';

  for (let i = 0; i < hand.length; i++) {
    const card = hand[i];
    const cardElement = document.createElement('div');
    cardElement.className = 'card';

    if (i === 0 && hideFirstCard) {
      cardElement.innerHTML = `<img src="images/back.png" alt="Card Back">`;
    } else {
      cardElement.innerHTML = `<img src="images/${card.suit}/${card.value}.png" alt="${card.value} of ${card.suit}">`;
    }

    element.appendChild(cardElement);
  }

  const handValueElement = document.createElement('div');
  handValueElement.textContent = `Total: ${calculateHandValue(hand)}`;
  element.appendChild(handValueElement);
}

function toggleButtons(enable) {
  hitButton.disabled = !enable;
  standButton.disabled = !enable;
}

function endGame(playerWins) {
  toggleButtons(false);

  if (playerWins) {
    alert('Player wins!');
  } else {
    alert('Dealer wins!');
  }
}

// ゲーム開始時にボタンを無効化
toggleButtons(false);




