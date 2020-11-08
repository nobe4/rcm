/* global Vue Synth Chord */

var synth = new Synth()

const app = Vue.createApp({
  data () {
    return {
      rootLocked: false,
      answerShown: false,
      exercises: [
        'Play the chords'
      ],
      currentExercise: 0,
      chords: [],
      chordsCount: 3
    }
  },
  methods: {
    reloadChords () {
      this.chords = []
      for (let i = this.chordsCount; i > 0; i--) {
        this.chords.push(Chord.random())
      }
    },
    playChord (chord) {
      chord.notes.forEach((note, i) => {
        setTimeout(() => {
          synth.play1second(note.frequency())
        }, 0)
      })
    },
    showAnswer () {
      this.answerShown = true
    },
    toggleExercise () {}
  },
  created () {
    this.reloadChords()
  }
}
)

app.component('toggle-answer', {
  props: ['answer'],
  template: `
    <template v-if="$parent.answerShown"> {{ answer }} </template>
    <button v-else @click="$parent.answerShown = true">show</button>
  `
})

app.mount('#guitar-exercises')
