// @ts-nocheck
$(function() {
    // 调用富文本编辑器

    var layer = layui.layer
    var form = layui.form
    initCate()
    initEditor()

    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                // 渲染
                var htmlStr = template('pup_tle', res)
                $('select').html(htmlStr)
                form.render()
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 给选择封面按钮注册点击事件
    $('#btnimg').on('click', function() {
        // console.log(123);
        $("#coveFile").click()
    })

    // 监听covefile的change事件获取用户选择的文件类表
    $('#coveFile').on('change', function(e) {
        // console.log(e);
        // 获取到文件的列表数组
        var files = e.target.files


        if (files.length === 0) {
            return
        }


        // 根据选择的文件创建一个对应的Url地址
        var newImgURL = URL.createObjectURL(files[0])

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域


    })
    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
            art_state = '草稿'
                // console.log(123);
        })
        // 为表单绑定submit提交事件
    $('#form_pub').on('submit', function(e) {
            e.preventDefault();

            // 基于表单，快速创建一个formdata表单

            var fd = new FormData($(this)[0]);
            fd.append('state', art_state)
                // fd.forEach(function(v, k) {
                //     console.log(k, v);
                // })

            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    fd.append('cover_img', blob)
                    Publist(fd)
                })

        })
        // 发起ajax请求
    function Publist(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})