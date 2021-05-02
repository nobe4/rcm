<template>
	<div id="rcm">
		<h1>Random Chord Machine</h1>
		<div id="chords">
			<chord
				v-for="(chord, i) in looper.chords"
				:value="chord"
				:detailed="showNotes"
				class="chord"
				:class="{ active: i == currentChord }"
				:key="chord"
			/>
		</div>
		<div class="controls">
			<div class="line">
				<button id="playPause" @click="looper.playPause()">
					{{ looper.playing ? 'Pause' : 'Play' }}
				</button>
				<button id="metronome" @click="looper.tick = !looper.tick">Metro</button>
				<button id="reload" @click="reload()">Reload</button>
			</div>
			<div class="line">
				<button id="notes" @click="this.showNotes = !this.showNotes">Notes</button>
				<button id="random" @click="currentRythmMethods++">
					{{ rhythm }}
				</button>
				<button id="modulation" @click="currentModulationName++">
					{{ modulation }}
				</button>
			</div>
			<div class="line">
				<input v-model="looper.tempo" type="number" min="30" max="300" step="1" />
				<input v-model="loopDuration" type="number" min="16" max="128" step="1" />
				<input v-model="looper.volume" type="number" min="0" max="40" step="1" />
			</div>
		</div>
		<help
			:volume="looper.volume"
			:tempo="looper.tempo"
			:duration="loopDuration"
			:rhythm="rhythm"
			:modulation="modulation"
		/>
	</div>
</template>

<style lang="stylus">
		font-size = 3em

		#chords
			padding 0
			text-align center

			.chord
				vertical-align top
				list-style-type none
				display inline-block
				margin 1em 2em
				text-align center

				&.active
					border-bottom 3px solid black

				> *
					font-size font-size
					&.rhythm
						font-size (font-size / 2)

				.name
					text-transform uppercase

				.modulation
					text-transform lowercase

				.rhythm
					display block

	.controls
		display: flex
		flex-flow: column
		align-items: center
		justify-content: center

		.line
			display: flex
			flex-flow: row wrap
			align-items: center
			justify-content: center
			text-align: center

	button, input
		box-sizing: border-box
		text-align: center
		width: 7em
		font-size: (font-size / 2)
		margin: 0.5em
		background: white
		padding: 0.3em
		border: black 2px solid
		text-transform: capitalize

		&.on, &:active
			background: black
			color: white
</style>

<script>
	import { Synth, Tick } from '@/lib/synth.js'
	import Looper from '@/lib/looper.js'
	import { randomChords } from '@/lib/chord.js'
	import { RhythmBox } from '@/lib/time.js'
	import Help from '@/components/Help.vue'
	import Chord from '@/components/Chord.vue'

	export default {
		name: 'Rcm',

		components: { Help, Chord },

		data: function () {
			let data = {
				// Global variables to use the interface.
				synth: new Synth(),
				tick: new Tick(),

				loopDuration: 32,
				showNotes: false,
				currentChord: 0,

				// Lists and default values.
				modulationListNames: ['root', 'simple', 'augmtd', '7 smpl', 'full'],
				currentModulationName: 1,
				rhythmMethods: ['equal', 'random', 'binary'],
				currentRythmMethods: 0,
			}
			data.looper = new Looper(data.synth, data.tick, [], 120, 32, (c) => {
				this.currentChord = c
			})

			return data
		},

		computed: {
			rhythm() {
				const r = this.rhythmMethods[this.currentRythmMethods % this.rhythmMethods.length]
				return r[0].toUpperCase() + r.slice(1)
			},
			modulation() {
				const m = this.modulationListNames[
					this.currentModulationName % this.modulationListNames.length
				]
				return m[0].toUpperCase() + m.slice(1)
			},
		},

		created() {
			this.reload()
		},

		methods: {
			reload() {
				const r = new RhythmBox(
					this.loopDuration,
					this.rhythmMethods[this.currentRythmMethods % this.rhythmMethods.length]
				)

				this.looper.chords = randomChords(
					r.durations,
					this.modulationListNames[
						this.currentModulationName % this.modulationListNames.length
					]
				)

				this.looper.currentChord = 0
			},
		},
	}
</script>
