$(function () {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 引入layui.js 自动注入对象自动生成form属性 
    var form = layui.form
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        // 以数组的形式 参数1正则匹配  参数2，匹配不符时的提示文字
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 属性选择器
            var pas = $(".reg-box [name=password] ").val()
            if (pas !== value) {
                return "两次密码不一致"
            }
        },
    })


    // layui 里面的提交失败的样式
    var layer = layui.layer
    // 给注册页面一个表单提交事件
    $("#form_reg").on("submit", function (e) {
        e.preventDefault()
        // 获取表单数据
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        }
        $.ajax({
            method: "post",
            url: "/api/reguser",
            data: data,
            success: function (res) {
                console.log(res)
                if (res.status != 0) {
                    // 
                    return layer.msg(res.message)
                }
                console.log("")
                layer.msg("注册成功")
                // 注册成功以后默认自动跳转到登录页面
                $("#link_login").click()
            }
        })

    })


    // 给登录页面一个submit监听事件
    $("#form_login").on("submit", function (e) {
        e.preventDefault(e)
        $.ajax({
            method: "post",
            url: "/api/login",
            // 快速获取表单的值，返回一个字符串
            data: $(this).serialize(),
            success: function (res) {
                console.log("请先注册")
                console.log(res)
                if (res.status !== 0) {
                    // 
                    return layer.msg(res.message)
                }
                layer.msg("注册成功")
                // 将登录成功的token 字符串，保存到localStorage本地
                localStorage.setItem("token", res.token)
                // 跳转到后台主页 
                // location.href=  跳转页面
                // location.assign("index.html")
                location.href = "index.html"
            }

        })

    })


})