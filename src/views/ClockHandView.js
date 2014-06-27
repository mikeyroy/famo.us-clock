/**
* ClockHandView.js
* Creates individual clock hands. Customization is done in the constructor.
* ex var hourHandView = new ClockHandView(5, 50, 5, 'blue');
*/
define(function(require, exports, module) {
	var View = require('famous/core/View');
	var Surface = require('famous/core/Surface');
	var Transform = require('famous/core/Transform');
	var StateModifier = require('famous/modifiers/StateModifier');

	/**
	* Initialization function
	* Creates an individual clock hand
	*/
	function ClockHandView() {
		View.apply(this, arguments);

		_createHand.apply(this, arguments);
	}

	ClockHandView.prototype = Object.create(View.prototype);
	ClockHandView.prototype.constructor = ClockHandView;

	ClockHandView.DEFAULT_OPTIONS = {
		size: [200, 200],
		origin: [0.5, 0.5],
		align: [0.5, 0.5]
	};

	/**
	* Creates a clock hand and places it in the UI
	* @param pinDiameter {Integer} The diameter of the center ring under the clock's pin
	* @param width {Integer} The width of the clock hand
	* @param length {Integer} The length of the clock hand
	* @param color {String} The color of the clock hand
	*/
	function _createHand(pinDiameter, width, length, color) {
		var pinHole = new Surface({
			properties: {
				border: pinDiameter + 'px solid ' + color,
				borderRadius: pinDiameter + 'px'
			}
		});

		var pinHoldModifier = new StateModifier({
			size: [pinDiameter, pinDiameter],
			origin: this.options.origin,
			align: this.options.align,
			transform: Transform.translate(-pinDiameter / 2, -pinDiameter / 2, 0)
		});

		this.add(pinHoldModifier).add(pinHole);

		var arm = new Surface({
			properties: {
				borderTop: width + 'px solid ' + color,
				borderRight: length / 2 + 'px solid transparent',
				borderLeft: length / 2 + 'px solid transparent'
			}
		});

		var armModifier = new StateModifier({
			size: [0, 0],
			origin: this.options.origin,
			align: this.options.align,
			transform: Transform.translate(-length / 2, pinDiameter / 2, 0)
		});

		this.add(armModifier).add(arm);
	}

	module.exports = ClockHandView;
});