
exports.plugin = {
words: {
    'id': 'Search',
    'title': 'Search',
    'author': 'Search',
    'price': 'Search',
    'path': 'Search',
    'thumbnail': 'Search',
    'category': 'Search'
},
tags: {
    Search: {
    isA: 'Knowledge'
    },
    Knowledge: {
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
