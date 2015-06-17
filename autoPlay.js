var autoPlay = {};

(function(autoPlay) {

    autoPlay.defaultBet = 5;
    autoPlay.recentBet = 5;
    autoPlay.speed = 4000;
    autoPlay.games = 0;

    // need to track win streak
    // need to trakc lose streak

    /**
     * The Book
     */
    autoPlay.book = function() {

        var book = [];

        // We don't need to account for when the player has <3 because
        // that would suggest an ace which would suggest a higher score
        // We also don't need to account for 21 because the player
        // automatically wins in that case.s

        // Dealer has    2    3    4    5    6    7    8    9    10   A
        book[4]    = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[5]    = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[6]    = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[7]    = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[8]    = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[9]    = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[10]   = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[11]   = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];

        book[12]   = [,,'H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'];
        book[13]   = [,,'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'];
        book[14]   = [,,'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'];
        book[15]   = [,,'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'];
        book[16]   = [,,'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'];

        book[17]   = [,,'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'];
        book[18]   = [,,'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'];
        book[19]   = [,,'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'];
        book[20]   = [,,'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'];

        return book;

    }

    autoPlay.hitStay = function(playerCount, dealerShowing) {

        // Get the move from "the book" as they say
        var move = this.book()[playerCount][dealerShowing];

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
        pubsub.subscribe('idle', function(cards) {

            setTimeout(function() {
                autoPlay.hitStay(blackjack.util.count(cards.player), blackjack.util.count(cards.dealer));
            }, autoPlay.speed);

        });

        // Account for player wins
        pubsub.subscribe('win', function(amount) {
            console.log('win: ' + amount);

            setTimeout(function() {
                // this.recentBet = this.defaultBet;
                // play(this.recentBet);
                play(this.defaultBet);
            }, autoPlay.speed);

        });

        // Account for player pushes
        pubsub.subscribe('push', function() {
            console.log('push');

            setTimeout(function() {
                //play(this.recentBet);
                play(this.defaultBet);
            }, autoPlay.speed);

        });

        // Account for player lose
        pubsub.subscribe('lose', function(amount) {
            console.log('lose: ' + amount);

            setTimeout(function() {
                //this.recentBet = parseInt(amount) * 2;
                //play(this.recentBet);
                play(this.defaultBet);
            }, autoPlay.speed);

        });

        // Account for the end of the game
        pubsub.subscribe('endgame', function() {
            autoPlay.games++;
            document.querySelector('.bank').value = blackjack.bank.amount;
            document.querySelector('.games').value = autoPlay.games;
        });

        // Start first Hand
        play(5);

    }

})(autoPlay);

autoPlay.init();