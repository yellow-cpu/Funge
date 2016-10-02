#!/bin/bash

# Put this script in the same root folder as the SDK folder and the certs folder

echo "=================================================="
echo "========== World of Plants Installation =========="
echo "=================================================="

# Check expect installation
echo "Checking expect installation..."
expect -v foo >/dev/null 2>&1 || {
	echo -e >&2 "Please install 'expect' to run this script:\n\tsudo apt-get install expect\n"
	exit 1
}
echo "expect installed"
echo

# Copy over certs
echo "Copying over certificates..."

cp -r certs/* AWS-IoT-Arduino-Yun-SDK/AWS-IoT-Python-Runtime/certs/

# Make install script executable
chmod 755 AWS-IoT-Arduino-Yun-SDK/AWSIoTArduinoYunInstallAll.sh

# Get IP, username and password for the board
echo -e "Please connect your arduino device to the same WiFi\nconnection as this PC, retrieve the IP address of\nthe arduino and enter it below:\n"
echo -en "\tArduino IP Address: "
read ip
echo
echo -e "Please enter in the user name and password for the\nArduino board (just press enter to use defaults):\n"
echo -en "\tUser Name <root>: "
read username
username=${username:-root}
echo -en  "\tPassword <arduino>: "
read -s password
password=${password:-arduino}
echo
echo

# Run install script with params
echo -e "Installing SDK on the Arduino board.\nThis might take a couple of minutes, so please be\npatient..."
echo

./AWS-IoT-Arduino-Yun-SDK/AWSIoTArduinoYunInstallAll.sh $ip $username $password

echo "Installation complete!"
echo "=================================================="