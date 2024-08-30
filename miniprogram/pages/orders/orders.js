// pages/orders/orders.js
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sids: [],
    token: '',
    product: [],
    totalPrice: 0,
    address: '',
    us: ''
  },
  onClickLeft() {
    wx.navigateBack()
  },
  gotoAddress() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {


    // 绑定 MobX store
    this.storeBindings = createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['address', 'userChooseAddress'], // 将 this.data.list 绑定为仓库中的 list ，即天气数据
      actions: ['updateAddress'], // 将 this.setList 绑定为仓库中的 setList action
    })



    // console.log(store.userChooseAddress);


    this.setData({
      us: store.userChooseAddress
    })

    console.log('us==>', this.data.us);


    let that = this



    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      //  console.log(data);
      that.setData({
        sids: data.data
      })
    })




    // if (this.data.address.length == 0) {
    //   this.setData({
    //     address: store.address
    //   })
    // }
    // else {

    // }





    wx.getStorage({
      key: 'token',
      success: res => {
        if (res.data) {
          this.setData({
            token: res.data
          })
          this.commitShopcart(res.data)
        }
      }
    })


    // console.log(this.data.sids);
  },
  commitShopcart(token) {
    // console.log(token, JSON.stringify(this.data.sids));
    wx.request({
      url: 'http://www.kangliuyong.com:10002/commitShopcart',
      method: 'GET',
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': token,
        'sids': JSON.stringify(this.data.sids)
      },
      success: res => {
        console.log(res);
        let data = res.data.result
        let price = 0
        data.forEach(item => {
          price += Number(item.count * item.price)
        });

        this.setData({
          product: res.data.result,
          totalPrice: price * 100
        })



      }
    })
  },

  modifyShopcartCountsub(event) {

    let sid = event.target.dataset.sid

    let count = Number(event.target.dataset.count) - Number(event.target.dataset.num)

    wx.request({
      url: 'http://www.kangliuyong.com:10002/modifyShopcartCount',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': this.data.token,
        sid: sid,
        count: count
      },
      success: res => {
        this.commitShopcart(this.data.token)
      }
    })
  },

  modifyShopcartCountadd(event) {
    let sid = event.target.dataset.sid
    console.log(sid);
    let count = Number(event.target.dataset.count) + Number(event.target.dataset.num)
    //  console.log(count);
    wx.request({
      url: 'http://www.kangliuyong.com:10002/modifyShopcartCount',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': this.data.token,
        sid: sid,
        count: count
      },
      success: res => {

        this.commitShopcart(this.data.token)

      }
    })
  },
  onSubmit() {
    if(this.data.us) {
       wx.request({
      url: 'http://www.kangliuyong.com:10002/pay',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': this.data.token,
        sids: JSON.stringify(this.data.sids),
        phone: this.data.us.tel,
        address: this.data.us.province + this.data.us.city + this.data.us.county + this.data.us.addressDetail,
        receiver: this.data.us.name
      },
      success: res => {
        // console.log(res);
        if(res.data.code === 60000) {
          wx.showToast({
            title: res.data.msg,
          })

          wx.navigateTo({
            url: '/pages/pay/pay',
          })
        }
      }
    })
    }
    else {
      wx.showToast({
        title: '地址不能为空',
      })
    }
   
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
    this.setData({
      us: store.userChooseAddress
    })

    console.log('us==>', this.data.us);
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