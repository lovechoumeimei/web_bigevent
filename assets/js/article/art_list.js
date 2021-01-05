// @ts-nocheck
$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function(data) {
            const dt = new Date(data)
            var y = padZero(dt.getFullYear())
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())


            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss


        }
        // 补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 查询参数对象
    var q = {
        pagenum: 1, //当前处于第一页
        pagesize: 2, //每页显示的数据两条
        cate_id: '', //文章分类的ID
        state: '', //文章状态
    }

    initTable()
        // 获取文章列表数据，并渲染
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 渲染列表
                var htmlStr = template('list_tab', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        });
    }

    initCate()
        // 定义一个初始化获取分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                layer.msg('获取文章分类成功')
                var htmlStr = template('list_cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // console.log(res);
                form.render()
            }
        });
    }
    // 表单注册submit提交事件
    $('#form_search').on('submit', function(e) {
            e.preventDefault();
            // 获取表单中选中的值
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val()
                // 把所获取到的值添加到q对象当中
            q.cate_id = cate_id
            q.state = state
            initTable()

        })
        // 第一渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候触发jump
            jump: function(obj, first) {
                // console.log(obj.curr);
                // 把最新的页码值复制到q对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                    // console.log(first);
                    // console.log(obj.curr);
                if (!first) {
                    initTable()
                }
            }
        });

    }

    // 给所有的删除按钮注册点击事件
    $('tbody').on('click', '.btn-delete', function() {
            // console.log(123);
            var id = $(this).attr('data-id')
            var len = $('.btn-delete').length
                // console.log(id);
            layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
                //do something
                $.ajax({
                    type: "GET",
                    url: "/my/article/delete/" + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('删除文章失败')
                        }
                        layer.msg('删除文章成功')


                        if (len === 1) {
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initTable()
                    }
                });

                layer.close(index);
            });
        })
        // 编辑注册点击事件，弹出弹出层
        // $('tbody').on('click', '.btn-edit', function() {
        //         // console.log(123);
        //         var index = layer.open({
        //             type: 1,
        //             area: ['500px', '250px'],
        //             title: '修改文章',
        //             content: $('#dialog-edit').html()
        //         });
        //         // 获取当前点击编辑的id
        //         var id = $(this).attr('data-id')
        //             // console.log(id);
        //         $.ajax({
        //             type: 'GET',
        //             url: '/my/article/' + id,
        //             success: function(res) {
        //                 form.val('form-edit', res.data)
        //             }
        //         });
        //     })
        // 以代理的形式为表单绑定submit事件
        // $('body').on('submit', '#form-edit', function(e) {
        //         // console.log(123);
        //         e.preventDefault();
        //         var fd = new FormData($(this)[0])
        //             // fd.forEach(function(k, v) {
        //             //     console.log(k, v);
        //             // })
        //         listupLoad(fd)
        //     })
        //     // 发起请求
        // function listupLoad(fd) {
        //     $.ajax({
        //         method: 'POST',
        //         url: '/my/article/edit',
        //         data: fd,
        //         contentType: false,
        //         processData: false,
        //         success: function(res) {
        //             // console.log(res);
        //             if (res.status !== 0) {
        //                 return layer.msg('跟新失败')
        //             }
        //             layer.msg('跟新成工')
        //             initTable()
        //         }
        //     })
        // }

})