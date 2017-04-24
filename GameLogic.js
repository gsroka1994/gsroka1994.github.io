//Initialize the deck
init();

//Deal to the players from the deck
deal();

//Get the turn up card from the deck
turnUpCard();

var straightCombos3 = [
						[1,2,3],
						[2,3,4],
						[3,4,5],
						[4,5,6],
						[5,6,7],
						[6,7,8],
						[7,8,9],
						[8,9,10],
						[10,11,12],
						[11,12,13]
						];
						
var straightCombos4 = [
						[1,2,3,4],
						[2,3,4,5],
						[3,4,5,6],
						[4,5,6,7],
						[5,6,7,8],
						[6,7,8,9]
						];
						
var straightCombos5 = [
						[1,2,3,4,5],
						[2,3,4,5,6],
						[3,4,5,6,7],
						[4,5,6,7,8]
						];
						
var straightCombos6 = [
						[1,2,3,4,5,6],
						[2,3,4,5,6,7]
						];
						
var straightCombos7 = [1,2,3,4,5,6,7];

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
		return 13;
	}
	else {
		return 1;
	}
}

// Sorting and comparison functions for straights
function st3(pile){
	var sortedPile = pile.sort();
	for(var i = 0; i < straightCombos3.length; i++){
			if(sortedPile.toString() == straightCombos3[i].toString()){
				return 3;
			}
	}
	return 0;
}

function st4(pile){
	var sortedPile = pile.sort();
	for(var i = 0; i < straightCombos4.length; i++){
			if(sortedPile.toString() == straightCombos4[i].toString()){
				return 4;
			}
	}
	return 0;
}

function st5(pile){
	var sortedPile = pile.sort();
	for(var i = 0; i < straightCombos5.length; i++){
			if(sortedPile.toString() == straightCombos5[i].toString()){
				return 5;
			}
	}
	return 0;
}

function st6(pile){
	var sortedPile = pile.sort();
	for(var i = 0; i < straightCombos6.length; i++){
			if(sortedPile.toString() == straightCombos6[i].toString()){
				return 6;
			}
	}
	return 0;
}

function st7(pile){
	var sortedPile = pile.sort();
	for(var i = 0; i < straightCombos7.length; i++){
			if(sortedPile.toString() == straightCombos7[i].toString()){
				return 7;
			}
	}
	return 0;
}

function testS(){
	var pile = [8,7,2,9,10,7,6];
	var test = straight(pile);
	console.log(test);
}

function testScoring(){
	var pile = [];
	var test = scorePegging(pile);
	console.log(test);
}

// Determines whether a straight was made during pegging
function straight(pile){
	var size = pile.length;
	var s3,s4,s5,s6,s7;
	
	if (size < 3){
		return 0;
	}

	s7 = st7(pile.slice(Math.max(pile.length - 7, 0)));
	if(s7 != 0){
		return s7;
	}
	s6 = st6(pile.slice(Math.max(pile.length - 6, 0)));
	if(s6 != 0){
		return s6;
	}
	s5 = st5(pile.slice(Math.max(pile.length - 5, 0)));
	if(s5 != 0){
		return s5;
	}
	s4 = st4(pile.slice(Math.max(pile.length - 4, 0)));
	if(s4 != 0){
		return s4;
	}
	s3 = st3(pile.slice(Math.max(pile.length - 3, 0)));
	if(s3 != 0){
		return s3;
	}
	
	return 0;
}

// Converts an entire hand to numeric values
function assignValues(cards){
	var newHand = [];
	var cardValue;
	for (var i = 0; i < cards.length; i++){
		cardValue = checkValue(cards[i]);
		newHand[i] = cardValue;
	}
	return newHand
}

// Sums for potential 15 during pegging
function sumFifteen(pile){
	 var sum = 0;
	 var size = pile.length;
	 for (var i = 0; i < size; i++){
		 if (pile[i] > 10){
			 sum += 10;
		 }
		 else {
			 sum += pile[i];
		 }
	 }
	if (sum == 15){
		return 2;  
	}
	else{
		return 0;  
	}
}

// Sums for potential 31 during pegging
function sumThirtyOne(pile){
	 var sum = 0;
	 var size = pile.length;
	 for (var i = 0; i < size; i++){
		 if (pile[i] > 10){
			 sum += 10;
		 }
		 else {
			 sum += pile[i];
		 }
	 }
	if (sum == 31){
		return 2;  
	}
	else{
		return 0;  
	}
}



// Scores the daunting pegging round
function scorePegging(cards){
	var size = cards.length;
	var score = 0;
	var pile = assignValues(cards);

	if(size == 1){
		return score;
	}

    else if (size == 2){
        if(pile[0] == pile[1]){
            score += 2;
        }
    }

    else if (size == 3){
        if(pile[1] == pile[2] && pile[1] != pile[0]){
            score+=2;
        }
        else if(pile[0] == pile[1] && pile[0] == pile[2]){
            score+=6;
        }
        else {
            // Do Nothing
        }
    }

	else if (size >= 4){
		if(pile[size-1] == pile[size-2] && pile[size-1] == pile[size - 3] && pile[size -1] == pile[size - 4]){
			score += 12;
		}
		else {
			if (pile[size-1] == pile[size-2] && pile[size-1] == pile[size - 3] && pile[size -1] != pile[size - 4]){
				score += 6;
			}
			else {
				if(pile[size-1] == pile[size-2] && pile[size-1] != pile[size - 3] ){
					score += 2;
				}
			}
		}
	}


	score += straight(pile);
	score += sumFifteen(pile);
	score += sumThirtyOne(pile);

	return score;  
}

