// components/tabs/tabs.js
Component({
	/**
	 * Component properties
	 */
	properties: {
		titles: Array,
		value: {
			value: 0,
			type: Number
		}
	},

	/**
	 * Component initial data
	 */
	data: {},

	/**
	 * Component methods
	 */
	methods: {
		bindtap(e) {
			const i = e.currentTarget.dataset.index
			this.triggerEvent('change', {
				index: i
			})
		}
	}
})