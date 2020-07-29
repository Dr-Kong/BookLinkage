// pages/upload/upload.js
const db = wx.cloud.database(),
	  util= require('../../utils/util.js'),
	  book_list = util.book_list,
	  sbj_list = util.sbj_list,
	  _sbj_list = util._sbj_list

Page({

	/**
	 * Page initial data
	 */
	data: {
		_sbj_list: _sbj_list,
		pub_list: ['barron', 'gardner'],
		edt_list: [3, 4],
		sbj: 0,
		pub: 0,
		edt: 0,
		p: 0,
		add_info: ''
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

	get_pub_list(i) {
		book_list[sbj_list[i]].forEach(pub => {
			pub_list.push(pub)
		})
		return pub_list
	},

	get_edt_list(j) {
		book_list[sbj_list[this.data.sbj]][j].forEach(edt => {
			edt_list.push(edt)
		})
		return edt_list
	},

	set_info(e) {
		const val = e.detail.value,
			  s =  this.data.sbj
		this.setData({sbj: val[0]})
		if (s != 9) {
			this.get_pub_list(s)
			this.setData({pub: val[1]})
			this.get_edt_list(val[1])
			this.setData({edt: val[2]})
		}
	},

	set_price(e) {
		this.setData({
			p: e.detail.value
		})
	},

	set_add_info(e) {
		this.setData({
			add_info: e.detail.value
		})
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