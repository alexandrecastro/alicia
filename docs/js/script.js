jQuery(document).ready(function ($) {
    initGame(WORLD_FLAGS);

    var cardElement = $('#deck ul li');
    var cardCount = cardElement.length;
    var cardWidth = cardElement.width();
    var cardHeight = cardElement.height();
    var deckWidth = cardCount * cardWidth;

    initDeck();

    function initGame(cards) {
        var i = 1;
        cards.forEach(function (card) {
            card.id = i++;
            card.options.forEach(function (option) {
                return option.id = i++;
            });
            card.options = shuffle(card.options);
        });
        cards = shuffle(cards);
        play(cards);
    }

    function play(cards) {
        deckHtml = "";
        cards.forEach(function (card) {
            deckHtml += buildCard(card);
        });
        $('#deck ul').html(deckHtml);
    }

    function buildCard(card) {
        cardHtml =
            "<li>" +
                "<div class=\"card\">" +
                    "<div class=\"card-content\">" +
                        "<img src=\"/alicia/images/" + card.image + "\" class=\"card-image\"/>" +
                    "</div>" +
                    "<div class=\"card-buttons\">" +
                        buildOptions(card.options) +
                    "</div>" +
                "</div>" +
            "</li>";
        return cardHtml;
    }

    function buildOptions(options) {
        optionsHtml = "";
        options.forEach(function (option) {
            optionsHtml += "<input type=\"button\" class=\"btn\" value=\"" + option.text + "\"/>";
        });
        return optionsHtml;
    }

    function initDeck() {
        $('#total-count').html(cardCount);

        $('#deck').css({ width: cardWidth, height: cardHeight });
        $('#deck ul').css({ width: deckWidth, marginLeft: - cardWidth });
        $('#deck ul li:last-child').prependTo('#deck ul');

        $('a.control-prev').click(function () { moveLeft(); });
        $('a.control-next').click(function () { moveRight(); });

        $('html').keydown(function (event) { if ( event.which == 37 ) { moveLeft(); } });
        $('html').keydown(function (event) { if ( event.which == 39 ) { moveRight(); } });

        setTimeout(function () { $('#loading').fadeOut(); }, 1000);
        setTimeout(function () { $('#game').fadeIn(); }, 2000);
    };

    function moveLeft() {
        $('#deck ul').animate({ left: + cardWidth }, 200, function () {
            $('#deck ul li:last-child').prependTo('#deck ul');
            $('#deck ul').css('left', '');
        });
    };

    function moveRight() {
        $('#deck ul').animate({ left: - cardWidth }, 200, function () {
            $('#deck ul li:first-child').appendTo('#deck ul');
            $('#deck ul').css('left', '');
        });
    };

    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var _ref = [array[j], array[i]];
            array[i] = _ref[0];
            array[j] = _ref[1];
        }
        return array;
    }

});