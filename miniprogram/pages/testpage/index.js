// miniprogram/pages/testpage/index.js
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
    if (name.length === 0 || studentID.length === 0) {
      wx.showToast({
        icon: 'none',
        title: '姓名和学号不能为空',
      })
    } else {
      wx.showLoading({
        duration: 2000,
        title: '注册中',
      })
      wx.cloud.callFunction({
        name: 'new_user',
        data: {
          name: name,
          studentID: studentID
        },
        success(res) {
          wx.hideLoading()
          wx.setStorageSync('registered', 'true')
          wx.setStorageSync('openid', res.result)
          wx.reLaunch({
            url: '/pages/index/index',
          })
        },
        fail: console.error
      })
    }
    wx.getLocation({
      success(res) {
        console.log(res)
      }
    })
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