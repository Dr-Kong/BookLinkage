// components/list/list.js by Dr.Kong
Component({
	/**
	 * Component properties
	 */
	properties: {
		is_expanded: Boolean,
		to_show: String
	},

	/**
	 * Component initial data
	 */
	data: {
		
	},

	/**
	 * Component methods
	 */
	methods: {
		expand() {
			this.setData({
				is_expanded: !this.data.is_expanded
			})
		}
	}
})
