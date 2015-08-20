# Sets a dummy alarm to prevent Chrome from deactivating our app.
class AlarmClass
  constructor: ->
    chrome.alarms.onAlarm.addListener @onAlarm.bind(@)
    # Chrome will not honor alarm requests with times < 1 minute.
    # https://developer.chrome.com/apps/alarms#method-create
    chrome.alarms.create "keep me up", delayInMinutes: 1, periodInMinutes: 1
    chrome.power.requestKeepAwake 'system'

  # Called when the alarm triggers. Nothing to do here.
  onAlarm: ->
    null

window.Alarm = new AlarmClass()
