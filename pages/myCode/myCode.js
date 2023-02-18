// pages/myCode/myCode.js
var QRCode = require('../../utils/weapp-qrcode.js')
var qrcode;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: 'https://github.com/tomfriwel/weapp-qrcode',
    image: ''
  },

  onLoad: function (options) {
    qrcode = new QRCode('canvas', {
      // usingIn: this,
      text: app.globalData.userDetail.userID,
      image:'/images/bg.jpg',
      width: 150,
      height: 150,
      colorDark: "#1CA4FC",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
  });
  this.setData({
    text:app.globalData.userDetail.userID,
  });
  },
  confirmHandler: function (e) {
    var value = e.detail.value
    qrcode.makeCode(value)
},
inputHandler: function (e) {
    var value = e.detail.value
    this.setData({
        text: value
    })
},
tapHandler: function () {
    console.log('传入字符串生成qrcode',this.data.text);
    // 传入字符串生成qrcode
    qrcode.makeCode(this.data.text)
},
// 长按保存
save: function () {
    console.log('save')
    wx.showActionSheet({
        itemList: ['保存图片'],
        success: function (res) {
            console.log(res.tapIndex)
            if (res.tapIndex == 0) {
                qrcode.exportImage(function (path) {
                    wx.saveImageToPhotosAlbum({
                        filePath: path,
                    })
                })
            }
        }
    })
  }
})