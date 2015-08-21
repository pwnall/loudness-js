## Managed Setup

The app is intended to be configured using Chrome's managed settings, so
IT admins can set up a domain's Chromeboxes.

The following commands simulate a managed configuration on OSX.

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

## Development Setup

If the app cannot find its managed settings, it will attempt to use the
configuration stored in local
[chrome.storage](https://developer.chrome.com/apps/storage).

That can be set by running the following JavaScript. The app must be reloaded
after performing configuration changes.

```javascript
chrome.storage.local.set({Server: 'http://server.local:3000',
                          BoardSerial: 'some-serial'});
```
