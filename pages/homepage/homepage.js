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
		sbj: 8,
		pub: 0,
		bl: [],
		keywords: '',
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
		wx.showLoading({
			title: '加载中……',
			mask: true
		})
		if (app.globalData.userInfo == null) {
			wx.getSetting().then(r => {
				if (r.authSetting['scope.userInfo']) {
					return wx.getUserInfo()
				} else {
					this.search()
					return Promise.reject()
				}
			}).then(res => {
				util.setUserInfo(res)
				return util.setOpenID(res)
			}).then(() => {
				this.setData({
					a: getApp()
				})
				this.search()
			})
		} else {
			if (this.data.a.globalData.userInfo == null) {
				this.setData({
					a: getApp()
				})
			}
			this.search()
		}
	},

	onPullDownRefresh() {
		wx.stopPullDownRefresh().then(() => {
			this.onShow()
		})
	},

	setUserInfo(e) {
		const res = e.detail
		if (res.userInfo == null) {
			return
		}
		wx.showLoading({
			title: '登录中……',
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
		const str = e.detail.value
		this.setData({
			keywords: str
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
		this.setData({
			tags: tempTags.length == 0 ? [''] : tempTags
		})
		this.search()
	},

	searchByTags(e) {
		const val = e.detail.value
		var temp = []
		if (val[0] != 8) {
			temp.push(sbjList[val[0]])
		}
		if (val[1] != 0) {
			temp.push(pubList[val[1]])
		}
		this.setData({
			sbj: val[0],
			pub: val[1],
			tags: temp
		})
		this.search()
	},

	search() {
		const kw = this.data.tags,
			openID = app.globalData.openID
		var temp = [],
			i = kw.length - 2
		wx.showLoading({
			title: '获取书本信息中……',
		})
		wx.cloud.callFunction({
			name: 'get',
			data: {
				collection: 'uploads',
				case: 2,
				openID: openID,
				keyWord: kw[i + 1]
			}
		}).then(res => {
			temp = res.result.data
			while (i > -1 && temp.length > 0) {
				const cur = kw[i].toLocaleLowerCase()
				for (let j = 0; j < temp.length; j++) {
					var isMatch = false
					Array.from(temp[j].tags, tag => {
						if (tag.toLocaleLowerCase().includes(cur)) {
							isMatch = true
						}
					})
					if (!isMatch) {
						temp.splice(j, 1)
					}
				}
				i--
			}
			this.setData({
				bl: temp
			})
			wx.hideLoading()
		})
	},

	hideKeyboard() {
		wx.hideKeyboard()
	},

	cancelSearch() {
		this.setData({
			sbj: 8,
			pub: 0,
			keywords: '',
			tags: ['']
		})
		this.search()
	}
})