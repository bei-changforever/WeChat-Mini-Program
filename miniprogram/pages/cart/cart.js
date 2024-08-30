// pages/cart/cart.js
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customHeaderShow: true,
    allCheck: false,
    token: '',
    Headerheight: 0,
    shopRes: [],
    totalPrice: 0,
    disable: true
  },

  checkedTap() {


    // console.log(this.data.allCheck);

    this.setData({
      allCheck: !this.data.allCheck
    })

    let price = 0
    if (this.data.allCheck) {

      this.data.shopRes.forEach(item => {
        item.choosed = true
        price += Number(item.price * item.count)


      })
      this.setData({
        shopRes: this.data.shopRes,
        totalPrice: price,
        disable: false
      })


    }
    else {
      this.data.shopRes.forEach(item => {
        item.choosed = false
      })
      this.setData({
        shopRes: this.data.shopRes,
        totalPrice: 0,
        disable: true
      })
    }


  },
  onClickButton() {

  },
  formsubmit() {

    let sids = []
    this.data.shopRes.forEach(item => {
      if (item.choosed) {
        sids.push(item.sid)
      }
    })


    wx.navigateTo({
      url: '/pages/orders/orders',
      success: res => {
        res.eventChannel.emit('acceptDataFromOpenerPage',
          {
            data: sids
          })
      }
    })


  },

  modifyShopcartCountsub(event) {
    //  console.log(event.target.dataset,this.data.token);
    let sid = event.target.dataset.sid
    // console.log(sid);
    let count = Number(event.target.dataset.count) - Number(event.target.dataset.num)
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
        // console.log(res);
        // console.log(totalPrice);
        this.findAllShopcart(this.data.token)
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

        this.findAllShopcart(this.data.token)
      }
    })
  },



  findAllShopcart(token) {
    wx.request({
      url: 'http://www.kangliuyong.com:10002/findAllShopcart',
      method: 'GET',
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': token,
      },
      success: res => {

        let data = res.data.result
        data.forEach(item => {
          item.choosed = false
        })
        console.log(data);
        if (res.data.code == 5000) {


          this.setData({
            shopRes: data,
          })
        }
      }
    })
  },
  onClose(event) {
    const { position, instance } = event.detail;
    let sid = event.target.dataset.sid
    // console.log(sid);
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          instance.close();
          // console.log('点击删除');
          wx.request({
            url: 'http://www.kangliuyong.com:10002/deleteShopcart',
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
              'tokenString': this.data.token,
              'sids': JSON.stringify([sid]),
            },
            success: res => {
              // console.log(res);

              this.findAllShopcart(this.data.token)
            }
          })
        });
        break;
    }
  },

  //自适应高度
  getHeaterHeight(dom) {

    wx.createSelectorQuery().select(dom).boundingClientRect((rect) => {
      this.setData({
        Headerheight: rect.height + app.globalData.capsuleObj.height + rect.height / 2
      })
    }).exec()
  },
  productItemCheck(event) {
    // console.log(event.target.dataset.item.choosed);
    let { item, index } = event.target.dataset
    // console.log(item,index);


    this.setData({
      [`shopRes[${index}].choosed`]: !this.data.shopRes[index].choosed
    })


    let price = 0
    this.data.shopRes.forEach(item => {
      // console.log(item);
      if (item.choosed) {
        // console.log(item.price);
        price += Number(item.price * item.count)

      }
      else {
        price += 0
      }

      this.setData({
        totalPrice: price,
      })
    })

    if(price > 0 ) {
      this.setData({
        disable: false
      })
    }
    else {
      this.setData({
        disable: true
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    wx.getStorage({
      key: 'token',
      success: res => {
        if (res.data) {
          this.findAllShopcart(res.data)
          this.setData({
            token: res.data
          })
        }

      }
    })

    this.getHeaterHeight('#ff')
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
    wx.getStorage({
      key: 'token',
      success: res => {
        if (res.data) {
          this.findAllShopcart(res.data)
          this.setData({
            token: res.data
          })
        }

      }
    })
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