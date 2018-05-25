var common = {
    tabs: function() {
        $(".tabs li").click(function() {
            $(this).parent().find("li").removeClass("active");
            $(this).addClass("active"); //Add "active" class to selected tab
            var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
            var url = $(this).find("a").attr("url");
            common.loadPage(activeTab, url)
            return false;
        });
    },
    redirect: function(url) {
      if(url) {
        location.href = url
      }
    },
    loadPage: function(el, url) {
        $('.tab-content').removeClass('active')
        $(el).addClass('active')
        console.log(el);
        if (el && url) {
            $(el).load(url)
        }
        return;
    },
    readOnlyAll: function(container, cb) {
      $(container).find('input,radio,textarea').attr('readonly', 'readonly')
      $(container).find('select').attr('disabled', true)
      cb()
    },
    cancelReadOnlyAll: function(container, cb) {
      $(container).find('input,radio,textarea').removeAttr('readonly')
      $(container).find('select').attr('disabled', false)
      cb()
    }
}
