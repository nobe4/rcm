<template>
	<div class="exercise">
		<h1>Interval Exercises</h1>

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

		<table v-if="currentExercise == 0">
			<tr>
				<th>Interval</th>
				<th>Note</th>
				<td><button @click="reload()">reload</button></td>
			</tr>

			<tr>
				<td></td>
				<td id="root">
					{{ interval.notes[0].toString() }}
					<span class="lockRoot" @click="rootLocked = !rootLocked">
						{{ rootLocked ? '&#x1f512;' : '&#x1f513;' }}
					</span>
				</td>
				<td><button @click="play(0)">play</button></td>
			</tr>

			<tr>
				<td>{{ interval.name() }}</td>
				<td>
					<toggle-answer>{{ interval.notes[1].toString() }}</toggle-answer>
				</td>
				<td><button @click="play(1)">play</button></td>
			</tr>
		</table>

		<table v-if="currentExercise == 1">
			<tr>
				<th>Interval</th>
				<th>Note</th>
				<td><button @click="reload()">reload</button></td>
			</tr>

			<tr>
				<td></td>
				<td id="root">
					{{ interval.notes[0].toString() }}
					<span class="lockRoot" @click="rootLocked = !rootLocked">
						{{ rootLocked ? '&#x1f512;' : '&#x1f513;' }}
					</span>
				</td>
				<td><button @click="play(0)">play</button></td>
			</tr>

			<tr>
				<td>
					<toggle-answer> {{ interval.name() }} </toggle-answer>
				</td>
				<td>{{ interval.notes[1].toString() }}</td>
				<td><button @click="play(1)">play</button></td>
			</tr>
		</table>

		<table v-if="currentExercise == 2">
			<tr>
				<th>Interval</th>
				<th>Note</th>
				<td><button @click="reload()">reload</button></td>
			</tr>

			<tr>
				<td></td>
				<td id="root">
					{{ interval.notes[0].toString() }}
					<span class="lockRoot" @click="rootLocked = !rootLocked">
						{{ rootLocked ? '&#x1f512;' : '&#x1f513;' }}
					</span>
				</td>
				<td><button @click="play(0)">play</button></td>
			</tr>

			<tr>
				<td>
					<toggle-answer> {{ interval.name() }} </toggle-answer>
				</td>
				<td>
					<toggle-answer>{{ interval.notes[1].toString() }}</toggle-answer>
				</td>
				<td><button @click="play(1)">play</button></td>
			</tr>
		</table>

		<item-selector name="interval" :items="intervalList" v-model="selectedIntervals" />
	</div>
</template>

<style lang="stylus">
	@import '~@/styles/exercises'
</style>

<script>
	import ToggleAnswer from '@/components/Toggle-answer.vue'
	import ItemSelector from '@/components/Item-selector.vue'

	import { Interval } from '@/lib/theory.js'
	import { Synth } from '@/lib/synth.js'

	export default {
		name: 'Interval',
		components: {
			ToggleAnswer,
			ItemSelector,
		},
		data: function () {
			return {
				synth: new Synth(),
				interval: Interval.random(),
				intervalList: Interval.names,
				answerShown: false,
				rootLocked: false,
				currentExercise: 0,
				selectedIntervals: [],
				exercises: [
					'Sing and name the note',
					'Sing and name the interval',
					'Sing and name the note and interval',
				],
			}
		},
		methods: {
			reload() {
				this.interval = Interval.random(
					this.rootLocked ? this.interval.notes[0].name : null,
					this.selectedIntervals
				)
				this.answerShown = false
			},
			play(index) {
				this.synth.play1second(this.interval.notes[index].frequency())
			},
		},
		watch: {
			currentExercise() {
				this.reload()
			},
		},
	}
</script>
