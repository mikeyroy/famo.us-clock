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

	function ClockView() {
		View.apply(this, arguments);

		_createClock.call(this);
		//_updateClock.call(this);
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

	function _createClock() {
		var clock = new Surface();

		var clockModifier = new StateModifier(this.options);

		this.add(clockModifier).add(clock);

		var clockFaceView = new ClockFaceView();

		var ticks = _getTimeRadians.call(this);

		var hourHandView = new ClockHandView(5, 50, 5, 'blue');

		this.hourHandModifier = new StateModifier({
			transform: Transform.rotateZ(ticks[0])
		});

		var minuteHandView = new ClockHandView(4, 65, 4, 'green');
		
		this.minuteHandModifier = new StateModifier({
			transform: Transform.rotateZ(ticks[1])
		});

		var secondHandView = new ClockHandView(3, 80, 2, 'red');

		this.secondHandModifier = new StateModifier({
			transform: Transform.rotateZ(ticks[2])
		});

		this.add(clockFaceView);
		this.add(this.hourHandModifier).add(hourHandView);
		this.add(this.minuteHandModifier).add(minuteHandView);
		this.add(this.secondHandModifier).add(secondHandView);
	}

	function _updateClock() {
		var ticks = _getTimeRadians.call(this);

		if (!ticks) {
			return;
		}

		this.hourHandModifier.setTransform(Transform.rotateZ(ticks[0]), this.options.handTransition);
		this.minuteHandModifier.setTransform(Transform.rotateZ(ticks[1]), this.options.handTransition);
		this.secondHandModifier.setTransform(Transform.rotateZ(ticks[2]), this.options.handTransition);
	}

	function _getTimeRadians() {
		var tickDate = new Date();
		var currentSecond = tickDate.getSeconds();

		if (currentSecond === this.lastSecond) {
			return;
		}

		this.lastSecond = currentSecond;

		var hours = tickDate.getHours();
		hours = hours > 11 ? hours - 12 : hours;

		var secondRadian = currentSecond * this.options.angleMultiplier;
		var minuteRadian = tickDate.getMinutes() * this.options.angleMultiplier;
		var hourRadian = hours * 5 * this.options.angleMultiplier + (minuteRadian / 12);

		return [hourRadian - this.options.baseRotation, minuteRadian - this.options.baseRotation, secondRadian - this.options.baseRotation];
	}

	module.exports = ClockView;
});