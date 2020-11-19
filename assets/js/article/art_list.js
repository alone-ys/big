// 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
}

//  请求文章列表数据并使用模板引擎渲染列表结构
// 定义获取文章列表数据的方法
getList()
function getList() {
    $.ajax({
        method: "get",
        url: "/my/article/list",
        data: q,
        success: function (res) {
            console.log(res)
            var htmlList = template("tpl-table", res)
            $("tbody").html(htmlList)

            // 渲染分页
            renderPage(res.total)
        }
    })
}


// 设置时间的过滤器
template.defaults.imports.dataTime = function (data) {
    var dt = new Date(data)
    var y = dataZero(dt.getFullYear())
    var m = dataZero(dt.getMonth() + 1)
    var d = dataZero(dt.getDate())
    var hh = dataZero(dt.getHours())
    var mm = dataZero(dt.getMinutes())
    var ss = dataZero(dt.getSeconds())
    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss

}
// 时间补0函数
function dataZero(dat) {
    return dat < 10 ? "0" + dat : dat
}

// 发起请求获取并渲染文章分类的下拉选择框
// 初始化文章分类的方法
var form = layui.form
initCate()
function initCate() {
    $.ajax({
        method: "get",
        url: "/my/article/cates",
        success: function (res) {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg('获取分类数据失败！')
            }
            layer.msg('获取分类数据成功！')
            var htmlList = template("tpl-cate", res)
            $("[name=cate_id]").html(htmlList)
            // 通过 layui 重新渲染表单区域的UI结构
            //layui提供的  有新的标签需要重新渲染一下
            form.render()
        }
    })
}

// 实现筛选 submit 的功能
$("#form-search").on("submit", function (e) {
    e.preventDefault()
    // 获取表单的中所有分类的值，和状态的值
    // 分别给列表区域
    var cate_id = $("[name=cate_id]").val()
    var state = $("[name=state]").val()
    // console.log(state)
    // 列表的q 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state

    // console.log(q.state)

    // 继续重新获取请求重新渲染列表数据
    getList()

})


// 定义渲染分页的方法
// 在文章列表的数据获取之后就需要 调用渲染分页的方法了
// 因为我们需要获取数据的总数
// 调用 laypage.render() 方法来渲染分页的结构
var laypage = layui.laypage
function renderPage(total) {
    // console.log(total)
    //执行一个laypage实例
    //laypage  里面有一个 render()方法 渲染分页的结构 来设置基础参数
    laypage.render({
        elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号 是装分页内容的容器
        count: total,//数据总数，从服务端得到
        limit: q.pagesize, // 每页显示几条数据
        curr: q.pagenum,// 设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],  //分页的样式
        limits: [2, 3, 5, 10],// 每页展示多少条
        // 在jump回调函数中通过obj.curr获取到最新的页码值
        // 分页发生切换的时候，触发 jump 回调渲染分页的
        // jump第一种触发 :点击页码才可以触发jump 分页发生切换的时候，first 值为undefined
        //jump 第二种触发 只要调用 laypage.render()就会触发jump 方法  然后触发 获取列表 getList()
        // first 值为true 会出现死循环所有用第一种触发 
        jump: function (obj, first) {
            // obj.curr 是layui 提供的最新的页码值
            q.pagenum = obj.curr
            // obj.limit 最新的条目数
            q.pagesize = obj.limit
            // 根据最新的 q 获取对应的数据列表，并渲染表格
            if (!first) {
                // 重新获取重新渲染页面
                getList()
            }

        }
    });

};

// // 点击删除 删除对应的数据
// // 同样需要自定义  ID值，获取对应的数据
$("body").on("click", ".btn-delete", function (e) {
    // 根据当前页面的删除按钮的个数来判断还有几条数据
    var length = $(".btn-delete").length
    console.log(length)
    // 获取自定义的ID 的值
    var id = $(this).attr('data-id')
    layer.confirm('确认要删除?', { icon: 3, title: '提示' }, function (index) {
        //do something
        $.ajax({
            method: "get",
            url: "/my/article/delete/" + id,
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg("删除列表失败！")
                }
                layer.msg("删除列表成功！")

                // 删除的bug 
                // 这里是因为我们点击页码值的时候会自动getList() ，渲染分页renderPage()
                // 触发 jump函数回调，又会获取q 里面的页码值继续 getList() 所以必须判断一下当前页面数据是否为0
                // 如果为0，就页码值 - 1
                // 长度为1，点击删除后，就没有数据了
                if (length === 1) {
                    // 点击删除后，就没有数据了
                    // 这里还要判断页码值 是否为1，为1就还是当前的1，不为1 就-1
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    
                }
                //获取文章分类的列表 渲染到页面
                getList()




            }
        })
        // 关闭对应的弹出层
        layer.close(index);

    })

})


