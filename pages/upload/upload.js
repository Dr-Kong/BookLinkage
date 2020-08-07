// pages/upload/upload.js
const app = getApp(),
	  db = wx.cloud.database({
		throwOnNotFound: false
	  }),
	  util= require('../../utils/util.js'),
	  pub_list = util.pub_list,
	  _pub_list = util._pub_list,
	  sbj_list = util.sbj_list,
	  _sbj_list = util._sbj_list

Page({

	/**
	 * Page initial data
	 */
	data: {
		type: 0,
		_id: null,
		_sbj_list: _sbj_list,
		pub_list: pub_list,
		_pub_list: _pub_list,
		last_name: '',
		wx_id: '',
		tel: '',
		sbj: 11,
		pub: 0,
		bk_name: '',
		is_legal: null,
		p: '',
		add_info: '',
		temp_paths: [],
		tags: [],
		hasUserInfo: false
	},
	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad(options) {
		const that = this
		if (options.type == 1) {
			db.collection('uploads').doc(options.bkID).get({
				success(res) {
					const r = res.data[0]
					that.setData({
						type: options.type,
						_id: options.bkID,
						last_name: r.lastName,
						wx_id: r.wxID,
						tel: r.telephone,
						bk_name: r.bkName,
						is_legal: r.isLegal,
						p: r.price,
						add_info: r.additionalInfo,
						temp_paths: r.fileID,
						tags: r.tags
					})
				}
			})
		} else {
			db.collection('uploads').where({
				_openid: app.globalData.openID
			}).get({
				success(res){
					const r = res.data[res.data.length - 1]
					that.setData({
						last_name: r.lastName,
						wx_id: r.wxID,
						tel: r.telephone
					})
				}
			})
		}
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
			last_name: e.detail.value,
			hasUserInfo: true
		})
	},

	set_wx_id(e) {
		this.setData({
			wx_id: e.detail.value,
			hasUserInfo: true
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
		if (e.detail.value == '是') {
			this.setData({
				is_legal: true
			})
		} else if (e.detail.value == '否') {
			this.setData({
				is_legal: false
			})
		}
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
		const that = this,
			tp = that.data.temp_paths
		wx.chooseImage({
			sizeType: ['original'],
			sourceType: ['album', 'camera'],
			success (res) {
				// tempFilePath can be used as the src property of the img tag to display images.
				that.setData({
					temp_paths: tp.concat(res.tempFilePaths)
				})
			}
		  })
	},

	removeImg(e) {
		const i = e.currentTarget.dataset.i,
			tp = this.data.temp_paths
		this.setData({
			temp_paths: tp.splice(i, 1)
		})
	},

	upload() {
		const that = this,
			  t = that.data.type
			  s = that.data.sbj,
			  p = that.data.pub,
			  bn = that.data.bk_name,
			  il = that.data.is_legal,
			  ai = that.data.add_infos,
			  id = that.data.wx_id,
			  tel = that.data.tel,
			  tags = that.data.tags
		var fi = [], tp = that.data.temp_path
		// disable the buttom in case of repeated upload
		that.setData({hasUserInfo: false})
		// humanistic optimize
		wx.showLoading({
			title: t == 0 ? '上传中' : '更新信息中'
		})
		if (s != 11) {
			tags.push(sbj_list[s])
			tags.push(_sbj_list[s])
		}
		if (p != 0) {
			tags.push(pub_list[p])
			tags.push(_pub_list[p])
		}
		tags.push(bn)
		tags.push(ai)
		if (il == true) {
			tags.push('正版')
			tags.push('原版')
			tags.push('原装')
		} else if (il == false) {
			tags.push('盗版')
			tags.push('复印')
			tags.push('影印版')
		}
		for (var i = 0; i < tags.length; i++) {
			var temp_tags = tags[i].split(' ')
			if (i + 1 < tags.length
				&& tags.indexOf(tags[i], i + 1) != -1
				|| tags.indexOf(tags[i]) != i
				|| tags[i] == ''
				|| tags[i] == ' '
				|| temp_tags.length > 1) {
				// remove unqualified tag
				tags.splice(i, 1)
				// in case of skipping element
				i--
				// add splited words
				if (temp_tags.length > 1) {
					tags = tags.concat(temp_tags)
				}
			}
		}
		// upload img and record its cloudpath
		for (let i = 0; i < tp.length; i++) {
			// remove cloud img
			if (tp[i].substr(0, 8) == 'cloud://') {
				tp.splice(i, 1)
				i--
				continue
			}
			const cur = tp[i]
			var cp = Date.parse(new Date()) / 10 + i + '.jpg'
			tp[i] = 'cloud://booklinkage-ryfw4.626f-booklinkage-ryfw4-1302677239/' + cp
			wx.cloud.uploadFile({
				cloudPath: cp,
				filePath: cur
			})
		}
		if (type == 0) {
			db.collection('uploads').doc(that.data._id).set({
				data: {
					tags: tags,
					lastName: that.data.last_name,
					wxID: id,
					telephone: tel,
					bkName: bn,
					isLegal: il,
					price: that.data.p,
					additionalInfo: ai,
					fileID: tp,
					isSoldOut: false
				},
				success(res) {
					wx.hideLoading()
					wx.showToast({
						title: t == 0 ? '上传成功' : '更新成功',
						mask: true,
						success(res) {
							wx.navigateBack()
						}
					})
				},
				fail(err) {
					// enable the buttom
					that.setData({hasUserInfo: true})
					wx.hideLoading()
					wx.showToast({
						title: '失败',
						icon: 'none'
					})
				}
			})
		} else {}
	}
})