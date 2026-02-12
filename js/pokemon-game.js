// (function(){// <--------- comment out to use console.log
"use strict";
// pika,bulba,charmander,squirtle,jigglypuff,cubone,dratini,oddish,growlithe,evee, poliwag,
//declaring api var
let xhr = $.get('https://api.pokemontcg.io/v1/cards');
let card1 = '';
let card2 = '';
let player1Hp = 0;
let player2Hp = 0;
let player1MaxHp = 0;
let player2MaxHp = 0;
let player1Attack = 0;
let player1Attack2 = 0;
let player2Attack = 0;
let player2Attack2 = 0;
let html = '';
let player1Name='';
let player2Name='';
let player1Turn = true;
let player2Turn = false;
let gameIsWon = false;
let squirtle = $.get("https://api.pokemontcg.io/v1/cards/sm9-23");
let charmander = $.get("https://api.pokemontcg.io/v1/cards/sm3-18");
let bulba = $.get("https://api.pokemontcg.io/v1/cards/bw5-1");
let pika = $.get("https://api.pokemontcg.io/v1/cards/xy12-35");
let psyduck= $.get("https://api.pokemontcg.io/v1/cards/xy9-16");
let jigglypuff= $.get("https://api.pokemontcg.io/v1/cards/xy10-65");
let ratata = $.get("https://api.pokemontcg.io/v1/cards/bw9-87");
let cubone = $.get("https://api.pokemontcg.io/v1/cards/bw6-60");
let dratini = $.get("https://api.pokemontcg.io/v1/cards/bw9-81");
let oddish = $.get("https://api.pokemontcg.io/v1/cards/dp6-112");
let growlithe = $.get("https://api.pokemontcg.io/v1/cards/pl3-108");
let evee = $.get("https://api.pokemontcg.io/v1/cards/ex11-69");
let poliwag = $.get("https://api.pokemontcg.io/v1/cards/hgss2-58");
let arr = [pika,bulba,charmander,squirtle,jigglypuff,cubone,dratini,oddish,growlithe,evee, poliwag, psyduck, ratata];
let random = Math.floor(Math.random() * arr.length);
let random2 = Math.floor(Math.random() * arr.length);
let randomFromArr1 = arr[random];
let randomFromArr2 = arr[random2];
let attackSound1 = new Audio('audio/slam.wav');
let attackSound2 = new Audio('audio/megakick.wav');
let missSound = new Audio('audio/withdraw1.wav');

/** music & enable attack button **/
$("#battle-btn").click(function() {
    $("#my_audio").get(0).play();
    $('#C1attack1').removeAttr('disabled');
    $('.attk-btn').css('visibility', 'visible');
});
hideElementsBasedOnPlayerTurn();
/** gets player 2 info **/
setTimeout(function(){
    randomFromArr2.done(function(data) {
        console.log(data);
        card2 += `<img alt="pokemon" src="${data.card.imageUrl}"/>`;
        player2Hp = data.card.hp;
        player2MaxHp = data.card.hp;
        player2Attack = data.card.attacks[0].damage;
        if(data.card.attacks.length >= 2) {
            player2Attack2 = data.card.attacks[1].damage;
        }
        player2Name = data.card.name;

        $('#card2').html(card2);
        $('#hp-bar-two').css("background-color", "red").css("display", "block").html("<span>HP " + player2Hp + "</span>");
        $('#C2attack1').html("Attack").css("background-color","red");

        // Enable battle button once both cards loaded
        if($('#card1').children().length > 0) {
            $('.battle-img').css('visibility', 'visible');
        }

        hideElementsBasedOnPlayerTurn();

        /** player two attack **/
        $("#C2attack1").click(function(){

            if(window.innerWidth <= 768) {
                $("#card2").animate({top: '-200px'}).animate({top: "0px"});
            } else {
                $("#card2").animate({right: '500px'}).animate({right: "-50px"});
            }
            let randomNum = Math.floor(Math.random() * Math.floor(5));
            // player1Hp -= player2Attack;
            console.log(randomNum);
            if(randomNum === 0 || randomNum === 3){
                if(player2Attack === ''){
                    player1Hp = player1Hp - player2Attack2;
                    $(".player1Damage").html("-" + player2Attack2).css("background", "yellow").fadeIn(500).fadeOut(2000);
                }else {
                    player1Hp = player1Hp - player2Attack;
                    $(".player1Damage").html("-" + player2Attack).css("background", "yellow").fadeIn(500).fadeOut(2000);
                }
            console.log(player2Attack);
            attackSound1.play();
            let damagePercent = (1 - (player1Hp / player1MaxHp)) * 100;
            $('#hp-bar-one').html("<span>HP " + player1Hp + "</span>");
            $('#hp-bar-one').css('--damage-width', damagePercent + '%');
            document.getElementById('hp-bar-one').style.setProperty('--damage-width', damagePercent + '%');
            $(".player2Damage").hide()
            } else if( randomNum === 1 || randomNum === 4){
                // if(player2Attack2 === 0){
                //     player1Hp = player1Hp - player2Attack
                // }else{
                //     player1Hp = player1Hp - player2Attack2;
                // }
                if(player2Attack2 === '' || player2Attack2 === 0){
                    player1Hp = player1Hp - player2Attack;
                    $(".player1Damage").html("-" + player2Attack).css("background", "yellow").fadeIn(500).fadeOut(2000);
                }else {
                    player1Hp = player1Hp - player2Attack2;
                    $(".player1Damage").html("-" + player2Attack2).css("background", "yellow").fadeIn(500).fadeOut(2000);
                }
            attackSound2.play();
            let damagePercent = (1 - (player1Hp / player1MaxHp)) * 100;
            $('#hp-bar-one').html("<span>HP " + player1Hp + "</span>");
            document.getElementById('hp-bar-one').style.setProperty('--damage-width', damagePercent + '%');
            $(".player2Damage").hide()
            }else if(randomNum === 2){
                missSound.play();
                $(".player1Damage").text("Dodge").css("background", "yellow").fadeIn(500).fadeOut(2000);

            }
            player2Turn = false;
            player1Turn = true;
            hideElementsBasedOnPlayerTurn();
            checkPlayerHp();
            showPlayAgainBtn();
            victoryDance();
        });
    }); // end of done function for player2
},3000);


/** gets player 1 info**/
setTimeout(function(){
    randomFromArr1.done(function(data) {
        console.log(data);
        card1 += `<img alt="" src="${data.card.imageUrl}"/>`;
        player1Hp = data.card.hp;
        player1MaxHp = data.card.hp;
        player1Attack = data.card.attacks[0].damage;
        if(data.card.attacks.length >= 2) {
            player1Attack2 = data.card.attacks[1].damage;
        }
        player1Name = data.card.name;

        $('#card1').html(card1);
        $('#hp-bar-one').css("background-color", "blue").css("display", "block").html("<span>HP " + player1Hp + "</span>");
        $('#C1attack1').css("background-color", "blue").html("Attack");

        // Enable battle button once both cards loaded
        if($('#card2').children().length > 0) {
            $('.battle-img').css('visibility', 'visible');
        }

        hideElementsBasedOnPlayerTurn();

        /** player one attack **/
        $("#C1attack1").click(function() {
            if(window.innerWidth <= 768) {
                $("#card1").animate({top: '200px'}).animate({top: "0px"});
            } else {
                $("#card1").animate({left: '500px'}).animate({left: "0px"});
            }
            let randomNum = Math.floor(Math.random() * Math.floor(5));
            console.log(randomNum);
            // choosing attack 1 or 2 base off random number
            if(randomNum === 0 || randomNum === 3){
                if(player1Attack === ''){
                    player2Hp = player2Hp - player1Attack2;
                    $(".player2Damage").html("-" + player1Attack2).css("background", "yellow").fadeIn(500).fadeOut(2000);
                }else {
                    player2Hp = player2Hp - player1Attack;
                    $(".player2Damage").html("-" + player1Attack).css("background", "yellow").fadeIn(500).fadeOut(2000);
                }
                attackSound1.play();
                let damagePercent = (1 - (player2Hp / player2MaxHp)) * 100;
                $('#hp-bar-two').html("<span>HP " + player2Hp + "</span>");
                document.getElementById('hp-bar-two').style.setProperty('--damage-width', damagePercent + '%');
                $(".player1Damage").hide();

            } else if( randomNum === 1 || randomNum === 4) {
                // if(player1Attack2 === 0){
                //     player2Hp = player2Hp - player1Attack
                // }
                if(player1Attack2 ==='' || player1Attack2 === 0){
                    player2Hp = player2Hp - player1Attack;
                    $(".player2Damage").html("-" + player1Attack).css("background", "yellow").fadeIn(500).fadeOut(2000);
                }else {
                    player2Hp = player2Hp - player1Attack2;
                    $(".player2Damage").html("-" + player1Attack2).css("background", "yellow").fadeIn(500).fadeOut(2000);
                }
                attackSound2.play();
                let damagePercent = (1 - (player2Hp / player2MaxHp)) * 100;
                $('#hp-bar-two').html("<span>HP " + player2Hp + "</span>");
                document.getElementById('hp-bar-two').style.setProperty('--damage-width', damagePercent + '%');
                $(".player1Damage").hide();
            }else if(randomNum === 2){
                missSound.play();
                $(".player2Damage").text("Dodge").css("background", "yellow").fadeIn(500).fadeOut(2000);
            }
            player2Turn = true;
            player1Turn = false;
            hideElementsBasedOnPlayerTurn();
            checkPlayerHp();
            showPlayAgainBtn();
            victoryDance();
        });
    }); // end of done function for player 1
}, 3000);

function checkPlayerHp() {
    let sound1 = new Audio('audio/victory.mp3');
    if (player2Hp <= 0) {
        $('#C2attack1').attr('disabled','disabled');
        $(".winner")
            .html("<h1>" + player1Name + " Wins!</h1>")
            .css("background-color", "blue")
            .css("display", "inline-block");
        $(".player-one").hide();
        $(".player-two").hide();
        $(".battle-img").hide();
        console.log(player2Name);
        $("#my_audio").get(0).pause();
        sound1.play();
    } else if (player1Hp <= 0) {
        $('#C1attack1').attr('disabled','disabled');
        $(".winner")
            .html("<h1>" + player2Name + " Wins!</h1>")
            .css("background-color", "red")
            .css("display", "inline-block");
        $(".player-one").hide();
        $(".player-two").hide();
        $(".battle-img").hide();
        $(".attack1Damage").hide();
        console.log(player1Name);
        $("#my_audio").get(0).pause();
        sound1.play();
    }
}



function victoryDance() {
    let pikaCry = new Audio('audio/pikaCry.mp3');
    let bulbaCry = new Audio('audio/bulba.mp3');
    let charCry = new Audio('audio/charCry.mp3');
    let squirtCry = new Audio('audio/squirtCry.mp3');
    let jigglyCry = new Audio('audio/jigglypuff.mp3');
    let cuboneCry = new Audio('audio/cubone.mp3');
    let dratiniCry = new Audio('audio/dratini.mp3');
    let growlitheCry = new Audio('audio/growlithe.mp3');
    let oddishCry = new Audio('audio/oddish.mp3');
    let eveeCry = new Audio('audio/evee.mp3');
    let poliwagCry = new Audio('audio/poliwag.mp3');
    let psyduckCry = new Audio('audio/psyduckCry.mp3');
    let rattataCry = new Audio('audio/rattata.mp3');

    if (player1Hp <= 0 && randomFromArr2 === pika) {
        pikaCry.play();
        $(".victory-dance").html("<img src=" + './img/pika2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
        // $(".winner").html("<div><h1>Red Player Wins!</h1></div>").css("color", "red")
    } else if (player1Hp <= 0 && randomFromArr2 === bulba) {
        bulbaCry.play();
        $(".victory-dance").html("<img src=" + './img/bulba4.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
        // $(".winner").html("<div><h1>Red Player Wins!</h1></div>").css("color", "red")
    } else if (player1Hp <= 0 && randomFromArr2 === squirtle) {
        squirtCry.play();
        $(".victory-dance").html("<img src=" + './img/squirtle2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
        // $(".winner").html("<div><h1>Red Player Wins!</h1></div>").css("color", "red")
    } else if (player1Hp <= 0 && randomFromArr2 === charmander) {
        charCry.play();
        $(".victory-dance").html("<img src=" + './img/charmander2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
        // $(".winner").html("<div><h1>Red Player Wins!</h1></div>").css("color", "red")
    } else if (player1Hp <= 0 && randomFromArr2 === jigglypuff) {
        jigglyCry.play();
        $(".victory-dance").html("<img src=" + './img/jigglypuff.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === cubone) {
        cuboneCry.play();
        $(".victory-dance").html("<img src=" + './img/cubone.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === dratini) {
        dratiniCry.play();
        $(".victory-dance").html("<img src=" + './img/dratini.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === growlithe) {
        growlitheCry.play();
        $(".victory-dance").html("<img src=" + './img/growlithe.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === oddish) {
        oddishCry.play();
        $(".victory-dance").html("<img src=" + './img/oddish.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === evee) {
        eveeCry.play();
        $(".victory-dance").html("<img src=" + './img/evee2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === poliwag) {
        poliwagCry.play();
        $(".victory-dance").html("<img src=" + './img/poliwag2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    }else if (player1Hp <= 0 && randomFromArr2 === psyduck) {
        psyduckCry.play();
        $(".victory-dance").html("<img src=" + './img/psyduck.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    }else if (player1Hp <= 0 && randomFromArr2 === ratata) {
        rattataCry.play();
        $(".victory-dance").html("<img src=" + './img/rattata2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");


    } else if (player2Hp <= 0 && randomFromArr1 === pika) {
        pikaCry.play();
        $(".victory-dance").html("<img src=" + './img/pika2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
        // winner$(".winner").html("<div><h1>Blue Player Wins!</h1></div>").css("color", "blue")
    } else if (player2Hp <= 0 && randomFromArr1 === bulba) {
        bulbaCry.play();
        $(".victory-dance").html("<img src=" + './img/bulba4.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
        // winner$(".winner").html("<div><h1>Blue Player Wins!</h1></div>").css("color", "blue")
    } else if (player2Hp <= 0 && randomFromArr1 === squirtle) {
        squirtCry.play();
        $(".victory-dance").html("<img src=" + './img/squirtle2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
        // winner$(".winner").html("<div><h1>Blue Player Wins!</h1></div>").css("color", "blue")
    } else if (player2Hp <= 0 && randomFromArr1 === charmander) {
        charCry.play();
        $(".victory-dance").html("<img src=" + './img/charmander2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
        // winner$(".winner").html("<div><h1>Blue Player Wins!</h1></div>").css("color", "blue")
    } else if (player2Hp <= 0 && randomFromArr1 === jigglypuff) {
        jigglyCry.play();
        $(".victory-dance").html("<img src=" + './img/jigglypuff.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === cubone) {
        cuboneCry.play();
        $(".victory-dance").html("<img src=" + './img/cubone.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === dratini) {
        dratiniCry.play();
        $(".victory-dance").html("<img src=" + './img/dratini.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === growlithe) {
        growlitheCry.play();
        $(".victory-dance").html("<img src=" + './img/growlithe.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === oddish) {
        oddishCry.play();
        $(".victory-dance").html("<img src=" + './img/oddish.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === evee) {
        eveeCry.play();
        $(".victory-dance").html("<img src=" + './img/evee2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === poliwag) {
        poliwagCry.play();
        $(".victory-dance").html("<img src=" + './img/poliwag2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === psyduck) {
        psyduckCry.play();
        $(".victory-dance").html("<img src=" + './img/psyduck.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    }else if (player2Hp <= 0 && randomFromArr1 === ratata) {
        rattataCry.play();
        $(".victory-dance").html("<img src=" + './img/rattata2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    }

} /**end of Victory Dance Function **/


function showPlayAgainBtn() {
    if (player1Hp <= 0 || player2Hp <= 0) {
        $("#reset-btn").css("display", "inline");
    }
    $("#reset-btn").on("click", function(){
        location.reload();
    });
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