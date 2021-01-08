// @ts-nocheck
$(function() {
    $('#link_reg').on('click', function(e) {

        $('.login_box').hide()
        $('.reg_box').show()
    })
    $('#link_login').on('click', function() {
        // console.log(123);
        $('.reg_box').hide()
        $('.login_box').show()
    })

    /* 登录密码校验 */
    var form = layui.form
    var layer = layui.layer
    form.verify({
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],

            // 注册密码校验两次密码是否一致
            repwd: function(value) {
                // 通过value拿确认到密码框里的内容
                // 拿到密码框里的值
                var pwd = $('.reg_box [name=password]').val()
                if (pwd != value) {
                    return '两次密码不一致'
                }
            }

        })
        // 监控注册表单的提交事件

    $('#form_reg').submit(function(e) {
        console.log(123);
        e.preventDefault();
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post("/api/reguser", data,
            function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功');
                $('#link_login').click()
            });
    });
    // 监控登录表单的提交事件
    $('#form_login').submit(function(e) {
        // console.log(123);
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "POST",
            // 快速获取表单中的元素
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('登录失败')

                }
                layer.msg('登录成功')
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })

})