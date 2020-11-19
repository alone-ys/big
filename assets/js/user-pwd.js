var form = layui.form
form.verify({
    password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 新增一个校验规则。新旧密码不能为空
    //给新密码框与旧的做对比
    samePwd: function (val) {
        // 属性选择器获取旧密码框的值
        if (val === $('[name=oldPwd]').val()) {
            return "新旧密码不能相同"
        }

    },
    // 新密码与再次输入密码做对比
    rePwd: function (val) {
        if (val !== $('[name=newPwd]').val()) {
            return "新密码与再次确认密码必须相同"
        }
    }

})
var layer = layui.layer
// 重置表单密码
$(".layui-form").on("submit", function (e) {
    e.preventDefault()
    $.ajax({
        method: "post",
        url: "/my/updatepwd",
        data: $(this).serialize(),
        success: function (res) {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg("重置密码失败！")
            }
            layer.msg("重置密码成功！")
            // 重置表单
            $(".layui-form")[0].reset()
        }
    })
})