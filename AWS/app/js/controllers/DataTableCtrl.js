/**
 * DataTable Module DataTableCtrl - Controls dialog button and closure.
 */
angular.module('aws.DataTable', []).controller('DataTableCtrl', function($scope, queryService) {

	queryService.queryObject.dataTable = {
			id : -1,
			title : ""
	};
	
	$scope.dataTableList = [];
	$scope.dataTableList = queryService.getDataTableList();
	
	//redundant code
//	$scope.$watch(function() {
//		return queryService.dataObject.dataTableList;//returns a list of data tables 
//	}, function() {
//		if(queryService.dataObject.hasOwnProperty("dataTableList")) {
//			for(var i=0; i < queryService.dataObject.dataTableList.length; i++) {//populates $scope.dataTabelList with json objects
//				dataTable = queryService.dataObject.dataTableList[i];
//				$scope.dataTableList.push( {
//											 id : dataTable.id ,
//											 title : dataTable.title
//											});
//			}
//		}
//	});
	
    $scope.$watch('dataTable', function() {
    	if ($scope.dataTable != undefined && $scope.dataTable != "") {
    		console.log($scope.dataTable);
    		//$scope.dataTable is a json
    		var dataTable = angular.fromJson($scope.dataTable);//conversion to an Object
    		queryService.queryObject.dataTable = dataTable; //updates the Query Object Panel on the left
    		if(dataTable.hasOwnProperty('id') && dataTable.id != null) {
    			queryService.getDataColumnsEntitiesFromId(dataTable.id);
    		}
    	}
    });
    
    $scope.$watch(function() {
    	return queryService.queryObject.dataTable;
    }, function() {
    	//updates the $scope.dataTable (UI) when a query is imported which requires conversion to Json
    	$scope.dataTable = angular.toJson(queryService.queryObject.dataTable);
    });
});