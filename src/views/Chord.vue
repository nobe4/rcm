<template>
	<div class="exercise">
		<template :key="c" v-for="c in chords">
			<div>{{ c.toString() }}</div>
			<guitar-position :chords="c.toGuitarPosition()" />
			<hr />
		</template>

		<h1>Chord Exercises</h1>

		<div class="exercise-selection">
			<details>
				<summary>{{ exercises[currentExercise] }}</summary>
				<ul>
					<li
						v-for="(exercise, index) in exercises"
						@click="currentExercise = index"
						:key="index"
					>
						{{ exercise }}
					</li>
				</ul>
			</details>
		</div>

		<table v-if="currentExercise === 0">
			<tr>
				<th>Chord</th>
				<th>Notes</th>
				<td><button @click="reload()">reload</button></td>
			</tr>

			<tr>
				<td>
					{{ chord.notes[0].toString() }}
					<span class="lockRoot" @click="rootLocked = !rootLocked">
						{{ rootLocked ? '&#x1f512;' : '&#x1f513;' }}
					</span>
				</td>
				<td>{{ chord.name }}</td>
				<td><button @click="play(false)">play</button></td>
			</tr>

			<tr>
				<td colspan="2">
					<toggle-answer>
						<div>
							{{ chord.notes.join('  ').toString() }}
						</div>
						<guitar-position :chords="chord.toGuitarPosition()" />
					</toggle-answer>
				</td>
				<td><button @click="play(true)">play</button></td>
			</tr>
		</table>

		<table v-if="currentExercise === 1">
			<tr>
				<th>Chord</th>
				<th>Notes</th>
				<td><button @click="reload()">reload</button></td>
			</tr>

			<tr>
				<td>
					{{ chord.notes[0].toString() }}
					<span class="lockRoot" @click="rootLocked = !rootLocked">
						{{ rootLocked ? '&#x1f512;' : '&#x1f513;' }}
					</span>
				</td>
				<td>
					<toggle-answer>
						{{ chord.name }}
					</toggle-answer>
				</td>
				<td><button @click="play(false)">play</button></td>
			</tr>

			<tr>
				<td colspan="2">
					<div>
						{{ chord.notes.join('  ').toString() }}
					</div>
					<toggle-answer>
						<guitar-position :chords="chord.toGuitarPosition()" />
					</toggle-answer>
				</td>
				<td><button @click="play(true)">play</button></td>
			</tr>
		</table>
	</div>
</template>

<style lang="stylus" scoped>
	@import '~@/styles/exercises'
	.guitar-position
		font-size 0.3em
</style>

<script>
	import ToggleAnswer from '@/components/Toggle-answer.vue'
	import GuitarPosition from '@/components/Guitar-position.vue'

	import { Synth } from '@/lib/synth.js'
	import { Chord } from '@/lib/theory.js'

	export default {
		name: 'Chord',
		components: {
			ToggleAnswer,
			GuitarPosition,
		},
		data: function () {
			return {
				synth: new Synth(),
				rootLocked: false,
				answerShown: false,
				exercises: ['Play the chord', 'Name the chord'],
				currentExercise: 0,
				chord: Chord.random(),
				chords: Chord.allMod(),
			}
		},
		methods: {
			reload() {
				this.chord = Chord.random(this.rootLocked ? this.chord.notes[0].name : null)
				this.answerShown = false
			},
			play(separate) {
				this.chord.notes.forEach((note, i) => {
					setTimeout(
						() => {
							this.synth.play1second(note.frequency())
						},
						separate ? 700 * i : 0
					)
				})
			},
		},
		watch: {
			currentExercise() {
				this.reload()
			},
		},
	}
</script>
