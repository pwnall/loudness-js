class ConfigClass
  constructor: ->
    @ready = new Promise (resolve, reject) =>
      @_resolveReady = resolve
      @_rejectReady = reject

    @boardKey = null
    @boardSerial = null
    @server = null
    @_readConfig()

  boardKey: null

  boardSerial: null

  server: null

  setBoardKey: (boardKey) ->
    @boardKey = boardKey
    identity =
      server: @server
      key: @boardKey
    chrome.storage.local.set boardIdentity: identity

  _readConfig: ->
    chrome.storage.managed.get ['Server', 'BoardSerial'], (results) =>
      @boardSerial = results.BoardSerial
      @server = results.Server
      chrome.storage.local.get ['boardIdentity', 'BoardSerial', 'Server'],
          (results) =>
            @boardSerial ||= results.BoardSerial
            @server ||= results.Server
            identity = results.boardIdentity || {}
            if identity.server is @server
              @boardKey = identity.key
            else
              @boardKey = null

            unless @_resolveReady is null
              @_resolveReady true
              @_resolveReady = null
              @_rejectReady = null
            return
      return
    return


window.Config = new ConfigClass()
