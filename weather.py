#!/usr/bin/python

import json

from sense_hat import SenseHat

sense = SenseHat()
sense.clear()

format = "{0:.1f}"
temperature = format.format(sense.get_temperature())
humidity = format.format(sense.get_humidity())
pressure = format.format(sense.get_pressure())

weather = {
	'temperature': temperature,
	'humidity': humidity,
	'pressure': pressure
	}

print json.dumps(weather) 
