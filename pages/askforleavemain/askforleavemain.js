// pages/askforleavemain/askforleavemain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    userID:'',
    nofoundshow:true,
    datalist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      username:options.name,
      userID:options.id
    });
    // https://www.himitdms.com:3001/V2/api/Excuse/GetbyID/220110
    wx.request({
      url: 'https://www.himitdms.com:3001/V2/api/Excuse/GetbyID/' + this.data.userID,
      method:'GET',
      success:(res)=>{
        console.log("获取员工所有的请假信息",res);
        if(res.statusCode == 200){
          let datas = res.data;
          console.log(res.data);     
          this.setData({
            datalist:res.data,
            nofoundshow:false
          })
        }
      }
    })
  },
  additem:function(e){
    console.log("添加请假");
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