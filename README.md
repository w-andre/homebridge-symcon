# homebridge-symcon
IP-Symcon plugin for homebridge

# Installation (Debian)

1. install Debian 8.2 (Jessie)
2. install dependencies (e.g. NodeJS, NPM):
```
    $ sudo apt-get install libavahi-compat-libdnssd-dev
    $ sudo apt-get install libkrb5-dev
    $ sudo wget -qO- https://deb.nodesource.com/setup_5.x | sudo bash -
    $ sudo apt-get install nodejs
    $ sudo apt-get install build-essential
    $ sudo apt-get install git
```
3. install Homebridge
```	
    $ sudo npm install -g homebridge
```	
4. install Symcon-Plugin for Homebridge
```
    $ sudo npm install -g homebridge-symcon
```	
5. create Homebridge configuration file 'config.json' in Directory .homebridge in user home (see config-sample.json)
6. start Homebridge
```
    $ homebridge
```
