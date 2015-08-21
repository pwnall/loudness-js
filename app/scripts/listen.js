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

    ListenClass.prototype.onSamples = null;

    return ListenClass;

  })();

  window.Listen = new ListenClass();

}).call(this);
