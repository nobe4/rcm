<template>
	<details>
		<summary>
			Change {{ name }}
			<input type="text" v-model="selectedItemsValue" />
		</summary>
		<div id="input-selection">
			<span @click="selectedItems = []">all</span>
			<span v-for="(item, index) in items" :key="index">
				<input type="checkbox" :id="index" :value="index" v-model="selectedItems" />
				<label :for="index">{{ item }}</label>
			</span>
		</div>
	</details>
</template>

<style lang="stylus" scoped>

	details
		summary
			font-size 1.5em
		#input-selection
			display flex
			justify-content space-between
			flex-wrap wrap
			font-size 2em

			span
				user-select none
				margin 0 0.5em 1em 0.5em

				&,
				label
					cursor pointer
					&:hover
							text-decoration underline

				input
					display none
					&:checked ~ label
						color white
						background-color black
</style>

<script>
	export default {
		name: 'item-selector',
		props: ['name', 'items', 'modelValue'],
		emits: ['update:modelValue'],
		data: function () {
			return {
				selectedItems: [],
			}
		},
		computed: {
			selectedItemsValue: {
				get() {
					// Add each found selected items index in a single binary number.
					const value = this.selectedItems
						.slice(0) // make a copy
						.sort((a, b) => a < b)
						.reduce((a, b) => a + (1 << b), 0)
					return value.toString(24)
				},
				set(value) {
					this.selectedItems = []

					if (!value) return

					// Convert to a binary string
					const selection = parseInt(value, 24).toString(2).split('').reverse()

					for (var i in selection) {
						if (selection[i] === '1') {
							this.selectedItems.push(i)
						}
					}
				},
			},
		},
		watch: {
			selectedItems(n, o) {
				if (n !== o) this.$emit('update:modelValue', n)
			},
		},
	}
</script>
