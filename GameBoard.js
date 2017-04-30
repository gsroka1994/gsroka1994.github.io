var p1_peg = 0;
var p2_peg = 0;

function peg(player, score) {
    var x; var p;

    if(player == "p1") {
        p = document.getElementById("p1_peg"+p1_peg).style;
        p1_peg = (p1_peg + 1) % 2;
    } else {
        p = document.getElementById("p2_peg"+p2_peg).style;
        p2_peg = (p2_peg + 1) % 2;
    }

    switch(true) {
        case (score == 1):
            if(player == "p1") {
                p.bottom = "6.1vh";
                p.right = "14vw";
            } else {
                p.bottom = "14.3vh";
                p.right = "14.4vw";
            }
            break;
        case (score < 37):
            if(player == "p1") {
                x = Math.floor((score-1)/5);
                p.right = String(((score-x-1)*1.5 + x*2.2)+14)+"vw";
                p.bottom = "6.1vh";
            } else {
                x = Math.floor((score-1)/5);
                p.right = String(((score-x-1)*1.5 + x*2.2)+14.4)+"vw";
                p.bottom = "14.3vh";
            }
            break;
        case (score == 37):
            if(player == "p1") {
                p.right = "77.8vw";
                p.bottom = "8.1vh";
            } else {
                p.right = "74.8vw";
                p.bottom = "14.3vh";
            }
            break;
        case (score == 38):
            if(player == "p1") {
                p.right = "80.4vw";
                p.bottom = "17.1vh";
            } else {
                p.right = "75.5vw";
                p.bottom = "16.8vh";
            }
            break;
        case (score == 39):
            if(player == "p1") {
                p.right = "77.8vw";
                p.bottom = "26.1vh";
            } else {
                p.right = "74.2vw";
                p.bottom = "19.6vh";
            }
            break;
        case (score == 40):
            if(player == "p1") {
                p.right = "72vw";
                p.bottom = "28.3vh";
            } else {
                p.right = "72.2vw";
                p.bottom = "20.2vh";
            }
            break;
        case (score == 41):
            if(player == "p1") {
                p.right = "69.6vw";
                p.bottom = "28.3vh";
            } else {
                p.right = "70vw";
                p.bottom = "20.2vh";
            }
            break;
        case (score < 77):
            if(player == "p1") {
                x = Math.floor((score-41)/5);
                p.right = String(69.6 - ((score-41-x)*1.5 + x*2.2))+"vw";
                p.bottom = "28.3vh";
            } else {
                x = Math.floor((score-41)/5);
                p.right = String(70 - ((score-41-x)*1.5 + x*2.2))+"vw";
                p.bottom = "20.2vh";
            }
            break;
        case (score == 77):
            if(player == "p1") {
                p.right = "9.5vw";
                p.bottom = "29.2vh";
            } else {
                p.right = "7vw";
                p.bottom = "22.6vh";
            }
            break;
        case (score == 78):
            if(player == "p1") {
                p.right = "8.8vw";
                p.bottom = "32.2vh";
            } else {
                p.right = "4vw";
                p.bottom = "31.6vh";
            }
            break;
        case (score == 79):
            if(player == "p1") {
                p.right = "9.5vw";
                p.bottom = "34.2vh";
            } else {
                p.right = "7vw";
                p.bottom = "40.6vh";
            }
            break;
        case (score == 80):
            if(player == "p1") {
                p.right = "12vw";
                p.bottom = "34.6vh";
            } else {
                p.right = "12.4vw";
                p.bottom = "42.8vh";
            }
            break;
        case (score < 121):
            if(player == "p1") {
                x = Math.ceil((score-80)/5);
                p.right = String(((score-x-80)*1.5 + x*2.2)+12)+"vw";
                p.bottom = "34.6vh";
            } else {
                x = Math.ceil((score-80)/5);
                p.right = String(((score-x-80)*1.5 + x*2.2)+12.4)+"vw";
                p.bottom = "42.8vh";
            }
            break;
        case (score >= 121):
            if(player == "p1") {
                p.right = "81.5vw";
                p.bottom = "34.6vh";
            } else {
                p.right = "82vw";
                p.bottom = "43.8vh";
            }
            break;
        default:
            if(player == "p1") {
                p.right = "7vw";
                p.bottom = "6.1vh";
            } else {
                p.right = "7.4vw";
                p.bottom = "14.3vh";
            }
    }
}
