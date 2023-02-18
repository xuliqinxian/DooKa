// pages/mission/mission.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    missionarry:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //拉取所有任务
    wx.request({
      url: 'https://www.himitdms.com:3001/V2/api/Mission/GetAll',
      method:"GET",
      success:(res)=>{
        console.log("获取任务列表",res);
        if(res.statusCode == 200){
          this.setData({
            missionarry:res.data
          })
        } 
      }
    })
  },
  ToMissionDetail: function (options){
    console.log(options.currentTarget.dataset.id);
    wx.navigateTo({
      url:'../missiondetail/missiondetail?id=' + options.currentTarget.dataset.id
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