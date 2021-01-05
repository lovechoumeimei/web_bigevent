// @ts-nocheck
$(function() {
    var layer = layui.layer
    var form = layui.form
        // 获取文章分类的列表
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                var strhtml = template('tpl-table', res)
                $('tbody').html(strhtml)
            }
        });
    }
    // 注册点击事件弹出弹出层
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加类别',
            content: $('#dialog-add').html()
        });
        // 通过事件委托给form-add添加submit事件
        $('body').on('submit', '#form-add', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('新增文章分类失败')
                    }
                    initArtCateList()
                    layer.msg('新增文章分类成功')
                    layer.close(indexAdd)
                }
            })
        })

    })



    // 编辑按钮注册点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // console.log(123);
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改类别',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id')
            // console.log(id);
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        });
    })

    // 代理形式为编辑表单进行submit绑定事假 
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('跟新失败')
                }
                layer.msg('更新数据分类成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理的形式为删除绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {

        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')

                    layer.close(index)
                    initArtCateList()
                }
            })


        })
    })
})