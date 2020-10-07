/* Generic class for audio components with a controlled gain.
 */
class AudioUnit {
  constructor () {
    this.volume = 1

    // Setup the audio context and link the nodes together.
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    this.master = this.audioCtx.createGain()
    this.master.connect(this.audioCtx.destination)
  }

  time () { return this.audioCtx.currentTime }

  /* setVolume: Change the current volume. Act by tweaking the gain's gain.
	 * params:
	 *     volume: The new volume to use.
	 */
  setVolume (volume) {
    this.volume = volume
    this.start()
  }

  /* start and stop: While the audio unit can be called/stopped in the futur,
	 * we want to change their volume now. Those functions perform just that.
	 */
  start () { this.master.gain.setValueAtTime(this.volume, this.time()) }
  stop () { this.master.gain.setValueAtTime(0, this.time()) }
}

/* Synth class to play chords. Add a compressor and a ADSR ramp for a cleaner
 * sound.
 */
class Synth extends AudioUnit {
  constructor () {
    super()

    // Create the compressor.
    this.compressor = this.audioCtx.createDynamicsCompressor()
    this.compressor.threshold.value = -10
    this.compressor.knee.value = 40
    this.compressor.ratio.value = 10
    this.compressor.attack.value = 0
    this.compressor.connect(this.master)
  }

  /* play: Play the sound.
	 * params:
	 *     pitch: The frequency to play.
	 *     start: Time at which to start playing the sound.
	 *     end:   Time at which to stop playing the sound.
	 */
  play (pitch, start, end) {
    // -1 is a silence
    if (pitch == -1) {
      return
    }

    // Create an oscillator, using a triangle wave.
    var oscillator = this.audioCtx.createOscillator()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(pitch, this.time())

    // Create a simple adsr ramp
    var a = 0.1; var d = 0.2; var s = 0.8; var r = 0.8

    var adsrRamp = this.audioCtx.createGain()
    adsrRamp.gain.setValueAtTime(0, start - 0.1)
    adsrRamp.gain.linearRampToValueAtTime(1, start + a)
    adsrRamp.gain.linearRampToValueAtTime(s, start + a + d)
    adsrRamp.gain.linearRampToValueAtTime(0, end + r)

    // Connect everything
    oscillator.connect(adsrRamp)
    adsrRamp.connect(this.compressor)

    // Set the timing for playing the note.
    oscillator.start(start)
    oscillator.stop(end + r)
  }
}

/* Simple AudioUnit used to play an 880 sinewave.
 */
class Tick extends AudioUnit {
  /* play: Play the sound.
	 * params:
	 *     time: Time at which to play the sound.
	 */
  play (time) {
    var oscillator = this.audioCtx.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, this.time())
    oscillator.connect(this.master)

    // Very short 'tick'
    oscillator.start(time)
    oscillator.stop(time + 0.1)
  }
}
