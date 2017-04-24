//Initialize the deck
//init();

//Deal to the players from the deck
//deal();

//Get the turn up card from the deck
//turnUpCard();


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

// Clears crib, hands, and pile
function clearNewTurn(){
	p1Hand = [];
	p2Hand = [];
	crib = [];
	pile = [];
}

// Converts JSON card into a numeric value to score with ease
function checkValue(card){
	var value = card.value;  
	if (value == "2"){
		return 2; 
	}
	else if (value == "3"){
		return 3; 
	}
	else if (value == "4"){
		return 4; 
	}
	else if (value == "5"){
		return 5; 
	}
	else if (value == "6"){
		return 6; 
	}
	else if (value == "7"){
		return 7; 
	}
	else if (value == "8"){
		return 8; 
	}
	else if (value == "9"){
		return 9; 
	}
	else if (value == "10"){
		return 10; 
	}
	else if (value == "JACK"){
		return 11; 
	}
	else if (value == "QUEEN"){
		return 12; 
	}
	else if (value == "KING"){
		return 14; 
	}
	else {
		return 1;
	}
}

function straight(pile){
	var straightExists;
	int size = pile.length();
	if (size == 3){
		
	}
}

function assignValues(hand){
	var newHand = [];
	var cardValue;
	for (i = 0; i < hand.length(); i++){
		cardValue = checkValue(hand[i]);
		newHand[i] = cardValue;
	}
	return newHand
}

function scorePegging(pile){
	boolean thirtyOne = false;
	int size = pile.length();
	if(size == 1){
		return 0;
	}
	else if (size == 2){
		if(pile[0].value == pile[1].value){
			return 2; 
		}
	}
	else if (size == 3){
		if(pile[1].value == pile[2].value){
			return 2; 
		}
		if(pile[0].value == pile[1].value && pile[0].value == pile[2].value){
			return 6; 
		}
		if(straight(pile) == "yessir"){
			return 3;
		}
	}
}