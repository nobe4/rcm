// List of all the notes
const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']

// List of all main intervals with their names.
class Interval {
  static names = ['unison', 'minor 2nd', 'major 2nd', 'minor 3rd', 'major 3rd', 'perfect 4th', 'tritone', 'perfect 5th', 'minor 6th', 'major 6th', 'minor 7th', 'major 7th', 'octave']

  constructor (root, data) {
    // Treat the root
    if (!root) return

    if (notes.indexOf(root) === -1) {
      throw new Error('invalid note name: ' + root)
    }
    this.notes = [root]

    // Treat the data
    if (!data) return

    if (notes.indexOf(data) >= 0) {
      // Data is a the second note, compute the interval.
      this.notes.push(data)
      let diff = notes.indexOf(data) - notes.indexOf(root)
      if (diff < 0) diff += 12
      this.interval = diff
    } else if (Interval.names.indexOf(data) >= 0) {
      // Data is the interval name, compute the new note.
      this.interval = Interval.names.indexOf(data)
      this.notes.push(notes[(notes.indexOf(root) + this.interval) % 12])
    } else {
      // Data is the number of steps from the root.
      this.interval = Number(data)
      if (!this.interval) throw new Error(`invalid data: '${data}'`)

      this.notes.push(notes[(notes.indexOf(root) + this.interval) % 12])
    }
  }

  static random (root) {
    if (!root) root = notes[Math.random() * notes.length << 0]

    const interval = Math.random() * Interval.names.length << 0

    return new Interval(root, interval)
  }

  toString () {
    return `${this.notes[0]} ${this.notes[1]}: ${Interval.names[this.interval]}`
  }
}

// List of all main chords with their interval and tones from the root.
class Chord {
  static names = {
    '': { // only the root note
      tones: [], intervals: []
    },
    major: { tones: [4, 7], intervals: [4, 3] },
    minor: { tones: [3, 7], intervals: [3, 4] },
    diminished: { tones: [3, 6], intervals: [3, 3] },
    augmented: { tones: [4, 8], intervals: [4, 4] },
    '5th': { tones: [7], intervals: [7] },
    'dominant 7th': { tones: [4, 7, 10], intervals: [4, 3, 3] },
    'major 7': { tones: [4, 7, 11], intervals: [4, 3, 4] },
    'minor 7': { tones: [3, 7, 10], intervals: [4, 3, 3] },
    'minor major 7': { tones: [3, 7, 11], intervals: [4, 4, 3] },
    'diminished 7': { tones: [3, 6, 9], intervals: [3, 3, 3] },
    'half diminished 7': { tones: [3, 6, 10], intervals: [3, 3, 4] },
    'augmented 7': { tones: [4, 8, 11], intervals: [4, 4, 4] }
  }

  constructor (root, ...data) {
    // Treat the root
    if (!root) return

    if (notes.indexOf(root) === -1) {
      throw new Error(`invalid note name: ${root}`)
    }
    this.notes = [root]
    this.name = '' // default name

    // Treat the data
    if (!data) return

    if (data.length === 1) {
      // Data is the chord name, compute the notes
      const chord = Chord.names[data[0]]
      if (chord) {
        this.name = data
        const rootIndex = notes.indexOf(root)
        for (let i = 0, j = chord.tones.length; i < j; i++) {
          this.notes.push(notes[(rootIndex + chord.tones[i]) % 12])
        }
      } else {
        throw new Error(`invalid arguments: ${data}`)
      }
    } else {
      // Data is the list of notes names, TODO
      throw new Error('doesn\'t handle multiple arguments yet')
    }
  }

  static random (root) {
    if (!root) root = notes[Math.random() * notes.length << 0]

    const names = Object.keys(Chord.names)
    const name = names[Math.random() * names.length << 0]

    return new Chord(root, name)
  }

  toString () {
    return `${this.notes[0]} ${this.name}: ${this.notes.join(' ')}`
  }
}

// List of all main scales with their interval and tones from the root.
class Scale {
          static names = {
            major: { tones: [2, 4, 5, 7, 9, 11], intervals: [2, 2, 1, 2, 2, 2, 1] },
            'harmonic minor': { tones: [2, 3, 5, 7, 8, 10], intervals: [2, 1, 2, 2, 1, 2, 2] },
            pentatonic: { tones: [2, 4, 7, 9], intervals: [2, 2, 3, 2, 2, 3] }
          }

          constructor (root, ...data) {
            // Treat the root
            if (!root) return

            if (notes.indexOf(root) === -1) {
              throw new Error(`invalid note name: ${root}`)
            }
            this.notes = [root]
            this.name = 'major' // default name

            // Treat the data
            if (!data) return

            if (data.length === 1) {
              // Data is the scale name, compute the notes
              const scale = Scale.names[data[0]]
              if (scale) {
                this.name = data
                const rootIndex = notes.indexOf(root)
                for (let i = 0, j = scale.tones.length; i < j; i++) {
                  this.notes.push(notes[(rootIndex + scale.tones[i]) % 12])
                }
              } else {
                throw new Error(`invalid arguments: ${data}`)
              }
            } else {
              // Data is the list of notes names, TODO
              throw new Error('doesn\'t handle multiple arguments yet')
            }
          }

          static random (root) {
            if (!root) root = notes[Math.random() * notes.length << 0]

            const names = Object.keys(Scale.names)
            const name = names[Math.random() * names.length << 0]

            return new Scale(root, name)
          }

          toString () {
            return `${this.notes[0]} ${this.name}: ${this.notes.join(' ')}`
          }
}
