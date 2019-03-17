"use strict";

const pokemon = require('pokemontcgsdk');
const util = require('util');

pokemon.card.all({ name: 'growlithe'})
    .on('data', card => {
        console.log(util.inspect(card.imageUrl, {showHidden: false, depth: null}))
    });



