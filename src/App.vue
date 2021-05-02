<template>
	<div id="nav">
		<router-link v-for="route in routes" :key="route.path" :to="route.path">
			{{ route.name }}
		</router-link>
	</div>
	<router-view />
</template>

<style lang="stylus">
	body
		box-sizing border-box
		font-family roboto, sans-serif
		text-align center
		padding 0.5em
		margin 0
		font-weight 100

		#nav
			text-align left

			a
				margin-right 1em

		h1
			font-size 3em
			font-weight 100
			text-transform uppercase

		#menu
			font-size: 3em
			list-style-type: none
			a
				color: black
</style>

<script>
	export default {
		name: 'Navigation',
		data() {
			return {
				routes: this.$router.options.routes,
			}
		},
	}
</script>
