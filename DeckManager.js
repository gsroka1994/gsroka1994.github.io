var deck;
var = deckID;
var = numCards;
var cutCard;
var p1Hand[];
var p2Hand[];

function init(){
		$.getJSON('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', function(data) {
			deck = data;
		});
		deckID = deck.deck_id;
		numCards = deck.remaining;
}

function deal(){
		var i;
		shuffle();
		for (i = 0, i < 6, i++){
			$.getJSON('https://deckofcardsapi.com/api/deck/deckID/draw/?count=1', function(data){
				p1Hand[i] = data.cards;
			});
			$.getJSON('https://deckofcardsapi.com/api/deck/deckID/draw/?count=1', function(data){
				p2Hand[i] = data.cards;
			});
		}
		numCards = data.remaining;
}

function topCard(){
	shuffle();
	$.getJSON('https://deckofcardsapi.com/api/deck/deckID/draw/?count=1', function(data){
			cutCard = data.cards;
			numCards = data.remaining;
		});
}

function shuffle(){
		$.getJSON('https://deckofcardsapi.com/api/deck/deckID/shuffle/', function(data){
			numCards = data.remaining;
		});
}

