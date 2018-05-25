
	$(document).ready(function() {
    	var area=$(".tab-update:visible");
    	if(area.length==0){
    		area=document;
    	}
  		var tabsParent = $(".tabsparent",area);
  		if(tabsParent.length!=0){
  			newTabs(area);
  		}else{
  			oldTabs(area);
  		}
	    
	    //点击事件
	    $(".tabs > li").click(function() {
			if($(this).find("a").attr("id")=="tabLi2"){
				if(!checkChangeTab()){
					return false;
				}
			}
	    	$(this).parent().find(">li").removeClass("active");
	        $(this).addClass("active"); //给点击的li添加class名 
	        var activeTab = $(this).find("a").attr("href"); //获取对应的div的id，以便去显示该div
	        $(activeTab).siblings().removeClass("active").hide();     //siblings()除了自己以外的同辈元素
	        $(activeTab).addClass("active").fadeIn(); //显示对应的div  
	        if($(this).find("a").attr("id")=="taskInputMain_a3"){
				if(!newTabs($(this).find("a").attr("href"))){
					return false;
				}
			}
	        return false;
	    });

	    window.onresize = function(){
	    	var area=$(".tab-update:visible");
	    	if(area.length==0){
	    		area=document;
	    	}
	    	var tabsParent = $(".tabsparent",area);
	    	$(".tabs",area).css("margin-left","0");
	    	$(".tabs",area).prev().hide();
	    	$(".tabs",area).next().show();
	  		if(tabsParent.length!=0){
	  			newTabs(area);
	  		}else{
	  			oldTabs(area);
	  		}
	    }
	  
	}); 

	//标签页初始化-1，需要做左右移动的
	function newTabs(area) {
		if(typeof(area)=="undefined"){
			area=document;
		}
	    //$(".tab-content",area).hide(); 
	    $(".tabs",area).each(function(i){
	    	var _this = $(this);
	    	var li = _this.find("li");
	    	var tf;
	    	li.each(function(){
	    		if(!tf){
	    			tf = $(this).hasClass("active");
	    		}
	    	})
	    	if(tf) {
    			return;
    		}else{
    			_this.find(">li:first").addClass("active").show()
    		}
	    	
	    })
		// 让箭头根据ul的父元素来定位
		$(".tabs",area).parent().css({
			"position": "relative",
	    	"overflow":"hidden"
		});
	    $(".tab-contentmian",area).each(function(i){
	    	var _this = $(this);
	    	var div = _this.find(".tab-content");
	    	var tf;
	    	div.each(function(){
	    		if(!tf){
	    			tf = $(this).hasClass("active");
	    		}
	    	})
	    	if(tf) {
    			_this.find(".active").show();
    		}else{
    			_this.find(".tab-content:first").addClass("active").show()
    		}
	    })
	    // 获取宽度以便比较，超出父元素宽度的隐藏
	    var ulW = $(".tabs",area).parent().width();
	   
	    var mr = parseInt($(".tabs > li",area).css("margin-right"));
	    $(".tabs",area).each(function(i){
	    	var w = 0;
	    	var $self=$(this);
	    	var li = $self.find("li");
	    	li.each(function(){
	    		w += $(this).outerWidth() + mr;
	    	})
	    	if(w > ulW){
	    		$self.width(w+100);
	    	}else{
	    		$self.width(ulW);
	    	}
	    });

	    $(".tabs",area).each(function(){
	    	var _thisW = $(this).width();
	    	if(_thisW > ulW){
	    		var i = $(this).parent().find("i");
	    		var hasclass = $(this).parent().hasClass("tabsparent");
	    		if( i.length == 0 && hasclass){   //左右按钮
	    			var iconR = "<i class='fa fa-angle-right' onclick='goRight(this)' style='position:absolute;top:0px;right:0px; cursor:pointer;padding:11px 5px;background:rgba(0,0,0, .3); color: #fff;z-index:10;'></i>"
			    	var iconL = "<i class='fa fa-angle-left' onclick='goLeft(this)' style='position:absolute;top:0px;left:0px; cursor:pointer;padding:11px 5px;background:rgba(0,0,0, .3); color: #fff; z-index:10;display:none;'></i>"
			    	$(this).parent().append(iconR);
			    	$(this).parent().prepend(iconL);
	    		}
		    }
	    })
	}

	function goRight(a){
		var ulParentW = $(a).parent().width();   
		var ul = $(a).prev();
		
		
		ul.animate({
			"marginLeft": 0-(0-(ul.css("marginLeft").replace("px",""))+ulParentW)
		},500,function(){
			var marginLeft=(ul.css("marginLeft").replace("px","")-0);
			if((0-marginLeft)>=ulParentW){
		    	ul.parent().find(".fa-angle-left").show();
			}
			if((0-marginLeft+ulParentW)>ul.width()){
		    	$(a).hide();
			}
		});
    	
    };


    function goLeft(a){
		var ulParentW = $(a).parent().width();   
		var ul = $(a).next();
		
		
		ul.animate({
			"marginLeft": 0-(0-(ul.css("marginLeft").replace("px",""))-ulParentW)
		},500,function(){
			var marginLeft=(ul.css("marginLeft").replace("px","")-0);
			if((0-marginLeft)<ulParentW){
		    	ul.parent().find(".fa-angle-left").hide();
			}
			if((0-marginLeft+ulParentW)<ul.width()){
				ul.parent().find(".fa-angle-right").show();
			}
		});
    	
    	
/*    	var ulParentW = $(a).parent().width();
    	var ul = $(a).next();
    	var ml = parseInt(ul.css("margin-left"));
    	var otherW = 0;
		var liW = 0;
    	var Li = ul.find("li");
    	var mr = parseInt(Li.css("margin-right"));
    	for (i = 0; i < Li.length; i++ ){
    		liW += Li[i].offsetWidth + mr;
    		if( liW > ulParentW ) {
    			otherW = liW - ulParentW;
    		}
    	}
    	if ( otherW > ulParentW ) {     //如果有三页li标签
    		if ( -otherW == ml ) {      //并且当前显示到了最后一个li标签
				ul.animate({            //ul的ml向左移动一个ul父元素的宽度。
					"marginLeft": ml + ulParentW - 60
				},500);
				ul.parent().find(".fa-angle-right").show();
	    	}else{                       //如果没有显示到最后一个li标签
	    		ul.animate({             //直接让ul的ml为0
					"marginLeft": 0
				},500);
		    	ul.parent().find(".fa-angle-right").show();
		    	$(a).hide();
	    	}
    	}
    	else{
    		ul.animate({
				"marginLeft": 0
			},500);
	    	ul.parent().find(".fa-angle-right").show();
	    	$(a).hide();
    	}*/
    	
    };

    //标签页初始化-2，不需要左右移动的
    function oldTabs(area){
		if(typeof(area)=="undefined"){
			area=document;
		}
		//$(".tab-content",area).hide(); 
		$(".tabs",area).each(function(i){
	    	var _this = $(this);
	    	var li = _this.find("li");
	    	var tf;
	    	li.each(function(){
	    		if(!tf){
	    			tf = $(this).hasClass("active");
	    		}
	    	})
	    	if(tf) {
    			return;
    		}else{
    			//自定义显示
    			if($(".mustShow").length==1){
    				$(".mustShow").addClass("active").show();
    			}else{
        			_this.find("li:first").addClass("active").show();
    			}

    		}
	    	
	    })
	    $(".tab-contentmian",area).each(function(i){
	    	var _this = $(this);
	    	var div = _this.find(".tab-content");
	    	var tf;
	    	div.each(function(){
	    		if(!tf){
	    			tf = $(this).hasClass("active");
	    		}
	    	})
	    	if(tf) {
    			_this.find(".active").show();
    		}else{
    			if($(".mustShowTab").length==1){
    				$(".mustShowTab").addClass("active").show();
    			}else{
        			_this.find(".tab-content:first").addClass("active").show()
    			}

    		}
	    })
    }

