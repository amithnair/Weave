/**
 * 
 */
angular.module('aws.projectManagementCtrl').directive('projectQueryButton', function($compile) {
  return {
	  restrict: 'E',
	  template: '<button style="width: 500px;" type="button" class="btn btn-default">' +
	  	'<ul><li>Title: {{$parent.query.title}}</li>' +
		  '</button>',
	  scope: {
		  //query: '@'
	  },
	  link: function(scope, element, attrs) {
		  console.log(attrs.item);
		  currentQuery= attrs.item;
		  element.bind('click', function(){
			  console.log(element.innerHTML);
		  });
	  } 
  	}; 
});
