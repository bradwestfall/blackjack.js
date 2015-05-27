var settings = {
    startingAmount: 200
}



var util = {
    box: [2,3,4,5,6,7,8,9,10,'J','Q','K','A'],  

    getDeck: function(count) {
        var deck = [];
        for (var i = 0; i < count; i++) {
            deck = deck.concat(this.box)
        }
        return this.shuffle(deck);
    },

    shuffle: function(o) {
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o
    },

    getCardVal: function(c) {
        switch(c) {
            case 'J': return 10;
            case 'K': return 10;
            case 'Q': return 10;
            case 'A': return 11;
            default: return c;
        }
    },

    sumArray(a) {
        return a.reduce(function(prev, current) {
            return prev + current
        }, 0);
    },

    arrayReplace: function(a, s, r) {
        var i = a.indexOf(s);
        if (i !== -1) a[i] = r;
        return a;
    },

    count: function(hand, first) {

        if (first == undefined) first = true;

        // Ensure the hand has all numbers. Only needed on 
        // the first iteration
        if (first) {
            hand = hand.map(function(c) {
                return util.getCardVal(c);
            });
        }

        // Get the count
        var count = util.sumArray(hand);

        // No Aces
        if (hand.indexOf(11) == -1 && count > 21) {
            return count;

        // Has at least one ace
        } else {

            // Find the highest version of this hand accounting
            // for aces and try not to go over 21
            if (count > 21) {
                hand = util.arrayReplace(hand, 11, 1);
                return this.count(hand, false);
            } else {
                return count;
            }
            
        }

    },

    report: function(message, color, bg) {
        if (color == undefined) color = 'black';
        if (bg == undefined) bg = 'white';
        console.log('%c' + message, 'color:' + color + '; background-color:'+bg);
    }

}

/**
 * Deck
 */

var deck = {
    cards: [],
    startedWith: 0,
    new: function() {
        this.cards = util.getDeck(6);
        this.startedWith = this.cards.length;
    },
    getCard: function() {
        if (!this.cards.length) this.new();
        return this.cards.pop();
    },
    renew: function() {
        if (this.startedWith * 0.5 > this.cards.length) {
            this.new();
            util.report('Shuffle', 'white', 'orange');
        }
    }
}


/**
 * Bank
 */

var bank = {
    amount: settings.startingAmount,
    bet: function(amount) {
        this.amount -= amount;
        return amount;
    },
    add: function(amount) {
        this.amount += amount;
    },
    report: function() {
        console.log('%cBank: ' + this.amount, 'color: green');
    }
}


/**
 * Hand
 */

var hand = {
    player: [],
    dealer: [],
    bet: 0,

    start: function(bet) {
        this.bet = bet;
        this.player = []; this.dealer = [];
        deck.renew();
        this.deal(this.player, deck.getCard());
        this.deal(this.dealer, deck.getCard());
        this.deal(this.player, deck.getCard());
        this.deal(this.dealer, deck.getCard());
        this.report();
        if (util.count(this.dealer) == 21) this.playerLose();
        if (util.count(this.player) == 21) this.playerWin(2.5);
    },

    deal: function(p, c) {
        p.push(c);
    },

    playerCount: function() {
        return util.count(this.player);
    },

    dealerCount: function() {
        return util.count(this.dealer)
    },

    report: function(full) {
        if (full) {
            util.report('Dealer: ' + this.dealer.join() + ' (' + util.count(this.dealer) + ')');
        } else {
           util.report('Dealer: ' + [this.dealer[0], '?'].join());
        }
        util.report('Player: ' + this.player.join() + ' (' + util.count(this.player) + ')');
    },

    hit: function() {
        this.deal(this.player, deck.getCard());
        if (util.count(this.player) > 21) {
            this.playerBust();
            return;
        }
        if (util.count(this.player) == 21) {
            this.stay();
            return;
        }
        this.report();
    },

    dealerMoves: function() {
        if (util.count(this.dealer) < 17) {
            this.deal(this.dealer, deck.getCard());
            this.dealerMoves();
        } else {
            this.endGame();
        }
    },

    stay: function() {
        this.dealerMoves();
    },

    playerBust: function() {
        this.endGame();
    },

    playerWin: function(m) {
        if (m == undefined) m = 2;
        util.report(' Win ', 'white', 'green');
        this.report(true);
        bank.add(this.bet * m);
        bank.report();
    },

    playerPush: function() {
        bank.add(this.bet);
        util.report(' Push ', 'white', 'blue');
    },

    playerLose: function() {
        util.report(' Lose ', 'white', 'red');
        this.report(true);
        bank.report();
    },

    endGame: function() {

        var player = util.count(this.player);
        var dealer = util.count(this.dealer);

        if (dealer > 21) {
            this.playerWin();
        } else if (player > 21 || dealer > player) {
            this.playerLose();
        } else if (player <= 21 && player > dealer) {
            this.playerWin();
        } else if (player == dealer) {
            this.playerPush();
        } else {
            util.report(' BUG! ', 'white', 'black');
        }

    }
}



var bet = function(amount) {
    if (amount == undefined) amount = 5;
    hand.start(bank.bet(amount));
}

var play = function() {
    hand.start(bank.bet(5));
}

var hit = function() {
    hand.hit();
}

var stay = function() {
    hand.stay();
}






hand.start(bank.bet(5));