// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	const bn = event.bkName
	var temp = '', len = 0
	for (let i = 0; i < bn.length && len < 11; i++) {
		const c = bn.charAt(i)
		if (c.match(/[^\x00-\xff]/ig) != null) 
		{
			len += 2
		}
		else
		{
			len ++
		}
	}
	if (len == 11) {
		var ei = bn.length
		ei = ei - (bn[ei - 1].match(/[^\x00-\xff]/ig) != null ? 2 : 1)
		temp = bn.substring(0, ei) + '…'
	} else {
		temp = bn
	}
	cloud.openapi.subscribeMessage.send({
		touser: event.touser,
		templateId: 'aDLCHqpsEJOAYixkD5JoR5YiugaVFqWDzKj0GPfR2cI',
		data: {
			character_string1: {
				value: event.time
			},
			thing2: {
				value: temp
			}
		}
	})
}