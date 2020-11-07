/* global Vue Synth Scale */

var synth = new Synth()

const app = Vue.createApp({
  data () {
    return {
      scale: Scale.random(),
      scaleList: Scale.allNames,
      rootLocked: false,
      answerShown: false,
      exercises: [
        'Name the scale',
        'Sing the scale',
        'Name and sing the scale'
      ],
      currentExercise: 0,
      findScale: true,
      selectedScales: []
    }
  },
  computed: {
    selectedScalesValue: {
      get () {
        // Add each found selected scales index in a single binary number.
        const value = this.selectedScales
          .sort((a, b) => a < b)
          .reduce((a, b) => a + (1 << b), 0)
        return value.toString(24)
      },
      set (value) {
        this.selectedScales = []

        if (!value) return

        // Convert to a binary string
        const selection = parseInt(value, 24)
          .toString(2)
          .split('')
          .reverse()

        for (var i in selection) {
          if (selection[i] === '1') {
            this.selectedScales.push(i)
          }
        }
      }
    }
  },
  methods: {
    reload () {
      this.scale = Scale.random(
        this.rootLocked ? this.scale.notes[0].name : null,
        this.selectedScales
      )
      this.answerShown = false
    },
    unselect () {
      this.selectedScales = []
    },
    play (index) {
      if (!index && index !== 0) {
        this.scale.notes.forEach((note, i) => {
          setTimeout(() => {
            synth.play1second(note.frequency())
          }, i * 700)
        })
      } else {
        synth.play1second(this.scale.notes[index].frequency())
      }
    },
    showAnswer () {
      this.answerShown = true
    },
    toggleExercise () {
      this.findNote = !this.findNote
      this.reload()
    }
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

app.mount('#scale-exercises')
