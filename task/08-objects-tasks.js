'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Перед началом работы с заданием, пожалуйста ознакомьтесь с туториалом:                         *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Возвращает объект Прямоугольник (rectangle) с параметрами высота (height) и ширина (width)
 * и методом getArea(), который возвращает площадь
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
	this.width = width;
	this.height = height;
	Rectangle.prototype.getArea = () => this.width * this.height;
}


/**
 * Возвращает JSON представление объекта
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
	return JSON.stringify(obj);
}


/**
 * Возвращает объект указанного типа из представления JSON
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
	return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Создатель css селекторов
 *
 * Каждый комплексый селектор может состоять из эелемента, id, класса, атрибута, псевдо-класса и
 * псевдо-элемента
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Может быть несколько вхождений
 *
 * Любые варианты селекторов могут быть скомбинированы с помощью ' ','+','~','>' .
 *
 * Задача состоит в том, чтобы создать отдельный класс, независимые классы или
 * иерархию классов и реализовать функциональность
 * для создания селекторов css с использованием предоставленного cssSelectorBuilder.
 * Каждый селектор должен иметь метод stringify ()
 * для вывода строкового представления в соответствии с спецификацией css.
 *
 * Созданный cssSelectorBuilder должен использоваться как фасад
 * только для создания ваших собственных классов,
 * например, первый метод cssSelectorBuilder может быть таким:
 *
 * Дизайн класса(ов) полностью зависит от вас,
 * но постарайтесь сделать его максимально простым, понятным и читаемым насколько это возможно.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  Если нужно больше примеров - можете посмотреть юнит тесты.
 */

function CssSelector() {
	this.elements = Array();
	this.ids = Array();
	this.classes = Array();
	this.attrs = Array();
	this.pseudoClasses = Array();
	this.pseudoElements = Array();
	this.PartEnum = {
		NONE: 0,
		ELEMENT: 1,
		ID: 2,
		CLASS: 3,
		ATTR: 4,
		PSEUDOCLASS: 5,
		PSEUDOELEMENT: 6
	};
	this.lastPart = this.PartEnum.NONE;
}

CssSelector.prototype = {

	checkOrder: function(curPart) {
		if (curPart < this.lastPart) {
			throw new Error("Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element");
		}
		return curPart;
	},
	
    element: function(value) {
    	if (this.elements.length != 0) {
    		throw new Error("Element, id and pseudo-element should not occur more then one time inside the selector");
    	}
    	this.lastPart = this.checkOrder(this.PartEnum.ELEMENT);
		this.elements.push(value);
		return this;
    },

    id: function(value) {
    	if (this.ids.length != 0) {
    		throw new Error("Element, id and pseudo-element should not occur more then one time inside the selector");
    	}
    	this.lastPart = this.checkOrder(this.PartEnum.ID);
        this.ids.push('#'.concat(value));
		return this;
    },

    class: function(value) {
    	this.lastPart = this.checkOrder(this.PartEnum.CLASS);
        this.classes.push('.'.concat(value));
		return this;
    },

    attr: function(value) {
    	this.lastPart = this.checkOrder(this.PartEnum.ATTR);
        this.attrs.push('['.concat(value, ']'));
		return this;
    },

    pseudoClass: function(value) {
    	this.lastPart = this.checkOrder(this.PartEnum.PSEUDOCLASS);
        this.pseudoClasses.push(':'.concat(value));
		return this;
    },

    pseudoElement: function(value) {
    	if (this.pseudoElements.length != 0) {
    		throw new Error("Element, id and pseudo-element should not occur more then one time inside the selector");
    	}
    	this.lastPart = this.checkOrder(this.PartEnum.PSEUDOELEMENT);
        this.pseudoElements.push('::'.concat(value));
		return this;
    },
    
    stringify: function() {
    	return this.elements.join('')
    		+ this.ids.join('')
    		+ this.classes.join('')
    		+ this.attrs.join('')
    		+ this.pseudoClasses.join('')
    		+ this.pseudoElements.join('');
    }
};

function CssSelectorCombination() {
	this.selectors = Array();
	this.combinators = Array();
}

CssSelectorCombination.prototype = {

	combine: function(selector1, combinator, selector2) {
		this.selectors = new Array(0).concat(('selectors' in selector1) ? selector1.selectors : selector1, ('selectors' in selector2) ? selector2.selectors : selector2);
		this.combinators = new Array(0).concat(('combinators' in selector1) ? selector1.combinators : [], combinator, ('combinators' in selector2) ? selector2.combinators : []);
		return this;
	},

	stringify: function() {
		let result = new String().concat(this.selectors[0].stringify());
		for (let i = 1; i < this.selectors.length; i++) {
			result = result.concat(' ', this.combinators[i - 1], ' ', this.selectors[i].stringify());
		}
		return result;
	}
	
}

const cssSelectorBuilder = {
	
    element: function(value) {
        return new CssSelector().element(value);
    },

    id: function(value) {
        return new CssSelector().id(value);
    },

    class: function(value) {
        return new CssSelector().class(value);
    },

    attr: function(value) {
        return new CssSelector().attr(value);
    },

    pseudoClass: function(value) {
        return new CssSelector().pseudoClass(value);
    },

    pseudoElement: function(value) {
        return new CssSelector().pseudoElement(value);
    },

    combine: function(selector1, combinator, selector2) {
        return new CssSelectorCombination().combine(selector1, combinator, selector2);
    },
};


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
