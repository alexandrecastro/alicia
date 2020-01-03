var cards = initCards(WORLD_FLAGS);

var hitCount = 0;
var errorCount = 0;

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
    return shuffle(cards);
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var _ref = [array[j], array[i]];
        array[i] = _ref[0];
        array[j] = _ref[1];
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
                "<div class=\"card-content\">" +
                    "<img src=\"/alicia/images/" + card.image + "\" class=\"card-image\"/>" +
                "</div>" +
                "<div class=\"card-buttons\">" +
                    buildOptions(card) +
                "</div>" +
            "</div>" +
        "</li>";
    return cardHtml;
}

function buildOptions(card) {
    var optionsHtml = "";
    card.options.forEach(function (option) {
        optionsHtml += "<input type=\"button\" class=\"btn\" id=\"option-" + option.id + "\" value=\"" + option.text + "\" onclick=\"play("+ card.id + ", " + option.id + ");\"/>";
    });
    return optionsHtml;
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
    if (option.correct) {
        $('#hit-count').html(++hitCount);
    } else {
        $('#option-' + option.id).addClass('wrong');
        $('#error-count').html(++errorCount);
    }
}

$(document).ready(function () {
    buildDeck();

    var cardElement = $('#deck ul li');
    var cardWidth = cardElement.width();
    var cardHeight = cardElement.height();

    initBoard();

    function initBoard() {
        $('#total-count').html(cards.length);

        var deckWidth = cards.length * cardWidth;

        $('#deck').css({ width: cardWidth, height: cardHeight });
        $('#deck ul').css({ width: deckWidth, marginLeft: - cardWidth });
        $('#deck ul li:last-child').prependTo('#deck ul');

        $('a.control-prev').click(function () { moveLeft(); });
        $('a.control-next').click(function () { moveRight(); });

        $('html').keydown(function (event) { if ( event.which == 37 ) { moveLeft(); } });
        $('html').keydown(function (event) { if ( event.which == 39 ) { moveRight(); } });

        setTimeout(function () { $('#loading').fadeOut(); }, 1000);
        setTimeout(function () { $('#board').fadeIn(); }, 2000);
    }

    function moveLeft() {
        $('#deck ul').animate({ left: + cardWidth }, 200, function () {
            $('#deck ul li:last-child').prependTo('#deck ul');
            $('#deck ul').css('left', '');
        });
    }

    function moveRight() {
        $('#deck ul').animate({ left: - cardWidth }, 200, function () {
            $('#deck ul li:first-child').appendTo('#deck ul');
            $('#deck ul').css('left', '');
        });
    }
});