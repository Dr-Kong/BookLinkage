// pages/upload/upload.js
const app = getApp(),
	db = wx.cloud.database({
		throwOnNotFound: false
	}),
	_ = db.command,
	util = require('../../utils/util.js'),
	pubList = util.pubList,
	_pubList = util._pubList,
	sbjList = util.sbjList,
	_sbjList = util._sbjList

Page({

	/**
	 * Page initial data
	 */
	data: {
		type: 0,
		_id: null,
		_sbjList: _sbjList,
		pubList: pubList,
		_pubList: _pubList,
		lastName: '',
		wxID: '',
		tel: '',
		sbj: 11,
		pub: 0,
		bkName: '',
		isLegal: null,
		p: '',
		addInfo: '',
		tempPaths: null,
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
						lastName: r.lastName,
						wxID: r.wxID,
						tel: r.telephone,
						bkName: r.bkName,
						isLegal: r.isLegal,
						p: r.price,
						addInfo: r.additionalInfo,
						tempPaths: r.fileID
					})
				}
			})
		} else {
			db.collection('uploads').where({
				_openid: app.globalData.openID
			}).get({
				success(res) {
					const r = res.data[res.data.length - 1]
					that.setData({
						lastName: r.lastName,
						wxID: r.wxID,
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

	setLastName(e) {
		this.setData({
			lastName: e.detail.value
		})
	},

	setWxID(e) {
		this.setData({
			wxID: e.detail.value,
			hasUserInfo: true
		})
	},

	setTel(e) {
		this.setData({
			tel: e.detail.value,
			hasUserInfo: true
		})
	},

	setBkInfo(e) {
		const val = e.detail.value
		this.setData({
			sbj: val[0],
			pub: val[1]
		})
	},

	setBkName(e) {
		this.setData({
			bkName: e.detail.value
		})
	},

	setIsLegal(e) {
		if (e.detail.value == '是') {
			this.setData({
				isLegal: true
			})
		} else if (e.detail.value == '否') {
			this.setData({
				isLegal: false
			})
		}
	},

	setP(e) {
		this.setData({
			p: e.detail.value
		})
	},

	setAddInfo(e) {
		this.setData({
			addInfo: e.detail.value
		})
	},

	chooseImg() {
		const that = this
		var tp = that.data.tempPaths
		tp = (tp == null) ? [] : tp
		wx.chooseImage({
			sizeType: ['original'],
			sourceType: ['album', 'camera'],
			success(res) {
				// tempFilePath can be used as the src property of the img tag to display images.
				that.setData({
					tempPaths: tp.concat(res.tempFilePaths)
				})
			}
		})
	},

	removeImg(e) {
		const i = e.currentTarget.dataset.i,
			tp = this.data.tempPaths
		this.setData({
			tempPaths: tp.splice(i, 1)
		})
	},

	upload() {
		const that = this,
			t = that.data.type,
			s = that.data.sbj,
			p = that.data.pub,
			bn = that.data.bkName,
			il = that.data.isLegal,
			ai = that.data.addInfo,
			id = that.data.wxID,
			tel = that.data.tel
		var tp = that.data.tempPaths,
			tags = []
		// disable the buttom in case of repeated upload
		that.setData({
			hasUserInfo: false
		})
		// humanistic optimize
		wx.showLoading({
			title: t == 0 ? '上传中' : '更新信息中'
		})
		if (t == 0) {
			if (s != 11) {
				tags.push(sbjList[s])
				tags.push(_sbjList[s])
			}
			if (p != 0) {
				tags.push(pubList[p])
				tags.push(_pubList[p])
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
				var tempTags = tags[i].split(' ')
				if (i + 1 < tags.length &&
					tags.indexOf(tags[i], i + 1) != -1 ||
					tags.indexOf(tags[i]) != i ||
					tags[i] == '' ||
					tags[i] == ' ' ||
					tempTags.length > 1) {
					// remove unqualified tag
					tags.splice(i, 1)
					// in case of skipping element
					i--
					// add splited words
					if (tempTags.length > 1) {
						tags = tags.concat(tempTags)
					}
				}
			}
		}
		// upload img and record its cloudpath
		for (let i = 0; i < tp.length; i++) {
			// remove cloud img url
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
		that.setData({
			tempPaths: tp
		})
		// add or update record
		if (t == 1) {
			db.collection('uploads').doc(that.data._id).update({
				data: {
					lastName: that.data.lastName,
					wxID: id,
					telephone: tel,
					bkName: bn,
					price: that.data.p,
					additionalInfo: ai,
					fileID: _.push({
						each: tp
					})
				},
				success(res) {
					wx.hideLoading()
					wx.showToast({
						title: '更新成功',
						mask: true,
						success(res) {
							wx.navigateBack()
						}
					})
				},
				fail(err) {
					// enable the buttom
					that.setData({
						hasUserInfo: true
					})
					wx.hideLoading()
					wx.showToast({
						title: '失败',
						icon: 'none'
					})
				}
			})
		} else {
			db.collection('uploads').add({
				data: {
					lastName: that.data.lastName,
					wxID: id,
					telephone: tel,
					bkName: bn,
					price: that.data.p,
					additionalInfo: ai,
					fileID: tp,
					isSoldOut: false,
					tags: tags,
					isLegal: il
				},
				success(res) {
					wx.hideLoading()
					wx.showToast({
						title: '上传成功',
						mask: true,
						success(res) {
							wx.navigateBack()
						}
					})
				},
				fail(err) {
					// enable the buttom
					that.setData({
						hasUserInfo: true
					})
					wx.hideLoading()
					wx.showToast({
						title: '失败',
						icon: 'none'
					})
				}
			})
		}
	}
})