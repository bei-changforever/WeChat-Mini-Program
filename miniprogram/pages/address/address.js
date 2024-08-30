// pages/address/address.js
import { areaList } from '@vant/area-data';
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    areaList,
    show: false,
    info: '',
    ischoose: false,
    activeIndex: 0

  },
  onClickLeft() {
    wx.navigateBack()
  },
  gotoNew() {
    wx.navigateTo({
      url: '/pages/newAddress/newAddress',
    })
  },
  findAddress(token) {
    wx.request({
      url: 'http://www.kangliuyong.com:10002/findAddress',
      method: 'GET',
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': token,
      },
      success: res => {
        console.log(res);
        let data = res.data.result

        if (res.data.result) {
          data.forEach(item => {
            item.ischooseIndex = 0,
              item.ischoose = false
          })
          // data.ischoose = false
          data.ischooseIndex = 0
          this.setData({
            info: data
          })
        }

      }
    })
  },
  checkedTap(e) {
    // console.log(this.data.info);
    // console.log(e);
    let { index, item, info } = e.target.dataset
    console.log(index, item, info);
    // if(this.data.activeIndex == index ) return
    // if(chooseindex == index ) return


    if (this.data.activeIndex == index) return


    this.setData({
      activeIndex: index
    })



    // this.setData({
    //   [`info[${this.data.activeIndex}].ischoose`]: true
    // })













  },
  sure() {
    let data = this.data.info[this.data.activeIndex]
    console.log(data);
    wx.navigateBack()
    store.updateuserChooseAddress(data)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {


    this.storeBindings = createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['address'], // 将 this.data.list 绑定为仓库中的 list ，即天气数据
      actions: ['updateuserChooseAddress'], // 将 this.setList 绑定为仓库中的 setList action
    })


    wx.getStorage({
      key: 'token',
      success: res => {
        if (res.data) {
          this.setData({
            token: res.data
          })

          this.findAddress(res.data)
        }
      }
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
    this.findAddress(this.data.token)
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