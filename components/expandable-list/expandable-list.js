// components/list/list.js by Dr.Kong
Component({
	/**
	 * Component properties
	 */
	properties: {
		on: {
			type: Boolean,
			value: false
		},
		title: String,
		src: String,
		disabled: {
			type: Boolean,
			value: false
		}
	},

	/**
	 * Component initial data
	 */
	data: {

	},

	/* External Classes */
	externalClasses: ['title-class', 'contents-class'],

	/**
	 * Component methods
	 */
	methods: {
		expand() {
			if (!this.properties.disabled) {
				this.setData({
					on: !this.properties.on
				})
			}
		}
	}
})