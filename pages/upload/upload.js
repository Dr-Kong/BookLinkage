// pages/upload/upload.js
const db = wx.cloud.database()
const util = require('../../utils/util.js')
const book_list = util.book_list

Page({

	/**
	 * Page initial data
	 */
	data: {
		/* sbj: '',
		name: '' */
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad: function (options) {

	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady: function () {

	},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow: function () {

	},

	/**
	 * Lifecycle function--Called when page hide
	 */
	onHide: function () {

	},

	/**
	 * Lifecycle function--Called when page unload
	 */
	onUnload: function () {

	},

	/**
	 * Page event handler function--Called when user drop down
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * Called when page reach bottom
	 */
	onReachBottom: function () {

	},

	/**
	 * Called when user click on the top right corner to share
	 */
	onShareAppMessage: function () {

	},

	choose_img() {
		wx.chooseImage({
			sizeType: ['original'],
			sourceType: ['album', 'camera'],
			success (res) {
				// tempFilePath can be used as the src property of the img tag to display images.
				const temp_paths = res.tempFilePaths
			}
		  })
	},

	/* upload(sbj, name, ) {
		var that = this
		that.choose_img()
		for (let i = 0; index < temp_paths.length; i++) {
			wx.cloud.uploadFile({
				cloudPath: 'book_img/' + '_' + sbj + '_' + name + '_' + id + '_' + i + '.jpg',
				filePath: temp_paths[i], // File path
				success: res => {
				// get resource ID
				},
				fail: err => {
				// handle error
				}
			})
		}
		wx.showToast({
			title: '上传成功',
		})
	} */
})