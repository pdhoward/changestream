
///////////////////////////////////////////////////////////////////////
////////////////// CBM  test for string matching against   ///////////
//////////////////////////////////////////////////////////////////////
exports.cbm = [
  {
    action: 'banter',
    url: 'https:\\\www.example.com/banter',
    description: "banter and chit chat",
    triggers: ['hi', 'hello', 'howdy', 'haps', 'what you doing']
  },
  {
    action: 'buy',
    url: 'https:\\\www.example.com/buy',
    description: "buy the product",
    triggers: ['i would like to buy', 'buy it', 'i am ready to buy',
      'ready to checkout', 'checkout please']
  },
  {
    action: 'search',
    url: 'https:\\\www.example.com/search',
    description: "search for a product",
    triggers: ['can you find that item for me', 'do you have that item',
      'need that item', 'how do i find that item', 'i need to find a product',
      'can you help me find a product', 'need a product']
  },
  {
    action: 'ship',
    url: 'https:\\\www.example.com/ship',
    description: "ship a product",
    triggers: ['please ship', 'ship', 'ship this', 'need to send it']
  },
  {
    action: 'about',
    url: 'https:\\\www.example.com/about',
    description: "CMB capability",
    triggers: ['what do you', 'are you a bot', 'what can you handle']
  }

]