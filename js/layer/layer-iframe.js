/*! layer-v2.1 弹层组件 License LGPL  http://layer.layui.com/ By 贤心 */
var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
//返回方法
function returnValue(value){
	//父窗口接收值
	parent.acceptValue(value);
	//层关闭
	parent.layer.close(index);
}
