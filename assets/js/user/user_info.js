// @ts-nocheck
$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return ('1~6个字符之间')
            }
        }
    })


    initUserinfo()
        // 初始化用户基本信息
    function initUserinfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
                form.val('abc', res.data)
            }
        })
    }
    $('#btnReset').on('click', function(e) {
            e.preventDefault();
            initUserinfo()
                // 
        })
        // 监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('更新失败')
                }
                layer.msg('更新成功')
                window.parent.getUserInfo()
            }

        })
    })

})