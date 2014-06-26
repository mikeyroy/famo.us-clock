define(function(require, exports, module) {
	var View = require('famous/core/View');
	var Surface = require('famous/core/Surface');
	var Transform = require('famous/core/Transform');
	var StateModifier = require('famous/modifiers/StateModifier');

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

	function _createHand(pinDiameter, width, height, color) {
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
				borderTop: height / 2 + 'px solid transparent',
				borderBottom: height / 2 + 'px solid transparent',
				borderLeft: width + 'px solid ' + color
			}
		});

		var armModifier = new StateModifier({
			size: [0, 0],
			origin: this.options.origin,
			align: this.options.align,
			transform: Transform.translate(pinDiameter / 2, -height / 2, 0)
		});

		this.add(armModifier).add(arm);
	}

	module.exports = ClockHandView;
});