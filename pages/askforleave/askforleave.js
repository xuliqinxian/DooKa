// pages/askforleave/askforleave.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    startdate:'',
    excusedesc:'事',
    islock:false,
    isshow:true,
    Recordid:'',
    selectstarttime:{date:'选择日期',time:'选择时间'},
    recordstarttime:'',
    selectclosedtime:{date:'选择日期',time:'选择时间'},
    recordclosedtime:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var tmpdate = new Date().toJSON().substring(0,10);
    if(options.route == 1){
      this.setData({
        username:options.username,
        userID:options.userID,
        startdate:tmpdate,
      })
    }else{
      this.setData({
        islock:true,
        Recordid:options.Recordid
      })
      //获取指定Recordid的请假记录
      wx.request({
        url: 'https://www.himitdms.com:3001/V2/api/Excuse/' + this.data.Recordid,
        method:'GET',
        success:(res)=>{
          // console.log("获取指定Recordid的请假信息",res);
          if(res.statusCode == 200){
            let datas = res.data;
            console.log(res.data);     
            if(res.data.indexOf("error") >=0){
            }   
            else{
              let datasss = res.data;
              datasss.forEach( (item, index)=> {
                this.setData({
                  excuseobj:datasss[index],
                  username:datasss[index].applier_username,
                  userID:datasss[index].applier_userid,
                  startdate:datasss[index].excuse_starttime,
                  timecount:datasss[index].excuse_timecount,
                  excusedesc:datasss[index].excuse_description,
                  recordstarttime:datasss[index].excuse_starttime,
                  recordclosedtime:datasss[index].excuse_closedtime,
                  isshow:false
                });
              })
            }
          }
        }
      });
    }
  },
  handledescChanges: function (e) {
    // console.log(e);
    this.setData({
      excusedesc: e.detail.value
    })
  },
  ApproveIt:function(e){
    // console.log('https://www.himitdms.com:3001/V2/api/Excuse/' + this.data.Recordid + '/批准/' + this.data.username + '/' + this.data.userID);
    wx.request({
      url: 'https://www.himitdms.com:3001/V2/api/Excuse/' + this.data.Recordid + '/批准/' + app.globalData.userDetail.username + '/' + app.globalData.userDetail.userID,
      method:"PUT",
      success:(res)=>{
        // console.log("批准假条返回",res);
        if(res.statusCode == 200){
          wx.showToast({
            title: '提交成功',
          });
          wx.reLaunch({
            url:'../approvemain/approvemain?route=1',
          });
        } 
      }
    })
  },
  DoIt:function(e){
    // console.log("提交请假条");
    wx.request({
      url: 'https://www.himitdms.com:3001/V2/api/Excuse/' + this.data.username + '/' + this.data.userID + '/' + this.data.excusedesc +'/'+ this.data.selectstarttime.date + ' ' + this.data.selectstarttime.time + '/' + this.data.selectclosedtime.date + ' ' + this.data.selectclosedtime.time,
      method:"POST",
      success:(res)=>{
        console.log("上传请假条返回",res);
        if(res.statusCode == 200){
          wx.showToast({
            title: '提交成功',
          });
          wx.reLaunch({
            url:'../askforleavemain/askforleavemain?name='+ this.data.username + '&id='+ this.data.userID,
          });
        } 
      }
    })
  },
  bindDateChange:function(e){
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      startdate:e.detail.value
    })
  },
  bindtimecountChange:function(e){
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      timecounter:this.data.array[e.detail.value]
    })
  },
  bindDateChange1:function(e){
    // console.log("开始时间选择",e)
    var time = this.data.selectstarttime.time;
    var date = e.detail.value;
    var tmp = {date,time};
    this.setData({
      selectstarttime:tmp,
    })
  },
  bindTimeChange1:function(e){
    // console.log("开始时间选择",e)
    var date = this.data.selectstarttime.date;
    var time = e.detail.value + ":00";
    var tmp = {date,time};
    this.setData({
      selectstarttime:tmp,
    })
  },
  bindDateChange2:function(e){
    // console.log("结束日期选择",e)
    var time = this.data.selectclosedtime.time;
    var date = e.detail.value;
    var tmp = {date,time};
    this.setData({
      selectclosedtime:tmp,
    })
  },
  bindTimeChange2:function(e){
    // console.log("结束时间选择",e)
    var date = this.data.selectclosedtime.date;
    var time = e.detail.value + ":00";
    var tmp = {date,time};
    this.setData({
      selectclosedtime:tmp,
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