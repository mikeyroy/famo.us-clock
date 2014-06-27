/**
* ClockView.js
* Builds the clock interface and implements the update mechanisms
*/
define(function(require, exports, module) {
	var View = require('famous/core/View');
	var ContextualView = require('famous/views/ContextualView');
	var Surface = require('famous/core/Surface');
	var Transform = require('famous/core/Transform');
	var StateModifier = require('famous/modifiers/StateModifier');
	var Easing = require('famous/transitions/Easing');
	var Timer = require('famous/utilities/Timer');

	var ClockFaceView = require('views/ClockFaceView');
	var ClockHandView = require('views/ClockHandView');

	/**
	* Initialization function. 
	* Starts the clock movements
	*/
	function ClockView() {
		View.apply(this, arguments);

		_createClock.call(this);

		var _this = this;
		Timer.every(function() { _updateClock.call(_this); });
	}

	ClockView.prototype = Object.create(View.prototype);
	ClockView.prototype.constructor = ClockView;

	ClockView.DEFAULT_OPTIONS = {
		size: [200, 200],
		origin: [0.5, 0.5],
		align: [0.5, 0.5],
		baseRotation: Math.PI / 2,
		angleMultiplier: Math.PI * 2 / 60,
		handTransition: { duration: 100, curve: Easing.inCubic }
	};

	/**
	* Creates the clock face and the clock hands from ClockFaceView and ClockHandView
	*/
	function _createClock() {
		var clock = new Surface();

		var clockModifier = new StateModifier(this.options);

		this.add(clockModifier).add(clock);

		var clockFaceView = new ClockFaceView();

		var ticks = _getTimeRadians.call(this);

		var hourHandView = new ClockHandView(5, 50, 5, '#444444');

		this.hourHandModifier = new StateModifier({
			transform: Transform.rotateZ(ticks[0])
		});

		var minuteHandView = new ClockHandView(4, 65, 4, '#000000');
		
		this.minuteHandModifier = new StateModifier({
			transform: Transform.rotateZ(ticks[1])
		});

		var secondHandView = new ClockHandView(3, 70, 2, 'red');

		this.secondHandModifier = new StateModifier({
			transform: Transform.rotateZ(ticks[2])
		});

		this.add(clockFaceView);
		this.add(this.hourHandModifier).add(hourHandView);
		this.add(this.minuteHandModifier).add(minuteHandView);
		this.add(this.secondHandModifier).add(secondHandView);
	}

	/**
	* Applies the transforms for each hand when they need to be moved. Is called in the Famo.us Engine RAF.
	*/
	function _updateClock() {
		var ticks = _getTimeRadians.call(this);

		if (!ticks) {
			return;
		}

		if (ticks[0]) {
			this.hourHandModifier.setTransform(Transform.rotateZ(ticks[0]), this.options.handTransition);
			this.minuteHandModifier.setTransform(Transform.rotateZ(ticks[1]), this.options.handTransition);
		}

		this.secondHandModifier.setTransform(Transform.rotateZ(ticks[2]), (Math.abs(ticks[2]) !== Math.PI ? this.options.handTransition : null));
	}

	/**
	* Takes the current time and calculates the radians required for the angle of each of the clock hands
	*
	* @return {Array} [hours, minutes, seconds]
	*/
	function _getTimeRadians() {
		var tickDate = new Date();

		var currentSecond = tickDate.getSeconds();

		if (currentSecond === this.lastSecond) {
			return;
		}

		this.lastSecond = currentSecond;

		var currentHour = tickDate.getHours();
		currentHour = currentHour > 11 ? currentHour - 12 : currentHour;

		var currentMinute = tickDate.getMinutes();

		var secondRadian, minuteRadian, hourRadian;

		secondRadian = currentSecond * this.options.angleMultiplier - Math.PI;
		
		if (currentMinute !== this.lastMinute) {
			minuteRadian = tickDate.getMinutes() * this.options.angleMultiplier;
			hourRadian = currentHour * 5 * this.options.angleMultiplier + (minuteRadian / 12) - Math.PI;
			
			minuteRadian -= Math.PI;

			this.lastMinute = currentMinute;
		}

		return [hourRadian, minuteRadian, secondRadian];
	}

	module.exports = ClockView;
});