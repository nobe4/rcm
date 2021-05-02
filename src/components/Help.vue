<template>
	<div id="help">
		<div @click="visible = !visible">Help</div>
		<div id="help" v-if="visible">
			<p>
				Hey, welcome to RCM. <br />
				As you can already see, it's generating music for you. <br />
				The notation is based on the
				<a href="https://en.wikipedia.org/wiki/Chord_(music)#Tabular_notation"
					>tabular notation</a
				>
				with the added <b>S</b> for silence. A chord with no modulation (maj, min,&nbsp;...)
				is describing the root note alone.<br />
				The symbols are showing the rythm used for each chord, if you want to see the
				chord's composition, hit <b>notes</b>. <br />
				<br />
				You can play along with the different parameters:
			</p>
			<dl>
				<dt>Play</dt>
				<dd>Self explanatory.</dd>
				<dt>Metro</dt>
				<dd>Add a tick every quarter notes.</dd>
				<dt>Reload</dt>
				<dd>Reload the chords.</dd>
				<dt>Notes</dt>
				<dd>Display the notes forming the chord.</dd>
				<dt id="help-rhythm">{{ rhythm }}</dt>
				<dd>Change the rythm generation method.</dd>
				<dt id="help-modulation">{{ modulation }}</dt>
				<dd>The list of available modulations.</dd>
				<dt id="help-tempo">{{ tempo }}</dt>
				<dd>The tempo against the quarter note.</dd>
				<dt id="help-duration">{{ duration }}</dt>
				<dd>The number of 16th notes you want.</dd>
				<dt id="help-volume">{{ volume }}</dt>
				<dd>The volume.</dd>
			</dl>
		</div>
	</div>
</template>

<style lang="stylus" scoped>
	#help
		max-width 50em
		margin 1em auto
		text-transform none
		text-align left

		> div:nth-child(1)
			cursor pointer

		a
			color black

		dl
			display grid
			grid-template-columns max-content auto

		dt
			grid-column-start 1
			font-weight bold
			padding-right 0.5em
			text-transform capitalize

		dd
			grid-column-start 2
			margin 0
</style>

<script>
	export default {
		name: 'help',
		props: ['volume', 'tempo', 'duration', 'modulation', 'rhythm'],
		data: function () {
			return {
				visible: false,
			}
		},
	}
</script>
