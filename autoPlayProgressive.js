/**
 * Blackjack.js (c) by Brad Westfall
 * Player Personna: This player doubles their bet every time they lose in hopes
 * of gaining back their losses when they eventually win. When they do win, they
 * start over at $5 per bet.
 */

'use strict';

var autoPlay = {};

(function(autoPlay) {

    autoPlay.startingAmount = 200;
    autoPlay.defaultBet = 15;
    autoPlay.recentBet = 5;
    autoPlay.speed = 50;
    autoPlay.games = 0;
    autoPlay.playOnLoad = true;

    autoPlay.hitOrStay = function(playerCount, dealerShowing) {

        // Get the move from "the book" as they say
        var move = book.hitOrStay(playerCount, dealerShowing);

        if (move.toUpperCase() == 'H') {
            blackjack.util.report('Hit');
            blackjack.hand.hit();
        } else if (move.toUpperCase() == 'S') {
            blackjack.util.report('Stay');
            blackjack.hand.stay();
        }

    }

    autoPlay.init = function() {

        // When Idle
        pubsub.subscribe('idle', function(t, cards) {

            setTimeout(function() {
                autoPlay.hitOrStay(blackjack.util.count(cards.player), blackjack.util.count(cards.dealer));
            }, autoPlay.speed);

        });

        // Account for player wins
        pubsub.subscribe('win', function(t, amount) {
            blackjack.util.report('win: ' + amount);

            setTimeout(function() {
                this.recentBet = this.defaultBet;
                play(this.recentBet);
            }, autoPlay.speed);

        });

        // Account for player pushes
        pubsub.subscribe('push', function() {
            blackjack.util.report('push');

            setTimeout(function() {
                play(this.recentBet);
            }, autoPlay.speed);

        });

        // Account for player lose
        pubsub.subscribe('lose', function(t, amount) {
            blackjack.util.report('lose: ' + amount);

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
                this.recentBet = doubledBet;
                play(doubledBet);

            }, autoPlay.speed);

        });

        // Start first Hand
        blackjack.bank.amount = this.startingAmount;
        if (this.playOnLoad) play(5);

    }

})(autoPlay);

autoPlay.init();