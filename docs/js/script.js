var lastPositionX = undefined;
var deck = undefined;

var cardCount = 0;
var notPlayedCount = 0;
var hitCount = 0;
var failCount = 0;

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var ref = [array[j], array[i]];
        array[i] = ref[0];
        array[j] = ref[1];
    }
    return array;
}

function init() {
    var i = 1;
    deck.cards.forEach(function (card) {
        card.id = i++;
        card.played = false;
        if (card.options) {
            card.options.forEach(function (option) {
                option.id = i++;
                option.selected = false;
            });
            card.options = shuffle(card.options);
        }
    });
    if (deck.shuffle) {
        deck.cards = shuffle(deck.cards);
    }
}

function buildDeck() {
    var deckHtml = "";
    deck.cards.forEach(function (card) {
        deckHtml += buildCard(card);
    });
    $('#deck ul').html(deckHtml);
}

function buildCard(card) {
    var cardHtml =
        "<li>" +
            "<div class='card' id='card-" + card.id + "'>" +
                "<div class='card-content' style='" + buildStyle('background', card.color) + "'>" +
                    buildQuestion(card) +
                "</div>" +
                "<div class='card-buttons'>" +
                    buildOptions(card) +
                "</div>" +
            "</div>" +
        "</li>";
    return cardHtml;
}

function buildQuestion(card) {
    var cardHtml;
    if (card.image) {
        cardHtml = "<img id='card-image-" + card.id + "' src='" + buildImageUrl(card, true) + "' class='card-image' alt=''/>"
    } else if (deck.id == 'CHEMICAL_ELEMENTS') {
        cardHtml =
            "<div class='card-element'>" +
                "<div class='element'>" +
                    "<div class='element-atomic-number'><span>" + card.atomicNumber + "</span></div>" +
                    "<div class='element-symbol'><span id='card-answer-" + card.id + "' class='dashed'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>" +
                    "<div class='element-name'><span>" + card.name + "</span></div>" +
                "</div>" +
            "</div>"
    } else {
        cardHtml = "<div class='card-question'><p style='" + buildStyle('color', card.fontColor) + "'>" + card.question + "</p></div>"
    }
    return cardHtml;
}

function buildOptions(card) {
    var optionsHtml = "";
    if (card.options) {
        card.options.forEach(function (option) {
            optionsHtml += "<input type='button' class='btn' id='option-" + option.id + "' value='" + option.text + "' onclick='play(" + card.id + ", " + option.id + ");'/>";
        });
    }
    return optionsHtml;
}

function buildImageUrl(card, partial) {
    return '/alicia/images/' + deck.repository + card.image + (partial && deck.type == 'PARTIAL_IMAGE' ? '_' : '') + '.' + deck.imageType;
}

function buildStyle(property, value) {
    return value ? property + ':' + value + ';' : '';
}

function play(cardId, optionId) {
    var card = deck.cards.find(function (element) { return element.id == cardId });
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
    if (deck.type == 'PARTIAL_IMAGE') {
        $('#card-image-' + card.id).attr('src', buildImageUrl(card, false));
    }
    if (deck.id == 'CHEMICAL_ELEMENTS') {
        $('#card-answer-' + card.id).removeClass('dashed');
        $('#card-answer-' + card.id).html(card.symbol);
    }
}

$(document).ready(function () {
    var deckId = new URL(window.location.href).searchParams.get('deck');
    deck = DECKS.find(function (element) { return element.id == deckId });
    if (!deck) {
        $('#title').html('Oops...');
    } else {
        $('#header').html(deck.name);
        $('#title').html(deck.name);
        $('#board').addClass(deck.id);

        init();

        buildDeck();

        cardCount = deck.cards.length;
        notPlayedCount = deck.cards.length;
        hitCount = 0;
        failCount = 0;

        var cardElement = $('#deck ul li');
        var cardWidth = cardElement.width();
        var cardHeight = cardElement.height();

        if (!deck.cards[0].options) {
            $('#score').hide();
        }

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

            setTimeout(function () {$('#loading').fadeOut(function () { $('#board').fadeIn(); }); }, 1000);
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