var interval = null
var synth = new Synth()

function reload () {
  interval = Interval.random()

  document.getElementById('root').innerText = interval.notes[0]
  document.getElementById('interval').innerText = interval.name()
  document.getElementById('target').innerText = ''
}

function playRoot () {
  synth.play1second(interval.notes[0].frequency())
}

function showTarget () {
  document.getElementById('target').innerText = interval.notes[1]
}

function playInterval () {
  synth.play1second(interval.notes[1].frequency())
}

reload()
