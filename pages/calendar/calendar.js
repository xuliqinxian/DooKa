// pages/calendar/calendar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data_arr:["日","一","二","三","四","五","六"],
    year:"",
    month:"",
    today:2 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let now = new Date();
    let year = now.getFullYear();
    // month获取是从 0~11
    let month = now.getMonth() + 1;
    this.setData({
      year,month
    });
    this.showCalendar();
  },
  showCalendar(){
    let {year,month} = this.data
    //以下两个month已经+1
    let currentMonthDays = new Date(year,month,0).getDate() //获取当前月份的天数
    let startWeek = new Date(year + '/' + month + '/' + 1).getDay(); //本月第一天是从星期几开始的
    this.setData({
      currentMonthDays,startWeek
    })
  },
    //上个月按钮
    bindPreMonth(){
      let {year,month} = this.data
      //判断是否是1月
      if(month - 1 >= 1){
        month = month - 1 
      }else{
        month = 12
        year = year - 1
      }
      this.setData({
        month,year
      })
      this.showCalendar()
    },
    //下个月按钮
  bindNextMonth(){
    let {year,month} = this.data
    //判断是否是12月
    if(month + 1 <= 12){
      month = month + 1 
    }else{
      month = 1
      year = year + 1
    }
    this.setData({
      month,year
    })
    this.showCalendar()
  },
  bindClickWeek:function(e){
  },
  bindClickDay:function(e){
    // console.log(e.currentTarget.dataset.index);
    this.setData({
      today:e.currentTarget.dataset.index
    });
    console.log(this.data.today);
    var tmpdate = this.data.year + "-" + ("0"+this.data.month).substring(0,2) + "-" + ("0"+this.data.today).substring(("0"+this.data.today).length-2,("0"+this.data.today).length);
    console.log(tmpdate);
    this.setData({
      date: tmpdate,
      list:[]
    })
    wx.reLaunch({
      url:'../equipment/equipment?date='+ this.data.date,
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