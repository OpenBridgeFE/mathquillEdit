/**
 * Created by xg on 2016/8/23.
 */
$(function(){
    var a = $(".mh-nav-left >ul >li").find(">a");
    var a2 = $(".mh-nav-left-ul2").find("a");
    a.click(function(){
        if($(this).next("ul").css("display") == "none"){
            $(this).parent().siblings().children("ul").slideUp();
            $(this).parent().siblings().children("a").children("label").html("<img src='../images/up.PNG'>");
            $(this).next("ul").slideDown();
            $(this).children("label").html("<img src='../images/down.PNG'>");
        }else{
            if($(this).next("ul").css("display")){
                $(this).parent().siblings().children("ul").slideUp();
                $(this).parent().siblings().children("a").children("label").html("<img src='../images/up.PNG'>");
                $(this).next("ul").slideUp();
                $(this).children("label").html("<img src='../images/up.PNG'>")
            }
        };
        if (!$(this).next("ul").css("display")) {
            $(".mh-nav-left >ul >li").find(">a").css({"background-color":"#2284c5","color":"#fff"});
            $(this).css({"background-color":"#66B2E5"});
            $(".mh-nav-left-ul2").find("a > span").css("color","#666");
        };
    })
    a2.click(function(){
        if($(this).next("ul").css("display") == "none"){
            $(this).next("ul").slideDown();
            $(this).children("label").html("<img src='../images/down.PNG'>");
        }else{
            if($(this).next("ul").css("display")){
                $(this).next("ul").slideUp();
                $(this).children("label").html("<img src='../images/up.PNG'>");
            }
        };
        if (!$(this).next("ul").css("display")) {
            $(".mh-nav-left-ul2").find("a > span").css("color","#666");
            $(this).children("span").css("color","#2284c5");
            $(".mh-nav-left >ul >li").find(">a").css({"background-color":"#2284c5","color":"#fff"});
        };
    })
})

