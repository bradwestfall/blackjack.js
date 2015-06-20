/**
 * Blackjack.js (c) Brad Westfall @bradwestfall
 * Player Personna: This player doubles their bet every time they lose in hopes
 * of gaining back their losses when they eventually win. When they do win, they
 * start over at $5 per bet.
 */

'use strict';

var autoPlay = {};

(function(autoPlay) {

    autoPlay.startingAmount = 1000;
    autoPlay.defaultBet = 5;
    autoPlay.speed = 5;
    autoPlay.playOnLoad = true;

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
                play(blackjack.bank.recentBet);
            }, autoPlay.speed);
        });

        // Account for player lose
        pubsub.subscribe('lose', function(t, amount) {
            setTimeout(function() {
                
                // This is the progressive part
                var doubledBet = parseInt(amount) * 2;

                if (blackjack.bank.amount < 5) {
                    console.clear();
                    blackjack.util.warn('Bankrupt :(');
                    statistics.report();
                    return;
                } else if (blackjack.bank.amount < doubledBet) {
                    doubledBet = blackjack.bank.amount;
                }

                // Play
                play(doubledBet);

            }, autoPlay.speed);
        });

        // Start first Hand
        blackjack.bank.amount = this.startingAmount;
        if (this.playOnLoad) play(defaultBet);

    }

})(autoPlay);

autoPlay.init();