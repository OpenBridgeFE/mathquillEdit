$(function(){
    $("#insert").on('click', function(){
        $("#inBlInput").append(`<li><div class="form-content" style="display: inline-block;">
                    <input class="inputText" value="请输入误差值" type="text">
            </div>
            <button id="originRecord" type="button" class="btn btn-blue">选择原始记录</button></li>`);
      }
    )
    

    
    $("#delete").on("click", function(){
        if($("li").length != 1) {
            $("li:last").remove();
        }
       
    })
    
    var h = $('#headTable td').height();
    $('.arrow-up').css({
        'margin-top':h
    });
    
    var flag = false;
    
    $('#headTable td').unbind("mousedown");
    $('#headTable td').not("td:first").mousedown(function () {
        let startIndex = $(this).index();
        let endIndex;
        flag = true;
        $('#info').css({
            display: 'block'
        });
        $('body').addClass('no-select-text');
        $('#info').html($(this).html());
        $(document).mousemove(function (e) {
            if (flag) {
                var e = e || window.event;
                var x = e.clientX + 5 + 'px';
                var y = e.clientY + 5 + 'px';
                $('#info').css({
                    left: x,
                    top: y
                });
                if (e.preventDefault) {
                    e.preventDefault();
                }
                return false;
            }
            
        });
        
        $('table td').mouseenter(function () {
            endIndex = $(this).index();
            if (endIndex == startIndex) {
                $('#triangle').css('display', 'none');
            } else {
                $('#triangle').css('display', 'block');
            }
            var offsetW = 0;
            var preTd = $(this).prevAll();
            $.each(preTd, function (id, item) {
                offsetW += item.offsetWidth;
            })
            if (endIndex > startIndex) {
                offsetW += $(this)["0"].offsetWidth;
            }
            $('#triangle').css({
                'top': 0,
                'left': offsetW + 4
            });
        });
        $(document).mouseup(function () {
            flag = false;
            $('#triangle').css('display', 'none');
            $('#info').css({
                display:'none'
            });
            if (endIndex < startIndex) {
                $("#mainTable tr").each(function (i) {
                    $('#mainTable tr:eq(' + i + ') td:eq(' + endIndex + ')').before($('#mainTable tr:eq(' + i + ') td:eq(' + startIndex + ')').clone(true));
                    $('#mainTable tr:eq(' + i + ') td:eq(' + (startIndex + 1) + ')').remove();
                    $('#headTable tr:eq(' + i + ') td:eq(' + endIndex + ')').before($('#headTable tr:eq(' + i + ') td:eq(' + startIndex + ')').clone(true));
                    $('#headTable tr:eq(' + i + ') td:eq(' + (startIndex + 1) + ')').remove();
                });
                
            } else if (endIndex > startIndex) {
                $("#mainTable tr").each(function (i) {
                    $('#mainTable tr:eq(' + i + ') td:eq(' + endIndex + ')').after($('#mainTable tr:eq(' + i + ') td:eq(' + startIndex + ')').clone(true));
                    $('#mainTable tr:eq(' + i + ') td:eq(' + (startIndex) + ')').remove();
                    $('#headTable tr:eq(' + i + ') td:eq(' + endIndex + ')').after($('#headTable tr:eq(' + i + ') td:eq(' + startIndex + ')').clone(true));
                    $('#headTable tr:eq(' + i + ') td:eq(' + (startIndex) + ')').remove();
                });
                
            }
            $(document).unbind("mousemove");
            $(document).unbind("mouseup");
            $('table td').unbind("mouseenter");
        });
        
    });
    var page = {
        originRecord: function() {
            $('#originRecord').on('click', function() {
                layer.open({
                    type: 2,
                    title: '原始记录',
                    shadeClose: false,
                    shade: 0.8,
                    area: ['50%', '60%'],
                    content: './originRecord.html', //iframe的url
                    btn: ['确定','关闭'],
                    yes: function(index, layero){
                        var x = document.getElementById('layui-layer-iframe'+index).contentWindow;
                        var input = x.document.getElementsByTagName('input');
                        var arr = []
                        $(input).each(function(i, e) {
                            if ($(e).attr('checked') == 'checked') {
                                arr.push($(e).next().html())
                            } 
                        })
                        for(var item in arr) {
                            $("#span").append('<span>' + arr[item] + '</span>' );
                            console.log(arr[item])
                        }
                
                        layer.close(index);
                    },
                    cancel: function(){
                        //右上角关闭回调
                    },
                });
            })
        },
        testSet: function() {
            $('#testSet').on('click', function() {
                layer.open({
                    type: 2,
                    title: '双实验差设置',
                    shadeClose: false,
                    shade: 0.8,
                    area: ['70%', '60%'],
                    content: ['./testSet.html', 'no'], //iframe的url
                    btn: ['确定','关闭'],
                    yes: function(index, layero){
                        // var x = document.getElementById('layui-layer-iframe'+index).contentWindow;
                        // var input = x.document.getElementsByTagName('input');
                        // var arr = []
                        // $(input).each(function(i, e) {
                        //     if ($(e).attr('checked') == 'checked') {
                        //         arr.push($(e).next().html())
                        //     } 
                        // })
                        // for(var item in arr) {
                        //     $("#span").append('<span>' + arr[item] + '</span>' );
                        //     console.log(arr[item])
                        // }
                
                        layer.close(index);
                    },
                    cancel: function(){
                        //右上角关闭回调
                    }
                });
            })
        }
    }
    $(document).ready(function() {
        page.originRecord();
        page.testSet();
    })
})

