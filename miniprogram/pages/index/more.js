// miniprogram/pages/index/more.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    student_id: ''
  },

  clear_storage: function() {
    try {
      wx.clearStorageSync()
      wx.redirectTo({
        url: '/pages/firstboot/index',
      })
    } catch (e) {
      // Do something when catch error
      wx.showToast({
        title: '清除失败',
        icon: 'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let name = wx.getStorageSync('name')
    let student_id = wx.getStorageSync('studentID')
    this.setData({
      name: name,
      student_id: student_id
    })
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