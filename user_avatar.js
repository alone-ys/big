$(function () {
    let layer = layui.layer
    //点击上传按钮  触发文件域
    $("#btnChooseImage").on('click', function () {
        //文件域点击事件
        $("#file").click()
    });

    //配置选项
    const options = {
        //设置剪裁容器的比例。
        aspectRatio: 1,
        //指定预览区域 类型：String(jQuery选择器)
        preview: '.img-preview'
    }

    //预设
    $("#image").cropper(options);


    //文件域添加 监听事件
    $("#file").on('change', function (e) {
        //获取文件列表
        let files = e.target.files

        //判断是否有文件
        if (files.length === 0) {
            return '请选择文件'
        };

        //获取具体文件
        let file = e.target.files[0];

        //将文件转为地址  URL.createObjectURL()
        let imgUrl = URL.createObjectURL(file)
        // console.log(imgUrl);

        $("#image").cropper('destroy').attr('src', imgUrl).cropper(options)

    });

    $("#btnUpload").on('click', function () {
        // 1. 要拿到用户裁剪之后的头像
        var dataURL = $("#image")
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            headers: {
                Authorization: localStorage.getItem('token')
            },
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) return layer.msg("更换头像失败")
                layer.msg("更换头像成功")
                //重新渲染
                window.parent.getUserInfo()
            }
        })

    })


})