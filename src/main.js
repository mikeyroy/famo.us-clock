define(function(require, exports, module) {
	// import dependencies
	var Engine = require('famous/core/Engine');
	var mainContext = Engine.createContext();
	
	var ClockView = require('views/ClockView');
	var clockView = new ClockView();
    
	mainContext.add(clockView);
});