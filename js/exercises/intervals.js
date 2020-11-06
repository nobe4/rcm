/* global Vue Synth Interval */

var synth = new Synth()

Vue.createApp({
  data () {
    return {
      interval: Interval.random(),
      intervalList: Interval.names,
      answerShown: false,
      rootLocked: false,
      currentExercise: 0,
      exercises: [
        'Sing and name the note',
        'Sing and name the interval',
        'Sing and name the note and interval'
      ],
      selectedIntervals: []
    }
  },
  computed: {
    selectedIntervalsValue: {
      get () {
        // Add each found selected intervals index in a single binary number.
        console.log(this.selectedIntervals)
        const value = this.selectedIntervals
          .sort((a, b) => a < b)
          .reduce((a, b) => a + (1 << b), 0)
        return value.toString(24)
      },
      set (value) {
        this.selectedIntervals = []

        if (!value) return

        // Convert to a binary string
        const selection = parseInt(value, 24)
          .toString(2)
          .split('')
          .reverse()

        for (var i in selection) {
          if (selection[i] === '1') {
            this.selectedIntervals.push(i)
          }
        }
      }
    }
  },
  methods: {
    reload () {
      this.interval = Interval.random(
        this.rootLocked ? this.interval.notes[0] : null,
        this.selectedIntervals
      )
      this.answerShown = false
    },
    unselect () {
      this.selectedIntervals = []
    },
    play (index) {
      synth.play1second(this.interval.notes[index].frequency())
    },
    showAnswer () {
      this.answerShown = true
    }
  }
}
).mount('#interval-exercises')
