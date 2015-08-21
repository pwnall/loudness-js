(function() {
  'use strict';
  var LoudnessClass;

  LoudnessClass = (function() {
    function LoudnessClass() {
      Listen.onSamples = this._onSamples.bind(this);
      this._pace = 0;
    }

    LoudnessClass.prototype._onSamples = function(event) {
      var channelCount, db, dbs, i, inputBuffer, j, powerSum, sampleCount, sampleRate, samples, sum;
      inputBuffer = event.inputBuffer;
      channelCount = inputBuffer.numberOfChannels;
      sampleCount = inputBuffer.length;
      sampleRate = inputBuffer.sampleRate;
      dbs = (function() {
        var _i, _j, _results;
        _results = [];
        for (i = _i = 0; 0 <= channelCount ? _i < channelCount : _i > channelCount; i = 0 <= channelCount ? ++_i : --_i) {
          samples = inputBuffer.getChannelData(i);
          sum = 0;
          powerSum = 0;
          for (j = _j = 0; 0 <= sampleCount ? _j < sampleCount : _j > sampleCount; j = 0 <= sampleCount ? ++_j : --_j) {
            sum += samples[j];
            powerSum += samples[j] * samples[j];
          }
          sum /= sampleCount;
          powerSum = Math.sqrt(powerSum / sampleCount);
          _results.push(10 * Math.log(powerSum));
        }
        return _results;
      })();
      db = dbs[0] >= dbs[1] ? dbs[0] : dbs[1];
      this._pace += 1;
      if (this._pace % 3 === 0) {
        return Client.updateSensors({
          micpower: db
        });
      }
    };

    return LoudnessClass;

  })();

  chrome.power.requestKeepAwake('system');

  window.Loudness = new LoudnessClass();

}).call(this);
