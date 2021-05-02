<template>
	<div>
		<span class="rhythm">
			<i
				v-for="duration in value.durationString.split('')"
				:class="duration"
				:key="duration"
			></i>
		</span>

		<span class="note">
			{{ root }}
		</span>
		<span class="modulation"> {{ value.modulation }} </span>

		<ul class="notes" v-if="detailed">
			<li v-for="note in notes" :key="note">{{ note.join('') }}</li>
		</ul>
	</div>
</template>

<style lang="stylus">
	/*
	Simple css recreation of the musical symbols. Only used for rhythm, those
	definitions will recreate the whole, half, ..., sixteenth note symbols.
	The notes can be any elements, preferably empty (like a <i></i> for instance)
	and must use one of the following class:
	 - w for whole note
	 - h for half note
	 - q for quarter note
	 - e for eighth note
	 - s for sixteenth note

	Those note need to be placed in a 'rhythm' element.
	To change the size of the notes, modify the w variable below.
	*/

	w = 1em

	// More defined sizes
	h = w * 3
	noteheadHeight = h / 4
	stemWidth = w / 8
	flagHeigth = h / 8

	// Some colors, changing the background will mess up the display, don't do
	// that.
	foreground = black
	background = transparent

	.name
		text-transform: uppercase

	.modulation
		text-transform: lowercase

	.rhythm
		// Basic definition for the element, since it can be applied to any type of
		// box, let's make things neat.
		display: block

		& > *
			position relative
			display inline-block
			width w
			height h

			// For the flags
			margin-right (w / 3)

			// For the notehead
			margin-bottom noteheadHeight

			// The notehead is made with a before element, fix everything her so we can
			// focus on the styling later.
			&::before
				content ""
				box-sizing border-box
				background-color white
				width w
				height noteheadHeight
				position absolute
				bottom -(h / 7)
				left (w / 8)
				border-radius 50%

				// The basic border definition, will change for the different note
				// values.
				border (w / 12) solid foreground

		// Whole note is an oval with left/right border. No stem.
		.w::before
			border-left-width (w / 3)
			border-right-width (w / 3)

		// All other notes have a stem and the notehead is slightly tilted.
		.h, .q, .e, .s
			border-right stemWidth solid foreground
			&::before
				transform rotatez(-15deg)

		// A half note has a top/down border
		.h
			&::before
				border-top-width (w / 4.5)
				border-bottom-width (w / 4.5)

		// All the remaining values have a filled notehead.
		.q, .e, .s
			&::before
				background-color foreground

		// For eigth and sixteenth notes, we need the flags, these are done using a
		// linear gradient on the after element.
		.e, .s
			&::after
				content ''
				position absolute
				top 0px
				width w
				right -1*w
				height h
				// 1 Flag
				background-image linear-gradient(180deg, foreground 0, foreground flagHeigth, background 0, background flagHeigth)

		.s::after
			// 2 Flags
			background-image linear-gradient(180deg, foreground 0, foreground flagHeigth, background 0, background flagHeigth, background flagHeigth * 2, foreground flagHeigth * 2, foreground flagHeigth * 3, background flagHeigth * 2, background flagHeigth * 3)

	.notes
		list-style: none
		font-size: 0.5em
		padding: 0.5em 0
</style>

<script>
	import { modulationToNoteNames } from '@/lib/chord.js'
	import { Note } from '@/lib/theory.js'

	export default {
		name: 'chord',
		props: ['value', 'detailed'],
		computed: {
			root() {
				if (this.value.root > 0) {
					return Note.fromMidi(this.value.root).toString()
				} else {
					return 'S'
				}
			},
			notes() {
				return modulationToNoteNames(this.value.root, this.value.modulation)
			},
		},
	}
</script>
