
// $.ajaxPrefilter(function (option) {
//     option.url = "http://ajax.frontend.itheima.net" + option.url
//     console.log(option.url)

//     // 请求头配置对象
//     // 响应头
//     // 判断路径里面是否包含 字符 /my/
//     if (option.url.indexOf('/my/') !== -1) {
//         // 如果有就直接获取headers 
//         option.headers = {
//             //获取之前在本地存储的token值 
//             Authorization: localStorage.getItem("token") || ""
//         }
//     }


//     // 全局访问complete函数
//     // 请求成功还是失败，都会调用complete这个函数
//     option.complete = function (res) {
//         // console.log("执行了complete 回调") 
//         console.log(res)
//         //  res.responseJSON就是当前拿到服务器的数据
//         if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
//             // 强制清空token
//             localStorage.removeItem("token")
//             // 强制跳转到登录页面
//             location.href = "login.html"
//         }

//     }

// })

