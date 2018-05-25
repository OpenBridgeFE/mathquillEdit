 function tabLoad(tab_href){
	 var tab_href;
	 //Default Action  
	 $(".tab-content").hide(); //Hide all content  
	 $(".tabs").each(function(i){
		 $(this).find("li:first").addClass("active").show()
	 })
	 $(".tab-contentmian").each(function(i){    	
		 // $(this).find(".tab-content:first").addClass("active").load(tab_href+"1.html").show();
	 })
	 
	 //On Click Event  
	 $(".tabs li").click(function() {
		 $(this).parent().find("li").removeClass("active");
		 $(this).addClass("active"); //Add "active" class to selected tab  
		 var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content 
		 $(activeTab).siblings().empty().hide();     //siblings()除了自己以外的同辈元素
		 var i=activeTab.substr(4);
		 console.log(i);
		 $(activeTab).load(tab_href+i+".html").fadeIn(); //Fade in the active content  
		 return false;
	 });      	
 }	 