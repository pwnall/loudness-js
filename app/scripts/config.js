(function() {
  'use strict';
  var ConfigClass;

  ConfigClass = (function() {
    function ConfigClass() {
      this.ready = new Promise((function(_this) {
        return function(resolve, reject) {
          _this._resolveReady = resolve;
          return _this._rejectReady = reject;
        };
      })(this));
      this.boardKey = null;
      this.boardSerial = null;
      this.server = null;
      this._readConfig();
    }

    ConfigClass.prototype.boardKey = null;

    ConfigClass.prototype.boardSerial = null;

    ConfigClass.prototype.server = null;

    ConfigClass.prototype.setBoardKey = function(boardKey) {
      var identity;
      this.boardKey = boardKey;
      identity = {
        server: this.server,
        key: this.boardKey
      };
      return chrome.storage.local.set({
        boardIdentity: identity
      });
    };

    ConfigClass.prototype._readConfig = function() {
      chrome.storage.managed.get(['Server', 'BoardSerial'], (function(_this) {
        return function(results) {
          _this.boardSerial = results.BoardSerial;
          _this.server = results.Server;
          chrome.storage.local.get(['boardIdentity', 'BoardSerial', 'Server'], function(results) {
            var identity;
            _this.boardSerial || (_this.boardSerial = results.BoardSerial);
            _this.server || (_this.server = results.Server);
            identity = results.boardIdentity || {};
            if (identity.server === _this.server) {
              _this.boardKey = identity.key;
            } else {
              _this.boardKey = null;
            }
            if (_this._resolveReady !== null) {
              _this._resolveReady(true);
              _this._resolveReady = null;
              _this._rejectReady = null;
            }
          });
        };
      })(this));
    };

    return ConfigClass;

  })();

  window.Config = new ConfigClass();

}).call(this);
