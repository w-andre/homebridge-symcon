# homebridge-symcon
IP-Symcon plugin for homebridge

## Installation (Debian)

* Install Debian 8.2 (Jessie)
* Install dependencies (e.g. NodeJS, NPM):
```
    $ sudo apt-get install libavahi-compat-libdnssd-dev
    $ sudo apt-get install libkrb5-dev
    $ sudo wget -qO- https://deb.nodesource.com/setup_5.x | sudo bash -
    $ sudo apt-get install nodejs
    $ sudo apt-get install build-essential
    $ sudo apt-get install git
```
* Install Homebridge
```	
    $ sudo npm install -g homebridge
```	
* Install Symcon-Plugin for Homebridge
```
    $ sudo npm install -g homebridge-symcon
```	
* Create Homebridge configuration file 'config.json' in Directory .homebridge in user home (see config-sample.json)
* Start Homebridge
```
    $ homebridge
```
