/**
 * Blackjack.js (c) by Brad Westfall
 */

'use strict';

var statistics = {};

(function(statistics) {

    statistics.basic = {
        games: 0,
        wins: 0,
        loses: 0,
        pushes: 0
    }

    // Need to track win streak and lose streak

    statistics.report = function() {
        console.table([this.basic]);
    }

    statistics.init = function() {

        // Account for player wins
        pubsub.subscribe('win', function(t, amount) {
            statistics.basic.wins++;
        });

        // Account for player pushes
        pubsub.subscribe('push', function() {
            statistics.basic.pushes++;
        });

        // Account for player lose
        pubsub.subscribe('lose', function(t, amount) {
            statistics.basic.loses++;
        });

        // Account for the end of the game
        pubsub.subscribe('endgame', function() {
            statistics.basic.games++;
        });

    }

})(statistics);

statistics.init();