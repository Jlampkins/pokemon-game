// (function(){// <--------- comment out to use console.log
"use strict";

//declaring api var
let xhr = $.get('https://api.pokemontcg.io/v1/cards');
let card1 = '';
let card2 = '';
let player1Hp = 0;
let player2Hp = 0;
let player1Attack = 0;
let player1Attack2 = 0;
let player2Attack = 0;
let player2Attack2 = 0;
let html = '';
let player1Turn = true;
let player2Turn = false;
let gameIsWon = false;
let squirtle = $.get("https://api.pokemontcg.io/v1/cards/sm9-23");
let charmander = $.get("https://api.pokemontcg.io/v1/cards/sm3-18");
let bulba = $.get("https://api.pokemontcg.io/v1/cards/bw5-1");
let pika = $.get("https://api.pokemontcg.io/v1/cards/xy12-35");
let arr = [pika,bulba,charmander,squirtle];
let random = Math.floor(Math.random() * arr.length);
let random2 = Math.floor(Math.random() * arr.length);
let randomFromArr1 = arr[random];
let randomFromArr2 = arr[random2];

/** music **/
$("#battle-btn").click(function() {
    $("#my_audio").get(0).play();
});

randomFromArr2.done(function(data) {
    console.log(data);
    card2 += `<img alt="pokemon" src="${data.card.imageUrl}"/>`;
    // player1Hp = data.card.hp;
    player2Hp = data.card.hp;
    player2Attack = data.card.attacks[0].damage;
    player2Attack2 = data.card.attacks[1].damage;

    $('#card1').html(card1);
    $('#card2').html(card2);
    $('#hp-bar-one').css("background-color", "blue").html("HP " + player1Hp);
    $('#hp-bar-two').css("background-color", "red").html("HP " + player2Hp);
    $('#C1attack1').html("Attack");
    $('#C2attack1').html("Attack");

    hideElementsBasedOnPlayerTurn();

    /** player two attack **/
    $("#C2attack1").click(function(){
        let randomNum = Math.floor(Math.random() * Math.floor(2));
        // player1Hp -= player2Attack;
        if(randomNum === 0){
            player1Hp = player1Hp - player2Attack;
            console.log(player2Attack);
            $('#hp-bar-one').html("HP " + player1Hp);
        } else if( randomNum === 1){
            player1Hp = player1Hp - player2Attack2;
            $('#hp-bar-one').html("HP " + player1Hp);
        }
        player2Turn = false;
        player1Turn = true;
        hideElementsBasedOnPlayerTurn();
        checkPlayerHp();
        victoryDance();
    });

}); // end of done function for player2


// document done function for player 1
randomFromArr1.done(function(data) {
    console.log(data);
    card1 += `<img alt="" src="${data.card.imageUrl}"/>`;
    // card2 += `<img alt="" src="${data.card.imageUrl}"/>`;
    player1Hp = data.card.hp;
    // player2Hp = data.card.hp;
    player1Attack = data.card.attacks[0].damage;
    player1Attack2 = data.card.attacks[1].damage;
    console.log(data.card.attacks[0].damage);
    console.log(data.card.attacks[1].damage);
    // player2Attack = data.card.attacks[0].damage;
    // player2Attack2 = data.card.attacks[1].damage;

    $('#card1').html(card1);
    $('#card2').html(card2);
    $('#hp-bar-one').html("HP " + player1Hp);
    $('#hp-bar-two').html("HP " + player2Hp);
    $('#C1attack1').html("Attack");
    $('#C2attack1').css("background-color","red").html("Attack");

    hideElementsBasedOnPlayerTurn();

    /** player one attack **/
    $("#C1attack1").click(function() {
        let randomNum = Math.floor(Math.random() * Math.floor(2));

        // choosing attack 1 or 2 base off random number
        if(randomNum === 0){
            // player2Hp -= player1Attack;
            player2Hp = player2Hp - player1Attack;
            $('#hp-bar-two').html("HP " + player2Hp);
        } else if( randomNum === 1) {
            // player2Hp -= player1Attack2;
            player2Hp = player2Hp - player1Attack2;
            $('#hp-bar-two').html("HP " + player2Hp);
        }
        player2Turn = true;
        player1Turn = false;
        hideElementsBasedOnPlayerTurn();
        checkPlayerHp();
        victoryDance();
    });
}); // end of done function for player 1

function checkPlayerHp() {
    let sound1 = new Audio('audio/victory.mp3');
    if (player2Hp <= 0) {
        $("#my_audio").get(0).pause();
        sound1.play();
        // $(".navbar").hide();
        // $("body").css("background-image", "url(img/charmander.gif)").css("background-size", "auto");
    } else if (player1Hp <= 0) {
        $("#my_audio").get(0).pause();

        // $(".navbar").hide();
        // $("body").css("background-image", "url(img/squirtle.gif)").css("background-size", "auto");
        sound1.play();
    }
}

function victoryDance() {
    if (player1Hp <= 0 && randomFromArr2 === pika) {
        $("#battle-btn").html("<img src=" + './img/pika2.gif' + " " + "alt=" + 'pokemon' + ">");
        $(".winner").html("<div><h1>Red Player Wins!</h1></div>").css("color", "red")
    } else if (player1Hp <= 0 && randomFromArr2 === bulba) {
        $("#battle-btn").html("<img src=" + './img/bulba4.gif' + " " + "alt=" + 'pokemon' + ">");
        $(".winner").html("<div><h1>Red Player Wins!</h1></div>").css("color", "red")
    } else if (player1Hp <= 0 && randomFromArr2 === squirtle) {
        $("#battle-btn").html("<img src=" + './img/squirtle2.gif' + " " + "alt=" + 'pokemon' + ">");
        $(".winner").html("<div><h1>Red Player Wins!</h1></div>").css("color", "red")
    } else if (player1Hp <= 0 && randomFromArr2 === charmander) {
        $("#battle-btn").html("<img src=" + './img/charmander2.gif' + " " + "alt=" + 'pokemon' + ">");
        $(".winner").html("<div><h1>Red Player Wins!</h1></div>").css("color", "red")

    } else if (player2Hp <= 0 && randomFromArr1 === pika) {
        $("#battle-btn").html("<img src=" + './img/pika2.gif' + " " + "alt=" + 'pokemon' + ">");
        $(".winner").html("<div><h1>Blue Player Wins!</h1></div>").css("color", "blue")
    } else if (player2Hp <= 0 && randomFromArr1 === bulba) {
        $("#battle-btn").html("<img src=" + './img/bulba4.gif' + " " + "alt=" + 'pokemon' + ">");
        $(".winner").html("<div><h1>Blue Player Wins!</h1></div>").css("color", "blue")
    } else if (player2Hp <= 0 && randomFromArr1 === squirtle) {
        $("#battle-btn").html("<img src=" + './img/squirtle2.gif' + " " + "alt=" + 'pokemon' + ">");
        $(".winner").html("<div><h1>Blue Player Wins!</h1></div>").css("color", "blue")
    } else if (player2Hp <= 0 && randomFromArr1 === charmander) {
        $("#battle-btn").html("<img src=" + './img/charmander2.gif' + " " + "alt=" + 'pokemon' + ">");
        $(".winner").html("<div><h1>Blue Player Wins!</h1></div>").css("color", "blue")
    }
}


function hideElementsBasedOnPlayerTurn() {
    if(player1Turn === true) {
        $("#C2attack1").hide();
        $("#C1attack1").show();
    } else if (player2Turn === true) {
        $("#C1attack1").hide();
        $("#C2attack1").show();
    }
}


// })();