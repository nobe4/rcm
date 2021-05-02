/* stringToRatio: Compute a number-based time duration for the note.
 * The logic is to use this value as a ratio when selecting the tempo.
 * For example, a half-note has a duration of 2, because we can then do
 * tempo/2 to have the duration of the note.
 * We can also combine durations like:
 *  - ww  => 1 + 1
 *  - hqe => 1/2 + 1/4 + 1/8
 * params:
 *     durationString: The defined duration, in a string format.
 * returns: The float ratio to apply on the tempo later.
 */
function stringToRatio(durationString) {
	const durationRatioReference = ['w', 'h', 'q', 'e', 's']

	const durationValues = durationString.split('')
	let ratio = 0

	durationValues.forEach((durationChar) => {
		ratio += 1 / (1 << durationRatioReference.indexOf(durationChar))
	})

	// Catch the invalid names
	if (ratio < 0) throw `Invalid duration name: '${durationString}'.`

	return ratio
}

/* ratioToString: Create the string equivalent to the duration.
 * e.g. 16: 4, 4, 4, 4 -> q, q, q, q
 * params:
 *     duration: The duration to get th string from.
 * returns: An array of strings
 */
function ratioToString(duration) {
	const durationLetters = ['s', 'e', 'q', 'h', 'w']
	let string = ''

	// x is at the same time the index in the duration letters reference and
	// the 2 power to apply when substracting the duration.
	let x = 4

	// While the duration is not entirely looked.
	while (duration > 0 && x > -1) {
		// If the current 2th power is contained in the duration
		if (duration - (1 << x) >= 0) {
			// Substract it
			duration -= 1 << x
			// And add the corresponding letter
			string += durationLetters[x]
		} else {
			// Otherwise, go to the next letter
			x--
		}
	}
	return string
}

/* RythmBox: Beat maker, create a list of chord length, fitting in a defined length.
 */
class RhythmBox {
	/* params:
	 *     duration: The duration of the mesure, in number of sixteenth chords
	 *     (e.g.  16 is a full bar, 32 is two bars).
	 *     mode: The mode of generation, simple is the default.
	 */
	constructor(duration = 16, mode = 'simple') {
		this.duration = duration
		this.durations = this[mode + 'Generator']()
	}

	/* equalGenerator: Create the default duration for the defined duration, simply cut the bar in
	 * 4 equal parts, and trim on the last durations to fill the gap.
	 * e.g. 16 -> 4, 4, 4, 4
	 *       6 -> 2, 2, 1, 1
	 * returns: An array of durations.
	 */
	equalGenerator() {
		// Round the duration to its next integer
		const duration = Math.ceil(this.duration / 4.0)
		const durations = [duration, duration, duration, duration]
		// Compute the difference between the computed duration and the expected
		// one.
		const difference = duration * 4 - this.duration

		// Reduce the tail of the array's value.
		for (var x = difference; x > 0; x--) {
			durations[4 - x]--
		}

		return durations
	}

	/* randomGenerator: Create a fully random rhythm progression.
	 * params:
	 *     noise: How much to scramble the durations.
	 * returns: An array of durations.
	 */
	randomGenerator(noise = 20) {
		// The minimal size of a division, this will vary how many divisions there are.
		const divisionBaseSize = Math.ceil(this.duration / (Math.random() * this.duration))

		// Max number of divisions
		const maxDivisions = Math.floor(this.duration / divisionBaseSize)

		// How many divisions we want.
		const divisionCount = Math.floor(Math.random() * maxDivisions) + 1

		// Actual division size
		const divisionSize = Math.ceil(this.duration / divisionCount)

		// Array of durations
		const durations = Array.from({ length: divisionCount }, () => divisionSize)

		// How much time is added in the computation.
		const difference = divisionCount * divisionSize - this.duration

		// Remove extra time
		for (var x = difference; x > 0; x--) {
			durations[divisionCount - x]--
		}

		// Sramble the rhythm
		// Move 1 around
		if (divisionCount > 1) {
			for (let x = Math.random() * noise; x-- > 0; ) {
				const a = Math.floor(Math.random() * divisionCount)
				const b = Math.floor(Math.random() * divisionCount)

				// Don't move if there's no time left, or if it's not doing anything.
				if (a == b || durations[a] <= 1) {
					x++
				} else {
					durations[a]--
					durations[b]++
				}
			}
		}

		return durations
	}

	/* binaryGenerator: Create a rhytm progression by dividing in two a number of
	 * time the initial duration.
	 * returns: An array of durations.
	 */
	binaryGenerator() {
		// Array to split
		const durations = [this.duration]

		// How many time do we want to divide? At least two, but not too much, and
		// depending on the current duration.
		const divisions = 2 + Math.floor(Math.random() * (this.duration / 4))

		for (let x = divisions; x-- > 0; ) {
			const randomIndex = Math.floor(Math.random() * durations.length)

			const divisibleValue = durations[randomIndex]

			// Do not try to divide below a sixteenth note
			if (divisibleValue <= 1) {
				x++
				continue
			}

			// Update the current value and add the other half right after. It's
			// effectively splitting the current time in half.
			durations[randomIndex] = Math.floor(divisibleValue / 2)
			durations.splice(randomIndex, 0, Math.ceil(divisibleValue / 2))
		}

		return durations
	}
}

export { RhythmBox, stringToRatio, ratioToString }
