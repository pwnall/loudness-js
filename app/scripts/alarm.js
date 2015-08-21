(function() {
  'use strict';
  var AlarmClass;

  AlarmClass = (function() {
    function AlarmClass() {
      chrome.alarms.onAlarm.addListener(this.onAlarm.bind(this));
      chrome.alarms.create("keep me up", {
        delayInMinutes: 1,
        periodInMinutes: 1
      });
      chrome.power.requestKeepAwake('system');
    }

    AlarmClass.prototype.onAlarm = function() {
      return null;
    };

    return AlarmClass;

  })();

  window.Alarm = new AlarmClass();

}).call(this);
