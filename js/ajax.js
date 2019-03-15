"use strict";
/** two cards iterate through the array for
 * card.attacks.name and card.attacks.damage and card.hp
 * and card.imageUrl
 */
const squirtle = "https://api.pokemontcg.io/v1/cards/sm9-23";
const charmander = "https://api.pokemontcg.io/v1/cards/sm3-18";
const getCards = "https://api.pokemontcg.io/v1/cards"
// const pokemon = require('pokemontcgsdk');
// const util = require('util');



$.get(getCards).done(function(data){
    console.log(data);
});
/** gets squirtle card **/
$.get(squirtle).done(function(data) {
    let name = data.card.name;
    let hp = data.card.hp;
    let attackName = data.card.attacks.name;
    let attackDam = data.card.attacks.damage;
    let image = data.card.imageUrl;
    let html = "";

    html += `<div>${name}</div>`;
    html += `<div>${hp}</div>`;
    for (let i = 0; i <= 1; i++) {
        html += "<div>" + data.card.attacks[i].name + "</div>";
        html += "<div>" + data.card.attacks[i].damage + "</div>";
    }

    html += `<div><img src= ${image} </div>`;
    $("#charmander-info").html(html);


});


/** gets Charmander Card **/
$.get(charmander).done(function(data) {
    let name = data.card.name;
    let hp = data.card.hp;
    let image = data.card.imageUrl;
    let attackName = data.card.attacks.name;
    let attackDam = data.card.attacks.damage;
    let html = "";

    html += `<div>${name}</div>`;
    html += `<div>${hp}</div>`;
    for (let i = 0; i <= 1; i++) {
        html += "<div>" + data.card.attacks[i].name + "</div>";
        html += "<div>" + data.card.attacks[i].damage + "</div>";
    }
    html += `<div><img src= ${image} </div>`;
    $("#squirtle-info").html(html);


});





/**  gets card data **/
function getCard(data) {
    let name = data.card.name;
    let hp = data.card.hp;
    let image = data.card.imageUrl;
    let attackName = data.card.attacks.name;
    let attackDam = data.card.attacks.damage;
    let html = "";

    html += `<div>${name}</div>`;
    html += `<div>${hp}</div>`;
    html += `<div><img src= ${image} </div>`;

    for (let i = 0; i <= 1; i++) {
        html += "<div>" + data.card.attacks[i].name + "</div>";
        html += "<div>" + data.card.attacks[i].damage + "</div>";
    }
    $("#charmander-info").html(html);
    $("#squirtle-info").html(html);
}


let sound1 = new Audio("fileloc.mp3");
sound1.play();

// $(document).ready(function() {
//     let obj = document.createElement("audio");
//     obj.src="audio/battleMusic.mp3";
//     $("#C1attack1").click(function() {
//         obj.play();
//     });
//
// });

// console.log(util);


// Get all cards
// pokemon.card.all()
//     .on('data', function (card) {
//         console.log(card.name)
//     });

// Filter Cards
// pokemon.card.all({ id: "sm9-23"})
//     .on('data', function (card) {
//         // console.log(util.inspect(card.name,{showHidden: false, depth: null}))
//         console.log(util.inspect(card,{depth: null}))
//
//     });
//
// // Get cards on a specific page / pageSize
// pokemon.card.where({ page: 50, pageSize: 500})
//     .then(cards => {
//         console.log(cards[0].name)
//     })

// })