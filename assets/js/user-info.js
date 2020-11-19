var form = layui.form

// 给表单设置自定义的校验规则 首先昵称
form.verify({
    nickname: function (val) {
        if (val.length > 6) {
            return "请输入1 ~ 6个字符"
        }
    }
})

getUserinfo()


var layer = layui.layer
// 获取用户的基本信息 ajax
function getUserinfo() {
    $.ajax({
        method: "get",
        url: "/my/userinfo",
        success: function (res) {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg("获取用户信息失败！")
            }
            // 调用 form.val()快速为表单赋值
            // 参数1：为那个表单这个表单必须有lay-filter 就是当前这个值
            // 参数2：是当前赋值的数据
            form.val("filter", res.data)
        }
    })
}


// 实现表单的重置效果
$("#btnReset").on("click", function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault()
    getUserinfo()
})


// 更新用户信息
// // 监听表单提交事件
$(".layui-form").on("submit", function (e) {
    e.preventDefault()
    $.ajax({
        method: "post",
        url: "/my/userinfo",
        data: $(this).serialize(),
        success: function (res) {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg("更改用户信息失败")
            }
            layer.msg("更改用户信息成功")

            $(".layui-form")[0].reset()
            // 在iframe 的子页面中调用父页面的获取用户信息的方法
            // window是iframe的window窗口
            //  window.parent 找到是全局的html，如果加了$(function ())代表局部的函数，全局范围就没办法拿到 局部的方法和属性
            window.parent.getUserInfo()
        }
    })
})
