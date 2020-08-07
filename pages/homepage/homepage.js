//index.js
const db = wx.cloud.database(),
  util = require('../../utils/util.js'),
  pub_list = util.pub_list,
  sbj_list = util.sbj_list,
  app = getApp()
var bkList = null

Page({
  data: {
    a: app,
    _sbj_list: util._sbj_list,
    sbj_list: sbj_list,
    pub_list: pub_list,
    sbj: 11,
    pub: 0,
    bl: bkList,
    keywords: '',
    isFocus: null,
    tags: null
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
      that.setData({
        a: getApp()
      })
    }
  },

  onShow() {
    const isf = this.data.isFocus
    if (isf == null) {
      db.collection('uploads').where({
        isSoldOut: false
      }).get({
        success(res) {
          bkList = res.data
        }
      })
    } else {
      // in case that some books are sold out
      this.search(tags)
    }
  },

  onReachBottom() {
    wx.showToast({
      title: this.data.isFocus == null ?
        '请使用输入关键词或滚动选择进行查询' : '已展示所有符合条件的书本',
      icon: 'none'
    })
  },

  onPullDownRefresh() {
    this.onLoad()
  },

  setUserInfo(e) {
    const res = e.detail
    util.setUserInfo(res)
    util.setOpenID(res)
    this.setData({
      app: getApp()
    })
  },

  searchByKeywords(e) {
    const str = e.detail.value,
      that = this
    that.setData({
      keywords: str,
      isFocus: true
    })
    var temp_tags = str.split(' ')
    for (var i = 0; i < temp_tags.length; i++) {
      if (i + 1 < temp_tags.length &&
        temp_tags.indexOf(temp_tags[i], i + 1) != -1 ||
        temp_tags[i] == '' ||
        temp_tags[i] == ' ') {
        // remove unqualified tag
        temp_tags.splice(i, 1)
        // in case of skipping element
        i--
      }
    }
    that.setData({
      tags: temp_tags
    })
    that.search(temp_tags)
  },

  searchByTags(e) {
    const val = e.detail.value
    this.setData({
      sbj: val[0],
      pub: val[1],
      isFocus: false,
      tags: [_sbj_list[val[0]], pub_list[val[1]]]
    })
    this.search(this.data.tags)
  },

  search(arr) {
    var kw = arr,
      temp = [],
      that = this
    db.collection('uploads').where({
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
      },
      fail(err) {
        that.setData({
          bl: []
        })
        wx.showToast({
          title: '暂时没有您想要的书本',
          icon: 'none'
        })
      }
    })
  },

  hideKeyboard() {
    wx.hideKeyboard()
  },

  cancelSearch() {
    this.setData({
      sbj: 11,
      pub: 0,
      bl: bkList,
      keywords: '',
      isFocus: null,
      tags = null
    })
  }
})