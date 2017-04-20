var numPeggingCardsPlayed = 0;
var maxNumPeggingCards = 8;
var peggingCardSlotIds = ["peggingPileCard0", "peggingPileCard1", "peggingPileCard2", "peggingPileCard3", "peggingPileCard4", "peggingPileCard5", "peggingPileCard6", "peggingPileCard7"];

function playPeggingCard() {
    document.getElementById(peggingCardSlotIds[numPeggingCardsPlayed]).style.visibility = "visible";
    if (numPeggingCardsPlayed < maxNumPeggingCards) {
        numPeggingCardsPlayed++;
    }
}

function clearPeggingCards() {
    for (var slot in peggingCardSlotIds) {
        document.getElementById(peggingCardSlotIds[slot]).style.visibility = "hidden";
    }
    numPeggingCardsPlayed = 0;
}