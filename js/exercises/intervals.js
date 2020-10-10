var interval = null
var synth = new Synth()

function test () {
  interval = Interval.random()

  document.getElementById('root').innerText = interval.notes[0]
  document.getElementById('interval').innerText = interval.name()
}

function playRoot () {
  synth.play1second(interval.notes[0].frequency())
}

function playInterval () {
  synth.play1second(interval.notes[1].frequency())
}

test()
