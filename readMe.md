// 
// pc基本没毛病
// 1.android 未实现new File() 类,建议返回base64
// 2.ios下横屏,倒屏图片有旋转角的问题。建议旋转完再调。



//方式
const img_compress = require("img_compress");

//参数
new img_compress({
        file: File, // 文件流
        encoderOptions: 0.92, // 压缩质量
        needFormData: false,  // 以form-data 对象返回
        expectBase64: false, //  以base64返回
        //默认返回File对象
 });

 返回值为一个promise

 所以 const targetObj  =  new img_compress({...}); targetObj.then(res=>{})
 或者 await new img_compress({...})
# imgCompress
