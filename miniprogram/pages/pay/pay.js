// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    currentIndex: 0,
    orders: [],
    status: 0,
    selectDate: [
      {
        title: "全部",
        status: 0
      },
      {
        title: "进行中",
        status: 1
      },
      {
        title: "已完成",
        status: 2
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.getStorage({
      key: 'token',
      success: res => {
        if (res.data) {
          this.setData({
            token: res.data
          })

          this.getPay(res.data, 0)
        }
      }
    })

  },
  onClickLeft() {
    wx.navigateBack()
  },
  getPay(token, status) {
    wx.request({

      // NO1679219103005
      url: 'http://www.kangliuyong.com:10002/findOrder',
      method: 'GET',
      //  header: {
      //   "Content-Type": "application/x-www-form-urlencoded"
      // },
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': token,
        'status': status,
        // 'oid'  : 'NO1679219103005'
      },
      success: res => {
        // console.log(res);
        if (res.data.code === 70000) {
          wx.showToast({
            title: res.data.msg,
          })

          let data = res.data.result

          let orders = []
          let oids = []
          data.forEach(item => {
            // console.log(item);
            if (oids.indexOf(item.oid) == -1) {
              oids.push(item.oid)
            }
          })

          oids.forEach(oid => {
            let currentData = {
              oid,
              count: 0,
              total: 0,
              data: []
            };

            data.forEach(item => {
              if (oid == item.oid) {
                if (!currentData.date) {


                  currentData.date = this.renderTime(item.createdAt)
                }
                if (!currentData.status) {
                  currentData.status = item.status
                }
                currentData.count += item.count
                currentData.total += item.count * item.price
                currentData.data.push(item)
              }
            })

            orders.push(currentData)
          })



          console.log(orders);


          this.setData({
            orders: orders
          })


        }
      }
    })
  },
  renderTime(date) {




    date = new Date(new Date(date).getTime() + 8 * 60 * 60 * 1000)
    date = date.toJSON()
    date = date.substring(0, 19).replace('T', ' ')


    return date



  },

  choose(e) {

    let { index, status } = e.target.dataset
    if (this.data.currentIndex == index) return
    this.setData({
      currentIndex: index,
      status: index
    })

    if (this.data.status === 0) {
      this.getPay(this.data.token, 0)
    }
    else if (this.data.status === 1) {
      this.getPay(this.data.token, 1)


    }
    else if (this.data.status === 2) {
      this.getPay(this.data.token, 2)
    }



  },
  Confirm(e) {

    console.log(e);

    let oid = e.target.dataset.oid

    wx.request({
      url: 'http://www.kangliuyong.com:10002/receive',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': this.data.token,
        'oid': oid
      },
      success: res => {
        // console.log(res);
        if (res.data.code == 80000) {
          wx.showToast({
            title: res.data.msg,
          })

          this.getPay(this.data.token, 0)
        }
      }
    })



  },

  delPro(e) {
    //  console.log(e);
    let { oid } = e.target.dataset


    wx.request({
      url: 'http://www.kangliuyong.com:10002/removeOrder',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': this.data.token,
        'oid': oid
      },
      success: res => {
        console.log(res);
        if(res.data.code == 90000) {
          wx.showToast({
            title: res.data.msg,
          })

          this.getPay(this.data.token,0)
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