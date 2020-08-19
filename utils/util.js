const app = getApp()

function formatTime(date) {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') +
		' ' +
		[hour, minute, second].map(formatNumber).join(':')

}

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

function setOpenID(res) {
	return wx.cloud.callFunction({
		name: 'getOpenID',
		data: {
			e: wx.cloud.CloudID(res.cloudID)
		}
	}).then(r => {
		app.globalData.openID = r.result.openid
		return Promise.resolve()
	})
}

function setUserInfo(res) {
	app.globalData.userInfo = res.userInfo
}

const pubList = ['', 'barron', 'cambridge', 'hease', 'hodder', 'mcgraw', 'oxford', 'xdf'],
	_pubList = ['', '巴郎', '剑桥', '', '', '麦格劳', '牛津', '新东方'],
	sbjList = ['biology', 'chemistry', 'chinese', 'computerscience',
		'economics', 'english', 'geograph', 'mathematics',
		'others', 'physics', 'psychology', 'tok'
	],
	_sbjList = ['生物', '化学', '中文', '计算机', '经济', '英语',
		'地理', '数学', '其他', '物理', '心理', '知识论'
	]

module.exports = {
	pubList: pubList,
	_pubList: _pubList,
	sbjList: sbjList,
	_sbjList: _sbjList,
	setOpenID: setOpenID,
	setUserInfo: setUserInfo,
	formatTime: formatTime
}