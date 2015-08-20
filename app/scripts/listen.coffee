'use strict';

class ListenClass
  constructor: ->
    @_context = new AudioContext()

    # 16384: maximum number of samples, because we don't care about latency.
    # 2 input channels, 0 output channels.
    @_scriptNode = @_context.createScriptProcessor 16384, 2, 2
    @_scriptNode.onaudioprocess = @_onSamples.bind @
    @_scriptNode.connect @_context.destination

    @_stream = null
    @_streamSource = null

    # Chrome still uses webkitGetUserMedia. This ivar abstracts over it.
    @getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia).bind(navigator)
    @getUserMedia { audio: true }, @onMediaSuccess.bind(@),
                  @onMediaFail.bind(@)

  onSamples: null

  _setStream: (stream) ->
    unless @_stream is null
      console.error 'setStream called twice!'
      return
    @_stream = stream

  _startProcessing: ->
    if @_stream is null
      console.error 'startRecording called without an input stream'
      return
    @_streamSource = @_context.createMediaStreamSource @_stream
    @_streamSource.connect @_scriptNode

  onMediaSuccess: (stream) ->
    @_setStream stream
    @_startProcessing()

  onMediaFail: (error) ->
    console.error 'getUserMedia failed'
    console.error error

  _onSamples: (event) ->
    if @onSamples
      @onSamples event

  onSamples: (event) ->
    inputBuffer = event.inputBuffer
    channelCount = inputBuffer.numberOfChannels
    sampleCount = inputBuffer.length
    sampleRate = inputBuffer.sampleRate

    hit = false;
    for i in [0...channelCount]
      samples = inputBuffer.getChannelData i

      sum = 0
      powerSum = 0
      for j in [0...sampleCount]
        sum += samples[j]
        powerSum += samples[j] * samples[j]
      sum /= sampleCount
      powerSum = Math.sqrt powerSum / sampleCount

      db = Math.log powerSum
      if db > -7
        hit = true

window.Listen = new ListenClass()
