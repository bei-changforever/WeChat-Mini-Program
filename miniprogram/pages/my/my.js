// pages/my/my.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customHeaderShow: true,
    userLogin: false,
    token: '',
    info: []
  },

  gotoLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  gotoStar() {
    wx.navigateTo({
      url: '/pages/star/star',
    })
  },
  gotoPersonSelf() {
    wx.navigateTo({
      url: '/pages/personSelf/personSelf',
    })
  },
  findMy(token) {
    wx.request({
      url: 'http://www.kangliuyong.com:10002/findMy',
      method: 'GET',
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': token
      },
      success: res => {
        console.log(res);
        this.setData({
          info: res.data.result
        })
      }
    })
  },
  loginout() {
    let that = this
    wx.request({
      url: 'http://www.kangliuyong.com:10002/logout',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': this.data.token,
      },
      success: res => {
        console.log(res);
        if (res.data.code == "F001") {
          wx.showToast({
            title: res.data.msg,
          })
          wx.removeStorage({
            key: 'token',
            success:res=> {
              console.log('删除token',res);
            }
          })
          that.setData({
            userLogin: false,
            token: '',
            info: []
          })
          // this.onLoad();
        }
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    // 绑定 MobX store
    this.storeBindings = createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['isLogin'], // 将 this.data.list 绑定为仓库中的 list ，即天气数据
      actions: ['updateLogin'], // 将 this.setList 绑定为仓库中的 setList action
    })

    wx.getStorage({
      key: 'token',
      success: res => {
        that.findMy(res.data)
        if (res.data) {
          this.setData({
            userLogin: true,
            token: res.data
          })
        }
        else {
          this.setData({
            userLogin: false,
            token: ''
          })
        }
      }
    })

    console.log(this.data.userLogin);


  },
  gotoPay() {
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.findMy(this.data.token)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})