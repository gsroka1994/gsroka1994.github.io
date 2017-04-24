//Initialize the deck
init();

//Deal to the players from the deck
deal();

//Get the turn up card from the deck
turnUpCard();


//Pegging
var numPeggingCardsPlayed = 0;
const MAX_NUM_PEGGING_CARDS = 8;
var peggingCardSlotIds = ["peggingPileCard0",
    "peggingPileCard1",
    "peggingPileCard2",
    "peggingPileCard3",
    "peggingPileCard4",
    "peggingPileCard5",
    "peggingPileCard6",
    "peggingPileCard7"];

//Counting
var countingHandSlotIds = ["countingHandCard0",
    "countingHandCard1",
    "countingHandCard2",
    "countingHandCard3"];

//Plays the next pegging card
function playPeggingCard() {
    if (numPeggingCardsPlayed < MAX_NUM_PEGGING_CARDS) {
        document.getElementById(peggingCardSlotIds[numPeggingCardsPlayed]).style.visibility = "visible";
        numPeggingCardsPlayed++;
    }
}

//Clears all pegging cards
function clearPeggingCards() {
    for (var slot in peggingCardSlotIds) {
        document.getElementById(peggingCardSlotIds[slot]).style.visibility = "hidden";
    }
    numPeggingCardsPlayed = 0;
}

//Displays the users hand for counting
function displayCountingHand() {
    for (var slot in countingHandSlotIds) {
        document.getElementById(countingHandSlotIds[slot]).style.visibility = "visible";
    }
}

//Hides the users hand for counting
function hideCountingHand() {
    for (var slot in countingHandSlotIds) {
        document.getElementById(countingHandSlotIds[slot]).style.visibility = "hidden";
    }
}

//Displays the turn-up card
function getTurnUpCard() {
    document.getElementById('turnUpCard').src = cutCard.image;
}

//Hides the turn-up card
function hideTurnUpCard() {
    document.getElementById('turnUpCard').src = "img/back.jpg";
}