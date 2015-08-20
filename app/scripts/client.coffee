class ClientClass
  constructor: ->
    @_serverUrl = null
    @_boardKey = null
    @_loadConfig()

  updateSensors: (sensors) ->
    return if @_boardKey is null

    boardTime = Date.now()
    fetch("#{@_serverUrl}/boards/#{@_boardKey}/sensors.json",
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sensors: sensors, board_time: boardTime))

  _loadConfig: ->
    Config.ready.then =>
      @_serverUrl = Config.server
      @_boardKey = Config.boardKey
      @_registerBoard() if @_boardKey is null

  _registerBoard: ->
    body =
      board:
        node: 'chrome'
        serial: Config.boardSerial
    fetch("#{@_serverUrl}/boards.json",
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body))
          .then (response) =>
            response.json()
          .then (json) =>
            @_boardKey = json.key
            Config.setBoardKey json.key


window.Client = new ClientClass()
