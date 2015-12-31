var sys = require('sys')
var process = require('child_process');

var python = "/usr/bin/python";
var path = "/opt/rabbitpi/weather-station/";
var cmdPrefix = python + " " + path;

var data = {
		"pressure": 0,
		"temperature": 0,
		"humidity": 0
}

function readData(error, stdout, stderr) {
	if (null !== error) {
		return false;
	}
	data = JSON.parse(stdout);
	return true;
}

function print() {
	//Print information on the LED matrix of Raspberry Pi SENSE HAT 
	var text = "Temperature: " + data.temperature + "C ";
	text += "Humidity: " + data.humidity + "% ";
	text += "Pressure: " + data.pressure + "mb ";
	var child = process.spawn(python, [path+"print.py", "--text", text], {
		detached: true,
		stdio: [ 'ignore', 'ignore', 'ignore' ]
	});
	child.unref();
}

function start(error, stdout, stderr) {
	if (readData(error, stdout, stderr)) {
		print();

		var intervalPrint = setInterval(function() {
			print();
		}, 32000);
	}
}

process.exec(cmdPrefix + "weather.py", start);

var intervalRead = setInterval(function() {
	process.exec(cmdPrefix + "weather.py", readData);
}, 1000);
