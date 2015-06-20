/**
 * Blackjack.js (c) Brad Westfall @bradwestfall
 * Book is meant to resemble http://www.casinowatchdogs.com/images/PerfectBlackjack.gif
 * However some mods were made because blackjack.js curently doesn't support splits, double downs, etc.
 */

'use strict';

var book = {};

(function(book) {

    /**
     * The Book
     */
    book.hitOrStay = function(playerCount, dealerShowing) {

        var book = [];

        // We don't need to account for when the player has <3 because
        // that would suggest an ace which would suggest a higher score
        // We also don't need to account for 21 because the player
        // automatically wins in that case.

        // Dealer has ->   2    3    4    5    6    7    8    9    10   A
        book[4]      = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[5]      = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[6]      = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[7]      = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[8]      = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[9]      = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[10]     = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
        book[11]     = [,,'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'];
  
        book[12]     = [,,'H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'];
        book[13]     = [,,'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'];
        book[14]     = [,,'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'];
        book[15]     = [,,'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'];
        book[16]     = [,,'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'];
  
        book[17]     = [,,'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'];
        book[18]     = [,,'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'];
        book[19]     = [,,'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'];
        book[20]     = [,,'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'];

        return book[playerCount][dealerShowing];

    }

})(book);