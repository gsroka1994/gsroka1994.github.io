function peg(player, score) {
    var p = document.getElementById(player).style;

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
                if ((score % 5) == 1) {
                    p.right = String((parseFloat(p.right)+2.2))+"vw";
                } else {
                    p.right = String((parseFloat(p.right)+1.5))+"vw";
                }
            } else {
                if ((score % 5) == 1) {
                    p.right = String((parseFloat(p.right)+2.2))+"vw";
                } else {
                    p.right = String((parseFloat(p.right)+1.5))+"vw";
                }
            }
            break;
        case (score == 37):
            if(player == "p1") {
                p.right = "77.8vw";
                p.bottom = "8.1vh";
            } else {
                p.right = "74.8vw";
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
            } else {
                p.right = "70vw";
            }
            break;
        case (score < 77):
            if(player == "p1") {
                if ((score % 5) == 1) {
                    p.right = String((parseFloat(p.right)-2.2))+"vw";
                } else {
                    p.right = String((parseFloat(p.right)-1.5))+"vw";
                }
            } else {
                if ((score % 5) == 1) {
                    p.right = String((parseFloat(p.right)-2.2))+"vw";
                } else {
                    p.right = String((parseFloat(p.right)-1.5))+"vw";
                }
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
                if ((score % 5) == 1) {
                    p.right = String((parseFloat(p.right)+2.2))+"vw";
                } else {
                    p.right = String((parseFloat(p.right)+1.5))+"vw";
                }
            } else {
                if ((score % 5) == 1) {
                    p.right = String((parseFloat(p.right)+2.2))+"vw";
                } else {
                    p.right = String((parseFloat(p.right)+1.5))+"vw";
                }
            }
            break;
        case (score == 121):
            if(player == "p1") {
                p.right = "81.5vw";
            } else {
                p.right = "82vw";
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
