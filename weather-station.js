var sys = require('sys')
var process = require('child_process');

function readData(error, stdout, stderr) {
	if (null !== error) {
		return;
	}
	var data = JSON.parse(stdout);

	//Print information on the LED matrix of Raspberry Pi SENSE HAT 
	var text = "Temperature: " + data.temperature + "C ";
	text += "Humidity: " + data.humidity + "% ";
	text += "Pressure: " + data.pressure + "mb ";
	var child = process.spawn("python", ["print.py", "--text", text], {
		detached: true,
		stdio: [ 'ignore', 'ignore', 'ignore' ]
	});
	child.unref();
}

process.exec("python weather.py", readData);
