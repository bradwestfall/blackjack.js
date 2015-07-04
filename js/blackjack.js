/**
 * Blackjack.js (c) Brad Westfall @bradwestfall
 */

'use strict';


/****************************************
  Settings
*****************************************/

var settings = {
    startingAmount: 1000,
    defaultBet: 5,
    decks: 6,
    clearOnStart: true,
    consoleLog: true
}


/****************************************
  Blackjack
*****************************************/

// Blackjack App
var blackjack = {};

// You know, patters 'n stuff
(function(blackjack) {

    /**
     * Utilities
     */
    blackjack.util = {

        // Cards in a Deck
        box: [2,3,4,5,6,7,8,9,10,'J','Q','K','A'],  

        // Get Deck
        getDeck: function(count) {
            var deck = [];
            for (var i = 0; i < count; i++) {
                deck = deck.concat(this.box)
            }
            return this.shuffle(deck);
        },

        // Shuffle
        shuffle: function(o) {
            for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o
        },

        // Get Card Value (Ace assumes 11)
        getCardVal: function(c) {
            switch(c) {
                case 'J': return 10;
                case 'K': return 10;
                case 'Q': return 10;
                case 'A': return 11;
                default: return c;
            }
        },

        // Sum an array of numeric values
        sumArray(a) {
            return a.reduce(function(prev, current) {
                return prev + current
            }, 0);
        },

        // Search an array for a value and replace with another value
        arrayReplace: function(a, s, r) {
            var i = a.indexOf(s);
            if (i !== -1) a[i] = r;
            return a;
        },

        // Count the value of a hand
        count: function(hand, first) {

            if (first == undefined) first = true;

            // Ensure the hand has all numbers. Only needed on 
            // the first iteration
            if (first) {
                hand = hand.map(function(c) {
                    return blackjack.util.getCardVal(c);
                });
            }

            // Get the count
            var count = blackjack.util.sumArray(hand);

            // No Aces
            if (hand.indexOf(11) == -1 && count > 21) {
                return count;

            // Has at least one ace
            } else {

                // Find the highest version of this hand accounting
                // for aces and try not to go over 21
                if (count > 21) {
                    hand = blackjack.util.arrayReplace(hand, 11, 1);
                    return this.count(hand, false);
                } else {
                    return count;
                }
                
            }

        },

        // Report to console with pretty colors
        report: function(message, color, bg) {
            if (!settings.consoleLog) return;
            if (color == undefined) color = 'black';
            if (bg == undefined) bg = 'white';
            console.log('%c ' + message + ' ', 'color:' + color + '; background-color:'+bg);
        },

        // Warn
        warn: function(message) {
            this.report(message, 'white', 'black');
        }

    }

    /**
     * Deck
     */
    blackjack.deck = {
        cards: [],
        startedWith: 0,

        // Start a new deck
        new: function() {
            this.cards = blackjack.util.getDeck(settings.decks);
            this.startedWith = this.cards.length;
        },

        // Get the lastest card in the deck
        getCard: function() {
            if (!this.cards.length) this.new();
            if (this.startedWith * 0.5 > this.cards.length) {
                this.new();
                blackjack.util.report('Shuffle', 'white', 'orange');
            }
            return this.cards.pop();
        }

    }

    /**
     * Bank
     */
    blackjack.bank = {
        recentBet: 0,
        amount: settings.startingAmount,
        bet: function(amount) {
            this.amount -= amount;
            this.recentBet = amount;
            return amount;
        },
        add: function(amount) {
            this.amount += amount;
        },
        report: function() {
            document.querySelector('.bank').innerHTML = '$' + blackjack.bank.amount;
            blackjack.util.report('Bank: ' + this.amount, 'green');
        }
    }

    /**
     * Hand
     */
    blackjack.hand = {
        player: [],
        dealer: [],
        bet: 0,
        inPlay: false,

        // Start a new hand
        start: function(bet) {

            // Clear console
            if (settings.clearOnStart) console.clear();
            
            // Cannot start a new game if one is already in play
            if (this.inPlay) {
                blackjack.util.warn('Cannot start a new game while in a game');
                this.showCards();
                return;
            }

            // Cannot bet less than 1
            if (bet < 1) {
                blackjack.util.warn('Cannot bet below $1');
                return;
            }

            // Cannot bet less than 1
            if (bet > blackjack.bank.amount) {
                blackjack.util.warn('Cannot bet more than your bank ($' + blackjack.bank.amount + ')');
                return;
            }

            // Remove funds from Bank and assign to hand
            this.bet = blackjack.bank.bet(bet);

            // Initial Setup
            this.inPlay = true;
            this.player = [];
            this.dealer = [];

            // Deal Cards
            this.deal(this.player, blackjack.deck.getCard());
            this.deal(this.dealer, blackjack.deck.getCard());
            this.deal(this.player, blackjack.deck.getCard());
            this.deal(this.dealer, blackjack.deck.getCard());
            
            // Opening count
            var dealerCount = blackjack.util.count(this.dealer);
            var playerCount = blackjack.util.count(this.player);

            blackjack.util.report('New Game, Bet: $' + this.bet, 'white', 'blue');

            // Push if both player and dealer has blackjack
            if (dealerCount == 21 && playerCount == 21) {
                this.playerPush();

            // Dealer only has blackjack
            } else if (dealerCount == 21) {
                this.playerLose();

            // Player wins 2.5 times bet
            } else if (playerCount == 21) {
                this.playerWin(2.5);

            // Regular play
            } else {
                this.showCards();
                pubsub.publish('idle', {
                    player: this.player,
                    dealer: [this.dealer[0]]
                });
            }

        },

        // Deal a card to a player
        deal: function(p, c) {
            p.push(c);
        },

        // Get the player's card count
        playerCount: function() {
            return blackjack.util.count(this.player);
        },

        // Get the dealer's card count
        dealerCount: function() {
            return blackjack.util.count(this.dealer)
        },

        // Show player and dealer cards. Full indicates if the
        // report should reveal all dealer cards
        showCards: function(full) {
            if (full) {
                blackjack.util.report('Dealer: ' + this.dealer.join() + ' (' + blackjack.util.count(this.dealer) + ')');
            } else {
               blackjack.util.report('Dealer: ' + [this.dealer[0], '?'].join());
            }
            blackjack.util.report('Player: ' + this.player.join() + ' (' + blackjack.util.count(this.player) + ')');
        },

        // Player Hit
        hit: function() {

            // Cannit hit if not in a game
            if (!this.inPlay) {
                blackjack.util.warn('Must start a new game first');
                return;
            }

            // Deal the plaer a card
            this.deal(this.player, blackjack.deck.getCard());

            // Too Many
            if (blackjack.util.count(this.player) > 21) {
                this.playerBust();
                return;
            }

            // Blackjack
            if (blackjack.util.count(this.player) == 21) {
                this.stay();
                return;
            }

            this.showCards();

            pubsub.publish('idle', {
                player: this.player,
                dealer: [this.dealer[0]]
            });

        },

        // Player Bust
        playerBust: function() {

            // Publish
            pubsub.publish('bust');

            this.playerLose();
        },

        // Player Stay
        stay: function() {

            // Cannot stay if not in a game
            if (!this.inPlay) {
                blackjack.util.warn('Must start a new game first');
                return;
            }

            this.dealerMoves();
        },

        // Dealer make moves until they win or lose
        dealerMoves: function() {
            if (blackjack.util.count(this.dealer) < 17) {
                this.deal(this.dealer, blackjack.deck.getCard());
                this.dealerMoves();
            } else {
                this.whoWon();
            }
        },

        whoWon: function() {

            // Card Count
            var playerCount = blackjack.util.count(this.player);
            var dealerCount = blackjack.util.count(this.dealer);

            // If dealer has over 21
            if (dealerCount > 21) {
                this.playerWin();

            // If player has over 21 or has worse hand than dealer
            } else if (playerCount > 21 || dealerCount > playerCount) {
                this.playerLose();

            // If Player has better hand than dealer
            } else if (playerCount > dealerCount) {
                this.playerWin();

            // If Player and Dealer Push
            } else if (playerCount == dealerCount) {
                this.playerPush();

            // This shouldn't happen
            } else {
                blackjack.util.warn('BUG!');
            }

        },
        
        // Player win. Indicate the "multiplier", defaults to 2 x bet
        playerWin: function(m) {
            if (m == undefined) m = 2;
            var winnings = this.bet * m;
            blackjack.util.report('Win', 'white', 'green');
            this.showCards(true);
            blackjack.bank.add(winnings);
            blackjack.bank.report();

            // Publish
            pubsub.publish('win', winnings);
            this.endGame();

        },

        // Player Push. Add the money back to the player's bank
        playerPush: function() {
            blackjack.bank.add(this.bet);
            blackjack.util.report('Push', 'white', 'blue');
            this.showCards(true);

            // Publish
            pubsub.publish('push');
            this.endGame();

        },

        // Player Lose
        playerLose: function() {
            blackjack.util.report('Lose', 'white', 'red');
            this.showCards(true);
            blackjack.bank.report();
            var bet = this.bet;

            // Lose
            pubsub.publish('lose', bet);
            this.endGame();

        },

        // End Game
        endGame: function() {

            // Publish
            pubsub.publish('endgame');

            this.inPlay = false;
            this.player = [];
            this.dealer = [];
            this.bet = 0;
        }

    }

})(blackjack);

/**
 * Console Shortcuts
 */

var play = function(amount) {
    if (amount == undefined) amount = settings.defaultBet;
    blackjack.hand.start(amount);
}

var hit = function() {
    blackjack.hand.hit();
}

var stay = function() {
    blackjack.hand.stay();
}

var bank = function() {
    blackjack.bank.report();
}

/**
 * Initial Console Messages
 */

blackjack.bank.report();
blackjack.util.report('Start by typing play()');