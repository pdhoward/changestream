
const plugin = {
words: {
    't rex': 'Dinosaur',
    'pangaea': 'Noun',
    'tethys sea': 'Noun'
},
tags: {
    Dinosaur: {
    isA: 'Animal'
    },
    Animal: {
    isA: 'Noun'
    }
},
patterns: {
    "the #TitleCase (era|epoch)": "TimePeriod", //'the Jurassic era'
    "#Noun rex": "Dinosaur", //
},
regex: {
    '^paleo[a-z]{4}': 'Noun',
    '[a-z]iraptor$': 'Dinosaur',
},
plurals: {
    brontosaurus: 'brontosauri',
    stegosaurus: 'stegosauruses'
}
};
