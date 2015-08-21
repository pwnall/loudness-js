'use strict';

class LoudnessClass
  constructor: ->
    Listen.onSamples = @_onSamples.bind(@)
    @_pace = 0

  _onSamples: (event) ->
    inputBuffer = event.inputBuffer
    channelCount = inputBuffer.numberOfChannels
    sampleCount = inputBuffer.length
    sampleRate = inputBuffer.sampleRate

    dbs = for i in [0...channelCount]
      samples = inputBuffer.getChannelData i

      sum = 0
      powerSum = 0
      for j in [0...sampleCount]
        sum += samples[j]
        powerSum += samples[j] * samples[j]
      sum /= sampleCount
      powerSum = Math.sqrt powerSum / sampleCount

      10 * Math.log(powerSum)

    db = if dbs[0] >= dbs[1] then dbs[0] else dbs[1]
    @_pace += 1
    if @_pace % 3 is 0
      Client.updateSensors micpower: db


chrome.power.requestKeepAwake 'system'
window.Loudness = new LoudnessClass()
