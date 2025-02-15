// pages/star/star.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    starList: []
  },
  onClickLeft() {
    wx.navigateBack()
  },

  findmyLike() {
    console.log('token==>', this.data.token);


    if (this.data.token.length > 0) {
      wx.request({
        url: 'http://www.kangliuyong.com:10002/findAllLike',
        method: 'GET',

        data: {
          'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          'tokenString': this.data.token,
         
        },
        success: res => {
          console.log('商品收藏==>', res);
          if(res.data.code == 2000) {
            this.setData({
              starList: res.data.result
            })
          }
         
        }
      })
    }


  },

  gotoProductDetail(e) {
   console.log(e);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this

    wx.getStorage({
      key: 'token',

      success: res => {

        this.setData({
          token: res.data
        })


        //进入页面获取收藏商品pid
        that.findmyLike()

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
    this.findmyLike()
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