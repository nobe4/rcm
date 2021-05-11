/*
 * How to write a guitar shape (here in 2nd position).                 -> Emin
 * 1. Find the leftmost note on the guitar neck and mark its position. -> 7
 * 2. String by string, add where the fingers are relative to this position
 *   a. Nothing is on string 1, skipping.                              ->
 *   b. E is on 2nd string, 0th fret. We bar the 5 strings.            -> 0b5
 *   c. B is on 3rd string, 2nd fret.                                  -> 2
 *   d. E is on 4th string, 2nd fret.                                  -> 2
 *   e. G is on 5th string, 1st fret.                                  -> 1
 * 3. Join with `:` and `;`                                            -> 7:;0b5;2;2;1
 *
 * All the chords are assumed to be modulations of E, the transposition will be done later.
 */
const GuitarShapes = {
	'': ['0:0', '7:;0', '2:;;0', '9:;;;0', '5:;;;;0', '0:;;;;;0'],
	5: ['0:0;2', '7:;0;2', '2:;;0;2', '9:;;;0;3', '5:;;;;0;2'],
	major: [
		'0:0b6;2;2;1',
		'7:;0b5;2;2;2',
		'7:;;2b3;',
		'10:3;2;0',
		'4:;3;2;0',
		'0:;;2;1;0',
		'7:;;;2;2;0',
		'2:;;0;2;3;2',
		'2:;;;2;3;2',
	],
	minor: [
		'0:0b6;2;2',
		'7:;0b5;2;2;1',
		'7:;;2;2;1',
		'10:3;1;0',
		'4:;3;1;0',
		'0:;;2;0;0',
		'0:;;;0;0;0',
		'7:;;;2;1;0',
		'2:;;0;2;3;1',
		'2:;;;2;3;1',
	],
	augmented: ['0:0b6;3;2;1', '7:;0b5;3;2;2'],
	diminished: ['0:0b6;1;2', '7:;0b5;1;2;1'],
	7: ['0:0b6;2;;1', '7:;0b5;2;;2'],
	'major 7': ['0:0b6;2;1;1', '7:;0b5;2;1;2'],
	'minor 7': ['0:0b6;2', '7:;0b5;2;;1'],
	'minor major 7': ['0:0b6;2;1', '7:;0b5;2;1;1'],
	'half diminished 7': ['0:0b6;1', '7:;0b5;1'],
	'diminished 7': ['11:1;2;0;1', '6:;1;2;0;2'],
	'augmented 7': ['0:0b6;3;2;1', '7:;0b5;3;2;3'],
}

function shapeToObject(s) {
	let o = { position: -1, strings: [{}, {}, {}, {}, {}, {}] }

	s = s.split(':')
	const position = s[0]
	let tail = s[1]

	o.position = parseInt(position)

	tail.split(';').forEach((s, i) => {
		switch (s) {
			case '':
				return
			case 'm':
				o.strings[i] = { muted: true }
				return
			case 'o':
				o.strings[i] = { open: true }
				return
		}

		o.strings[i] = {
			position: parseInt(s[0]),
		}

		// Handle bars
		if (s.indexOf('b') === 1) {
			o.strings[i].bar = parseInt(s[2])
		}
	})

	return o
}

export { GuitarShapes, shapeToObject }
