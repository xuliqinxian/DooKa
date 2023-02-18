// pages/approvemain/approvemain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nofoundshow:false,
    nofoundshow2:false,
    datalist:[],
    datalist2:[],
    route:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      username:options.username,
      userID:options.userID,
      route:options.route
    });
    // https://www.himitdms.com:3001/V2/api/Excuse/GetbyID/220110
    wx.request({
      url: 'https://www.himitdms.com:3001/V2/api/Excuse/GetAllWaitApproveTask/',
      method:'GET',
      success:(res)=>{
        console.log("获取员工所有的请假信息",res);
        if(res.statusCode == 200){
          let datas = res.data;
          console.log('查找到的数据',res.data);
          if(res.data.indexOf("error") >=0){
            this.setData({
              nofoundshow:true
            })
            console.log('没找到数据');
          }   
          else{
            this.setData({
              datalist:res.data,
              nofoundshow:false
            })
          }
        }
      }
    });
    // https://www.himitdms.com:3001/V2/api/LineExcepReport2/GetAll
    wx.request({
      url: 'https://www.himitdms.com:3001/V2/api/LineExcepReport2/GetAllWaitApproveTask',
      method:'GET',
      success:(res)=>{
        console.log("获取所有打卡信息",res);
        if(res.statusCode == 200){
          let datas = res.data;
          console.log(res.data);     
          if(res.data.indexOf("error") >=0){
            this.setData({
              nofoundshow2:true
            })
          }   
          else{
            this.setData({
              datalist2:res.data,
              nofoundshow2:false
            })
          }
        }
      }
    });
    this.timer = setInterval(function(){
      this.timechange()
        }.bind(this),60000); // 创建定时器，每个 60s 触发一次 timechange()函数
  },
  timechange:function(){
    if(this.data.route == 1){
      wx.request({
        url: 'https://www.himitdms.com:3001/V2/api/Excuse/GetAllWaitApproveTask/',
        method:'GET',
        success:(res)=>{
          console.log("获取员工所有的请假信息",res);
          if(res.statusCode == 200){
            let datas = res.data;
            console.log('查找到的数据',res.data);
            if(res.data.indexOf("error") >=0){
              this.setData({
                nofoundshow:true
              })
              console.log('没找到数据');
            }   
            else{
              this.setData({
                datalist:res.data,
                nofoundshow:false
              })
            }
          }
        }
      });
    }
    else{
// https://www.himitdms.com:3001/V2/api/LineExcepReport2/GetAll
wx.request({
  url: 'https://www.himitdms.com:3001/V2/api/LineExcepReport2/GetAllWaitApproveTask',
  method:'GET',
  success:(res)=>{
    console.log("获取所有打卡信息",res);
    if(res.statusCode == 200){
      let datas = res.data;
      console.log(res.data);     
      if(res.data.indexOf("error") >=0){
        this.setData({
          nofoundshow2:true
        })
      }   
      else{
        this.setData({
          datalist2:res.data,
          nofoundshow2:false
        })
      }
    }
  }
});
    } 
  },
  ToAskforLeaveDetail: function (options){
    console.log(options.currentTarget.dataset.id);
    wx.navigateTo({
      url:'../askforleave/askforleave?route=2&Recordid=' + options.currentTarget.dataset.id
    })
  },
  ToLineReportDetail: function (options){
    console.log(options.currentTarget.dataset.id);
    wx.navigateTo({
      url:'../linereport/linereport?route=2&Recordid=' + options.currentTarget.dataset.id
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