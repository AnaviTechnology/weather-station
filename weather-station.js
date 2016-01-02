var sys = require('sys');
var childProcess = require('child_process');
var nconf = require('nconf');
var mqtt  = require('mqtt');
var fs = require('fs');

var configPath = '/etc/rabbitpi/weather-station.json'

try {
	fs.accessSync(configPath, fs.F_OK);
} catch (e) {
	console.error('ERROR: config file ' + configPath + ' not found');
	process.exit(1);
}

nconf.file(configPath);

var client  = mqtt.connect({
				host: nconf.get('mqtt:host'),
				port: nconf.get('mqtt:port')
			});

var python = "/usr/bin/python";
var path = "/opt/rabbitpi/weather-station/";
var cmdPrefix = python + " " + path;

var isPrintEnabled = nconf.get('display:print');

var data = {
		"pressure": 0,
		"temperature": 0,
		"humidity": 0
}

function childProcessConfigurations(message) {
	// Example configuration message:
	// { "print": false }
	try {
		// Read configurations
		var config = JSON.parse(message.toString());
		// Update print settings
		isPrintEnabled = (true == config.print);
	}
	catch(error) {
		// Nothing to do, the configuration is wrong
		console.log("Configuration error: "+error.message);
	}
}

client.on('connect', function () {
	client.subscribe('config');
});

client.on('message', function (topic, message) {
	if ('config' === topic) {
		childProcessConfigurations(message);
	}
});

function readData(error, stdout, stderr) {
	if (null !== error) {
		return false;
	}
	var dataNew = JSON.parse(stdout);

	//check if weather data has changed
	if (dataNew.temperature && data.temperature &&
		(dataNew.temperature != data.temperature) ) {
		client.publish('sensors/temperature',
			JSON.stringify({ temperature: dataNew.temperature }) );
	}

	if (dataNew.humidity && data.humidity &&
		(dataNew.humidity != data.humidity) ) {
		client.publish('sensors/humidity',
			JSON.stringify({ humidity: dataNew.humidity }) );
	}

	if (dataNew.pressure && data.pressure &&
		(dataNew.pressure != data.pressure) ) {
		client.publish('sensors/pressure',
			JSON.stringify({ pressure: dataNew.pressure }) );
	}

	//update data
	data = dataNew;

	return true;
}

function print() {
	//Do not do anything if printing is disabled
	if (isPrintEnabled === false) {
		return;
	}
	//Print information on the LED matrix of Raspberry Pi SENSE HAT 
	var text = "Temperature: " + data.temperature + "C ";
	text += "Humidity: " + data.humidity + "% ";
	text += "Pressure: " + data.pressure + "mb ";
	var child = childProcess.spawn(python, [path+"print.py", "--text", text], {
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

childProcess.exec(cmdPrefix + "weather.py", start);

var intervalRead = setInterval(function() {
	childProcess.exec(cmdPrefix + "weather.py", readData);
}, 1000);
