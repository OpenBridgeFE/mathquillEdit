/**
 * Created by joyC on 2016/4/28.
 */
$(function(){
    $(".search-more i").removeClass("fa-angle-up").addClass("fa-angle-down");
    searchHide();
    $(".search-more").bind("click",function(){
        if($(".search-more .fa-angle-down").length!=0){
            $(".form-group-Wdate").fadeIn();
            $(".form-group").fadeIn();
            $(this).children("i").removeClass("fa-angle-down").addClass("fa-angle-up");
        }else{
            $(this).children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            searchHide();
        }
        var _height=$(".tb_search .pull-left").height()+10;
        $(".tb_search").parents(".right-form").height(_height);
        console.log(_height);
    });
    function searchHide() {
        $(".clear-left").removeClass("clear-left");
        var searchWidth= 0,_len=1;
        $(".tb_search>div>div").each(function () {
            $(this).attr("style","");
            $(this).find("label").attr("style","");
            $(this).show();
            $(this).hasClass("form-group")&&$(this).removeClass("form-group-Wdate");
            searchWidth+=$(this).width() + 20;
            if($(".iframe-cot").width()-64<searchWidth){
                _len++;
                if(_len==2){
                    //修改测试内容
                    var nodeLen = $(this).prevAll().length - 1;
                    var nodeWidthAll = 0;
                    for(var i = 0;i<nodeLen;i++){
                        var label1 = $(".tb_search>div>div:nth-child("+ (i+2)+")").find("label").width();
                        var label2 = $(".tb_search>div>div:nth-child("+ (i + nodeLen +2) +")").find("label").width();
                        var contentWidth1 = $(".tb_search>div>div:nth-child("+ (i+2)+")").width()-label1;
                        var contentWidth2 = $(".tb_search>div>div:nth-child("+ (i + nodeLen +2)+")").width()-label2;
                        var _width = label1>label2?label1:label2;
                        _width+=contentWidth1>contentWidth2?contentWidth1:contentWidth2;
                        nodeWidthAll+=_width + 20;
                    }
                    if(nodeWidthAll>$(".iframe-cot").width()-64){
                        _len = 3;
                        $(this).prev().addClass("clear-left");
                        var _prev = $(this).prev()[0];
                        changeSearchEle(_prev,2);
                        changeSearchEle(this,_len);
                    }else{
                        $(this).addClass("clear-left");
                        changeSearchEle(this,_len);
                    }
                }else{
                    changeSearchEle(this,_len);
                }
            }
        });
        if(_len==1){
            $(".search-more").hide();
        }else {
            $(".search-more").show();
        }
    }
    $(window).resize(function () {
        searchHide();
    })
});
function changeSearchEle(ele,_len){
    if(_len==5){
    }
    var _width;
    if($(".tb_search>div>div:nth-child("+ _len+")").is(":hidden")){
        _width = $(".tb_search>div>div:nth-child("+ _len+")")[0].width;
    }else{
        _width = $(".tb_search>div>div:nth-child("+ _len+")").find("label").width();
    }
    if(_width>$(ele).find("label").width()){
        $(ele).find("label").width((_width + 1) + "px").css("text-align","right");
        $(ele)[0].width = $(".tb_search>div>div:nth-child("+ _len+")").find("label").width();
    }else{
        $(".tb_search>div>div:nth-child("+ _len+")").find("label").width(($(ele).find("label").width()+1) + "px").css("text-align","right");
        $(ele)[0].width = $(ele).find("label").width();
    }
    if($(".tb_search>div>div:nth-child("+ _len+")").width()>$(ele).width()){
        $(ele).width(($(".tb_search>div>div:nth-child("+ _len+")").width()+1) + "px");
    }else{
        $(".tb_search>div>div:nth-child("+ _len+")").width(($(ele).width()+1) + "px");
    }

    $(ele).hide();
}