// (function(){// <--------- comment out to use console.log
"use strict";
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
let pika = cardData.pikachu;
let bulba = cardData.bulbasaur;
let charmander = cardData.charmander;
let squirtle = cardData.squirtle;
let psyduck = cardData.psyduck;
let jigglypuff = cardData.jigglypuff;
let ratata = cardData.rattata;
let cubone = cardData.cubone;
let dratini = cardData.dratini;
let oddish = cardData.oddish;
let growlithe = cardData.growlithe;
let evee = cardData.eevee;
let poliwag = cardData.poliwag;
let arr = [pika,bulba,charmander,squirtle,jigglypuff,cubone,dratini,oddish,growlithe,evee, poliwag, psyduck, ratata];
let random = Math.floor(Math.random() * arr.length);
let random2 = Math.floor(Math.random() * arr.length);
let randomFromArr1 = arr[random];
let randomFromArr2 = arr[random2];
let attackSound1 = new Audio('audio/slam.wav');
let attackSound2 = new Audio('audio/megakick.wav');
let missSound = new Audio('audio/withdraw1.wav');
let musicMuted = false;
let sfxMuted = false;
let player1Poisoned = { active: false, damage: 0, turnsLeft: 0 };
let player2Poisoned = { active: false, damage: 0, turnsLeft: 0 };

// Sound button toggle
$("#sound-btn").click(function() {
    $("#sound-menu").toggle();
});

// Music toggle handler
$("#music-toggle").change(function() {
    musicMuted = !this.checked;
    if(musicMuted) $("#my_audio").get(0).pause();
    else $("#my_audio").get(0).play();
});

// Sound effects toggle handler
$("#sfx-toggle").change(function() {
    sfxMuted = !this.checked;
});

// Summons a random helper Pokemon for Call for Family attack
function callForFamily(excludePokemon) {
    let availablePokemon = arr.filter(p => p !== excludePokemon);
    let helper = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
    let helperAttack = helper.attacks[Math.floor(Math.random() * helper.attacks.length)];
    return { pokemon: helper, damage: helperAttack.damage || "10", name: helper.name, attackName: helperAttack.name };
}

/** music & enable attack button **/
$("#battle-btn").click(function() {
    $("#my_audio").get(0).play();
    $('#C1attack1').removeAttr('disabled');
    $('.attk-btn').css('visibility', 'visible');
});
hideElementsBasedOnPlayerTurn();

/** gets player 2 info **/
let data2 = randomFromArr2;
card2 += `<img alt="pokemon" src="${data2.imageUrl}"/>`;
player2Hp = data2.hp;
player2MaxHp = data2.hp;
player2Attack = data2.attacks[0].damage;
if(data2.attacks.length >= 2) {
    player2Attack2 = data2.attacks[1].damage;
}
player2Name = data2.name;

$('#hp-bar-two').css("background-color", "red").html("<span>HP " + player2Hp + "</span>");
$('#C2attack1').html("Attack").css("background-color","red");

/** gets player 1 info**/
let data1 = randomFromArr1;
card1 += `<img alt="" src="${data1.imageUrl}"/>`;
player1Hp = data1.hp;
player1MaxHp = data1.hp;
player1Attack = data1.attacks[0].damage;
if(data1.attacks.length >= 2) {
    player1Attack2 = data1.attacks[1].damage;
}
player1Name = data1.name;

$('#hp-bar-one').css("background-color", "blue").html("<span>HP " + player1Hp + "</span>");
$('#C1attack1').css("background-color", "blue").html("Attack");

setTimeout(() => {
    $('#card2').html(card2);
    $('#card1').html(card1);
    $('#hp-bar-one').css("display", "block");
    $('#hp-bar-two').css("display", "block");
    $('.battle-img').css('visibility', 'visible');
}, 2000);

hideElementsBasedOnPlayerTurn();

/** player two attack **/
$("#C2attack1").click(function(){
    if(player2Poisoned.active && player2Poisoned.turnsLeft > 0) {
        player2Hp -= player2Poisoned.damage;
        $(".player2Damage").html("-" + player2Poisoned.damage + " 🧪").css("background", "purple").fadeIn(300).fadeOut(1000);
        let damagePercent = (1 - (player2Hp / player2MaxHp)) * 100;
        $('#hp-bar-two').html("<span>HP " + player2Hp + "</span>");
        document.getElementById('hp-bar-two').style.setProperty('--damage-width', damagePercent + '%');
        player2Poisoned.turnsLeft--;
        if(player2Poisoned.turnsLeft === 0) player2Poisoned.active = false;
        if(player2Hp <= 0) {
            setTimeout(() => {
                checkPlayerHp();
                showPlayAgainBtn();
                victoryDance();
            }, 1200);
            return;
        }
        setTimeout(continueAttack, 1200);
        return;
    }
    
    let healthPercent = player2Hp / player2MaxHp;
    let hasHealAttack = data2.attacks.find(a => a.heal);
    if(healthPercent <= 0.5 && hasHealAttack && Math.random() < 0.5) {
        player2Hp = Math.min(player2Hp + parseInt(hasHealAttack.heal), player2MaxHp);
        $(".player2Damage").html("+" + hasHealAttack.heal + " ❤️").css("background", "lightgreen").fadeIn(300).fadeOut(1000);
        let healPercent = (1 - (player2Hp / player2MaxHp)) * 100;
        $('#hp-bar-two').html("<span>HP " + player2Hp + "</span>");
        document.getElementById('hp-bar-two').style.setProperty('--damage-width', healPercent + '%');
        setTimeout(() => {
            player2Turn = false;
            player1Turn = true;
            hideElementsBasedOnPlayerTurn();
        }, 1200);
        return;
    }
    continueAttack();
    
    function continueAttack() {
        let randomNum = Math.floor(Math.random() * Math.floor(5));
        let distance = window.innerWidth <= 768 ? '200px' : '500px';
        let attackDamage = player2Attack;
        let attackDamage2 = player2Attack2;
        let selectedAttackIndex = (randomNum === 0 || randomNum === 3) ? 0 : 1;
        let selectedAttackData = data2.attacks[selectedAttackIndex] || data2.attacks[0];
        let attackName = selectedAttackData.name;

        if (selectedAttackData.heal && randomNum !== 2) {
            player2Hp = Math.min(player2Hp + parseInt(selectedAttackData.heal), player2MaxHp);
            $(".player2Damage").html("+" + selectedAttackData.heal + " ❤️").css("background", "lightgreen").fadeIn(300).fadeOut(1000);
            let healPercent = (1 - (player2Hp / player2MaxHp)) * 100;
            $('#hp-bar-two').html("<span>HP " + player2Hp + "</span>");
            document.getElementById('hp-bar-two').style.setProperty('--damage-width', healPercent + '%');
            setTimeout(() => {
                player2Turn = false;
                player1Turn = true;
                hideElementsBasedOnPlayerTurn();
            }, 1200);
            return;
        }

        if (selectedAttackData.summon && randomNum !== 2) {
            let helper = callForFamily(randomFromArr2);
            $(".player2Damage").html(attackName).css("background", "lightgreen").fadeIn(200).fadeOut(600);
            setTimeout(() => {
                $("#card2").html(`<img alt="helper" src="${helper.pokemon.imageUrl}"/>`);
                $(".player2Damage").html(helper.name + "!").css("background", "lightblue").fadeIn(200).fadeOut(600);
                setTimeout(() => {
                    $(".player2Damage").html(helper.attackName).css("background", "lightgreen").fadeIn(200).fadeOut(600);
                    setTimeout(() => {
                        $("#card2").animate({ right: distance }, 400, 'swing', function () {
                            if (randomNum !== 2 && !sfxMuted) {
                                if (randomNum === 0 || randomNum === 3) attackSound1.play();
                                else attackSound2.play();
                            }
                        }).animate({ right: "0px" }, 400, 'swing');
                        attackDamage = helper.damage;
                        attackDamage2 = helper.damage;
                        setTimeout(() => {
                            $("#card2").html(card2);
                            executeAttack();
                        }, 800);
                    }, 600);
                }, 600);
            }, 600);
            return;
        }

        $(".player2Damage").html(attackName).css("background", "lightgreen").fadeIn(200).fadeOut(600);
        setTimeout(() => {
            $("#card2").animate({ right: distance }, 400, 'swing', function () {
                if (randomNum !== 2 && !sfxMuted) {
                    if (randomNum === 0 || randomNum === 3) attackSound1.play();
                    else attackSound2.play();
                }
            }).animate({ right: "0px" }, 400, 'swing');
            setTimeout(() => executeAttack(), 800);
        }, 600);
    
        function executeAttack() {
        if(randomNum === 0 || randomNum === 3){
            if(attackDamage === ''){
                player1Hp = player1Hp - attackDamage2;
                $(".player1Damage").html("-" + attackDamage2).css("background", "yellow").fadeIn(500).fadeOut(2000);
            }else {
                player1Hp = player1Hp - attackDamage;
                $(".player1Damage").html("-" + attackDamage).css("background", "yellow").fadeIn(500).fadeOut(2000);
            }
            if(selectedAttackData.poison) {
                player1Poisoned = { active: true, damage: selectedAttackData.poison, turnsLeft: selectedAttackData.poisonTurns };
                setTimeout(() => $(".player1Damage").html("Poisoned!").css("background", "purple").fadeIn(300).fadeOut(1000), 2000);
            }
            console.log(attackDamage);
            let damagePercent = (1 - (player1Hp / player1MaxHp)) * 100;
            $('#hp-bar-one').html("<span>HP " + player1Hp + "</span>");
            $('#hp-bar-one').css('--damage-width', damagePercent + '%');
            document.getElementById('hp-bar-one').style.setProperty('--damage-width', damagePercent + '%');
            $(".player2Damage").hide()
        } else if( randomNum === 1 || randomNum === 4){
            if(attackDamage2 === '' || attackDamage2 === 0){
                player1Hp = player1Hp - attackDamage;
                $(".player1Damage").html("-" + attackDamage).css("background", "yellow").fadeIn(500).fadeOut(2000);
            }else {
                player1Hp = player1Hp - attackDamage2;
                $(".player1Damage").html("-" + attackDamage2).css("background", "yellow").fadeIn(500).fadeOut(2000);
            }
            if(selectedAttackData.poison) {
                player1Poisoned = { active: true, damage: selectedAttackData.poison, turnsLeft: selectedAttackData.poisonTurns };
                setTimeout(() => $(".player1Damage").html("Poisoned!").css("background", "purple").fadeIn(300).fadeOut(1000), 2000);
            }
            let damagePercent = (1 - (player1Hp / player1MaxHp)) * 100;
            $('#hp-bar-one').html("<span>HP " + player1Hp + "</span>");
            document.getElementById('hp-bar-one').style.setProperty('--damage-width', damagePercent + '%');
            $(".player2Damage").hide()
        }else if(randomNum === 2){
            if(!sfxMuted) missSound.play();
            $(".player1Damage").text("Dodge").css("background", "yellow").fadeIn(500).fadeOut(2000);
        }
        player2Turn = false;
        player1Turn = true;
        hideElementsBasedOnPlayerTurn();
        checkPlayerHp();
        showPlayAgainBtn();
        victoryDance();
        }
    }
});

/** player one attack **/
$("#C1attack1").click(function() {
    if(player1Poisoned.active && player1Poisoned.turnsLeft > 0) {
        player1Hp -= player1Poisoned.damage;
        $(".player1Damage").html("-" + player1Poisoned.damage + " 🧪").css("background", "purple").fadeIn(300).fadeOut(1000);
        let damagePercent = (1 - (player1Hp / player1MaxHp)) * 100;
        $('#hp-bar-one').html("<span>HP " + player1Hp + "</span>");
        document.getElementById('hp-bar-one').style.setProperty('--damage-width', damagePercent + '%');
        player1Poisoned.turnsLeft--;
        if(player1Poisoned.turnsLeft === 0) player1Poisoned.active = false;
        if(player1Hp <= 0) {
            setTimeout(() => {
                checkPlayerHp();
                showPlayAgainBtn();
                victoryDance();
            }, 1200);
            return;
        }
        setTimeout(continueAttack, 1200);
        return;
    }
    
    let healthPercent = player1Hp / player1MaxHp;
    let hasHealAttack = data1.attacks.find(a => a.heal);
    if(healthPercent <= 0.5 && hasHealAttack && Math.random() < 0.5) {
        player1Hp = Math.min(player1Hp + parseInt(hasHealAttack.heal), player1MaxHp);
        $(".player1Damage").html("+" + hasHealAttack.heal + " ❤️").css("background", "lightgreen").fadeIn(300).fadeOut(1000);
        let healPercent = (1 - (player1Hp / player1MaxHp)) * 100;
        $('#hp-bar-one').html("<span>HP " + player1Hp + "</span>");
        document.getElementById('hp-bar-one').style.setProperty('--damage-width', healPercent + '%');
        setTimeout(() => {
            player2Turn = true;
            player1Turn = false;
            hideElementsBasedOnPlayerTurn();
        }, 1200);
        return;
    }
    continueAttack();
    
    function continueAttack() {
    let randomNum = Math.floor(Math.random() * Math.floor(5));
    let distance = window.innerWidth <= 768 ? '200px' : '500px';
    let attackDamage = player1Attack;
    let attackDamage2 = player1Attack2;
    let selectedAttackIndex = (randomNum === 0 || randomNum === 3) ? 0 : 1;
    let selectedAttackData = data1.attacks[selectedAttackIndex] || data1.attacks[0];
    let attackName = selectedAttackData.name;
    
    if(selectedAttackData.heal && randomNum !== 2) {
        player1Hp = Math.min(player1Hp + parseInt(selectedAttackData.heal), player1MaxHp);
        $(".player1Damage").html("+" + selectedAttackData.heal + " ❤️").css("background", "lightgreen").fadeIn(300).fadeOut(1000);
        let healPercent = (1 - (player1Hp / player1MaxHp)) * 100;
        $('#hp-bar-one').html("<span>HP " + player1Hp + "</span>");
        document.getElementById('hp-bar-one').style.setProperty('--damage-width', healPercent + '%');
        setTimeout(() => {
            player2Turn = true;
            player1Turn = false;
            hideElementsBasedOnPlayerTurn();
        }, 1200);
        return;
    }
    
    if(selectedAttackData.summon && randomNum !== 2) {
        let helper = callForFamily(randomFromArr1);
        $(".player1Damage").html(attackName).css("background", "lightgreen").fadeIn(200).fadeOut(600);
        setTimeout(() => {
            $("#card1").html(`<img alt="helper" src="${helper.pokemon.imageUrl}"/>`);
            $(".player1Damage").html(helper.name + "!").css("background", "lightblue").fadeIn(200).fadeOut(600);
            setTimeout(() => {
                $(".player1Damage").html(helper.attackName).css("background", "lightgreen").fadeIn(200).fadeOut(600);
                setTimeout(() => {
                    $("#card1").animate({left: distance}, 400, 'swing', function() {
                        if(randomNum !== 2 && !sfxMuted) {
                            if(randomNum === 0 || randomNum === 3) attackSound1.play();
                            else attackSound2.play();
                        }
                    }).animate({left: "0px"}, 400, 'swing');
                    attackDamage = helper.damage;
                    attackDamage2 = helper.damage;
                    setTimeout(() => {
                        $("#card1").html(card1);
                        executeAttack();
                    }, 800);
                }, 600);
            }, 600);
        }, 600);
        return;
    }
    
    $(".player1Damage").html(attackName).css("background", "lightgreen").fadeIn(200).fadeOut(600);
    setTimeout(() => {
        $("#card1").animate({left: distance}, 400, 'swing', function() {
            if(randomNum !== 2 && !sfxMuted) {
                if(randomNum === 0 || randomNum === 3) attackSound1.play();
                else attackSound2.play();
            }
        }).animate({left: "0px"}, 400, 'swing');
        setTimeout(() => executeAttack(), 800);
    }, 600);
    
    function executeAttack() {
        if(randomNum === 0 || randomNum === 3){
            if(attackDamage === ''){
                player2Hp = player2Hp - attackDamage2;
                $(".player2Damage").html("-" + attackDamage2).css("background", "yellow").fadeIn(500).fadeOut(2000);
            }else {
                player2Hp = player2Hp - attackDamage;
                $(".player2Damage").html("-" + attackDamage).css("background", "yellow").fadeIn(500).fadeOut(2000);
            }
            if(selectedAttackData.poison) {
                player2Poisoned = { active: true, damage: selectedAttackData.poison, turnsLeft: selectedAttackData.poisonTurns };
                setTimeout(() => $(".player2Damage").html("Poisoned!").css("background", "purple").fadeIn(300).fadeOut(1000), 2000);
            }
            let damagePercent = (1 - (player2Hp / player2MaxHp)) * 100;
            $('#hp-bar-two').html("<span>HP " + player2Hp + "</span>");
            document.getElementById('hp-bar-two').style.setProperty('--damage-width', damagePercent + '%');
            $(".player1Damage").hide();
        } else if( randomNum === 1 || randomNum === 4) {
            if(attackDamage2 ==='' || attackDamage2 === 0){
                player2Hp = player2Hp - attackDamage;
                $(".player2Damage").html("-" + attackDamage).css("background", "yellow").fadeIn(500).fadeOut(2000);
            }else {
                player2Hp = player2Hp - attackDamage2;
                $(".player2Damage").html("-" + attackDamage2).css("background", "yellow").fadeIn(500).fadeOut(2000);
            }
            if(selectedAttackData.poison) {
                player2Poisoned = { active: true, damage: selectedAttackData.poison, turnsLeft: selectedAttackData.poisonTurns };
                setTimeout(() => $(".player2Damage").html("Poisoned!").css("background", "purple").fadeIn(300).fadeOut(1000), 2000);
            }
            let damagePercent = (1 - (player2Hp / player2MaxHp)) * 100;
            $('#hp-bar-two').html("<span>HP " + player2Hp + "</span>");
            document.getElementById('hp-bar-two').style.setProperty('--damage-width', damagePercent + '%');
            $(".player1Damage").hide();
        }else if(randomNum === 2){
            if(!sfxMuted) missSound.play();
            $(".player2Damage").text("Dodge").css("background", "yellow").fadeIn(500).fadeOut(2000);
        }
        player2Turn = true;
        player1Turn = false;
        hideElementsBasedOnPlayerTurn();
        checkPlayerHp();
        showPlayAgainBtn();
        victoryDance();
        }
    }
});

// Checks if either player's HP is 0 or below and displays winner
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
        if(!sfxMuted) sound1.play();
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
        if(!sfxMuted) sound1.play();
    }
}

// Displays victory dance GIF for the winning Pokemon
function victoryDance() {
    if (player1Hp <= 0 && randomFromArr2 === pika) {
        $(".victory-dance").html("<img src=" + './img/pika2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === bulba) {
        $(".victory-dance").html("<img src=" + './img/bulba4.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === squirtle) {
        $(".victory-dance").html("<img src=" + './img/squirtle2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === charmander) {
        $(".victory-dance").html("<img src=" + './img/charmander2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === jigglypuff) {
        $(".victory-dance").html("<img src=" + './img/jigglypuff.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === cubone) {
        $(".victory-dance").html("<img src=" + './img/cubone.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === dratini) {
        $(".victory-dance").html("<img src=" + './img/dratini.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === growlithe) {
        $(".victory-dance").html("<img src=" + './img/growlithe.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === oddish) {
        $(".victory-dance").html("<img src=" + './img/oddish.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === evee) {
        $(".victory-dance").html("<img src=" + './img/evee2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player1Hp <= 0 && randomFromArr2 === poliwag) {
        $(".victory-dance").html("<img src=" + './img/poliwag2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    }else if (player1Hp <= 0 && randomFromArr2 === psyduck) {
        $(".victory-dance").html("<img src=" + './img/psyduck.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    }else if (player1Hp <= 0 && randomFromArr2 === ratata) {
        $(".victory-dance").html("<img src=" + './img/rattata.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === pika) {
        $(".victory-dance").html("<img src=" + './img/pika2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === bulba) {
        $(".victory-dance").html("<img src=" + './img/bulba4.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === squirtle) {
        $(".victory-dance").html("<img src=" + './img/squirtle2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === charmander) {
        $(".victory-dance").html("<img src=" + './img/charmander2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === jigglypuff) {
        $(".victory-dance").html("<img src=" + './img/jigglypuff.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === cubone) {
        $(".victory-dance").html("<img src=" + './img/cubone.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === dratini) {
        $(".victory-dance").html("<img src=" + './img/dratini.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === growlithe) {
        $(".victory-dance").html("<img src=" + './img/growlithe.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === oddish) {
        $(".victory-dance").html("<img src=" + './img/oddish.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === evee) {
        $(".victory-dance").html("<img src=" + './img/evee2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === poliwag) {
        $(".victory-dance").html("<img src=" + './img/poliwag2.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    } else if (player2Hp <= 0 && randomFromArr1 === psyduck) {
        $(".victory-dance").html("<img src=" + './img/psyduck.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    }else if (player2Hp <= 0 && randomFromArr1 === ratata) {
        $(".victory-dance").html("<img src=" + './img/rattata.gif' + " " + "alt=" + 'pokemon' + ">").css("display", "inline");
    }
}

// Shows the Play Again button when game ends
function showPlayAgainBtn() {
    if (player1Hp <= 0 || player2Hp <= 0) {
        $("#reset-btn").css("display", "inline");
    }
    $("#reset-btn").on("click", function(){
        location.reload();
    });
}

// Shows/hides attack buttons based on whose turn it is
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
