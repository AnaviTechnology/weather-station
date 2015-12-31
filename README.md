# weather-station
Python and Node.js scripts for a weather station using Raspberry Pi Sense HAT

#Hardware

* Raspberry Pi
* Raspberry Pi Sense HAT

#Installation

* Ensure that Python modules for Raspberry Pi Sense HAT have been installed, for Debian use the following tutorial: https://www.raspberrypi.org/documentation/hardware/sense-hat/

* Get the source code

```
mkdir -p /opt/rabbitpi/
git clone https://github.com/RabbitPi/weather-station.git /opt/rabbitpi/weather-station/
```

* Deploy systemd service

```
cp /opt/rabbitpi/weather-station/systemd/rabbitpi-weather-station.service /lib/systemd/system/rabbitpi-weather-station.service
systemctl daemon-reload
```

* Launch automatically the systemd service on every boot 

```
systemctl enable rabbitpi-weather-station
```

* Start manually the systemd service

```
systemctl start rabbitpi-weather-station
```
