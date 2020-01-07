var lastPositionX = undefined;
var game = undefined;
var cards = [];

var cardCount = 0;
var notPlayedCount = 0;
var hitCount = 0;
var failCount = 0;

function initCards(cards) {
    var i = 1;
    cards.forEach(function (card) {
        card.id = i++;
        card.played = false;
        card.options.forEach(function (option) {
            option.id = i++;
            option.selected = false;
        });
        card.options = shuffle(card.options);
    });
    return game.shuffle ? shuffle(cards) : cards;
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var ref = [array[j], array[i]];
        array[i] = ref[0];
        array[j] = ref[1];
    }
    return array;
}

function buildDeck() {
    var deckHtml = "";
    cards.forEach(function (card) {
        deckHtml += buildCard(card);
    });
    $('#deck ul').html(deckHtml);
}

function buildCard(card) {
    var cardHtml =
        "<li>" +
            "<div class=\"card\" id=\"card-" + card.id + "\">" +
                "<div class=\"card-content\" style=\"" + buildStyle(card) + "\">" +
                    buildQuestion(card) +
                "</div>" +
                "<div class=\"card-buttons\">" +
                    buildOptions(card) +
                "</div>" +
            "</div>" +
        "</li>";
    return cardHtml;
}

function buildQuestion(card) {
    var cardHtml = "";
        if (card.image) {
            cardHtml += "<img  id=\"card-image-" + card.id + "\" src=\"/alicia/images/" + game.repository + card.image + (game.type == 'PARTIAL_IMAGE' ? '_' : '') + '.' + game.imageType  + "\" class=\"card-image\"/>"
        } else {
            cardHtml += "<div class=\"card-question\"><p>" + card.question + "</p></div>"
        }
    return cardHtml;
}

function buildOptions(card) {
    var optionsHtml = "";
    card.options.forEach(function (option) {
        optionsHtml += "<input type=\"button\" class=\"btn\" id=\"option-" + option.id + "\" value=\"" + option.text + "\" onclick=\"play("+ card.id + ", " + option.id + ");\"/>";
    });
    return optionsHtml;
}

function buildStyle(card) {
    return (game.cardColor ? 'background: ' + game.cardColor + ';' : '') +
           (card.color ? 'background: ' + card.color + ';' : '') +
           (card.fontColor ? 'color: ' + card.fontColor + ';' : '') +
           (card.fontSize ? 'font-size: ' + card.fontSize + ';' : '');
}

function play(cardId, optionId) {
    var card = cards.find(function (element) { return element.id == cardId });
    var option = card.options.find(function (element) { return element.id == optionId });
    card.played = true;
    option.selected = true;
    card.options.forEach(function (option) {
        var optionElement = $('#option-' + option.id);
        optionElement.attr("disabled", true);
        if (option.correct) {
            optionElement.addClass('correct');
        }
    });
    $('#not-played-count').html(--notPlayedCount);
    if (option.correct) {
        $('#hit-count').html(++hitCount);
    } else {
        $('#option-' + option.id).addClass('wrong');
        $('#fail-count').html(++failCount);
    }
    if (game.type == 'PARTIAL_IMAGE') {
        $('#card-image-' + card.id).attr('src', '/alicia/images/' + game.repository + card.image + '.' + game.imageType);
    }
}

$(document).ready(function () {
    var gameId = new URL(window.location.href).searchParams.get('game');
    game = GAMES.find(function (element) { return element.id == gameId });
    if (!game) {
        $('#title').html('Oops...');
    } else {
        $('#title').html(game.title);
        $('#header').html(game.title);

        cards = initCards(game.cards);

        buildDeck();

        cardCount = cards.length;
        notPlayedCount = cards.length;
        hitCount = 0;
        failCount = 0;

        var cardElement = $('#deck ul li');
        var cardWidth = cardElement.width();
        var cardHeight = cardElement.height();

        initBoard();

        function initBoard() {
            $('#total-count').html(cardCount);
            $('#not-played-count').html(notPlayedCount);

            var deckWidth = cardCount * cardWidth;

            $('#deck').css({width: cardWidth, height: cardHeight});
            $('#deck ul').css({width: deckWidth, marginLeft: -cardWidth});
            $('#deck ul li:last-child').prependTo('#deck ul');

            $('a.control-prev').click(function () { moveLeft(); });
            $('a.control-next').click(function () { moveRight(); });

            $('html').keydown(function (event) { if (event.which == 37) { moveLeft(); } });
            $('html').keydown(function (event) { if (event.which == 39) { moveRight(); } });

            $('#deck ul').on('touchstart', function (event) {
                lastPositionX = event.changedTouches[0].pageX;
            });
            $('#deck ul').on('touchend', function (event) {
                var diff = event.changedTouches[0].pageX - lastPositionX;
                if (diff < -50) {
                    moveRight();
                }
                if (diff > 50) {
                    moveLeft();
                }
            });

            setTimeout(function () { $('#loading').fadeOut(); }, 1000);
            setTimeout(function () { $('#board').fadeIn(); }, 2000);
        }

        function moveLeft() {
            $('#deck ul').animate({left: +cardWidth}, 200, function () {
                $('#deck ul li:last-child').prependTo('#deck ul');
                $('#deck ul').css('left', '');
            });
        }

        function moveRight() {
            $('#deck ul').animate({left: -cardWidth}, 200, function () {
                $('#deck ul li:first-child').appendTo('#deck ul');
                $('#deck ul').css('left', '');
            });
        }
    }
});