(function ($, root) {
    function Control (len) {
        this.index = 0
        this.len = len
    }
    Control.prototype = {
        prev: function () {
            return this.getIndex(-1)
        },
        next: function () {
            return this.getIndex(1)
        },
        getIndex: function (val) {
            let index = this.index
            let len = this.len
            let curIndex = (index + val + len) % len
            this.index = curIndex
            return curIndex
        }
    }
    root.indexControl = Control
} (window.Zepto, window.player || (window.player = {})))