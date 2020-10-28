/* global Vue Synth Interval */

var synth = new Synth()

Vue.createApp({
  data () {
    return {
      interval: Interval.random(),
      intervalList: Interval.names,
      showInterval: false,
      selectedIntervals: []
    }
  },
  computed: {
    selectedIntervalsValue: {
      get () {
        // Add each found selected intervals index in a single binary number.
        const value = this.selectedIntervals
	  .reduce((a, b) => a + 1 << b, 0)
        return value.toString(20)
      },
      set (value) {
        this.selectedIntervals = []

        if (!value) return

        // Convert to a binary string
        const selection = parseInt(value, 20)
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
      this.interval = Interval.random(null, this.selectedIntervals)
      this.showInterval = false
    },
    unselect () {
      this.selectedIntervals = []
    },
    play (index) {
      synth.play1second(this.interval.notes[index].frequency())
    },
    showTarget () {
      this.showInterval = true
    }
  }
}
).mount('#interval-exercises')
