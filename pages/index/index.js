//index.js
import Api from '../../utils/api.js';
import Utils from '../../utils/util.js';

const app = getApp()

Page({
  data: {
    details: null,
    tag: 99,
    toView: "item0"
  },
 
  onLoad: function () {
    this.getMains();
  },
  /**
   * 获取用户信息
   */
  onGotUserInfo: function (res) {
    app.globalData.userInfo = res.detail.userInfo;
    app.upUserInfo();
  },

  /**
   * 获取列表数据
   */
  getMains: function () {
    const that = this;
    let queryData = {};
    if (that.data.tag != 99) {
      queryData.tag = that.data.tag;
    }
    // 上传用户信息
    wx.request({
      method: 'GET',
      url: Api.mains,
      data: queryData,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(response) {
        const res = response.data;
        if (res.errorCode === 0) {
          that.setData({ details: res.data.details});
        }
      }
    });
  },

  /**
   * 顶部导航的点击事件
   */
  navTap: function (event) {
    const tag = event.currentTarget.dataset.tag;
    this.setData({ toView: "item" + tag, tag: tag });
  },

  /**
   * 到历史页面
   */
  toHistory: function () {
    wx.navigateTo({
      url: '../history/history'
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      path: '/pages/index/index'
    }
  },

  /**
   * 生成卡片分享
   */
  toShareCard: function () {
    const curDate = new Date();
    wx.setStorage({
      key: 'details',
      data: { date: Utils.formatDay(curDate), details:this.data.details}
    });
    wx.navigateTo({
      url: '../share/share'
    });
  }
})
