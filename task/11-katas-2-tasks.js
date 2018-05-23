'use strict';

/**
 * Возвращает номер банковского счета, распаршеный из предоставленной строки.
 *
 * Вы работаете в банке, который недавно приобрел аппарат, помогающий в чтении писем и факсов, отправленных филиалами.
 * Аппарат сканирует бумажный документ и генерирует строку с банковсчким счетом, который выглядит следующим образом:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Каждая строка содержит номер счета, записанный с помощью '|' и '_'.
 * Каждый счет должен иметь 9 цифр в диапазоне от 0 до 9.
 *
 * Ваша задача -- написать функцию, которая будет принимать номер счета строкой, как описано выше, и парсить ее в обычные числа.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
	let numAssocArray = Array(10);
	for (let i = 0; i < numAssocArray.length; i++) {
		numAssocArray[i] = Array(3);
	}
	let tpl1 = ' _     _  _     _  _  _  _  _ ';
	let tpl2 = '| |  | _| _||_||_ |_   ||_||_|';
	let tpl3 = '|_|  ||_  _|  | _||_|  ||_| _|';
	for (let i = 0; i < numAssocArray.length; i++) {
		numAssocArray[i][0] = tpl1.substr(i * 3, 3);
		numAssocArray[i][1] = tpl2.substr(i * 3, 3);
		numAssocArray[i][2] = tpl3.substr(i * 3, 3);
	}
	
	let lines = bankAccount.split('\n');
	let strNumStorage = Array(3);
	let num = 0;
	let index;
	for (let i = 0; i < lines[0].length; i += 3) {
		for (let j = 0; j < strNumStorage.length; j++) {
			strNumStorage[j] = lines[j].substr(i, 3);
		}
		for (let j = 0; j < numAssocArray.length; j++) {
			if ((strNumStorage[0] == numAssocArray[j][0])
				&& (strNumStorage[1] == numAssocArray[j][1])
				&& (strNumStorage[2] == numAssocArray[j][2])) {
				index = j;
			}
		}
		num = num * 10 + index;
	}
	return num;
}


/**
 * Возвращает строку, в которой будут вставлены переносы строки в правильных местах. Каждая часть до переноса строки должна быть не больше, чем переданное в функцию число.
 * Строка может быть перенесена только по границе слов.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
	let words = text.split(' ');
	let line;
	while (words.length > 0) {
		line = words.shift();
		while ((words.length > 0) && (line.length + words[0].length < columns)) {
			line += ' ' + words.shift();
		}
		yield line;
	}
}


/**
 * Возвращает ранг заданной покерной комбинации.
 * Ранги смотрите тут: https://en.wikipedia.org/wiki/List_of_poker_hands
 * https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%BA%D0%B5%D1%80
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function IsStraight(cards) {
	let values = Array();
	for (let card of cards) {
		switch (card['name']) {
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '10':
				values.push(Number.parseInt(card['name']));
				break;
			case 'J':
				values.push(11);
				break;
			case 'Q':
				values.push(12);
				break;
			case 'K':
				values.push(13);
				break;
		}
	}
	values = values.sort((a, b) => a > b);
	let areInStraightOrder = true;
	for (let i = 1; i < values.length; i++) {
		if (values[i] - values[i - 1] != 1) {
			areInStraightOrder = false;
		}
	}
	if (!areInStraightOrder) {
		return false;
	}
	if (values.length == 5) {
		return true;
	}
	if ((values[0] == 2) || (values[values.length - 1] == 13)) {
		return true;
	}
}

function IsFlush(cards) {
	for (let i = 1; i < cards.length; i++) {
		if (cards[0]['suit'] != cards[i]['suit']) {
			return false;
		}
	}
	return true;
}

function IsStraightFlush(cards) {
	
	return IsFlush(cards) && IsStraight(cards);
}

function IsFullHouse(cards) {
	let counter = 0;
	let remainingCards;
	for (let i = 0; (i < cards.length - 2) && (counter != 3); i++) {
		counter = 1;
		for (let j = i + 1; j < cards.length; j++) {
			if (cards[i]['name'] == cards[j]['name']) {
				counter++;
			}
		}
		if (counter == 3) {
			remainingCards = cards.filter((card) => card['name'] != cards[i]['name']);
		}
	}
	if ((counter == 3) && (remainingCards[0]['name'] == remainingCards[1]['name'])) {
		return true;
	}
	return false;
}

function ParseCard(card) {
	let matched = card.match(/([JQKA\d]+)(.+)/);
	let result = new Array();
	result['name'] = matched[1];
	result['suit'] = matched[2];
	return result;
}

function GetMaxOfKind(cards) {
	let oneOfKindArray = new Array();
	let maxOfKind = 0;
	for (let card of cards) {
		if (oneOfKindArray[card['name']] === undefined) {
			oneOfKindArray[card['name']] = 1;
		} else {
			oneOfKindArray[card['name']]++;
		}
		maxOfKind = Math.max(maxOfKind, oneOfKindArray[card['name']]);
	}
	return maxOfKind;
}

function GetPairsCount(cards) {
	let nameCountArray = Array();
	let numOfPairs = 0;
	for (let card of cards) {
		if (nameCountArray[card['name']] === undefined) {
			nameCountArray[card['name']] = 1;
		} else {
			if (++nameCountArray[card['name']] == 2) {
				numOfPairs++;
			}
		}
	}
	return numOfPairs;
}

function getPokerHandRank(hand) {
	let cards = new Array(hand.length);
	for (let i = 0; i < hand.length; i++) {
		cards[i] = ParseCard(hand[i]);
	}
	let maxOfKind = GetMaxOfKind(cards);
	let pairs = GetPairsCount(cards);
	if (IsStraightFlush(cards)) {
		return PokerRank.StraightFlush;
	}
	if (maxOfKind == 4) {
		return PokerRank.FourOfKind;
	}
	if (IsFullHouse(cards)) {
		return PokerRank.FullHouse;
	}
	if (IsFlush(cards)) {
		return PokerRank.Flush;
	}
	if (IsStraight(cards)) {
		return PokerRank.Straight;
	}
	if (maxOfKind == 3) {
		return PokerRank.ThreeOfKind;
	}
	if (pairs == 2) {
		return PokerRank.TwoPairs;
	}
	if (pairs == 1) {
		return PokerRank.OnePair;
	}
	return PokerRank.HighCard;
}


/**
 * Возвращает набор прямоугольников из заданной фигуры.
 * Фигура -- это многострочный набор ASCII символов из '-', '+', '|' и пробелов.
 * Ваша задача -- разбить фигуру на прямоугольники, из которых она составлена.
 *
 * К СВЕДЕНИЮ: Порядок прямоугольников не имеет значения.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
	let figureArr = figure.split('\n');
	let rectangle;
	for (let i = 0; i < figureArr.length; i++) {
		for (let j = 0; j < figureArr[i].length; j++) {
			if (figureArr[i][j] == '+') {
				rectangle = GetRectangle(figureArr, i, j);
				if (rectangle != null) {
					yield DrawRectangle(rectangle[1], rectangle[0]);
				}
			}
		}
	}
}

function GetRectangle(figure, row, column) {
	for (let i = row + 1; i < figure.length; i++) {
		if (figure[i][column] == '+') {
			for (let j = column + 1; j < figure[row].length; j++) {
				if (figure[i][j] == "+") {
					if (figure[row][j] == "+") {
						let flag = true;
						for (let k = row + 1; k < i; k++) {
							if (figure[k][j] != '|') {
								flag = false;
								break;
							}
						}
						if (flag) {
							return [i - row + 1, j - column + 1];
						}
					}
				} else if (figure[i][j] != '-') {
					break;
				}
			}
		}
		else if (figure[i][column] != '|') {
			break;
		}
	}
	return null;
}
	
function DrawRectangle(width, height) {
	return '+' + '-'.repeat(width - 2) + '+\n'
		   + ('|' + ' '.repeat(width - 2) + '|\n').repeat(height - 2)
		   + '+' + '-'.repeat(width - 2) + '+\n';
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
