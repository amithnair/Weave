angular.module('aws.projectManagementCtrl', [])
.controller("projectManagementCtrl", function($scope, queryService){
	
	//$scope.currentProjectSelection = "";//displays in the UI the current selected Project
	
	$scope.listOfProjects =[];
	$scope.listOfProjects = queryService.getListOfProjects();
	$scope.listItems = [];//list of JSON Objects 
	$scope.finalListOfQueryObjects= [];//corresponding list for UI
	$scope.currentQuerySelected = {};

	//as soon as the UI is updated fetch the project and the list of queryObjects within
	$scope.$watch('projectSelectorUI', function(){
		if($scope.projectSelectorUI != undefined && $scope.projectSelectorUI != ""){
			queryService.queryObject.projectSelected = $scope.projectSelectorUI;//updates UI
			//$scope.currentProjectSeletion = $scope.projectSelectorUI;
			
			queryService.getListOfQueryObjectsInProject($scope.projectSelectorUI);
				
		}
	});
	
	

	$scope.$watch(function() {
		return queryService.dataObject.listofQueryObjectsInProject;
	}, function() {
		$scope.listItems = queryService.dataObject.listofQueryObjectsInProject;
				for(var i in $scope.listItems){
					console.log("oneItem", $scope.listItems[i]);
		}
		
	});
	
	//updates the UI depending on the queryObject
	$scope.$watch(function(){
		return queryService.queryObject.projectSelected;
	}, function(){
		$scope.projectSelectorUI = queryService.queryObject.projectSelected;
	});
	
	
//	//as soon as project is selected create the list
//	$scope.$watch(function(){
//		return $scope.listItems;
//	}, function(){
//
//		
//		
//		
//		
//		//testing
//		var dropDownList = document.getElementById("queryObjectChoicesUI");
//		for(var i in $scope.listItems)
//		{
//			if($scope.listItems[i] === null)
//				{
//					break;
//				}
//			else{
//				
//				var tempListItem = $scope.listItems[i];//single JSON object//cast?
//				var children = new Array();
//				
//				var uiList = document.createElement("ul");
//					//for one list Option
//				var nameOption = document.createElement("li");//create list item
//				nameOption.appendChild(document.createTextNode("Title : " + tempListItem.title));//append to list
//				children.push(nameOption);
//				
//				var dataTableOption = document.createElement("li");//create list item
//				dataTableOption.appendChild(document.createTextNode("Script : "+ tempListItem.dataTable.title));//append to list
//				children.push(dataTableOption);
//				
//				
//				var dateOption = document.createElement("li");//create list item
//				dateOption.appendChild(document.createTextNode("Date Created : "+ tempListItem.date));//append to list
//				children.push(dateOption);
//				
//				var scriptOption = document.createElement("li");//create list item
//				scriptOption.appendChild(document.createTextNode("Script : "+ tempListItem.scriptSelected));//append to list
//				children.push(scriptOption);
//				
//				//creating button
//				var button = document.createElement("button");
//				button.setAttribute("id", i);
//				button.setAttribute("type", "button");
//				button.style.width = "500px";
//				button.style.height = "200px";
//				button.setAttribute("class", "btn btn-default");
//				button.onclick = function(){
//					//getting index
//					var index = parseInt(this.id);
//					$scope.currentQuerySelected = $scope.listItems[index];//getting the corresponding queryObject
//					console.log("current", $scope.currentQuerySelected);
//					;};
//				
//				//Appending the respective children
//				//uiList.appendChild(nameOption);
//				//uiList.appendChild(dateOption);
//				
//				for(child in children){
//					uiList.appendChild(children[child]);
//				}
//				button.appendChild(uiList);
//				dropDownList.appendChild(button);
//		
//			}
//				
//		}
//	});
	
     
	
	/****************Button Controls******************************/
	
	$scope.loadQueryInAnalysisBuilder = function(){
		//load that JSON queryObject
		
		queryService.queryObject = $scope.currentQuerySelected;
		console.log("updatedQuery", $scope.currentQuerySelected);
	};
	
	$scope.runQueryInAnalysisBuilder = function(){
		//call the run query function for regular run button
	};
});