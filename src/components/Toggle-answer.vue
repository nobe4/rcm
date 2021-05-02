<template>
	<div>
		<template v-if="this.$parent.answerShown">
			<slot></slot>
		</template>
		<button v-else @click="this.$parent.answerShown = true">show</button>
	</div>
</template>

<script>
	export default {
		name: 'toggle-answer',
	}
</script>
