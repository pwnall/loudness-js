(function() {
  'use strict';
  var ListenClass;

  ListenClass = (function() {
    function ListenClass() {
      this._context = new AudioContext();
      this._scriptNode = this._context.createScriptProcessor(16384, 2, 2);
      this._scriptNode.onaudioprocess = this._onSamples.bind(this);
      this._scriptNode.connect(this._context.destination);
      this._stream = null;
      this._streamSource = null;
      this.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia).bind(navigator);
      this.getUserMedia({
        audio: true
      }, this.onMediaSuccess.bind(this), this.onMediaFail.bind(this));
    }

    ListenClass.prototype.onSamples = null;

    ListenClass.prototype._setStream = function(stream) {
      if (this._stream !== null) {
        console.error('setStream called twice!');
        return;
      }
      return this._stream = stream;
    };

    ListenClass.prototype._startProcessing = function() {
      if (this._stream === null) {
        console.error('startRecording called without an input stream');
        return;
      }
      this._streamSource = this._context.createMediaStreamSource(this._stream);
      return this._streamSource.connect(this._scriptNode);
    };

    ListenClass.prototype.onMediaSuccess = function(stream) {
      this._setStream(stream);
      return this._startProcessing();
    };

    ListenClass.prototype.onMediaFail = function(error) {
      console.error('getUserMedia failed');
      return console.error(error);
    };

    ListenClass.prototype._onSamples = function(event) {
      if (this.onSamples) {
        return this.onSamples(event);
      }
    };

    ListenClass.prototype.onSamples = function(event) {
      var channelCount, db, hit, i, inputBuffer, j, powerSum, sampleCount, sampleRate, samples, sum, _i, _j, _results;
      inputBuffer = event.inputBuffer;
      channelCount = inputBuffer.numberOfChannels;
      sampleCount = inputBuffer.length;
      sampleRate = inputBuffer.sampleRate;
      hit = false;
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
        db = Math.log(powerSum);
        if (db > -7) {
          _results.push(hit = true);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return ListenClass;

  })();

  window.Listen = new ListenClass();

}).call(this);
