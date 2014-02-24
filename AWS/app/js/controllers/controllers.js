'use strict';

/**
 * Main AWS Application Controller
 * LayoutCtrl - TODO
 * WeaveLaunchCtrl - TODO 
 * PanelGenericCtrl <TODO rename> - Displays the dashboard portlets and their data. 
 */
angular.module("aws.Main", [])
.controller("LayoutCtrl", function($scope){
	$scope.leftPanelUrl = "./tpls/leftPanel.tpls.html";
	$scope.analysisUrl = "./tpls/analysis.tpls.html";
	$scope.weaveInstancePanel = "./tpls/weave.tpls.html";
	$scope.projectManagementUrl = "./tpls/ProjectManagementPanel.tpls.html";
	
	$scope.$watch(function(){
		return aws.timeLogString;
	},function(oldVal, newVal){
		$("#LogBox").append(newVal);
	});
});

