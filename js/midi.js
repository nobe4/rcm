/* mtf (midi to frequency): Compute the number-based hertz frequency for the
 * note. So we can pass this value directly later.
 * The name is formed of the root note and its height.
 * The reference tunning is A4 = 440Hz.
 * params:
 *     midi: The midi integer
 * returns: The note frequency
 */
function mtf (midi) {
  // Using http://www.glassarmonica.com/science/frequency_midi.php
  // f = 27.5 * 2 ^ ((midi - 21)/12)
  // Midi notes are from 21 (A0, 27.5Hz) to 108 (C8, 4186Hz)
  return 27.5 * Math.pow(2, ((midi - 21.0) / 12.0))
}

/* mtnn (midi to note name): Compute the note at a defined distance from the root.
 * params:
 *     midi: The midi note to get the name from.
 * returns: An array containing: the note letter, the possible modulation, the note height
 */
function mtnn (midi) {
  // -1 is a silence
  if (midi == -1) return ['s', '', '']

  // List all possible note to simplify the computation to a single modulo.
  const note = ['a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#'][(midi - 21) % 12]

  // Use the same method but move the change to the note between b and c
  const height = Math.floor((midi - 12) / 12)

  return [note[0], note[1] || '', height]
}
