article()
// 获取文章分类的列表
function article() {
    $.ajax({
        method: "get",
        url: "/my/article/cates",
        success: function (res) {
            console.log(res)
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
        }
    })
}

var layer = layui.layer
// 点击添加类别 弹出一个弹出层 

// 为添加类别按钮绑定点击事件
var indexAdd = null
$("#btnAddCate").on("click", function () {
    // layer.open  弹出层里面可以自定义样式
    indexAdd = layer.open({
        // 
        type: 1,
        area: ['500px', '250px'],
        title: '添加文章分类',
        content: $("#dialog-add").html()
    })

})


// 事件委托，为 form-add 表单绑定 submit 事件
// 添加类别的请求
$("body").on("submit", "#form-add", function (e) {
    e.preventDefault()
    $.ajax({
        method: "post",
        url: "/my/article/addcates",
        data: $(this).serialize(),
        success: function (res) {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg("新增分类失败!")
            }
            //获取文章分类的列表 渲染到页面
            article()
            layer.msg('新增分类成功！')
            // 根据索引，关闭对应的弹出层
            layer.close(indexAdd)
        }

    })
})

var form = layui.form

// 点击编辑按钮展示修改文章分类的弹出层
// 通过 事件委派 的形式，为 btn-edit 按钮绑定点击事件
var indexEdit = null
// 通过事件委托来 btn-edit 编辑按钮 触发点击事件
$("body").on("click", ".btn-edit", function () {
    indexEdit = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '修改文章分类',
        content: $("#dialog-edit").html()

    })

    // 在展示弹出层之后，根据 id 的值发起请求获取文章分类的数据，并填充到表单中
    // 获取当前对应ID的值
    // 自定义一个属性ID
    var id = $(this).attr('data-id')
    console.log(id)
    // 发起请求获取对应分类的数据
    $.ajax({
        method: "get",
        //风格传参的形式 http://my.clcik.com/对应的参数值  
        url: "/my/article/cates/" + id,
        success: function (res) {
            console.log(res)
            // 快速获取表单的值，填充到页面
            form.val("form-edit", res.data)
        }
    })
})

// 给确认修改这个表单一个submit 提交事件
// 通过事件委托
$("body").on("submit", "#form-edit", function (e) {
    e.preventDefault()
    //获取文章分类的列表 渲染到页面
    $.ajax({
        method: "post",
        url: "/my/article/updatecate",
        data: $(this).serialize(),
        success: function (res) {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg("更新类别失败！")
            }
            layer.msg("更新类别成功！")
            //   ///////
            //获取文章分类的列表 渲染到页面
            article()
            // 根据索引，关闭对应的弹出层
            layer.close(indexEdit)

        }

    })

})

// 点击删除 删除对应的数据
// 同样需要自定义  ID值，获取对应的数据
$("body").on("click", ".btn-delete", function (e) {
    var id = $(this).attr('data-id')
    layer.confirm('确认要删除?', { icon: 3, title: '提示' }, function (index) {
        //do something
        $.ajax({
            method: "get",
            url: "/my/article/deletecate/" + id,
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg("删除类别失败！")
                }
                layer.msg("删除类别成功！")
                //获取文章分类的列表 渲染到页面
                article()
                // 关闭对应的弹出层
                layer.close(index);

            }
        })

    })
})