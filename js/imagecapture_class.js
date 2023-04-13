// imagecapture_class.js
"use strict";

class ImageCapture {
  constructor() {
    this.initGrobalVars();
    this.setDomNames();
    this.initCanvas();
    this.initEventListener();
//    this.changeMode("adjustment");
    this.changeMode("setting");
  }

  initGrobalVars() {
    this.videowidth = 800;
    this.videoheight = 450;
    this.streaming = false; //video on/off flag
    this.video = null;
    this.canvas = null;
    this.streamObject = null;
  }

  initCanvas() {
    this.canvas.width = this.videowidth;
    this.canvas.height = this.videoheight;
    this.canvas.style.background = "#aaa";
    this.context = this.canvas.getContext("2d");
  }

  setDomNames() {
    //main elem
    this.video          = document.getElementById("video");
    this.canvas         = document.getElementById("canvas");
    //page
    this.adjustment     = document.getElementById("adjustment");
    this.photograph     = document.getElementById("photograph");
    this.setting        = document.getElementById("setting");
    //button
    this.btnPhotograph1 = document.getElementById("btnPhotograph1");
    this.btnPhotograph2 = document.getElementById("btnPhotograph2");
    this.btnSetting     = document.getElementById("btnSetting");
    this.btnAdjustment  = document.getElementById("btnAdjustment");
    //setting vars
//    this.fileheader     = document.getElementById("fileheader");
  }

  initEventListener() {
    this.photograph.addEventListener("click",      (e) => { e.preventDefault(); this.takePicture(); });
    this.photograph.addEventListener("contextmenu",(e) => { e.preventDefault(); this.changeMode("setting"); });
    this.btnSetting.addEventListener("click",      (e) => { e.preventDefault(); this.changeMode("setting"); });
    this.btnAdjustment.addEventListener("click",   (e) => { e.preventDefault(); this.changeMode("adjustment"); });
    this.btnPhotograph1.addEventListener("click",  (e) => { e.preventDefault(); this.changeMode("photograph"); });
    this.btnPhotograph2.addEventListener("click",  (e) => { e.preventDefault(); this.changeMode("photograph"); });
    this.video.addEventListener("canplay",         (e) => { e.preventDefault(); this.getVideoSize(); });
  }

  changeMode(mode) {
console.log("chageMode()", mode);
this.debuglog("debug1", "chageMode()", mode);
    switch(mode) {
    case "adjustment":
      this.adjustment.style.display = "block";
      this.photograph.style.display = "none";
      this.setting.style.display    = "none";
      this.startVideo();
      break;
    case "photograph":
      this.adjustment.style.display = "none";
      this.photograph.style.display = "block";
      this.setting.style.display    = "none";
      this.startVideo();
      this.drawCanvas();
      break;
    case "setting":
      this.adjustment.style.display = "none";
      this.photograph.style.display = "none";
      this.setting.style.display    = "block";
      this.stopVideo();
      break;
    }
  }

    getVideoSize() {
console.log("video.videoWidth Height", this.video.videoWidth, this.video.videoHeight);
this.debuglog("debug2", "video.videoWidth Height", this.video.videoWidth, this.video.videoHeight);
      this.canvas.width  = this.videowidth  = this.video.videoWidth;
      this.canvas.height = this.videoheight = this.video.videoHeight;
    }

//  clearCanvas() {
//    this.context.fillStyle = "#aaa";
//    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
//  }

  drawCanvas() {
    this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
  }

  takePicture() {
    if (!this.streaming) { return; } //"video is off, can not shutter

    this.drawCanvas();
    this.canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.getElementById("atag");
      a.download = this.makeFilename();
      a.href = url;
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    }, "image/png");
  }

  makeFilename() {
    const now = new Date();
    const yy =  now.getFullYear();
    const mm =  ("0" + (now.getMonth() + 1)).slice(-2);
    const dd =  ("0" + now.getDate()).slice(-2);
    const hh =  ("0" + now.getHours()).slice(-2);
    const mi =  ("0" + now.getMinutes()).slice(-2);
    const ss =  ("0" + now.getSeconds()).slice(-2);
    const fileheader = document.getElementById("fileheader");
    const header = fileheader.value;
    const file = header + yy + mm + dd + hh + mi + ss + ".png";
    return file;
  }

  selectRadioTag(name) {
    const elements = document.getElementsByName(name);
    for (const elem of elements) {
      if (elem.checked) {
        return elem.value;
      }
    }
    return null;
  }

  startVideo() {
    if (this.streaming) {
      console.log("video is aleardy on");
      return;
    }
console.info("入出力デバイスを確認してビデオを開始するよ！");

  const facing = this.selectRadioTag("camera");
  const res = this.selectRadioTag("resolution");
  let ww, hh;
  switch (res) {
  case "low":
    ww = 400;
    hh = 225;
    break;
  case "high":
    ww = { min: 800, max: 1920 };
    hh = { min: 600, max: 1080 };
    break;
  case "middle":
  default:
    ww = 800;
    hh = 450;
    break;
  }
console.log("resolution", res, ww, hh);
console.log("facing", facing);
this.debuglog("debug3", "resolution", res, ww, hh);
this.debuglog("debug4", "facing", facing);

  const constraints = { //カメラ設定
    audio: false,
    video: {
      width: ww,
      height: hh,
      facingMode: facing,
    }
  };

    navigator.mediaDevices.getUserMedia(constraints) //start video camera
    .then((stream) => {
      this.video.srcObject = stream;
      this.video.play();
      this.streamObject = stream;
      this.streaming = true;
    })
    .catch((err) => {
      console.log("An error occurred: " + err);
    });
  }

  stopVideo() {
    if (!this.streaming) {
      console.log("video is off");
      return;
    }
console.info("ビデオを止めるよ！");

    this.streamObject.getVideoTracks()[0].stop(); //stop video camera
    this.video.pause();
    this.streaming = false;
  }

  debuglog(id, msg1, msg2="", msg3="", msg4="") {
    const elem = document.getElementById(id);
    const msgall = msg1 + " " + msg2 + " " + msg3 + " " + msg4;
    elem.innerText = msgall;
  }

}
