// pages/logout/logout.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    count:3,
    showCamera:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
 logout:function() {
   console.log("退出登录");
   app.globalData.userDetail = null;
   wx.setStorageSync('user', null);
   wx.reLaunch({
    url: '../../pages/me/me'
  });
 },
 takePhoto() {
  const ctx = wx.createCameraContext()
  ctx.takePhoto({
  quality: 'high',
  success: (res) => {
    this.setData({
    src: res.tempImagePath //返回的路径 可以作为src显示在页面上
    });
  wx.uploadFile({
    url: 'http://43.143.224.181:3000/V2/api/File/Image',//'https://www.himitdms.com:3001/V2/api/File/Image',
    filePath: this.data.src,
    name: "file",
    header: {
      "content-type": "multipart/form-data"
    },
    success:(res)=> {
      console.log("上传返回",res)
      if (res.statusCode == 200) {
        wx.showToast({
          title: "上传成功",
          icon: "none",
          duration: 1500
        });
        // this.data.imgs.push(JSON.parse(res.data).data)
        this.setData({
          imgs: this.data.imgs.concat(this.data.src)
        });
        wx.showToast({
          title: "跳转到扫场所码",
          icon: "none",
          duration: 3000
        });
        wx.scanCode({
          onlyFromCamera: true,
          success :(res) =>{
            var scanret = res.result;
            if(!(scanret.indexOf("DMSYY")>=0))
            {
              wx.showToast({
                title:'无效条码请重扫',
                icon:'error'
              });
              return;  
            }
            this.setData(
              {
                scanret:scanret
              }
            );
            try{
              wx.request({
                url: app.globalData.serverurl + app.globalData.swversion + '/api/ClockIn2/'+ app.globalData.userDetail.userID + '/' + scanret,
                method:"POST",
                success:(res)=>{
                  this.setData({
                    retmsg:res.statusCode
                  });
                  if(res.statusCode == 200){
                    let datas = res.data;
                    console.log(res.data);
                    datas.forEach( (item, index)=> {
                      console.log(index + '返回信息：' + datas[index].msg);
                      if(datas[index].msg.indexOf("重复打卡")>=0){
                        wx.showToast({
                          title:'重复卡不上传'
                        });
                        return;
                      }
                      else{
                        if(datas[index].msg.indexOf("退卡")>=0){
                            var element = [{
                              time: datas[index].msgtimestamp,
                              con: datas[index].msg,
                              isRedDot:true
                            }]
                        }else if(datas[index].msg.indexOf("打卡")>=0)
                        {
                            var element = [{
                              time: datas[index].msgtimestamp,
                              con: datas[index].msg,
                              isRedDot:false
                            }]
                        }
                      }
                        this.setData({
                        // list:this.data.list.concat(element)
                        list:element.concat(this.data.list)
                      });
                      wx.showToast({
                        title:'打卡成功'
                      });
                    })
                  }
                },
                fail:(rest)=>{
                  console.log(rest);
                  this.setData({
                    retmsg:"执行上传失败"+rest.errMsg
                  });
                }
              });
            }
            catch(e){
              console.log(e);
              this.setData({
                retmsg:e.errMsg
              });
            }
          }
        });
      }
    },
    fail: function (err) {
      console.log('上传失败原因',err);
      wx.showToast({
        title: "上传失败",
        icon: "none",
        duration: 2000
      })
    },
    complete: function (result) {
      console.log('上传完成',result.errMsg)
    }
  });
  }
  });
  },

  bindUpload: function (e) {
    switch (this.data.imgs.length) {
      case 0:
        this.data.count = 3
        break
      case 1:
        this.data.count = 2
        break
      case 2:
        this.data.count = 1
        break
    }
    var that = this
    wx.chooseImage({
      count: that.data.count, // 默认3
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: 'https://www.himitdms.com:3001/V2/api/File/Image',
            filePath: tempFilePaths[i],
            name: "file",
            header: {
              "content-type": "multipart/form-data"
            },
            success:(res)=> {
              console.log("上传返回",res)
              if (res.statusCode == 200) {
                wx.showToast({
                  title: "上传成功",
                  icon: "none",
                  duration: 1500
                })
   
                that.data.imgs.push(JSON.parse(res.data).data)
   
                that.setData({
                  imgs: that.data.imgs
                })
              }
            },
            fail: function (err) {
              console.log('上传失败原因',err);
              wx.showToast({
                title: "上传失败",
                icon: "none",
                duration: 2000
              })
            },
            complete: function (result) {
              console.log('上传完成',result.errMsg)
            }
          })
        }
      }
    })
  },
  // 删除图片
  deleteImg: function (e) {
    var that = this
    wx.showModal({
      title: "提示",
      content: "是否删除",
      success: function (res) {
        if (res.confirm) {
          for (var i = 0; i < that.data.imgs.length; i++) {
            if (i == e.currentTarget.dataset.index) that.data.imgs.splice(i, 1)
          }
          that.setData({
            imgs: that.data.imgs
          })
        } else if (res.cancel) {
          console.log("用户点击取消")
        }
      }
    })
  },  
  getPhoto() {
    // c创建相机上下文对象,获取唯一的相机对象
    var context = wx.createCameraContext()
    // 照相功能
    context.takePhoto({
      quality: "high",
      success: res => {
        // 照相成功的回调
        console.log(res);  // 图片的信息
        this.setData({
          // 隐藏相机
          //  showCamera:false,
          imageUrl: res.tempImagePath,
          imgwidth: res.width,
          imgheight: res.height
        })
        console.log(this.data.imageUrl)
      },
      fail: () => {
        wx.showToast({
          title: '出现错误',
        })
      }
    })
  },// 相机前后镜头转换
  changePos() {
    this.setData({
      cameraPos: this.data.cameraPos == "back" ? "front" : "back"
    })
  },
// 关闭相机
  goBack() {
    this.setData({
      showCamera: false,
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