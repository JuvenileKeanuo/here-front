Page({
  data: {
    leftHidden: false,
    rightHidden: false,
    curPage: 0,
  },
  swipeChange: function(e) {
    var cur = e.detail.current
    if (cur === 2) {
      this.setData({
        leftHidden: true,
        rightHidden: true,
        curPage: cur,
      })
    } else {
      this.setData({
        leftHidden: false,
        rightHidden: false,
        curPage: cur,
      })
    }
  },
  nextPage: function(e) {
    if (this.data.curPage < 2) {
      this.setData({
        curPage: this.data.curPage + 1,
      })
    } else {
      wx.redirectTo({
        url: '/pages/firstboot/index'
      })
    }
  },
  goregister: function() {
    wx.redirectTo({
      url: '/pages/firstboot/index',
    })
  }
})