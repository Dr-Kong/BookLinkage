// pages/upload/upload.js
const app = getApp(),
	  db = wx.cloud.database().collection('uploads'),
	  util= require('../../utils/util.js'),
	  pub_list = util.pub_list,
	  sbj_list = util.sbj_list,
	  _sbj_list = util._sbj_list

Page({

	/**
	 * Page initial data
	 */
	data: {
		openID: app.globalData.openID,
		_sbj_list: _sbj_list,
		pub_list: pub_list,
		last_name: '',
		wx_id: '',
		tel: '',
		sbj: 0,
		pub: 0,
		bk_name: '',
		is_legal: false,
		p: 0,
		add_info: '',
		temp_paths: []
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
	onShow() {},

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

	set_last_name(e) {
		this.setData({
			last_name: e.detail.value
		})
	},

	set_wx_id(e) {
		this.setData({
			wx_id: e.detail.value
		})
	},

	set_tel(e) {
		this.setData({
			tel: e.detail.value
		})
	},

	set_bk_info(e) {
		const val = e.detail.value
		this.setData({
			sbj: val[0],
			pub: val[1]
		})
	},

	set_bk_name(e){
		this.setData({
			bk_name: e.detail.value
		})
	},

	set_is_legal(e){
		if(e.detail.value == '是')
			this.setData({
				is_legal: true
			})
	},

	set_p(e) {
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
				this.setData({temp_paths: res.tempFilePaths})
			}
		  })
	},

	upload() {
		const that = this,
			  s = that.data.sbj,
			  p = that.data.pub,
			  bn = that.data.bk_name,
			  il = that.data.is_legal,
			  ai = that.data.add_info
			  tp = that.data.temp_paths
		var tags = [], len = tags.length
		tags.push(sbj_list[s])
		tags.push(_sbj_list[s])
		tags.push(bn)
		tags.push(ai)
		if (pub != 0) {
			tags.push(pub_list[p])
		}
		if (il) {
			tags.push('正版')
			tags.push('原版')
			tags.push('原装')
		} else {
			tags.push('盗版')
			tags.push('复印')
			tags.push('影印版')
		}
		// traverse tags
		for (let i = 0; i < len; i++) {
			var temp_tags = str.split(' ')
			//remove duplicate or multiple-word tag
			if (i + 1 <len && tags.indexOf(tags[i]) != -1
			 || temp_tags.length > 1) {
				tags.splice(i, 1)
				//in case of skipping element
				i--
				// add splited words
				if(temp_tags.length > 1) {
					tags.concat(temp_tags)
				}
			}
		}
		for (let i = 0; i < that.data.temp_paths.length; i++) {
			wx.cloud.uploadFile({
				cloudPath: format_time(new Date()) + '.jpg',
				filePath: tp[i], // File path
				success(res) {
					/* get resource ID using the reference 'tp',
					rather than the property 'temp_paths' */
					tp[i] = res.fileID
				}/* ,
				fail(err) {
				// handle error
				} */
			})
		}
		db.add({
			data: {
				tags: tags,
				last_name: that.data.last_name,
				wx_id: that.data.wx_id,
				telephone: that.data.tel,
				book_name: that.data.bk_name,
				price: p,
				add_info: ai,
				file_id: tp,
				is_sold_out: false
			},
			success(res) {wx.showToast({title: '上传成功'})}
		})
	}
})