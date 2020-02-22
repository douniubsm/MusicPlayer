// 实现页面渲染
(function ($, root) {
    function renderImg (src) {
        const img = new Image()
        img.src = src
        img.onload = function () {
            $('.img-box img').attr('src', src)
            root.blurImg(img, $('body'))
        }
    }
    function renderInfo (data) {
        const str = `<div class="song-name">${data.song}</div>
        <div class="singer-name">${data.album}</div>
        <div class="album-name">${data.singer}</div>`
        $('.song-info').html(str)
    }
    function renderLike (like) {
        if (like) {
            $('.control .like .icon-xihuan1').css({display: "block"})
        } else {
            $('.control .like .icon-xihuan').css({display: "block"})
        }
    }

    root.render = function (data) {
        renderImg(data.image)
        renderInfo(data)
        renderLike(data.isLike)
    }
}(window.Zepto, window.player || (window.player = {})))