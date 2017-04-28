var deck;
var deckID;
var numCards;
var cutCard;
var p1h = [];
var p2h = [];
var tempHand = [];
var dealerCards = [];

function init(){
		$.ajax({
			url:'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
			dataType: 'json',
			async:false,
			success: function(data) {
				deck = data;
				deckID =  deck.deck_id;
                numCards = deck.remaining;
			}
		});
}

function getDealer(){
    $.ajax({
        url:'https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=2',
        dataType:'json',
        async:false,
        success:function(data){
            dealerCards[0] = data.cards[0];
            dealerCards[1] = data.cards[1];
            numCards = data.remaining;
        }
    });
}

function deal(){
			$.ajax({
				url:'https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=6',
				dataType:'json',
                async:false,
                success:function(data){
					p1h = data.cards;
					numCards = data.remaining;
				}
			});
			$.ajax({
                url:'https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=6',
				dataType:'json',
				async:false,
				success:function(data){
					p2h = data.cards;
                    numCards = data.remaining;
                }
			});

			p1h.sort(function(a, b){
				if(a.value == "KING"){a.value=13};
                if(a.value == "QUEEN"){a.value=12};
                if(a.value == "JACK"){a.value=11};
                if(a.value == "ACE"){a.value=1};
                if(b.value == "KING"){b.value=13};
                if(b.value == "QUEEN"){b.value=12};
                if(b.value == "JACK"){b.value=11};
                if(b.value == "ACE"){b.value=1};

				return parseFloat(a.value) - parseFloat(b.value)
			});
    		p2h.sort(function(a, b){
        		if(a.value == "KING"){a.value=13};
        		if(a.value == "QUEEN"){a.value=12};
        		if(a.value == "JACK"){a.value=11};
        		if(a.value == "ACE"){a.value=1};
        		if(b.value == "KING"){b.value=13};
        		if(b.value == "QUEEN"){b.value=12};
        		if(b.value == "JACK"){b.value=11};
        		if(b.value == "ACE"){b.value=1};

        		return parseFloat(a.value) - parseFloat(b.value)
    		});
}

function turnUpCard(){
	$.ajax({
		url:'https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1',
		dataType:'json',
		async:false,
		success:function(data){
			cutCard = data.cards[0];
			numCards = data.remaining;
		}
	});
}

function shuffle(){
		$.ajax({
			url:'https://deckofcardsapi.com/api/deck/' + deckID + '/shuffle/',
			dataType: 'json',
            async:false,
            success: function(data) {
				numCards = data.remaining;
			}
		});
}



