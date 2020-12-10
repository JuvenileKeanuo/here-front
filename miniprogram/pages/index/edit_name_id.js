// miniprogram/pages/index/edit_name_id.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showtext: 'hello world',
    name: '',
    studentID: ''
  },

  nameChange(e) {
    this.data.name = e.detail.value
  },

  studentIDChange(e) {
    this.data.studentID = e.detail.value
  },

  enter() {
    const {
      name,
      studentID
    } = this.data
    let that = this
    if (name.length === 0 || studentID.length === 0) {
      wx.showToast({
        icon: 'none',
        title: '姓名和学号不能为空',
      })
    } else {
      wx.showLoading({
        duration: 2000,
        title: '更改中',
      })
      wx.request({
        url: app.globalData.server_url + 'update_user_info',
        data: {
          OPENID: wx.getStorageSync('openid'),
          NAME: name,
          STUDENTID: studentID
        },
        success(res) {
          wx.showToast({
            title: '成功',
          })
          wx.hideLoading()
          wx.setStorageSync('name', name)
          wx.setStorageSync('studentID', studentID)
          wx.reLaunch({
            url: '/pages/index/index',
          })
        },
        fail(res) {
          wx.showToast({
            title: res.toString,
            icon: 'none'
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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