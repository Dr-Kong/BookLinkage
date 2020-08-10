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

  onLoad() {
    const that = this
    if (app.globalData.userInfo == null) {
      wx.getSetting({
        success(r) {
          if (r.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success(res) {
                util.setUserInfo(res)
                util.setOpenID(res)
                that.setData({
                  a: getApp()
                })
              }
            })
          }
        }
      })
    } else if (that.data.a.globalData.userInfo == null) {
      // Authorized on another page
      that.setData({
        a: getApp()
      })
    }
  },

  onShow() {
    this.search()
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
    util.setUserInfo(res)
    util.setOpenID(res)
    this.setData({
      a: getApp()
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
    var temp = [],
      that = this,
      kw = that.data.tags
    db.collection('uploads').where({
      isSoldOut: false,
      _openid: _.neq(app.globalData.openID),
      // fuzzy search
      tags: _.elemMatch({
        $regex: '.*' + kw.pop(),
        $options: 'i'
      })
    }).get({
      success(res) {
        temp = res.data
        while (kw.length > 0 && temp.length > 0) {
          const cur = kw.pop()
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].tags.indexOf(cur) == -1) {
              temp.splice(i, 1)
            }
          }
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