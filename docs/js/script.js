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
    return shuffle(cards);
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
            "<div class=\"card\" id=\"card-" + card.id + "\" style=\"" + (card.color ? 'color: ' + card.color + ';' : '') + (card.backgroundColor ? 'background: ' + card.backgroundColor + ';' : '') + "\">" +
                "<div class=\"card-content\">" +
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
            cardHtml += "<img  id=\"card-image-" + card.id + "\" src=\"/alicia/images/" + card.image + "\" class=\"card-image\"/>"
            if (card.imageSolution) {
                cardHtml += "<img  id=\"card-image-solution-" + card.id + "\" src=\"/alicia/images/" + card.imageSolution + "\" class=\"hidden card-image\"/>"
            }
        } else {
            cardHtml += "<div class=\"card-question\"><p style=\"" + (card.fontSize ? 'font-size: ' + card.fontSize + ';' : '') + "\">" + card.question + "</p></div>"
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
    if (card.imageSolution) {
        $('#card-image-' + card.id).hide();
        $('#card-image-solution-' + card.id).fadeIn();
    }
}

$(document).ready(function () {
    var gameId = new URL(window.location.href).searchParams.get('game');
    var game = GAMES.find(function (element) { return element.id == gameId });
    if (!game) {
        $('#title').html('Oops...');
    } else {
        $('#title').html(game.title);

        cards = initCards(game.data);

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