/* global Vue Synth Scale */

var synth = new Synth()

Vue.createApp({
  data () {
    return {
      scale: Scale.random(),
      scaleList: Scale.allNames,
      answerShown: false,
      findScale: true,
      selectedScales: []
    }
  },
  computed: {
    selectedScalesValue: {
      get () {
        // Add each found selected scales index in a single binary number.
        console.log(this.selectedScales)
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
      this.scale = Scale.random(null, this.selectedScales)
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
          }, i * 1000)
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
).mount('#scale-exercises')
