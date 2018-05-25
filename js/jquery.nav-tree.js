/**
 * Created by joyC on 2016/5/4.
 */
(function($){
    //原始数据模型
    var cache = {},_cache = [],deleteCache=[],
    //默认属性
        setting = {
            data:{
                unitId:null,
                unitName:"",
                status:0,
                parentId:null,
                unitNo:"",
                unitType:0,
                level:null,
                url:"",
                isUnit:"Y"
            },
            set:{
                unitId:"unitId",
                unitName:"unitName",
                status:"status",
                parentId:"parentId",
                unitNo:"unitNo",
                unitType:"unitType",
                url:"url",
                isUnit:"isUnit"
            },
            //回调函数属性
            callback:{
                //是否采取右键按钮编辑
                RIGHTCLICK:false,
                //是否调用ajax请求函数
                urlDelete:"",
                urlAdd:"",
                urlEdit:"",
                level:null,
                //基本操作函数
                BASICCLICK:{
                    ARRBOX:null,
                    FUNCTION:false
                },
                PARENTCLICK:false,
                SONCLICK:false,
                SCROLL:true
            },
            css:{
                padLeft:false,
                maxPart:13
            }
        },
    //数据请求
        _ajax = {
            //编辑更新请求
            _ajaxEdit:function(obj){
                var tempStatus;
                var dataForUpdateName = {
                    id: obj.id,
                    orgName: obj.orgName,
                    orgParentId: obj.orgParentId,
                }
                $.ajax({
                    type : "POST",  //提交方式
                    url : setting.callback.urlEdit,//路径
                    data: JSON.stringify(dataForUpdateName),
                    dataType:"JSON",
                    contentType: "application/json",
                    async: false,
                    success : function(result) {//返回数据根据结果进行相应的处理
                        tempStatus="true";
                        layer.msg('操作成功', {icon: 1});
                    },
                    error: function (result) {
                        tempStatus="false";
                        layer.msg('操作失败', {icon: 4});
                    }
                });
                return tempStatus;
            },
            //删除请求
            _ajaxDelete:function(obj){
                var tempStatus;
                var ids=[];
                var isContainPerson;
                for (var i = 0; i < obj.length; i++) {
                    ids.push(obj[i].id);
                }
                isContainPerson = isContainPeo(ids);
                if(isContainPerson == null || isContainPerson == "undefined"){
                    layer.msg('操作失败', {icon: 4});
                    return;
                }else{
                    if(!isContainPerson){
                        //直接删除
                        $.ajax({
                            type : "POST",  //提交方式
                            url :setting.callback.urlDelete,//路径
                            data: JSON.stringify(ids),
                            dataType:"JSON",
                            contentType: "application/json",
                            async: false,
                            success : function(result) {//返回数据根据结果进行相应的处理
                                tempStatus="true";
                                layer.msg('操作成功', {icon: 1});
                            },
                            error: function (result) {
                                tempStatus="false";
                                layer.msg('操作失败', {icon: 4});
                            }
                        });
                    }else{
                        tempStatus="false";
                        layer.msg('该节点下组织有人员信息，无法删除', {icon: 4});
                    }
                }
                return tempStatus;
            },
            //新增请求
            _ajaxAdd: function (obj) {
                var dataForAdd = {
                    orgName: obj.orgName,
                    orgParentId: obj.orgParentId,
                    level: obj.level,
                }
                $.ajax({
                    type : "POST",  //提交方式
                    url : setting.callback.urlAdd,//路径
                    data: JSON.stringify(dataForAdd),
                    dataType:"JSON",
                    contentType: "application/json",
                    success : function(result) {//返回数据根据结果进行相应的处理
                        layer.msg('操作成功', {icon: 1});
                        return true;
                    },
                    error: function (result) {
                        layer.msg('操作失败', {icon: 4});
                        return false;
                    }
                });
            }
        }
    //回调函数
    _roots = {
        //点击、移进、移出、前插、删除
        //获取id
        _click: function (e,arr) {
            if(setting.css.padLeft==false){
                $(e).children("span").bind("click",function(){
                    var _len=parseInt($(this).parent().parent().attr("class").slice(-1))+1;
                    console.log(_len);
                    _scroll.deleteScrollbox(_len);
                    $(".scroll-group").hide();
                    if(arr.length>=_len){
                        arr=arr.slice(0,_len-1);
                    }
                    //获得arr
                    arr=[];
                    $(e).parents("ul:not(.TreeLevel0)").siblings("span").each(function(){
                        arr.push(_funs.getNodeArr(this));
                    });
                    arr.push(_funs.getNodeArr(this));
                    var isUnit = $(this).attr("toggle-unit");
                    var _box=[];
                    var _num=$(".TreeLevel0").children("li").length==1?1:0;
                    for(var i=_num;i<arr.length;i++){
                        _box.push(arr[i].name);
                    }
                    $(".TreeLevel0").children("li").length==1&&arr.length==1?$(".treeList").text(""):$(".treeList").text("  >   "+_box.join("   >   "));
                    setting.callback.BASICCLICK.FUNCTION!==false&&setting.callback.BASICCLICK.FUNCTION(arr,isUnit);
                    $(".TreeLevel0").hide();
                })
            }else{
                $(e).children("span").bind("click",function(){
                    var _len=parseInt($(this).parent().parent().attr("class").slice(-1))+1;
                    if(!$(this).hasClass("active")){
                        _scroll.deleteScrollbox(_len);
                        if(arr.length>=_len){
                            arr=arr.slice(0,_len-1);
                        }
                        var obj=new Object();
                        obj.name=$(this).text();
                        obj.id=$(this).parent().attr("toggle-id");
                        obj.level=$(this).parent().parent().attr("class").slice(-1);
                        arr.push(obj);
                        var _box=[];
                        for(var i=0;i<arr.length;i++){
                            _box.push(arr[i].name);
                        }
                        $(".treeList").text(">"+_box.join(">"));
                        setting.callback.BASICCLICK.FUNCTION!==false&&setting.callback.BASICCLICK.FUNCTION(arr);
                    }
                })
            }
        },
        _sonClick:function(e){
            $(e).children("span").bind("click",function(){
                var self= this;
                if(setting.callback.SONCLICK!==false){
                    setting.callback.SONCLICK(self)
                }else {
                    $(this).parent().siblings().find(".active").removeClass("active");
                    $(this).attr("class","active");
                    $(".TreeLevel0").hide();
                    //$(".TreeLevel0").parent().find(".active").removeClass("active");
                    $(".scroll-group").hide();
                }
            });
            $(e).children("span").bind("mouseover",function(){
                if($(this).parent().siblings().find("ul:visible").length!=0){
                    $(this).parent().siblings().find("ul:visible").hide();
                    $(this).parent().siblings().find(".active").removeClass("active");
                    $(this).addClass("active");
                    var _len = parseInt($(this).parent().parent().attr("class").slice(-1))+1;
                    _scroll.deleteScrollbox(_len);
                }
            })

        },
        _bindClick:function(e){
            //$(e).find(".selected").length==0
            $(e).children("ul").hide();
            $(e).children("i").addClass("fa fa-angle-left");
            if(setting.css.padLeft==false){
                $(e).children("span").bind("mouseover",function(){
                    if(!$(this).hasClass("active")){
                        var _len=parseInt($(this).parent().parent().attr("class").slice(-1))+1;
                        //if(!$(this).hasClass("active")){
                        _scroll.deleteScrollbox(_len);
                        $(this).parent().parent().find(".active").removeClass("active");
                        $(this).addClass("active");
                        $(this).parent().addClass("active");
                        $(this).parent().siblings().find("ul").each(function(){
                            if($(this).parent().find(".selected").length==0){
                                $(this).hide();
                                $(this).parent().find(".fa-angle-down").removeClass("fa-angle-down");
                                $(this).parent().find(".active").removeClass("active");
                            }
                        });
                        $(this).siblings("ul").show();
                        $(this).siblings("i").toggleClass("fa-angle-down");
                    }
                })
            }else {
                $(e).children("span").bind("click",function(){
                    if(!$(this).hasClass("active")){
                        $(this).parent().parent().find(".active").removeClass("active");
                        $(this).addClass("active");
                        $(this).parent().addClass("active");
                        $(this).parent().siblings().find("ul").each(function(){
                            if($(this).parent().find(".selected").length==0){
                                $(this).hide();
                                $(this).parent().find(".fa-angle-down").removeClass("fa-angle-down");
                                $(this).parent().find(".active").removeClass("active");
                            }
                        });
                        $(this).siblings("ul").show();
                        $(this).siblings("i").toggleClass("fa-angle-down");
                    }else{
                        if($(this).parent().find(".selected").length==0){
                            $(this).removeClass("active");
                            $(this).parent().removeClass("active");
                            $(this).parent().find("ul").hide();
                            var _len=parseInt($(this).parent().parent().attr("class").slice(-1))+1;
                            _scroll.deleteScrollbox(_len);
                            $(this).parent().find(".fa-angle-down").removeClass("fa-angle-down");
                        }
                    }
                })
            }
        },
        _bindRightClick: function (e,level) {
            $(e).mousedown(function(event){
                if(3==event.which){
                    document.oncontextmenu = function(event){ return false; }
                    var _div=document.createElement("div"),treeLevel=$(e).parent().parent().attr("class").slice(-1);
                    $(".nav-tree-btns").remove();
                    var _html = level===null?"<p>编辑部门</p><p>删除部门</p><p>增加部门</p>":level>treeLevel?"<p>编辑部门</p><p>删除部门</p><p>增加部门</p>":"<p>编辑部门</p><p>删除部门</p>";
                    $(_div).addClass("nav-tree-btns").html(_html).css({"left":event.offsetX,"top":event.offsetY-30});
                    _roots._initBtns(_div,e,treeLevel);
                    $(this).parent().append($(_div));
                    $("*:not('.nav-tree-btns')").one("click",function(){
                        $(".nav-tree-btns").remove();
                        document.oncontextmenu = function(event){ return true; }
                    })
                }
            })
        },
        _initBtns:function(_e,e,treeLevel){
            $(_e).children("p:last-child").bind("click",function(){
                root.addNewNode(e.parent(),treeLevel);
                $(".nav-tree-btns").remove();
            }),
                $(_e).children("p:nth-child(1)").bind("click",function(){
                    root.editNode(e.parent());
                    $(".nav-tree-btns").remove();
                }),
                $(_e).children("p:nth-child(2)").unbind("click").bind("click",function(){
                    root.deleteNode(e.parent());
                    $(".nav-tree-btns").remove();
                })
        }
    },
        //复制
        tools = {
            clone: function (obj){
                if (obj === null) return null;
                var o = tools.isArray(obj) ? [] : {};
                for(var i in obj){
                    o[i] = (obj[i] instanceof Date) ? new Date(obj[i].getTime()) : (typeof obj[i] === "object" ? arguments.callee(obj[i]) : obj[i]);
                }
                return o;
            },
            isArray: function(arr) {
                return Object.prototype.toString.apply(arr) === "[object Array]";
            },
            isParent:function(obj){
                return obj[setting.set.parentId]===null?true:obj[setting.set.parentId]=="0"?true:false;
            },
            newObject:function(e){
                var obj=new Object();
                obj[setting.set.parentId] = $(e).parent().parent().attr("toggle-id")==undefined?null:$(e).parent().parent().attr("toggle-id");
                obj[setting.set.unitId]=$(e).attr("toggle-id");
                obj[setting.set.unitName]=$(e).children("span").text();
                obj.level=$(e).parent().attr("class").slice(-1);
                obj = $.extend(true,{},setting.data,obj);
                return obj;
            }
        },
        //元素绑定对应函数方法
        _funs = {
            randomId:function(){
                var strList = "0123456789abcdefghijklmnopqrstuvwxyz";
                var arr=[];
                for(var i=0;i<40;i++){
                    arr.push(strList[parseInt(Math.random()*(strList.length-1))]);
                }
                return arr.join("");
            },
            newData: function () {
                var arr = {};
                for(var i in setting.data){
                    var str=setting.set[i];
                    arr[str] = setting.data[i];
                }
                return arr;
            },
            getNodeArr:function(e){
                var obj=new Object();
                obj.name=$(e).text();
                obj.id=$(e).parent().attr("toggle-id");
                obj.url=$(e).parent().attr("toggle-url");
                obj.level=$(e).parent().parent().attr("class").slice(-1);
                return obj;
            }
        },
        root = {
            //获取父亲节点函数
            getParentNode:function(obj){
                var pId = tools.isParent(obj)?null:obj[setting.set.parentId];
                var _box = null;
                if(!pId){
                    _box = $(_flag);
                }else {
                    _box = $("li[toggle-id='"+ pId +"']");
                    return _box.length==0?false:_box;
                }
                return _box;
            },
            getDeleteNode:function(e){
                if($(e).children("ul").length!=0){
                    $(e).children("ul").children("li").each(function(){
                        root.deleteNode(this);
                    });
                    $(e).children("ul").remove();
                }
            },
            getDeleteNode2:function(e){
                if($(e).children("ul").length!=0){
                    $(e).children("ul").children("li").each(function(){
                        root.getDeleteNode2(this);
                    });
                }else{
                    var obj=tools.newObject(e);
                    deleteCache.push(obj);
                }
            },
            getNode: function (obj) {
                var _li=document.createElement("li"),
                    _span=document.createElement("span"),
                    _i=document.createElement("i");
                $(_span).text(obj[setting.set.unitName]).attr({"title":obj[setting.set.unitName],"toggle-unit":obj[setting.set.isUnit]});
                setting.css.padLeft!=false&&$(_span).css("padding-left",(obj.level*setting.css.padLeft + 25)+"px");
                _li.parentId = obj[setting.set.parentId];
                $(_li).attr({"toggle-id":obj[setting.set.unitId],"toggle-url":obj[setting.set.url]}).append($(_span)).append($(_i));
                return _li;
            },
            //生成页面元素
            searchNode: function (pNode) {
                num++;
                levelNum=num;
                pNode.each(function(){
                    var pStr = $(this).attr("toggle-id");
                    for(var i in cache){
                        var _str=i.split("_")[0];
                        pStr==_str&&root.insertNode(this,cache[i]);
                    };
                    var _sNode=$(this).children("ul").children("li");
                    if(_sNode.length!=0){
                        root.searchNode(_sNode);
                        //绑定函数
                        _roots._click(this,setting.callback.BASICCLICK.ARRBOX);
                        setting.callback.PARENTCLICK===false?_roots._bindClick(this):setting.callback.PARENTCLICK();
                        setting.callback.RIGHTCLICK===true&&_roots._bindRightClick($(this).children("span"),setting.callback.level);
                    }else{
                        _roots._click(this,setting.callback.BASICCLICK.ARRBOX);
                        _roots._sonClick(this);
                        setting.callback.RIGHTCLICK===true&&_roots._bindRightClick($(this).children("span"),setting.callback.level);
                    }
                });
                num--
            },
            insertNode: function () {
                var parentNode=arguments[0],sonNode=arguments[1];
                if($(parentNode).children("ul").length==0){
                    var _ul=document.createElement("ul");
                    $(_ul).addClass("TreeLevel" +  num).append($(sonNode));
                    $(parentNode).append($(_ul));
                }else{
                    $(parentNode).children("ul").append($(sonNode));
                }
            },
            addNode: function (obj,num) {
                //   获取父亲节点
                var parentBox = root.getParentNode(obj);
                //  当前生成的元素
                var _elem = root.getNode(obj);
                if(!!parentBox){
                    parentBox.append($(_elem));
                    //_roots._bindClick(_elem);
                }else {
                    cache[obj[setting.set.parentId] + "_" + num] = _elem;
                }
            },
            //编辑节点名称
            editNode: function (e) {
                var tempVal = $(e).children("span").text();
                $(e).children("span").hide();
                var _input=document.createElement("input");
                $(_input).val( $(e).children("span").text());
                $(e).append($(_input));
                var tempStatus;
                $(_input).focus().bind("blur",function(){
                    var str=$(this).val();
                    $(e).children("span").text(str);
                    var obj=tools.newObject(e);
                    var tempStatus;
                    layer.confirm('您确定要修改吗？', {btn: ['确定','取消'] ,title:'提示信息'}, function(){
                        //ajax请求
                        tempStatus = _ajax._ajaxEdit(obj);
                    });
                    if(tempStatus==undefined){
                        $(e).children("span").text(tempVal);
                    }
                    $(_input).remove();
                    $(e).children("span").show();
                });
            },
            deleteNode:function(e){
                //分级删除
                root.getDeleteNode2(e);
                layer.confirm('您确定要删除吗？', {btn: ['确定','取消'] ,title:'提示信息'}, function(){
                    //ajax请求
                    var tempStatus = _ajax._ajaxDelete(deleteCache);
                    if(tempStatus == "true"){
                        root.getDeleteNode(e);
                        var _p=$(e).parent(),__p=$(e).parent().parent();
                        $(e).remove();
                        if(_p.find("li").length==0){
                            _p.remove();
                        }
                        //父层变子层
                        __p.find("ul").length==0&&root.changeSonNode(__p);
                    }
                });
            },
            addNewNode:function(e,treeLevel){
                $(e).find("ul").length==0&&root.changeParentNode(e,treeLevel);
                var _input=document.createElement("input"),_li=document.createElement("li"),_i=document.createElement("i");
                $(_li).append($(_input));
                $(e).children("ul").append($(_li));
                var _len=parseInt($(e).children("ul").attr("class").slice(-1));
                var _Lilen=parseInt($(e).children("ul").children("li").length);
                if($(e).find(".active").length!=0){
                    $(e).children("ul").show();
                }else{
                    $(e).children("span").trigger("click");
                }
                if($(".nav-tree ."+_len).length!=0){
                    $(e).children("ul").children("li:nth-child("+ (_Lilen-setting.css.maxPart+2) +")").prevAll().hide();
                    $(e).children("ul").children("li:nth-child("+ (_Lilen-setting.css.maxPart+3) +")").nextAll().show();
                }
                $(_input).focus().bind("blur",function(){
                    var str=$(this).val();
                    var reg=/^\s+$/g;
                    if(str==""||reg.test(str)){
                        if($(this).parent().siblings().length==0){
                            root.changeSonNode($(this).parent().parent().parent());
                            $(this).parent().parent().remove();
                        }else {
                            $(this).parent().remove();
                        }
                    }else{
                        var _span=document.createElement("span");
                        $(_span).text(str);
                        //随机生成id
                        $(this).parent().attr("toggle-id",_funs.randomId());
                        $(this).parent().append($(_span)).append($(_i));
                        $(this).remove();
                        _roots._bindRightClick($(_span),setting.callback.level);
                        var obj=tools.newObject(e.children("ul").children("li:last-child"));
                        //    ajax请求
                        _ajax._ajaxAdd(obj);
                    }
                });
            },
            changeParentNode:function(e,treeLevel){
                var _ul=document.createElement("ul");
                $(_ul).addClass("TreeLevel" + (treeLevel+1) );
                $(e).append($(_ul));
                _roots._bindClick(e);
            },
            changeSonNode: function (e) {
                $(e).children("span").unbind("click").removeClass("active").siblings("i").attr("class","");
                $(e).removeClass("active");
            }
        },
        _scroll={
            stop:null,
            timer:null,
            flag:false,
            //滚动事件
            top: function (lv) {
                var _first=$(".TreeLevel"+ lv+":visible>li:visible")[0];
                var maxnum=setting.css.maxPart - 1;
                var _num=$(_first).index()+ maxnum;
                if(_num>maxnum){
                    $($(".TreeLevel"+ lv+":visible>li")[_num]).hide(200);
                    $(_first).prev().show(200);
                }
            },
            down: function (lv) {
                var _len= $(".TreeLevel"+ lv +":visible>li").length;
                var _first=$(".TreeLevel"+ lv+":visible>li:visible")[0];
                var maxnum=setting.css.maxPart - 1;
                var _num=$(_first).index() + maxnum;
                if(_num<_len){
                    $(_first).hide(200);
                    $($(".TreeLevel"+ lv+":visible>li")[_num]).show(200);
                }
            },
            toTop: function (lv) {
                _scroll.timer = setTimeout(function() {//down 1s，才运行。
                    _scroll.flag = true;
                    _scroll.stop==null&&(_scroll.stop = setInterval(function() {
                        _scroll.top(lv);
                    },200));
                }, 1500);
            },
            toDown: function (lv) {
                _scroll.timer = setTimeout(function() {
                    _scroll.flag = true;
                    _scroll.stop==null&&(_scroll.stop = setInterval(function() {//down 1s，才运行。
                        _scroll.down(lv);
                    }, 200));
                },1500);
            },
            toTopStop:function(){
                if (!_scroll.flag) {
                    clearInterval(_scroll.timer);
                }
                clearInterval(_scroll.stop);
                _scroll.stop=null;
            },
            toDownStop:function(){
                if (!_scroll.flag) {
                    clearInterval(_scroll.timer);
                }
                clearInterval(_scroll.stop);
                _scroll.stop=null;
            },
            scrollBox:function(lv){
                var _div=document.createElement("div"),_a1=document.createElement("a"),_a2=document.createElement("a");
                $(_a1).html("<i class='fa fa-angle-double-up'></i>").bind({"mousedown": function () {
                    _scroll.toTop(lv);
                },"click":function(){
                    _scroll.top(lv);
                },"mouseout":_scroll.toTopStop,"mouseup":_scroll.toTopStop});
                $(_a2).html("<i class='fa fa-angle-double-down'></i>").bind({"mousedown":function(){
                    _scroll.toDown(lv)
                },"click":function(){
                    _scroll.down(lv);
                },"mouseout":_scroll.toDownStop,"mouseup":_scroll.toDownStop});
                $(_div).addClass("scroll-group "+lv).append($(_a1),$(_a2));
                return _div;
            },
            deleteScrollbox: function (lv) {
                for(var i=lv;i<=levelNum;i++){
                    $(".nav-tree").children("."+i).remove()
                }
            }
        },
        //    虚拟容器
        _flag = document.createDocumentFragment();
    var num = 0,levelNum=0;
    //初始化init
    $.fn.navTree = {
        init: function (obj,sets,zNodes) {
            //合并函数/方法属性
            $.extend(true,setting.callback,sets.callback);
            //合并属性名称
            $.extend(true,setting.set,sets.data);
            $.extend(true,setting.css,sets.css);
            //重置重要字段名称
            setting.data=_funs.newData();
            //    分析zNode节点
            zNodes = zNodes ? tools.clone(tools.isArray(zNodes)? zNodes : [zNodes]) : [];
            //    合并默认属性 并将最终数据存入cache缓存
            $(zNodes).each(function () {
                var settings = tools.clone(setting.data);
                $.extend(true,settings,this);
                _cache.push(settings);
            });
            //获取层级
            for(var i=0;i<_cache.length;i++){
                //生成元素
                root.addNode(_cache[i],i);
            }
            //插入元素
            root.searchNode($(_flag).children());
            $(obj).append($(_flag));
            //处理数据过多，滚动条问题START
            if(setting.callback.SCROLL!=false) {
                $(obj).parent().find("ul").css("height", 34 * setting.css.maxPart + "px");
                $(obj).parent().find("ul").each(function () {
                    if ($(this).children("li").length > setting.css.maxPart) {
                        var self = this;
                        $(this).siblings("span").bind("mouseover", function () {
                            var _lv = $(self).attr("class").slice(-1);
                            if ($(this).hasClass("active")) {
                                $($(this).siblings("ul").children("li:visible")[0]).prevAll().show();
                                var divBox = null;
                                divBox = _scroll.scrollBox(_lv);
                                $(divBox).css({
                                    "left": (1 + 230 * _lv) + "px",
                                    "top": (setting.css.maxPart * 34 - 5) + "px"
                                });
                                var _className=$(divBox).attr("class").split(" ").join(".");
                                //console.log($(obj).parent().find("."+_className).length);
                                $(obj).parent().find("."+_className).length>=1&&$(obj).parent().find("."+_className).remove();
                                $(obj).parent().append($(divBox));
                                $(self).children("li").each(function () {
                                    $(this).index() >= (setting.css.maxPart - 1) && $(this).hide();
                                })
                            }else if($(this).hasClass("nav-header")){
                                $($(this).siblings("ul").children("li:visible")[0]).prevAll().show();
                                var divBox = null;
                                divBox = _scroll.scrollBox(_lv);
                                $(divBox).css({
                                    "left": (1 + 230 * _lv) + "px",
                                    "top": (setting.css.maxPart * 34 - 5) + "px",
                                    "background":"#EDEDED"
                                }).hide();
                                (obj).parent().find(".scroll-group").hasClass("0")||$(obj).parent().append($(divBox));
                                $(self).children("li").each(function () {
                                    $(this).index() >= (setting.css.maxPart - 1) && $(this).hide();
                                    $(this).index() < (setting.css.maxPart - 1) && $(this).show();
                                })
                            }else {
                                _scroll.deleteScrollbox(_lv);
                            }
                        })
                    }
                });
                $(obj).children("li").length==1&&$(".treeList").prev().text($(obj).children("li:first-child").children("span").text());
            }
            //END
            $(obj).parent().siblings().bind("click", function () {
                $(".TreeLevel0").hide();
                $(".scroll-group").hide();
            });
            $(obj).siblings(".nav-header").bind("click",function(){
                $(this).siblings(".TreeLevel0").toggle();
                //$(".treeList").text()!=""&& $(".treeList").text("");
                $(".scroll-group").toggle();
            }).siblings(".TreeLevel0").hide();
            if($(".iframe-cot").height()<(setting.css.maxPart * 34+50)){
                $(".iframe-cot").css("min-height",setting.css.maxPart * 34+50+"px");
            }
        }
    }
})(jQuery);