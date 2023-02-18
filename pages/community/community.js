// pages/community/community.js
import uCharts from '../../utils/u-charts.js';
var uChartsInstance = {};
var uChartsInstance2 = {};
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    crewarry:[],
    cWidth: 450,
    cHeight: 300,
    cWidth2: 450,
    cHeight2: 300,
    cWidth3: 450,
    cHeight3: 300,
    imgarry:[]
  },
  
  getServerData2() {
    //模拟从服务器获取数据时的延时
    setTimeout(() => {
      //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
      let res = {
            categories: ["2018"],
            series: [
              {
                name: "投入CT",
                data: [35]
              },
              {
                name: "产出CT",
                data: [18]
              }
            ]
          };
      this.drawCharts2('CT_Detail', res);
    }, 500);
  }, 
  getServerData() {
    //模拟从服务器获取数据时的延时
    setTimeout(() => {
      //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
      let res = {
            series: [
              {
                name: "正确率",
                color: "#2fc25b",
                data: 0.8
              }
            ]
          };
      this.drawCharts('outputprocess', res);
    }, 500);
  },
  drawCharts2(id,data){
    const ctx = wx.createCanvasContext(id, this);
    uChartsInstance[id] = new uCharts({
        type: "column",
        context: ctx,
        width: this.data.cWidth2,
        height: this.data.cHeight2,
        categories: data.categories,
        series: data.series,
        animation: true,
        background: "#FFFFFF",
        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
        padding: [15,15,0,5],
        enableScroll: false,
        legend: {},
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          data: [
            {
              min: 0
            }
          ]
        },
        extra: {
          column: {
            type: "group",
            width: 30,
            activeBgColor: "#000000",
            activeBgOpacity: 0.08
          }
        }
      });
  },
  drawCharts(id,data){
    const ctx = wx.createCanvasContext(id, this);
    uChartsInstance[id] = new uCharts({
        type: "arcbar",
        context: ctx,
        width: this.data.cWidth,
        height: this.data.cHeight,
        series: data.series,
        animation: true,
        background: "#FFFFFF",
        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
        padding: undefined,
        title: {
          name: "80%",
          fontSize: 15,
          color: "#2fc25b"
        },
        subtitle: {
          name: "产出",
          fontSize: 15,
          color: "#666666"
        },
        extra: {
          arcbar: {
            type: "circle",
            width: 12,
            backgroundColor: "#E9E9E9",
            startAngle: 1.5,
            endAngle: 0.25,
            gap: 2
          }
        }
      });
  },
  tap(e){
    uChartsInstance[e.target.id].touchLegend(e);
    uChartsInstance[e.target.id].showToolTip(e);
    // uChartsInstance2[e.target.id].touchLegend(e);
    // uChartsInstance2[e.target.id].showToolTip(e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var tmpv = app.globalData.serverurl + app.globalData.swversion + '/api/ClockIn2/GetCrew/' + app.globalData.currentstationcode;
    console.log('链接',tmpv);
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
    //获取场所内人员
    wx.request({
      url: app.globalData.serverurl + app.globalData.swversion + '/api/ClockIn2/GetCrew/' + app.globalData.currentstationcode,
      method:"GET",
      success:(res)=>{
        console.log("获取场所内人员信息",res);
        if(res.statusCode == 200){
          let datas = res.data;
          console.log(res.data);     
          this.setData({
            crewarry:res.data
          })
        } 
      }
    });
  },
  swiperChange:function(e){
    //console.log(e,"轮播触发");
    this.setData({
      currentindex:e.detail.current
    });
  },
  calling: function() {
    wx.makePhoneCall({
    phoneNumber: '15084961633',
    success: function() {
    console.log("拨打电话成功！")
    },
    fail: function() {
    console.log("拨打电话失败！")
    }
    })
    },
    CallingTap: function (options) {
      console.log('点击拨号');
      console.log(options.currentTarget.dataset.value);
      wx.makePhoneCall({
        phoneNumber: options.currentTarget.dataset.value,
        success: function() {
        console.log("拨打电话成功！")
        },
        fail: function() {
        console.log("拨打电话失败！")
        }
        })
    },
    SendMsgTap: function (options) {
      console.log('点击发消息');
      console.log(options);
      console.log(options.currentTarget.dataset.value);
    },
    GoodTap: function (options) {
      console.log('点击点赞');
      console.log(options);
      console.log(options.currentTarget.dataset.value);
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
      //这里的第一个 750 对应 css .charts 的 width
      const cWidth = 350 / 750 * wx.getSystemInfoSync().windowWidth;
      //这里的 500 对应 css .charts 的 height
      const cHeight = 200 / 750 * wx.getSystemInfoSync().windowWidth;
      //这里的第一个 750 对应 css .charts 的 width
      const cWidth2 = 300 / 750 * wx.getSystemInfoSync().windowWidth;
      //这里的 500 对应 css .charts 的 height
      const cHeight2 = 300 / 750 * wx.getSystemInfoSync().windowWidth;
      //这里的第一个 750 对应 css .charts 的 width
      const cWidth3 = 300 / 750 * wx.getSystemInfoSync().windowWidth;
      //这里的 500 对应 css .charts 的 height
      const cHeight3 = 300 / 750 * wx.getSystemInfoSync().windowWidth;
      this.setData({ cWidth, cHeight,cWidth2, cHeight2 });
      this.getServerData();
      this.getServerData2();
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