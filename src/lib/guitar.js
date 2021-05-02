const GuitarShapes = {
	'': ['0:0', '7:;0'],
	5: ['0:0;2', '7:;0;2'],
	major: ['0:0b6;2;2;1', '7:;0b5;2;2;2'],
	minor: ['0:0b6;2;2', '7:;0b5;2;2;1'],
	augmented: ['0:0b6;3;2;1', '7:;0b5;3;2;2'],
	diminished: ['0:0b6;1;2', '7:;0b5;1;2;1'],
	'major 7': ['0:0b6;2;;1', '7:;0b5;2;;2'],
	'dominant 7': ['0:0b6;2;1;1', '0:;0b5;2;;2'],
	'minor 7': ['0:0b6;2', '0:;0b5;2;;1'],
	'minor major 7': ['0:0b6;2;1', '0:;0b5;2;1;1'],
	'half diminished 7': ['0:0b6;1', '7:;0b5;1'],
	'diminished 7': ['0:1;2;0;1', '7:;1;2;0;2'],
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
