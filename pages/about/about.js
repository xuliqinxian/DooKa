// pages/about/about.js
var app = getApp();
import uCharts from '../../utils/u-charts.js';
var uChartsInstance = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appswversion:'',
    cWidth: 750,
    cHeight: 500,
    longitude:'113.08093',
    latitude:'28.24595',
    location:'',
    markers: [{          // 对应wxml文件中的markers变量
     id: 0,
     latitude: 0,
     longitude: 0,
     width: 50,
     height: 50
   }],
   inter:100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      appswversion:app.globalData.appswversion
    });
    this.startInter();
  },
/**
   * 启动定时器
   */
  startInter : function(){
    var that = this;
    this.setData({
      inter : setInterval(
        function () {
            // TODO 你需要无限循环执行的任务
            console.log('setInterval 每过5000毫秒执行一次任务')
            wx.getLocation({
      type: 'gcj02',//'wgs84',
      success: (res)=> {
        console.log('读取坐标返回',res);
        var location = res.latitude.toFixed(2) + ',' + res.longitude.toFixed(2);
        that.setData({
           latitude:res.latitude,
           longitude:res.longitude,
           markers: [{
             id:1,
             latitude: res.latitude,
             longitude: res.longitude,
             width:50,
             height:50,
             }],
             location:location
        });
        const speed = res.speed;
        const accuracy = res.accuracy;
      }
     });
        }, 5000)
    })
  },
  /**
   * 结束定时器
   */
  endInter: function(){
    clearInterval(this.data.inter)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    //这里的第一个 750 对应 css .charts 的 width
    const cWidth = 750 / 750 * wx.getSystemInfoSync().windowWidth;
    //这里的 500 对应 css .charts 的 height
    const cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    this.setData({ 
      cWidth:cWidth, 
      cHeight:cHeight 
    });
    this.getServerData();
  },
  getServerData() {
    //模拟从服务器获取数据时的延时
    setTimeout(() => {
      //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
      let res = {
        categories: ["2018","2019","2020","2021","2022","2023"],
        series: [
          {
            name: "曲面",
            type: "area",
            style: "curve",
            data: [70,50,85,130,64,88]
          },
          {
            name: "柱1",
            index: 1,
            type: "column",
            data: [40,{"value":30,"color":"#f04864"},55,110,24,58]
          },
          {
            name: "柱2",
            index: 1,
            type: "column",
            data: [50,20,75,60,34,38]
          },
          {
            name: "曲线",
            type: "line",
            style: "curve",
            color: "#1890ff",
            disableLegend: true,
            data: [70,50,85,130,64,88]
          },
          {
            name: "折线",
            type: "line",
            color: "#2fc25b",
            data: [120,140,105,170,95,160]
          },
          {
            name: "点",
            index: 2,
            type: "point",
            color: "#f04864",
            data: [100,80,125,150,112,132]
          }
        ]
      };
      this.drawCharts('rkUUzgrXDwwzNOZFeqIQxKSubnuNzYxn', res);
    }, 500);
  }, 
  drawCharts(id,data){
    const ctx = wx.createCanvasContext(id, this);
    uChartsInstance[id] = new uCharts({
        type: "mix",
        context: ctx,
        width: this.data.cWidth,
        height: this.data.cHeight,
        categories: data.categories,
        series: data.series,
        animation: true,
        background: "#FFFFFF",
        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
        padding: [15,15,0,15],
        enableScroll: true,
        legend: {},
        xAxis: {
          disableGrid: true,
          title: "单位：年",
          scrollShow: true,
          itemCount: 4
        },
        yAxis: {
          disabled: false,
          disableGrid: false,
          splitNumber: 5,
          gridType: "dash",
          dashLength: 4,
          gridColor: "#CCCCCC",
          padding: 10,
          showTitle: true,
          data: [
            {
              position: "left",
              title: "折线"
            },
            {
              position: "right",
              min: 0,
              max: 200,
              title: "柱状图",
              textAlign: "left"
            },
            {
              position: "right",
              min: 0,
              max: 200,
              title: "点",
              textAlign: "left"
            }
          ]
        },
        extra: {
          mix: {
            column: {
              width: 20
            }
          }
        }
      });
  },
  tap(e){
    uChartsInstance[e.target.id].scrollEnd(e);
    uChartsInstance[e.target.id].touchLegend(e);
    uChartsInstance[e.target.id].showToolTip(e);
  },
  touchstart(e){
    uChartsInstance[e.target.id].scrollStart(e);
  },
  touchmove(e){
    uChartsInstance[e.target.id].scroll(e);
  },
  getLocation:function (e) {
    wx.getLocation({
      type: 'wgs84',
      success: (res)=> {
        console.log(res);
        this.setData({
           latitude:res.latitude,
           longitude:res.longitude
        })
        const speed = res.speed;
        const accuracy = res.accuracy;
      }
     });
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
    this.endInter();
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