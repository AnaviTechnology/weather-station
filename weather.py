#!/usr/bin/python

import json

from sense_hat import SenseHat

sense = SenseHat()
sense.clear()

temperature = sense.get_temperature()
humidity = sense.get_humidity()
pressure = sense.get_pressure()

weather = {
	'temperature': temperature,
	'humidity': humidity,
	'pressure': pressure
	}

print json.dumps(weather) 
