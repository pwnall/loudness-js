## Backend setup

```bash
cp config.plist.example config.plist
dscl -u $USER /Local/Default -mcximport /Computers/local_computer config.plist
sudo mcxrefresh -n $USER
```

If an error occurs:

```bash
GUID=`uuidgen`
ETHER=`ifconfig en0 | awk '/ether/ {print $2}'`
dscl -u $USER /Local/Default -create /Computers/local_computer
dscl -u $USER /Local/Default -create /Computers/local_computer RealName "Local Computer"
dscl -u $USER /Local/Default -create /Computers/local_computer GeneratedUID $GUID
dscl -u $USER /Local/Default -create /Computers/local_computer ENetAddress $ETHER
```
