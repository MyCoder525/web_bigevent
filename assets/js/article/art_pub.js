$(function () {
    const form = layui.form;
    // 获取文章分类
    // 初始化富文本编辑器
    initEditor()
    const initCate = () => {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败！");
                }
                const htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 动态插入的数据  不支持更新 需要手动调用form.render()方法 否则看不到页面的变化
                form.render("select");
            },
        });
    };

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    //模拟文件选择
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //声明文章状态 变量
    let art_state = "已发布"
    $("#btnSave2").click(() => {
        art_state = "草稿"

    })



    //新增文章
    $(".layui-form").submit(function (e) {
        e.preventDefault()
        const fd = new FormData($(this)[0])
        fd.append("state", art_state)

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            });
    });
    //发送请求 新增文章
    const publishArticle = (data) => {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data,
            contentType: false,
            processData: false,
            success: (res) => {
                if (res.status !== 0) return layer.msg('发布文章失败！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'

                window.parent.change()
            },
        });
    };
    //
    //获取文章分类
    initCate();
});