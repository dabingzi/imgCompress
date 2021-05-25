function compress(opts) {
  this.options = opts || {
    encoderOptions: 0.92,
    file: "",
    needFormData: false,
    expectBase64: false, //
    type: "image/jpeg",
  };
  const { file } = this.options;
  return this.readImgFile(file);
}
compress.prototype = {
  readImgFile(file) {
    let that = this;
    return new Promise(function (resolve, reject) {
      let reader = new FileReader();
      reader.onload = function () {
        let img = new Image();
        img.src = reader.result;
        if (img.complete) {
          resolve(that.toBuffer(img, file.name));
        } else {
          img.onload = function () {
            resolve(that.toBuffer(img, file.name));
          };
        }
      };
      reader.readAsDataURL(file);
    });
  },
  toBuffer(img, fileName) {
    let imgBase64 = this.canvasCompressImg(img);
    let fileBuffer = this.formatBase64ToUnicode(imgBase64, fileName);
    let formData = new FormData();
    formData.append("file", fileBuffer);
    return this.options.expectBase64
      ? imgBase64
      : this.options.needFormData
      ? formData
      : fileBuffer;
  },

  canvasCompressImg(img) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    let canvasBak = document.createElement("canvas");
    let smallCanvas = canvasBak.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    let count,
      width = img.width,
      height = img.height;
    let ratio;
    if ((ratio = (width * height) / 4000000) > 1) {
      ratio = Math.sqrt(ratio);
      width /= ratio;
      height /= ratio;
    } else {
      ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height); //png

    if ((count = (width * height) / 1000000) > 1) {
      count = ~~(Math.sqrt(count) + 1);
      let nw = ~~(width / count);
      let nh = ~~(height / count);
      canvasBak.width = nw;
      canvasBak.height = nh;
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          smallCanvas.drawImage(
            img,
            i * nw * ratio,
            j * nh * ratio,
            nw * ratio,
            nh * ratio,
            0,
            0,
            nw,
            nh
          );
          ctx.drawImage(canvasBak, i * nw, j * nh, nw, nh);
        }
      }
    } else {
      ctx.drawImage(img, 0, 0, width, height);
    }
    return canvas.toDataURL(this.options.type, this.options.encoderOptions);
  },

  formatBase64ToUnicode(base64Data, fileName) {
    let arr = base64Data.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]);
    let n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  },
};

module.exports = compress;
