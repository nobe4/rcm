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
