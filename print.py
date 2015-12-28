#!/usr/bin/python

import sys

from sense_hat import SenseHat

text = "RabbitPi"
colorRed = 0
colorGreen = 240
colorBlue = 0
for index in range(len(sys.argv)):
	next = index+1
	if next >= len(sys.argv):
		break
	if "--text" == sys.argv[index]:
		text = sys.argv[next]
	elif "--color-red" == sys.argv[index]:
		colorRed = int(sys.argv[next])
	elif "--color-green" == sys.argv[index]:
		colorGreen = int(sys.argv[next])
	elif "--color-blue" == sys.argv[index]:
		colorBlue = int(sys.argv[next])

color = (colorRed, colorGreen, colorBlue)

print "Text: "+text

sense = SenseHat()
sense.set_rotation(180)
try:
	sense.show_message(text, text_colour=color)
except ValueError as error:
	print "Error: " + str(error)
