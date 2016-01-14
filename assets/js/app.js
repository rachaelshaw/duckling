angular.module('brushfire', ['toastr', 'compareTo', 'ui.bootstrap'])
  .config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      '*://www.youtube.com/**'
    ]);
  }])

.filter('spaceless', function() {
  return function(input) {
    if (input) {
      return input.replace(/\s+/g, '-');
    }
  };
});

angular.module('brushfire').run(['$http', function($http) {
  
  if (window.SAILS_LOCALS._csrf) {
    $http.defaults.headers.common['X-CSRF-Token'] = window.SAILS_LOCALS._csrf;
  }
}]);