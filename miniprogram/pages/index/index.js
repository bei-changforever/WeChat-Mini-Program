// pages/index/index.js
const http = require('../../utils/http')
const ui = require('../../utils/ui')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    index_card_item: [
      {
        title: 'Coffee',
        icon: '../../assets/images/coffe.png'
      },
      {
        title: 'News',
        icon: '../../assets/images/news.png'
      },
      {
        title: 'Activity',
        icon: '../../assets/images/activitity.png'
      },
      {
        title: 'Found',
        icon: '../../assets/images/found.png'
      }
    ],
    newProductList: [],
    coffe_desc: [],
    scrollTop: 0,
    bannerHeight: 0,
    customHeaderShow: true,
    mm: '',
    dd: ''
  },
  //轮播图
  getBanner() {
    wx.cloud.callFunction({
      name: 'banner',
      success: res => {
        this.setData({
          bannerList: res.result.data
        })
        console.log(res);
      },
      complete:()=> {
        this.getBannerHeight('#banner')
      }
    })
  },
  getCoffeDesc() {
    wx.cloud.callFunction({
      name: 'getCoffeDesc',
      success: res => {
        this.setData({
          coffe_desc: res.result.data
        })
      }
    })
  },
  getNewsProduct() {
    let options = {
      url: '/typeProducts',
      data: {
        key: 'isHot',
        value: 1
      },
      showLoading: true
    }

    http.request(options).then(res => {
      ui.hideLoading()
      this.setData({
        newProductList: res.data.result
      })
      
    })
  },
  gotoProductDetailPage(e) {
   
    wx.navigateTo({
      url: `/pages/productDetail/productDetail?pid=${e.target.dataset.pid}`,
    })
  },
  getBannerHeight(dom) {
   wx.createSelectorQuery().select(dom).boundingClientRect((rect) => {
      this.setData({
        scrollTop: rect.height
      })
    }).exec()
  },
  startTime() {
    let date = new Date()
    let mm = date.getMonth() + 1
    let dd = date.getDate()
    mm = mm < 10 ? '0' + mm : mm
    dd = dd < 10 ? '0' + dd : dd
    

    this.setData({
      mm,
      dd
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBanner()
    this.getNewsProduct()
    this.getCoffeDesc()
    this.startTime()
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

  },
  onPageScroll(e) {
    if(e.scrollTop > this.data.scrollTop) {
    this.setData({
      customHeaderShow: false
    })
    }
    if(e.scrollTop < this.data.scrollTop) {
      this.setData({
        customHeaderShow: true
      })
    }
  }
})