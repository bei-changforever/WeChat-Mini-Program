// pages/search/search.js
const http = require('../../utils/http')
const ui = require('../../utils/ui')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    dataArr: [],
    kwList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     let that = this
     wx.getStorage({
       key: 'KwList',
       success: res => {
         that.setData({
          kwList: res.data || []
         })
       }
     })
  },
  onClickLeft(){
    wx.navigateBack()
  },
  search() {
    if (!this.data.searchValue.trim()) {
      return
    }
    else {
   
      let options = {
        url: '/search',
        data: {
          name: this.data.searchValue
        }
      }
      wx.showLoading({
        title: '搜索中...',
      })

      http.request(options).then(res => {
        let data = res.data.result
        console.log(data);
        this.setData({
          dataArr: data
        })
        wx.hideLoading()
      })

      if (this.data.kwList.indexOf(this.data.searchValue) == -1) {
        console.log('历史记录中没有，添加进历史记录');
         this.data.kwList.unshift(this.data.searchValue)
         this.setData({
          kwList: this.data.kwList
         })
         wx.setStorage({
           key: 'KwList',
           data: this.data.kwList
         })
      }
    }
  },
  writeKey(event) {
    let kw = event.detail.value.trim()
    
    if(event.detail.value.trim().length == 0) {
      this.setData({
        dataArr: []
      })
    }
    
    this.setData({
      searchValue: kw
    })
  },
  del(){
    this.setData({
      kwList: []
    })
    wx.setStorage({
      key: 'KwList',
      data: this.data.kwList
    })
  },
  gotoProductDetailPage(e) {

    wx.navigateTo({
      url: `/pages/productDetail/productDetail?pid=${e.target.dataset.pid}`,
    })
  },
  chooseHistory(e){
    this.setData({
      searchValue: e.target.dataset.name
    })
    this.search()
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

  }
})