// miniprogram/pages/group-owner/details_single.js
const app = getApp()
const buttons = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    check_data: {},
    unchecked_exist: false,
    checked_exist: false,
    url: '',
    types: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'],
    typeIndex: 3,
    colors: ['light', 'stable', 'positive', 'calm', 'balanced', 'energized', 'assertive', 'royal', 'dark'],
    colorIndex: 4,
    dirs: ['horizontal', 'vertical', 'circle'],
    dirIndex: 0,
    sAngle: 0,
    eAngle: 360,
    spaceBetween: 10,
    buttons,
    button_icon: app.globalData.icon_pen
  },
  onChange: function() {
    wx.navigateTo({
      url: this.data.url,
    })
  },
  checkTap: function() {
    wx.navigateTo({
      url: '/pages/reregister/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let data = JSON.parse(options.data)
    let unchecked_exist = false
    let checked_exist = false
    if (data._user_unchecked.length === 0) {
      unchecked_exist = true
    }
    if (data._user_checked.length === 0) {
      checked_exist = true
    }
    this.setData({
      check_data: data,
      unchecked_exist: unchecked_exist,
      checked_exist: checked_exist,
      url: '/pages/reregister/index?data=' + JSON.stringify(data._user_unchecked) + '&id=' + options.id + '&date=' + data._date
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
  upper: function() {

  },
  lower: function() {

  },
})