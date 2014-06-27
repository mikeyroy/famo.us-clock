/**
* ClockFaceView.js
* Builds the clock border, tick marks, and center pin
*/
define(function(require, exports, module) {
	var View = require('famous/core/View');
	var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
	var StateModifier = require('famous/modifiers/StateModifier');

	/**
	* Initialization function
	* Generates the clock face UI
	*/
	function ClockFaceView() {
		View.apply(this, arguments);

		_clockBorder.call(this);
		_clockTicks.call(this);
		_clockHandPin.call(this);
	}

	ClockFaceView.prototype = Object.create(View.prototype);
	ClockFaceView.prototype.constructor = ClockFaceView;

	ClockFaceView.DEFAULT_OPTIONS = {
		size: [200, 200],
		origin: [0.5, 0.5],
		align: [0.5, 0.5],
		clockBorderWidth: 10,
		smallTickHeight: 8,
		bigTickHeight: 20,
		TickHeight: 4,
		angleMultiplier: Math.PI * 2 / 60,
		pinDiameter: 2
	};

	/**
	* Creates the clocks border
	*/
	function _clockBorder() {
		var clockBorder = new Surface({
			properties: {
				border: this.options.clockBorderWidth + 'px solid #dddddd',
				borderRadius: (this.options.size[0] / 2) + 'px',
				borderStyle: 'double'
			}
		});

		var clockBorderModifier = new StateModifier(this.options);

		this.add(clockBorderModifier).add(clockBorder);
	}

	/**
	* Generates the 60 clock ticks
	*/
	function _clockTicks() {
		for (var i = 0; i < 60; i+= 1) {
			_addClockTick.call(this, i);
		}
	}

	/**
	* Creates the clock tick and calculates the position it needs to be in on the clock face
	*/
	function _addClockTick(minute) {
		var tick = new Surface({
			properties: {
				borderRight: (minute % 5 === 0 ? this.options.bigTickHeight : this.options.smallTickHeight) + 'px solid #808080'
			}
		});

		var tickModifier = new StateModifier({
			size: [this.options.size[0] / 2 - this.options.clockBorderWidth, this.options.TickHeight],
			transform: Transform.translate(0, -this.options.TickHeight / 2, 0),
			origin: [0, 0],
			align: this.options.align
		});

		var rotateModifier = new StateModifier({
			transform: Transform.rotateZ(minute * this.options.angleMultiplier)
		});

		this.add(rotateModifier).add(tickModifier).add(tick);
	}

	/**
	* Generates the central pin and properly places it
	*/
	function _clockHandPin() {
		var pin = new Surface({
			properties: {
				border: this.options.pinDiameter + 'px solid #333333',
				borderRadius: this.options.pinDiameter + 'px'
			}
		});

		var pinModifier = new StateModifier({
			size: [this.options.pinDiameter, this.options.pinDiameter],
			origin: this.options.origin,
			align: this.options.align,
			transform: Transform.translate(-this.options.pinDiameter / 2, -this.options.pinDiameter / 2, 100)
		});

		this.add(pinModifier).add(pin);
	}

	module.exports = ClockFaceView;
});