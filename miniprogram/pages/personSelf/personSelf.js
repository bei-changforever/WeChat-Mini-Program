// pages/personSelf/personSelf.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    info: {},
    token: '',
    userChooseImg: false
  },
  getPersonSelf(token) {

    wx.request({
      url: 'http://www.kangliuyong.com:10002/findAccountInfo',
      method: 'GET',
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': token
      },
      success: res => {
        console.log(res);
        this.setData({
          info: res.data.result,
        })
      }
    })
  },
  onClickLeft() {
    wx.navigateBack()
  },
  afterRead(event) {
    let that = this
    const { file } = event.detail;
    console.log(file.url);
    let type = file.url.split('.')
    // console.log(type[1]);
    this.setData({
      userChooseImg: true
    })
    wx.getFileSystemManager().readFile({
      filePath: file.url,
      encoding: 'base64',
      success:res=>{
       let base64Img =  'data:image/' + type[1].toLocaleLowerCase() + ';base64,' + res.data
       console.log(base64Img);
       //调用修改头像接口
        that.changeTouxian(type[1].toLocaleLowerCase(),base64Img)
      }
    })
    
    this.data.fileList.unshift({
      url: file.url
    })

    this.setData({
      fileList: this.data.fileList
    })
  },

  changeTouxian(type,base64img){
    console.log(type,base64img);
    wx.request({
      url: 'http://www.kangliuyong.com:10002/updateAvatar',
      method:'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': this.data.token,
        'imgType': type,
        'serverBase64Img': base64img
      },
      success:res=>  {
        console.log(res);
        if(res.data.code == "H001") {
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },
  deleteImg(event) {
    let index = event.detail.index
    console.log(index)//输出的就是图片所在fileList的下标，自己根据需要进行操作就行
    this.data.fileList.splice(index, 1)
    this.setData({
      fileList: this.data.fileList
    })
  },
  formSubmit(e) {
    let { desc, nickName } = e.detail.value
    let reg_name = /^[A-Za-z\u4e00-\u9fa5]{1,16}$/;

    if (nickName.length > 0 && this.data.info[0].nickName !== nickName) {
      if (!reg_name.test(nickName)) {
        return wx.showToast({
          title: '昵称不符合规范',
        })
      }
      else {
        //修改昵称接口
        wx.request({
          url: 'http://www.kangliuyong.com:10002/updateNickName',
          method: 'POST',
          data: {
            'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
            'tokenString': this.data.token,
            'nickName': nickName
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: res => {
            // console.log(res);
            if(res.data.code == "C001") {
              wx.showToast({
                title: res.data.msg,
              })
            }
          }
        })
      }
    }
    if (desc.length > 0 && (this.data.info[0].desc !== desc)) {
      if (!reg_name.test(desc)) {
        return wx.showToast({
          title: '简介不符合规范',
        })
      }
      else {
        //修改昵称接口
        wx.request({
          url: 'http://www.kangliuyong.com:10002/updateDesc',
          method: 'POST',
          data: {
            'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
            'tokenString': this.data.token,
            'desc': desc
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: res => {
            // console.log(res);
            if(res.data.code == "D001") {
              wx.showToast({
                title: res.data.msg,
              })
            }
          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    wx.getStorage({
      key: 'token',
      success: res => {
        that.getPersonSelf(res.data)
        that.setData({
          token: res.data
        })
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