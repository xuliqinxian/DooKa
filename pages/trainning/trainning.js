// pages/trainning/trainning.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgarry:[],
    scanret:'请输入要查询的内容'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: app.globalData.serverurl + '/api/Banner',
      method:"GET",
      success:(res)=>{
        console.log("获取banner",res);
        if(res.statusCode == 200){
          this.setData({
            imgarry:res.data
          })
        } 
      },
      fail:(result)=>{
        console.log("获取Banner异常:",result);
      }
    });
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