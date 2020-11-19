// 调用 获取用户的基本信息
getUserInfo()

var layer = layui.layer
// 点击退出按钮，实现退出功能
$("#btnBack").on("click", function () {
    // layui 提供的提示信息
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
        //do something
        // 1.清空本地存储tonken
        localStorage.removeItem("token")
        // 2.重新跳转登录页面
        location.href = "login.html"
        // 关闭confirm 询问框 
        layer.close(index);
    });
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "get",
        url: "/my/userinfo",
        // 响应头
        // headers: {
        //     //获取之前在本地存储的token值 
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            console.log(res)
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败！")
            }
            // 渲染用户的头像和名字
            getpic(res.data)
        },

    })
}

// 渲染用户头像
function getpic(user) {
    // 判断如果用户有nickname 就设置nickname 值，没有就设置username值
    var uname = user.nickname || user.username
    $("#welcome").html("欢迎&nbsp;&nbsp;" + uname)
    // 判断用户是否有user_pic图片头像 有就用这个，没有就用文字头像
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr("src", user.user_pic).show()
        // 文件头像隐藏
        $(".text-avatar").hide()
    } else {
        $(".text-avatar").html(uname[0].toUpperCase()).show()
        $(".layui-nav-img").hide()

    }

}