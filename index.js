var drag = (function() {

    // 移动方向选项
    var axis = {
        x   : {},
        y   : {},
        all : {}
    };

    // 范围选项
    var auto_size = {
        width  : {},
        height : {}
    };

    // 获取 body，创建全屏遮罩
    var body = document.body;
    var mask = document.createElement('div');

    // 设置全屏遮罩 css
    mask.style.top      = '0';
    mask.style.left     = '0';
    mask.style.right    = '0';
    mask.style.bottom   = '0';
    mask.style.position = 'fixed';

    // 获取窗体尺寸
    var window_width  = window.innerWidth;
    var window_height = window.innerHeight;

    // 更新尺寸
    window.addEventListener('resize', function() {
        window_width  = window.innerWidth;
        window_height = window.innerHeight;
    });

    // option {
    //     axis: 移动方向选项
    //     rect: [x, y, w, h] 移动范围
    // }
    return {
        init: function(node, option) {

            // 设置参数默认值
            option = option || {};
            option.axis = option.axis || axis.all;
            option.rect = option.rect || [0, 0, auto_size.width, auto_size.height];

            // 动态范围开关
            var auto = {
                x: option.rect[2] === auto_size.width,
                y: option.rect[3] === auto_size.height
            };

            // 移动范围引用
            var rect = option.rect;

            // 保存当前 element 部分 css
            var visible = node.style.visibility;
            var user_select = node.style['-moz-user-select'] || node.style['-webkit-user-select'];

            // 当前操作节点
            var temp = null;

            // 记录节点和鼠标初始位置
            var node_pos  = {};
            var mouse_pos = {};

            node.addEventListener('mouseover', function(e) {
                node_pos.x = node.offsetLeft;
                node_pos.y = node.offsetTop;
            });

            node.addEventListener('mousedown', function(e) {

                // 更新动态尺寸
                auto.x && (option.rect[2] = window_width);
                auto.y && (option.rect[3] = window_height);

                // 设置节点不可选，放置鼠标选中文字影响拖拽
                node.style['-moz-user-select'] = 'none';
                node.style['-webkit-user-select'] = 'none';

                var clone = node.cloneNode(true);

                // 设置克隆元素默认 css
                clone.style.top      = node_pos.y + 'px';
                clone.style.left     = node_pos.x + 'px';
                clone.style.position = 'absolute';

                // 原节点隐藏显示
                node.style.visibility = 'hidden';

                // 插入 clone 元素及遮罩
                body.appendChild(clone);
                body.appendChild(mask);

                // 设置当前操作节点
                temp = clone;

                // 记录移动初始位置
                mouse_pos.x = e.pageX;
                mouse_pos.y = e.pageY;
            });

            // 有操作结点时触发回调
            function active(call) {
                return function() {
                    var args = Array.prototype.slice.call(arguments);
                    temp && call.apply(this, args);
                }
            }

            // 设置移动范围
            if (option) {
                if (option.axis === axis.x) {
                    mask.onmousemove = active(function(e) {

                        // 计算移动偏移
                        var offset = node_pos .x + e.pageX - mouse_pos.x;

                        // 计算 x 轴边界
                        var x = rect[0] + rect[2] - temp.offsetWidth;

                        // 设置边界
                        if (offset < rect[0]) offset = rect[0];
                        if (offset > x)       offset = x;

                        temp.style.left = offset + 'px';
                    });
                }

                if (option.axis === axis.y) {
                    mask.onmousemove = active(function(e) {

                        // 计算移动偏移
                        var offset = node_pos .y + e.pageY - mouse_pos.y;

                        // 计算 y 轴边界
                        var y = rect[1] + rect[3] - temp.offsetHeight;

                        // 设置边界
                        if (offset < rect[1]) offset = rect[1];
                        if (offset > y)       offset = y;

                        temp.style.top = offset + 'px';
                    });
                }

                if (option.axis === axis.all) {
                    mask.onmousemove = active(function(e) {

                        // 计算移动偏移
                        var offset = {
                            x: node_pos .x + e.offsetX - mouse_pos.x,
                            y: node_pos .y + e.pageY - mouse_pos.y
                        };

                        // 设置左上边界
                        if (offset.x < rect[0]) offset.x = rect[0];
                        if (offset.y < rect[1]) offset.y = rect[1];

                        // 计算右下边界值
                        var x = rect[0] + rect[2] - temp.offsetWidth;
                        var y = rect[1] + rect[3] - temp.offsetHeight;

                        // 设置右下边界
                        if (offset.x > x) offset.x = x;
                        if (offset.y > y) offset.y = y;

                        temp.style.top  = offset.y + 'px';
                        temp.style.left = offset.x + 'px';
                    });
                }
            }

            var cancel = active(function(e) {

                // 删除克隆元素及遮罩
                body.removeChild(temp);
                body.removeChild(mask);

                //  恢复节点默认 css 属性
                node.style.visibility = visible;
                node.style['-moz-user-select']    = user_select;
                node.style['-webkit-user-select'] = user_select;

                // 置空当前操作节点
                temp = null;
            });

            mask.onmouseleave = cancel;
            mask.onmouseup    = cancel;
        },

        x   : axis.x,
        y   : axis.y,
        all : axis.all,

        width  : auto_size.width,
        height : auto_size.height
    }
})();
