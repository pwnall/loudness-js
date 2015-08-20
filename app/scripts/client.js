(function() {
  var ClientClass;

  ClientClass = (function() {
    function ClientClass() {
      this._serverUrl = null;
      this._boardKey = null;
      this._loadConfig();
    }

    ClientClass.prototype.updateSensors = function(sensors) {
      var boardTime;
      if (this._boardKey === null) {
        return;
      }
      boardTime = Date.now();
      return fetch("" + this._serverUrl + "/boards/" + this._boardKey + "/sensors.json", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sensors: sensors,
          board_time: boardTime
        })
      });
    };

    ClientClass.prototype._loadConfig = function() {
      return Config.ready.then((function(_this) {
        return function() {
          _this._serverUrl = Config.server;
          _this._boardKey = Config.boardKey;
          if (_this._boardKey === null) {
            return _this._registerBoard();
          }
        };
      })(this));
    };

    ClientClass.prototype._registerBoard = function() {
      var body;
      body = {
        board: {
          node: 'chrome',
          serial: Config.boardSerial
        }
      };
      return fetch("" + this._serverUrl + "/boards.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then((function(_this) {
        return function(response) {
          return response.json();
        };
      })(this)).then((function(_this) {
        return function(json) {
          _this._boardKey = json.key;
          return Config.setBoardKey(json.key);
        };
      })(this));
    };

    return ClientClass;

  })();

  window.Client = new ClientClass();

}).call(this);
