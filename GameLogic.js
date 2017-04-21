var numPeggingCardsPlayed = 0;
const MAX_NUM_PEGGING_CARDS = 8;
var peggingCardSlotIds = ["peggingPileCard0", "peggingPileCard1", "peggingPileCard2", "peggingPileCard3", "peggingPileCard4", "peggingPileCard5", "peggingPileCard6", "peggingPileCard7"];
var countingHandSlotIds = ["countingHandCard0", "countingHandCard1", "countingHandCard2", "countingHandCard3"];

function playPeggingCard() {
    if (numPeggingCardsPlayed < MAX_NUM_PEGGING_CARDS) {
        document.getElementById(peggingCardSlotIds[numPeggingCardsPlayed]).style.visibility = "visible";
        numPeggingCardsPlayed++;
    }
}

function clearPeggingCards() {
    for (var slot in peggingCardSlotIds) {
        document.getElementById(peggingCardSlotIds[slot]).style.visibility = "hidden";
    }
    numPeggingCardsPlayed = 0;
}

function displayCountingHand() {
    for (var slot in countingHandSlotIds) {
        document.getElementById(countingHandSlotIds[slot]).style.visibility = "visible";
    }
}

function hideCountingHand() {
    for (var slot in countingHandSlotIds) {
        document.getElementById(countingHandSlotIds[slot]).style.visibility = "hidden";
    }
}