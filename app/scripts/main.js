require.config({
  shim: {
  },

  paths: {
    jquery: 'vendor/jquery.min'
  }
});

require(['app'], function(app) {
  // use app here
  console.log(app);

  var $window = $(window)
  // side bar
  $('.docs-sidenav').affix({
    offset: {
      top: function () { return $window.width() <= 980 ? 290 : 210 }
    , bottom: 270
    }
  })

});
