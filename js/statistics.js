/**
 * Blackjack.js (c) Brad Westfall @bradwestfall
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

    statistics.currentGame = {};
    statistics.games = [];

    // Need to track win streak and lose streak

    statistics.report = function() {
        // Show recent 1000 games
        console.table(this.games.slice(-1000));
    }

    statistics.init = function() {

        // Account for player wins
        pubsub.subscribe('win', function(t, amount) {
            statistics.basic.wins++;
            statistics.currentGame.outcome = 'Win';
        });

        // Account for player pushes
        pubsub.subscribe('push', function() {
            statistics.basic.pushes++;
            statistics.currentGame.outcome = 'Push';
        });

        // Account for player lose
        pubsub.subscribe('lose', function(t, amount) {
            statistics.basic.loses++;
            statistics.currentGame.outcome = 'Loss';
        });

        // Account for the end of the game
        pubsub.subscribe('endgame', function() {
            statistics.basic.games++;
            statistics.currentGame.game = statistics.basic.games;
            statistics.currentGame.playerHand = blackjack.hand.player.join()
            statistics.currentGame.playerCount = blackjack.util.count( blackjack.hand.player )
            statistics.currentGame.dealerHand = blackjack.hand.dealer.join()
            statistics.currentGame.dealerCount = blackjack.util.count( blackjack.hand.dealer )
            statistics.currentGame.bet = blackjack.bank.recentBet;
            statistics.currentGame.bank = blackjack.bank.amount;
            statistics.games.push(statistics.currentGame);
            statistics.currentGame = {};
        });

    }

})(statistics);

statistics.init();