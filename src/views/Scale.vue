<template>
	<div class="exercise">
		<h1>Scale Exercises</h1>

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

		<table>
			<tr>
				<th>Scale</th>
				<th>Root</th>
				<td><button @click="reload()">reload</button></td>
			</tr>

			<template v-if="currentExercise == 0">
				<tr>
					<td id="scale">
						<toggle-answer>
							{{ scale.name.toString() }}
						</toggle-answer>
					</td>
					<td id="root">
						{{ scale.notes[0].toString() }}
						<span @click="rootLocked = !rootLocked">
							<template v-if="rootLocked"> &#x1f512; </template>
							<template v-else> &#x1f513; </template>
						</span>
					</td>
					<td><button @click="play(0)">play</button></td>
				</tr>

				<tr>
					<th>Notes</th>
					<td id="scale">{{ scale.notes.join(' ') }}</td>
					<td><button @click="play()">play</button></td>
				</tr>
			</template>

			<template v-if="currentExercise == 1">
				<tr>
					<td id="scale">
						{{ scale.name.toString() }}
					</td>
					<td id="root">
						{{ scale.notes[0].toString() }}
						<span @click="rootLocked = !rootLocked">
							<template v-if="rootLocked"> &#x1f512; </template>
							<template v-else> &#x1f513; </template>
						</span>
					</td>
					<td><button @click="play(0)">play</button></td>
				</tr>

				<tr>
					<th>Notes</th>
					<td id="scale">
						<toggle-answer>
							{{ scale.notes.join(' ') }}
						</toggle-answer>
					</td>
					<td><button @click="play()">play</button></td>
				</tr>
			</template>

			<template v-if="currentExercise == 2">
				<tr>
					<td id="scale">
						<toggle-answer>
							{{ scale.name.toString() }}
						</toggle-answer>
					</td>
					<td id="root">
						{{ scale.notes[0].toString() }}
						<span @click="rootLocked = !rootLocked">
							<template v-if="rootLocked"> &#x1f512; </template>
							<template v-else> &#x1f513; </template>
						</span>
					</td>
					<td><button @click="play(0)">play</button></td>
				</tr>

				<tr>
					<th>Notes</th>
					<td>
						<toggle-answer>
							{{ scale.notes.join(' ') }}
						</toggle-answer>
					</td>
					<td><button @click="play()">play</button></td>
				</tr>
			</template>
		</table>

		<item-selector name="scale" :items="scaleList" v-model="selectedScales" />
	</div>
</template>

<script>
	import ToggleAnswer from '@/components/Toggle-answer.vue'
	import ItemSelector from '@/components/Item-selector.vue'

	import { Scale } from '@/lib/theory.js'
	import { Synth } from '@/lib/synth.js'

	export default {
		name: 'Scale',
		components: {
			ToggleAnswer,
			ItemSelector,
		},
		data: function () {
			return {
				synth: new Synth(),
				scale: Scale.random(),
				scaleList: Scale.allNames,
				rootLocked: false,
				answerShown: false,
				exercises: ['Name the scale', 'Sing the scale', 'Name and sing the scale'],
				currentExercise: 0,
				findScale: true,
				selectedScales: [],
			}
		},
		methods: {
			reload() {
				this.scale = Scale.random(
					this.rootLocked ? this.scale.notes[0].name : null,
					this.selectedScales
				)
				this.answerShown = false
			},
			play(index) {
				if (!index && index !== 0) {
					this.scale.notes.forEach((note, i) => {
						setTimeout(() => {
							this.synth.play1second(note.frequency())
						}, i * 700)
					})
				} else {
					this.synth.play1second(this.scale.notes[index].frequency())
				}
			},
		},
		watch: {
			currentExercise() {
				this.reload()
			},
		},
	}
</script>
