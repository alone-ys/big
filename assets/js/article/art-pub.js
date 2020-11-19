
var layer = layui.layer
var form = layui.form
// 获取文章类别的请求
getCate()


function getCate() {
    $.ajax({
        method: "get",
        url: "/my/article/cates",
        success: function (res) {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg("初始化文章分类失败！")
            }
            layer.msg("初始化文章分类成功！")
            var htmlStr = template("tpl-cate", res)
            $("[name=cate_id]").html(htmlStr)

            // 最后用layui的方法渲染
            form.render()

        }
    })
}

// 初始化富文本编辑器
initEditor()

// 实现基本裁剪效果
// 1. 初始化图片裁剪器
var $image = $('#image')

// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
}

// 3. 初始化裁剪区域
$image.cropper(options)

// 为选择封面按钮添加文件上传功能

$("#btnChooseImage").on("click", function () {
    $("#coverFile").click()
})

// 将选择的图片设置到裁剪区域中
// change 事件，获取用户选择的文件列表
$("#coverFile").on("change", function (e) {
    // 用files 获取文件的列表数组

    var files = e.target.files
    console.dir(e.target)
    console.log(e.target)
    // console.log(files)
    // 判断用户是否选择了文件
    if (files.length === 0) {
        return
    }
    // 根据文件创建对应的url 
    // h5 新增的一个对象 URL，有一个属性 createObjectURL
    // 2. 将文件，转化为路径
    var imgUrl = URL.createObjectURL(files[0])
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgUrl) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域

})
// 定义一个全局的文章状态
var art_state = "已发布";

// 当点击存为草稿的时候，当前文章的状态为 “草稿”
$("#btnSave").on("click", function () {
    art_state = "草稿"
})

// 监听这个表单 submit 获取当前数据
$("#form-pub").on("submit", function (e) {
    e.preventDefault()
    // 基于form表单，快速创建一个formData 对象
    // 获取当前里面的数据
    var fd = new FormData($(this)[0])
    // 3. 将文章的发布状态，存到 fd 中
    fd.append('state', art_state)
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280,
        })
        // h5 新增的转换之后再执行回调函数的代码
        .toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob)

            // 发起ajax请求 
            publishArticle(fd)

        })

})
// 发起Ajax请求实现发布文章的功能
function publishArticle(fd) {
    $.ajax({
        method: "post",
        url: "/my/article/add",
        data: fd,
        // 必须添加以下两个配置项
        contentType: false,  //当前数据格式不设置，原样发送服务器
        processData: false,  //不进行编码，原样发送服务器
        success: function (res) {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg("发表文章失败！")
            }
            layer.msg("发表文章成功！")
            // 发布文章成功后，跳转到文章列表页面
            location.href = "art_list.html"
        }
    })
}



