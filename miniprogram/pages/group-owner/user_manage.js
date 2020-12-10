// miniprogram/pages/group-owner/user_manage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    user_data: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let data = JSON.parse(options.data)
    let id = JSON.parse(options.id)
    this.setData({
      user_data: data,
      id: id,
    })
  },

  removeUser: function(e) {
    let that = this
    var openid = e.currentTarget.dataset.id
    wx.request({
      url: app.globalData.server_url + 'group_user_exit',
      data: {
        OPENID: openid,
        GROUPID: that.data.id
      },
      success(res) {
        wx.navigateBack({
          delta: 1
        })
      }
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

  }
})