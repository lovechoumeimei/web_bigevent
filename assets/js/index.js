// @ts-nocheck
$(function() {
        var layer = layui.layer

        // 调用获取用户基本信息
        getUserInfo()
            // 退出注册事件
        $('#tuichu').on('click', function() {
            layer.confirm('确定退出吗?', { icon: 3, title: '提示' }, function(index) {
                //do something
                // 清空本地存储的token
                localStorage.removeItem('token')
                location.href = '/login.html'
                layer.close(index);
            });
        })
    })
    // 获取用户基本信息


function getUserInfo() {
    // 发送获取用户信息请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status != 0) {
                return layui.layer.msg('获取用户信失败')
            }
            // 调用渲染函数
            renderAvatar(res.data)
        },
        // complete: function(res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空token值
        //         localStorage.removeItem('token')
        //             // 强制跳转登录界面
        //         location.href = '/login.html'
        //     }
        // }
    })

}
// 渲染用户的头像
function renderAvatar(user) {
    var name = user.nickname || user.username
        // 设置文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 渲染用户的头像
    if (user.user_pic != null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本投降
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }

}