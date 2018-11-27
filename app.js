//app.js
import Api from '/utils/api.js';
App({
  onLaunch: function (options) {
    this.globalData.scene = options.scene;
    const that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 获取openid
        wx.request({
          method: 'GET',
          url: Api.getOpenid,
          data: {code: res.code},
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(response) {
            const res = response.data;
            that.globalData.openid = res.data.openid;
            that.globalData.isExistUser = res.data.isExistUser;
            that.getUserInfo();
          }
        });
      }
    });
  },
  getUserInfo: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              this.upUserInfo();
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  upUserInfo: function () {
    const that = this;
    const isExistUser = that.globalData.isExistUser;
    if (!isExistUser) {
      // 上传用户信息
      wx.request({
        method: 'PUT',
        url: Api.user,
        data: { ...that.globalData.userInfo, openid: that.globalData.openid },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data);
        }
      });
    } else { // 更新用户信息
      // 上传用户信息
      wx.request({
        method: 'POST',
        url: Api.user + '?openid='+that.globalData.openid,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data);
        }
      });
    }
    
  },
  globalData: {
    userInfo: null,
    openid: null,
    isExistUser: 0,
    scene: 0
  }
})