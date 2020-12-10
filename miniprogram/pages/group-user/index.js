// miniprogram/pages/group-user/index.js
import F2 from '@antv/wx-f2';

const app = getApp()
var util = require('../../utils/util.js')

const buttons = [{
  label: '退出小组',
  icon: app.globalData.icon_exit,
},
{
  label: '签到',
  icon: app.globalData.icon_check,
},
]

let chart = null;
var status_chart = [];

function initChart(canvas, width, height, F2) {
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(status_chart)
  chart.scale('人数', {
    nice: true,
    tickInterval: 1,
  })
  chart.coord({
    transposed: false
  });
  chart.axis('人数', {
    line: null,
    grid: F2.Global._defaultAxis.grid,
    label(text, index, total) {
      const textCfg = {
        text: text + ' 人'
      };
      if (index === 0) {
        textCfg.textAlign = 'left';
      }
      if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.axis('Date', {
    line: F2.Global._defaultAxis.line,
    grid: null
  });
  chart.tooltip({
    custom: true, // 自定义 tooltip 内容框
    onChange(obj) {
      const legend = chart.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.map(item => {
        map[item.name] = Object.assign({}, item);
      });
      tooltipItems.map(item => {
        const {
          name,
          value
        } = item;
        if (map[name]) {
          map[name].value = (value);
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide() {
      const legend = chart.get('legendController').legends.top[0];
      legend.setItems(chart.getLegendItems().country);
    }
  });
  chart.interval().position('Date*人数').color('状态', ['#4f58a8', '#e64340']).adjust('stack');
  chart.render();
  return chart;
}

Page({
  data: {
    groupname: 'test',
    id: 0,
    openid: '',
    group_data: [],
    user_data: [],
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
    skeletons: [0, 1, 2, 3, 4, 5, 6],
    isloaded: false,
    isempty: false,
    location: {
      got: false,
    },
    opts: {
      onInit: initChart
    }
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    let that = this;
    let name = options.strr;
    let id = options.id
    let openid = wx.getStorageSync('openid')
    this.setData({
      groupname: name,
      id: Number(id),
      openid: openid
    })
  },
  onShow: function () {
    this.setData({
      isempty: false,
    })
    wx.getLocation({
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          location: {
            got: true,
            latitude: latitude,
            longitude: longitude,
          },
        })
      }
    })
    let that = this
    status_chart = []
    wx.request({
      url: app.globalData.server_url + 'get_groupdata',
      data: {
        OPENID: wx.getStorageSync('openid'),
        GROUPID: that.data.id
      },
      success(res) {
        var group_data_temp = res.data._history
        var user_data_temp = res.data._users_history.find(function (x) {
          return x._openid == that.data.openid
        })._history
        user_data_temp.sort(util.compareFunctionLess('_date'))
        for (let user_data_temp_single of user_data_temp) {
          user_data_temp_single.datestring = util.CNDateString(new Date(user_data_temp_single._date))
          user_data_temp_single.status = user_data_temp_single._checked ? '已到' : '未到'
          group_data_temp.sort(util.compareFunctionGreater('_date'))
          var chart_count = 0
        }
        for (var i = group_data_temp.length - 1; i >= 0; i--) {
          group_data_temp[i].datestring = util.CNDateString(new Date(group_data_temp[i]._date))
          if (chart_count < 3) {
            status_chart.push({
              Date: group_data_temp[i].datestring,
              状态: '未到',
              人数: group_data_temp[i]._user_unchecked.length
            }, {
                Date: group_data_temp[i].datestring,
                状态: '已到',
                人数: group_data_temp[i]._user_checked.length
              })
          }
          chart_count++
        }
        for (var date = '\t'; chart_count != 0 && chart_count < 3; chart_count++) {
          status_chart.push({
            Date: date,
            状态: '未到',
            人数: 0
          }, {
              Date: date,
              状态: '已到',
              人数: 0
            })
          date += '\t'
        }
        status_chart.reverse()
        group_data_temp.sort(util.compareFunctionLess('_date'))
        that.setData({
          group_data: group_data_temp,
          user_data: user_data_temp,
          skeletons: []
        })
        if (that.data.group_data.length == 0) {
          that.setData({
            isempty: true,
          })
        }
        if (chart != null) {
          chart.changeData(status_chart)
          chart.scale('人数', {
            nice: true,
            tickInterval: 1,
          })
        }
      }
    })
  },
  onClick(e) {
    let that = this
    if (e.detail.index === 0) {
      //退出小组
      wx.showModal({
        title: '退出小组',
        content: '退出小组后会清除你在小组内的签到信息，请谨慎操作',
        confirmText: "取消",
        cancelText: "退出",
        success: function (res) {
          if (res.confirm) {
          } else {
            wx.request({
              url: app.globalData.server_url + 'group_user_exit',
              data: {
                OPENID: wx.getStorageSync('openid'),
                GROUPID: that.data.id
              },
              success(res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
        }
      });
    }
    if (e.detail.index === 1) {
      this.checkTap()
    }
  },
  checkTap: function () {
    let that = this
    wx.request({
      url: app.globalData.server_url + 'check_do',
      data: {
        OPENID: wx.getStorageSync('openid'),
        GROUPID: that.data.id,
        GPSLOCATION: that.data.location,
      },
      success(res) {
        switch (Number(res.data)) {
          case 1:
            wx.navigateTo({
              url: '/pages/group-user/check_success',
            })
            break
          case 2:
            wx.showToast({
              title: '签过了就别点了',
              icon: 'none'
            })
            break
          case -1:
            wx.showToast({
              title: '现在不是签到时间',
              icon: 'none'
            })
            break
          case -2:
            wx.showToast({
              title: '你不在签到范围内哦',
              icon: 'none'
            })
            break
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  scroll: function () {

  },
  upper: function () {

  },
  lower: function () {

  }
})