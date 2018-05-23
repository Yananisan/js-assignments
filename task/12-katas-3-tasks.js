'use strict';

/**
 * Возвращает true если слово попадается в заданной головоломке.
 * Каждое слово может быть построено при помощи прохода "змейкой" по таблице вверх, влево, вправо, вниз.
 * Каждый символ может быть использован только один раз ("змейка" не может пересекать себя).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (первая строка)
 *   'REACT'     => true   (начиная с верхней правой R и дальше ↓ ← ← ↓)
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (первая колонка)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {

	function IsInPosArr(posArr, pos) {
		for (let arrPos of posArr) {
			if ((arrPos[0] == pos[0]) && (arrPos[1] == pos[1])) {
				return true;
			}
		}
		return false;
	}

	function IsHere(puzzle, word, curLetterNum, curPos) {
		if (curLetterNum == word.length - 1) {
			if ((puzzle[curPos[0]][curPos[1]] == word[curLetterNum]) && (!IsInPosArr(wasInRow, [curPos[0], curPos[1]]))) {
				return true;
			} else {
				return false;
			}
		} else {
			if ((puzzle[curPos[0]][curPos[1]] == word[curLetterNum]) && (!IsInPosArr(wasInRow, [curPos[0], curPos[1]]))) {
				let result = false;
				wasInRow.push([curPos[0], curPos[1]]);
				if (curPos[0] > 0)
					result = result || IsHere(puzzle, word, curLetterNum + 1, [curPos[0] - 1, curPos[1]]);
				if (curPos[1] < puzzle[curPos[0]].length - 1)
					result = result || IsHere(puzzle, word, curLetterNum + 1, [curPos[0], curPos[1] + 1]);
				if (curPos[0] < puzzle.length - 1)
					result = result || IsHere(puzzle, word, curLetterNum + 1, [curPos[0] + 1, curPos[1]]);
				if (curPos[1] > 0)
					result = result || IsHere(puzzle, word, curLetterNum + 1, [curPos[0], curPos[1] - 1]);
				wasInRow.pop();
				return result;
			} else {
				return false;
			}
		}
	}
	
	let result = false;
	let wasInRow = new Array();
	for (let i = 0; i < puzzle.length; i++) {
		for (let j = 0; j < puzzle[i].length; j++) {
			result = result || IsHere(puzzle, searchStr, 0, [i, j]);
		}
	}
	return result;
}


/**
 * Возвращает все перестановки заданной строки.
 * Принимаем, что все символы в заданной строке уникальные.
 * Порядок перестановок не имеет значения.
 *
 * @param {string} chars
 * @return {Iterable.<string>} все возможные строки, построенные из символов заданной строки
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
 

 
function* getPermutations(chars) {

	function *HeapsAlgorithm(n, A) {
		if (n == 1) {
			yield A.join('');
		} else {
			let temp;
			for (let i = 0; i < n; i++) {
				yield *HeapsAlgorithm(n - 1, A);
				if (n % 2 == 0) {
					temp = A[i];
					A[i] = A[n - 1];
					A[n - 1] = temp;
				} else {
					temp = A[0];
					A[0] = A[n - 1];
					A[n - 1] = temp;
				}
			}
		}
	}
	
	yield *HeapsAlgorithm(chars.length, chars.split(''));
}


/**
 * Возвращает наибольшую прибыль от игры на котировках акций.
 * Цены на акции храняться в массиве в порядке увеличения даты.
 * Прибыль -- это разница между покупкой и продажей.
 * Каждый день вы можете либо купить одну акцию, либо продать любое количество акций, купленных до этого, либо ничего не делать.
 * Таким образом, максимальная прибыль -- это максимальная разница всех пар в последовательности цен на акции.
 *
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (купить по 1,2,3,4,5 и затем продать все по 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (ничего не покупать)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (купить по 1,6,5 и затем продать все по 10)
 */
function getMostProfitFromStockQuotes(quotes) {
	let sum = 0;
	quotes.forEach((value, index) => {
		sum += quotes.slice(index).sort((a, b) => b - a)[0] - value;
	});
	return sum;
}


/**
 * Класс, предосатвляющий метод по сокращению url.
 * Реализуйте любой алгоритм, но не храните ссылки в хранилище пар ключ\значение.
 * Укороченные ссылки должны быть как минимум в 1.5 раза короче исходных.
 *
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function(url) {
    	let result = new String();
    	let char1, char2, newChar;
		for (let i = 0; i + 1 < url.length; i += 2) {
			char1 = url.charCodeAt(i);
			char2 = url.charCodeAt(i + 1);
			newChar = (char1 << 8) + char2;
			result += String.fromCharCode(newChar);
		}
		if (url.length % 2 == 1) {
			result += String.fromCharCode(url.charCodeAt(url.length - 1) << 8);
		}
		return result;
    },
    
    decode: function(code) {
		let result = new String();
		let char1, char2, oldChar;
		for (let i = 0; i < code.length; i++) {
			oldChar = code.charCodeAt(i);
			char2 = oldChar & 255;
			char1 = oldChar >> 8;
			result += String.fromCharCode(char1) + ((char2 == 0) ? '' : String.fromCharCode(char2));
		}
		return result;
    } 
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
