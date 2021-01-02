// @ts-nocheck
// 每次调用ajax或get或post都会调用此函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // 统一权限接口，设置headers请求头
    if (options.url.indexOf !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    options.complete = function(res) {
        console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token值
            localStorage.removeItem('token')
                // 强制跳转登录界面
            location.href = '/login.html'
        }
    }

})