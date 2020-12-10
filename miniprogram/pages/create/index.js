// miniprogram/pages/create/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    password: ''
  },

  nameChange(e) {
    this.data.name = e.detail.value
  },

  passwordChange(e) {
    this.data.password = e.detail.value
  },

  enter() {
    const {
      name,
      password
    } = this.data
    if (name.length === 0 || password.length === 0) {
      wx.showToast({
        icon: 'none',
        title: '房间名和密码不能为空',
      })
    } else {
      wx.showLoading({
        duration: 2000,
        title: '创建中',
      })
      wx.request({
        url: app.globalData.server_url + 'group_create',
        data: {
          OPENID: wx.getStorageSync('openid'),
          GROUPNAME: name,
          GROUPPASS: password
        },
        success(res) {
          wx.hideLoading()
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})