// pages/indexDetail/indexDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detaildata:null,
    videosrc2:"http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
    videosrc:"https://www.bilibili.com/video/BV1K54y1G7sM?t=8.6"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('url传递的参数',options);
    //获取详细数据
    wx.request({
      url: app.globalData.serverurl + '/api/Banner',
      method:"GET",
      success:(res)=>{
        console.log("获取banner",res);
        if(res.statusCode == 200){
          let datas = res.data;
          datas.forEach((item, index)=>{
            if(options.id == datas[index].id){
              this.setData({
                detaildata:datas[index]
              })
              wx.setNavigationBarTitle({
                title: datas[index].desc
              })
            }
          });
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