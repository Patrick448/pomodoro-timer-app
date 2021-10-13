#!/bin/bash

adb start-server
adb tcpip 5555
adb connect 192.168.0.119:5555
