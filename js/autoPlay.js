/**
 * Blackjack.js (c) Brad Westfall @bradwestfall
 * Player Personna: This player bets $5 all the time, no matter what
 */

'use strict';

var autoPlay = {};

(function(autoPlay) {

    autoPlay.defaultBet = 5;
    autoPlay.speed = 0;
    autoPlay.on = false;

    autoPlay.hitOrStay = function(playerHand, dealerShowing) {

        var playerCount = blackjack.util.count(playerHand);
        var dealerCount = blackjack.util.count(dealerShowing)
        
        // Soft hand cant lose on hit
        if (playerCount < 17 && playerHand.indexOf('A') > 0) {
            blackjack.util.report('Hit');
            blackjack.hand.hit();
        } else {

            // Get the move from "the book" as they say
            var move = book.hitOrStay(playerCount, dealerCount);

            if (move.toUpperCase() == 'H') {
                blackjack.util.report('Hit');
                blackjack.hand.hit();
            } else if (move.toUpperCase() == 'S') {
                blackjack.util.report('Stay');
                blackjack.hand.stay();
            }
            
        }

    }

    autoPlay.init = function() {
        var defaultBet = this.defaultBet;

        // When Idle
        pubsub.subscribe('idle', function(t, cards) {
            setTimeout(function() {
                autoPlay.hitOrStay(cards.player, cards.dealer);
            }, autoPlay.speed);
        });

        // Account for player wins
        pubsub.subscribe('win', function(t, amount) {
            setTimeout(function() {
                play(defaultBet);
            }, autoPlay.speed);
        });

        // Account for player pushes
        pubsub.subscribe('push', function() {
            setTimeout(function() {
                play(defaultBet);
            }, autoPlay.speed);
        });

        // Account for player lose
        pubsub.subscribe('lose', function(t, amount) {
            setTimeout(function() {

                if (blackjack.bank.amount < 5) {
                    console.clear();
                    blackjack.util.warn('Bankrupt :(');
                    statistics.report();
                    return;
                }

                play(defaultBet);
            }, autoPlay.speed);
        });

        /**
         * DOM Events
         */

        document.querySelector('.autoplay.start').onclick = function() {
            if (!blackjack.hand.inPlay) {
                autoPlay.on = true;
                play(autoPlay.defaultBet);
            } else {
                console.log('Autoplay can only be turned on when your current game is over');
            }            
        }

        document.querySelector('.autoplay.stop').onclick = function() {
            autoPlay.on = false;
        }

    }

})(autoPlay);

autoPlay.init();