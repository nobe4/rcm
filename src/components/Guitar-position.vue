<template>
	<div class="guitar-position" v-if="chord">
		<table>
			<tr
				v-for="(_, p) in 5"
				:key="p"
				:data-p="p"
				:data-nut="p === 0 && chord.position === 0 ? true : undefined"
			>
				<td
					v-for="(_, s) in 6"
					:key="s"
					:data-open="
						p === 0 && chord.position === 0 && chord.strings[s].position === 0
							? true
							: undefined
					"
					:data-muted="p === 0 && chord.strings[s].muted ? true : undefined"
					:data-on="chord.strings[s].position === p ? true : undefined"
					:data-bar="
						chord.position >= 0 && chord.strings[s].position === p
							? chord.strings[s].bar
							: undefined
					"
					:data-position="p === 0 && s === 0 ? chord.position : undefined"
				>
					<span v-if="p == 4 && s == 0" @click="current++">next</span>
				</td>
			</tr>
		</table>
	</div>
</template>

<style lang="stylus" scoped>
	base-size = 0.5em

	floating-after()
		content ''
		background black
		width ceil(base-size * 1.5, 4)
		height ceil(base-size * 1.5, 4)
		border-radius base-size * 10
		position absolute
		top ceil(base-size / 4.5, 4)
		left ceil(base-size * 1.25, 4)

	.guitar-position
		table
			text-align left
			border-collapse collapse
			margin 8 * base-size auto 1em
			padding 0

			tr
				padding 0
				margin 0

				&[data-nut=true]
					&, td
						height 0

					:not(:first-child)
						 border-top ceil(base-size/2, 4) solid black

				td
					position relative
					padding 0
					margin 0
					width 2 * base-size
					height 2 * base-size

					span
						font-size 0.4em
						cursor pointer

					&:not(:first-child)
						border 1px solid black

					&[data-on]
						&:after
							floating-after()

						for num in (2..6)
							&[data-bar=\"{num}\"]
								&:after
									width num * ceil(base-size * 1.9, 4)

					&[data-open]:after
						floating-after()
						top (- base-size * 2)
						background white
						border 1px solid black

					&[data-muted]:after
						floating-after()
						content 'X'
						top (- base-size * 2)
						background white
						text-align center

					&[data-position]
						position relative

						&:before
							content attr(data-position)
							position absolute
							top 0
							right base-size *2
</style>

<script>
	export default {
		name: 'guitar-position',
		props: ['chords'],
		data: function () {
			return { current: 0 }
		},
		computed: {
			chord() {
				return this.chords[this.current % this.chords.length]
			},
		},
	}
</script>
