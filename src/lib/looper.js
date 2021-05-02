/* Play a suite of chords/chords in a loop and allow a simple play/pause/tempo
 * change mechanism. Mainly based on
 * https://www.html5rocks.com/en/tutorials/audio/scheduling/.
 */
class Looper {
	/* Create a new looper, following a set of chords at a defined tempo.
	 * params:
	 *     synth: The synth to play the chords on.
	 *     synth: The synth to tick the metronome on.
	 *     chords: The list of chords to play.
	 *     tempo: The BPM to play the chords.
	 *     callback: A function to call everytime the current chord change.
	 */
	constructor(synth, tick, chords, tempo, volume, callback) {
		this.chords = chords
		this.tempo = tempo
		this.synth = synth
		this.tick = tick
		this.volume = volume

		this.playing = false

		// How much in advance should we look for chords.
		this.lookAhead = 0.3
		// How quickly should the interval call the loop function.
		this.timeoutTime = 25
		// The interval element, to be cleared.
		this.intervalLoop = null

		// Where we are in the chord list.
		this.currentChord = 0
		// What is the next audio context time to play a chord at.
		this.nextChordTime = 0
		// Same for the metronome
		this.nextTickTime = 0
		this.activeTick = false

		this.callback = callback
	}

	set volume(volume) {
		volume /= 100
		this.synth.setVolume(volume)
		this.tick.setVolume(volume)
	}

	get volume() {
		return parseInt(this.synth.volume * 100)
	}

	/* play: Play the loop.  */
	play() {
		//  Playing means we start again from the first chord.
		this.currentChord = 0

		// We also start playing right away.
		this.nextChordTime = this.synth.time()
		this.synth.start()

		this.nextTickTime = this.tick.time()
		this.tick.start()

		// And we call the loop function every so often.
		this.intervalLoop = setInterval(() => this.loop(), this.timeoutTime)
	}

	/* pause: Pause the loop.  */
	pause() {
		// Pausing clear the interval loop.
		this.synth.stop()
		this.tick.stop()
		clearInterval(this.intervalLoop)
	}

	/* playPause: Toggle the loop playing.  */
	playPause() {
		this.playing = !this.playing

		if (this.playing) {
			this.play()
		} else {
			this.pause()
		}
	}

	/* The loop will request to play every chord found in the defined lookAhead.  */
	loop() {
		// If there are 2 quarter chords fitting inside the 30ms of look ahead, schedule them.
		while (this.nextChordTime < this.synth.time() + this.lookAhead) {
			// Play the current chord.
			this.chords[this.currentChord].play(this.synth, this.tempo, this.nextChordTime)

			// Update the new time to play the next chord.
			this.nextChordTime += (this.chords[this.currentChord].duration * 15.0) / this.tempo

			// Send the current index to the outside world.
			const currentChord = this.currentChord
			setTimeout(() => {
				this.callback(currentChord)
			}, 0)

			// Update the current chord.
			this.currentChord = ++this.currentChord % this.chords.length
		}

		// Same logic for ticking
		while (this.nextTickTime < this.tick.time() + this.lookAhead) {
			if (this.activeTick) {
				this.tick.play(this.nextTickTime)
			}
			// Update the new time to play the next chord.
			this.nextTickTime += 60.0 / this.tempo
		}
	}
}

export default Looper
