// miniprogram/pages/reregister/index.js
const app = getApp()
var checkvalues = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxItems: [{
        name: 'Anne',
        value: '0'
      },
      {
        name: 'Ed',
        value: '1'
      }
    ],
    userItems: [],
    id: 0,
    date: 0,
  },

  checkboxChange: function(e) {
    checkvalues = e.detail.value
    var checkboxItems = this.data.checkboxItems,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems,
      userItems: checkvalues,
    });
  },

  onCommit: function() {
    let that = this
    wx.request({
      url: app.globalData.server_url + 'recheck',
      data: {
        OPENID: wx.getStorageSync('openid'),
        GROUPID: that.data.id,
        STIDENTOPENID: that.data.userItems,
        DATE: that.data.date
      },
      success(res) {
      }
    })
    wx.navigateBack({
      delta: 2
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let data = JSON.parse(options.data)
    let id = options.id
    let date = options.date
    var temp_items = []
    for (let curdata of data) {
      temp_items.push({
        name: curdata._name,
        value: curdata._openid
      })
    }
    this.setData({
      checkboxItems: temp_items,
      id: id,
      date: date,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  scroll: function() {

  },
  lower: function() {

  },
  upper: function() {

  }
})