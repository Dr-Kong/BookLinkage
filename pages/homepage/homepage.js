//index.js
const db = wx.cloud.database({
		throwOnNotFound: false
	}),
	_ = db.command,
	util = require('../../utils/util.js'),
	pubList = util.pubList,
	sbjList = util.sbjList,
	app = getApp()

Page({
	data: {
		a: app,
		_sbjList: util._sbjList,
		sbjList: sbjList,
		pubList: pubList,
		sbj: 11,
		pub: 0,
		bl: null,
		keywords: '',
		isFocus: null,
		tags: ['']
	},
	// switch to mine
	bindViewTap() {
		wx.switchTab({
			url: '../mine/mine',
		})
	},

	onLoad() {},

	onShow() {
		const that = this
		new Promise(resolve => {
			if (app.globalData.userInfo == null) {
				wx.getSetting().then(r => {
					return new Promise(res => {
						if (r.authSetting['scope.userInfo']) {
							// authorized
							wx.getUserInfo({
								success: res
							})
						} else {
							res()
						}
					})
				}).then(result => {
					return new Promise(res => {
						if (result != null) {
							util.setOpenID(result).then(() => {
								util.setUserInfo(result)
								res()
							})
						} else {
							res()
						}
					})
				}).then(() => {
					that.setData({
						a: getApp()
					})
					resolve()
				})
			} else {
				resolve()
			}
		}).then(() => {
			if (that.data.a.globalData.userInfo == null) {
				// Authorized on another page, yet this page was loaded
				that.setData({
					a: getApp()
				})
			}
			that.search()
		})
	},

	onReachBottom() {
		wx.showToast({
			title: this.data.isFocus == null ?
				'请使用输入关键词或滚动选择进行查询' : '已展示所有符合条件的书本',
			icon: 'none'
		})
	},

	onPullDownRefresh() {
		this.onShow()
	},

	setUserInfo(e) {
		const res = e.detail
		wx.showLoading({
			title: '登录中',
			mask: true
		})
		util.setOpenID(res).then(() => {
			util.setUserInfo(res)
			this.setData({
				a: getApp()
			})
			this.search()
			wx.hideLoading()
		})
	},

	searchByKeywords(e) {
		const str = e.detail.value,
			that = this
		that.setData({
			keywords: str,
			isFocus: true
		})
		var tempTags = str.split(' ')
		for (var i = 0; i < tempTags.length; i++) {
			if (i + 1 < tempTags.length &&
				tempTags.indexOf(tempTags[i], i + 1) != -1 ||
				tempTags[i] == '' ||
				tempTags[i] == ' ') {
				// remove unqualified tag
				tempTags.splice(i, 1)
				// in case of skipping element
				i--
			}
		}
		that.setData({
			tags: tempTags
		})
		that.search()
	},

	searchByTags(e) {
		const val = e.detail.value
		this.setData({
			sbj: val[0],
			pub: val[1],
			isFocus: false,
			tags: [_sbjList[val[0]], pubList[val[1]]]
		})
		this.search()
	},

	search() {
		const that = this,
			kw = that.data.tags,
			openID = app.globalData.openID
		var temp = [],
			i = kw.length - 2
		db.collection('uploads').where({
			isSoldOut: false,
			_openid: _.neq(openID == null ? '' : openID),
			// fuzzy search
			tags: _.elemMatch({
				$regex: '.*' + kw[i + 1],
				$options: 'i'
			})
		}).get({
			success(res) {
				temp = res.data
				while (i > 0 && temp.length > 0) {
					const cur = kw[i]
					for (let j = 0; j < temp.length; j++) {
						if (temp[j].tags.indexOf(cur) == -1) {
							temp.splice(j, 1)
						}
					}
					i--
				}
				that.setData({
					bl: temp
				})
				if (temp.length == 0) {
					wx.showToast({
						title: '暂时没有您想要的书本',
						icon: 'none'
					})
				}
			}
		})
	},

	hideKeyboard() {
		wx.hideKeyboard()
	},

	cancelSearch() {
		const that = this
		db.collection('uploads').where({
			isSoldOut: false,
			_openid: _.neq(app.globalData.openID)
		}).get({
			success(res) {
				that.setData({
					sbj: 11,
					pub: 0,
					bl: res.data,
					keywords: '',
					isFocus: null,
					tags: ['']
				})
			}
		})
	}
})