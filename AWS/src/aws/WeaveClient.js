goog.require('aws');
goog.provide('aws.WeaveClient');
	

/**
 * This is the constructor for the weave client class.
 *  we initialize the properties here. 
 * @param {Weave} weave An instance of weave
 * @constructor
 */
aws.WeaveClient = function (weave) {

	// the weave client only has this weave property.
	/** @type {Weave} */
	this.weave = weave;
	
};

/**
 * This function should be the public function 
 * 
 * @param {string} dataSourceName The name of the data source where the data will come from.
 * 
 */
aws.WeaveClient.prototype.newVisualization = function (visualization, dataSourceName) {
	
	var parameters = visualization["parameters"];
	var toolName;
	switch(visualization.type) {
		case 'MapTool':
			toolName = this.newMap(parameters["id"], parameters["title"], parameters["keyType"]);
			this.setPosition(toolName, "0%", "0%");
			return toolName;
		case 'ScatterPlotTool':
			toolName = this.newScatterPlot(parameters["X"], parameters["Y"], dataSourceName);
			this.setPosition(toolName, "50%", "50%");
			return toolName;
		case 'DataTable':
			toolName = this.newDatatable(parameters, dataSourceName);
			this.setPosition(toolName, "50%", "0%");
			return toolName;
		case 'BarChartTool' :
			toolName = this.newBarChart(parameters["sort"], parameters["label"], parameters["heights"], dataSourceName);
			this.setPosition(toolName, "0%", "50%");
			return toolName;
		default:
			return;
}
	
};

/**
 * This function should be the public function 
 * 
 * @param {string} dataSourceName The name of the data source where the data will come from.
 * 
 */
aws.WeaveClient.prototype.updateVisualization = function (visualization, dataSourceName) {
	
	var parameters = visualization["parameters"];
	var toolName;
	switch(visualization.type) {
		case 'MapTool':
			toolName = this.updateMap(visualization.toolName, parameters["id"], parameters["title"], parameters["keyType"]);
			this.setPosition(toolName, "0%", "0%");
			return toolName;
		case 'ScatterPlotTool':
			toolName = this.updateScatterPlot(visualization.toolName, parameters["X"], parameters["Y"], dataSourceName);
			this.setPosition(toolName, "50%", "50%");
			return toolName;
		case 'DataTable':
			toolName = this.updateDatatable(visualization.toolName, parameters, dataSourceName);
			this.setPosition(toolName, "50%", "0%");
			return toolName;
		case 'BarChartTool' :
			toolName = this.updateBarChart(visualization.toolName, parameters["sort"], parameters["label"], parameters["heights"], dataSourceName);
			this.setPosition(toolName, "0%", "50%");
			return toolName;
		default:
			return;
}
	
};

aws.WeaveClient.prototype.newMap = function (entityId, title, keyType){

    var toolName = this.weave.path().getValue('generateUniqueName("MapTool")');
    
    this.weave.path(toolName).request('MapTool');
    this.weave.path().push(toolName,'children', 'visualization', 'plotManager', 'plotters', 'Geometries')
    .request('weave.visualization.plotters::GeometryPlotter')
    .push('geometryColumn', 'internalDynamicColumn', null).request('ReferencedColumn')
    .push('dynamicColumnReference', null).request('HierarchyColumnReference')
    .state({dataSourceName :"WeaveDataSource",
      hierarchyPath : '<attribute keyType="' + keyType + '" weaveEntityId="' + entityId + '" title= "' + title + '" projection="EPSG:2964" dataType="geometry"/>'});
//    .state('line','color','defaultValue', 0x000000)
//    .exec('fill.color.internalDynamicColumn.globalName = "defaultColorColumn"');
    
    return toolName;
};

/**
 * This function accesses the weave instance and create a new scatter plot, regardless of wether or not 
 * there is an existing scatter plot.
 * 
 * @param {string} the name of the existing Map in Weave'se session state
 * @param {number} entityId The entityId of the geometry column.
 * @param {string} title the Title for the datasource
 * @param {string} keyType the weave keyType
 * @return {string} The name of the MapTool that was created. Visualizations are created at the root of the HashMap.
 * 		  
 */
aws.WeaveClient.prototype.updateMap = function (toolName,entityId, title, keyType){
	
	if(toolName == undefined)
		 toolName = this.weave.path().getValue('generateUniqueName("MapTool")');
   
   this.weave.path(toolName).request('MapTool');
   this.weave.path().push(toolName,'children', 'visualization', 'plotManager', 'plotters', 'Geometries')
   .request('weave.visualization.plotters::GeometryPlotter')
   .push('geometryColumn', 'internalDynamicColumn', null).request('ReferencedColumn')
   .push('dynamicColumnReference', null).request('HierarchyColumnReference')
   .state({dataSourceName :"WeaveDataSource",
     hierarchyPath : '<attribute keyType="' + keyType + '" weaveEntityId="' + entityId + '" title= "' + title + '" projection="EPSG:2964" dataType="geometry"/>'});
//   .state('line','color','defaultValue', 0x000000)
//   .exec('fill.color.internalDynamicColumn.globalName = "defaultColorColumn"');
   
   return toolName;
};

/**
 * This function accesses the weave instance and create a new scatter plot, regardless of wether or not 
 * there is an existing scatter plot.
 * 
 * @param {string} xColumnName A column for the X value on the scatter plot.
 * @param {string} yColumnName A column for the Y value on the scatter plot.
 * @param {string} dataSourceName
 *
 * @return The name of the created scatterplot.
 * 		  
 */
aws.WeaveClient.prototype.newScatterPlot = function (xColumnName, yColumnName, dataSourceName) {
	
	/** @type {string} */
	var toolName = this.weave.path().getValue('generateUniqueName("ScatterPlotTool")');//returns a string
	
	this.weave.path(toolName).request('ScatterPlotTool');
	
	var columnPathX = this.weave.path(toolName,'children','visualization', 'plotManager','plotters','plot','dataX').getPath();
	var columnPathY = this.weave.path(toolName,'children','visualization', 'plotManager','plotters','plot','dataY').getPath();
	
	this.setCSVColumn(dataSourceName,columnPathX, xColumnName );//setting the X column
	this.setCSVColumn(dataSourceName, columnPathY, yColumnName );//setting the Y column
	
	return toolName;
};

/**
 * This function updates the attributes of an existing scatter plot if there is one, otherwise creates a new Scatterplot
 * 
 * @param {string} toolName name of the tool in Weave's session state
 * @param {string} xColumnName A column for the X value on the scatter plot.
 * @param {string} yColumnName A column for the Y value on the scatter plot.
 * @param {string} dataSourceName
 *
 * @return The name of the scatterplot.
 * 		  
 */
aws.WeaveClient.prototype.updateScatterPlot = function(toolName, xColumnName, yColumnName, dataSourceName){
	/** @type {string} */
	if(toolName == undefined)
		toolName = this.weave.path().getValue('generateUniqueName("ScatterPlotTool")');//returns a string

	this.weave.path(toolName).request('ScatterPlotTool');
	
	var columnPathX = this.weave.path(toolName,'children','visualization', 'plotManager','plotters','plot','dataX').getPath();
	var columnPathY = this.weave.path(toolName,'children','visualization', 'plotManager','plotters','plot','dataY').getPath();
	
	this.setCSVColumn(dataSourceName,columnPathX, xColumnName );//setting the X column
	this.setCSVColumn(dataSourceName, columnPathY, yColumnName );//setting the Y column
	
	return toolName;
};

/**
 * This function accesses the weave instance and creates a new data table, regardless of whether or not
 * there is an existing data table.
 * 
 * @param {Array.<string>} columnNames Array of columns to put in the table
 * @param {string} dataSourceName the name of datasource to pull data from
 * 
 * @return The name of the created data table.
 */
aws.WeaveClient.prototype.newDatatable = function(columnNames, dataSourceName){
	
	var toolName = this.weave.path().getValue('generateUniqueName("DataTableTool")');//returns a string
	//this.weave.requestObject([toolName], 'DataTableTool');
	this.weave.path(toolName).request('DataTableTool');
	
	//loop through the columns requested
	for (var i in columnNames)
		{
			var columnPath = this.weave.path(toolName, 'columns', columnNames[i] ).getPath();
			this.setCSVColumn(dataSourceName, columnPath, columnNames[i]);
		}
	
	return toolName;
};

/**
 * This function accesses the weave instance and creates a new data table, regardless of whether or not
 * there is an existing data table.
 * 
 * @param {string} toolName name of the tool in Weave's session state
 * @param {Array.<string>} columnNames Array of columns to put in the table
 * @param {string} dataSourceName the name of datasource to pull data from
 * 
 * @return The name of the created data table.
 */
aws.WeaveClient.prototype.updateDatatable = function(toolName, columnNames, dataSourceName){

	/** @type {string} */
	if(toolName == undefined)
		toolName = this.weave.path().getValue('generateUniqueName("DataTableTool")');//returns a string
	
	//this.weave.requestObject([toolName], 'DataTableTool');
	this.weave.path(toolName).request('DataTableTool');
	
    this.weave.path(toolName, 'columns').state(null);

	//loop through the columns requested
	for (var i in columnNames)
		{
			var columnPath = this.weave.path(toolName, 'columns', columnNames[i] ).getPath();
			this.setCSVColumn(dataSourceName, columnPath, columnNames[i]);
			//this.setCSVColumn(dataSourceName, [toolName,'columns',columnNames[i]], columnNames[i]);
			
		}
	
	return toolName;
};
	
/**
 * this function accesses the weave instance and creates a new Radviz tool
 * @param {Array.<string>} columnNames array of columns to be used as dimensional anchors
 * @param {string} dataSourceName the name of the datasource to pull the data from
 * 
 * @return the name of the created Radviz tool
 * 
 */

aws.WeaveClient.prototype.newRadviz = function(columnNames, dataSourceName){
	var toolName = this.weave.path().getValue('generateUniqueName("RadVizTool")');//returns a string
	//this.weave.requestObject([toolName], 'RadVizTool');
	this.weave.path(toolName).request('RadVizTool');
	
	//populating the Dimensional Anchors
	for(var i in columnNames){
		var columnPath = this.weave.path(toolName,toolName, 'children', 'visualization','plotManager', 'plotters','plot','columns',columnNames[i] ).getPath();
		this.setCSVColumn(dataSourceName, columnPath, columnNames[i]);
	}
};
	
/**
 * this function accesses the weave instance and creates a new Radviz tool
 * @param {string} toolName name of the tool in Weave's session state
 * @param {Array.<string>} columnNames array of columns to be used as dimensional anchors
 * @param {string} dataSourceName the name of the datasource to pull the data from
 * 
 * @return the name of the created Radviz tool
 * 
 */

aws.WeaveClient.prototype.updateRadviz = function(toolName, columnNames, dataSourceName){
	
	/** @type {string} */
	if(toolName == undefined)
		toolName = this.weave.path().getValue('generateUniqueName("RadVizTool")');//returns a string

	this.weave.path(toolName).request('RadVizTool');
	
	//populating the Dimensional Anchors
	for(var i in columnNames){
		var columnPath = this.weave.path(toolName,toolName, 'children', 'visualization','plotManager', 'plotters','plot','columns',columnNames[i] ).getPath();
		this.setCSVColumn(dataSourceName, columnPath, columnNames[i]);
	}
};

/**
 * This function accesses the weave instance and create a new bar chart, regardless of whether or not 
 * there is an existing bar chart.
 * 
 * @param {string} label the column name used for label.
 * @param {string} sort a column name used for the barchart sort column.
 * @param {Array.<string>} heights an array of heights columns used for the barchart heights.
 * @param {string} dataSourceName name of the datasource to pick columns from
 * @return the name of the created bar chart.
 * 		   
 */
aws.WeaveClient.prototype.newBarChart = function (sort, label, heights, dataSourceName) {
	
	var toolName = this.weave.path().getValue('generateUniqueName("CompoundBarChartTool")');//returns a string
	
	this.weave.path(toolName).request('CompoundBarChartTool');

	var labelPath = this.weave.path(toolName, 'children','visualization', 'plotManager','plotters', 'plot', 'labelColumn').getPath(); 
	var sortColumnPath = this.weave.path(toolName, 'children','visualization', 'plotManager','plotters', 'plot', 'sortColumn').getPath();

	
   	this.setCSVColumn(dataSourceName,labelPath, label);
    this.setCSVColumn(dataSourceName, sortColumnPath, sort);

    this.weave.path(toolName, 'children', 'visualization', 'plotManager', 'plotters', 'plot', 'heightColumns').state(null);
    
    for (var i in heights)
	{
		var heightColumnPath = this.weave.path(toolName, 'children', 'visualization', 'plotManager', 'plotters', 'plot', 'heightColumns',heights[i]).getPath();
		this.setCSVColumn(dataSourceName, heightColumnPath, heights[i]);
	}
    
	return toolName;
};

/**
 * This function accesses the weave instance and create a new bar chart, regardless of whether or not 
 * there is an existing bar chart.
 * @param {string} toolName name of the tool in Weave's session state
 * @param {string} label the column name used for label.
 * @param {string} sort a column name used for the barchart sort column.
 * @param {Array.<string>} heights an array of heights columns used for the barchart heights.
 * @param {string} dataSourceName name of the datasource to pick columns from
 * @return the name of the created bar chart.
 * 		   
 */
aws.WeaveClient.prototype.updateBarChart = function (toolName, sort, label, heights, dataSourceName) {
	
	/** @type {string} */
	if(toolName == undefined)
		toolName = this.weave.path().getValue('generateUniqueName("CompoundBarChartTool")');//returns a string
		this.weave.path(toolName).request('CompoundBarChartTool');

	var labelPath = this.weave.path(toolName, 'children','visualization', 'plotManager','plotters', 'plot', 'labelColumn').getPath(); 
	var sortColumnPath = this.weave.path(toolName, 'children','visualization', 'plotManager','plotters', 'plot', 'sortColumn').getPath();

	
   	this.setCSVColumn(dataSourceName,labelPath, label);
    this.setCSVColumn(dataSourceName, sortColumnPath, sort);
    
    this.weave.path(toolName, 'children', 'visualization', 'plotManager', 'plotters', 'plot', 'heightColumns').state(null);

    for (var i in heights)
	{
		var heightColumnPath = this.weave.path(toolName, 'children', 'visualization', 'plotManager', 'plotters', 'plot', 'heightColumns',heights[i]).getPath();
		this.setCSVColumn(dataSourceName, heightColumnPath, heights[i]);
	}
    
	return toolName;
};

/**
 * This function accesses the weave instance and sets the position of a given visualization
 * If there is no such panel the behavior is unknown.
 * 
 * @param {string} toolName the name of the tool.
 * @param {string} posX the new X position of the panel in percent form.
 * @param {string} posY the new Y position of the panel in percent form.
 * 
 * @return void
 * 
 */
aws.WeaveClient.prototype.setPosition = function (toolName, posX, posY) {
	
	//this.weave.path([toolName]).push('panelX').state(posX).pop().push('panelY').state(posY);
	this.weave.path(toolName).push('panelX').state(posX).pop().push('panelY').state(posY);
};


/**
 * This function accesses the weave instance and creates a new csv data source from string.
 * 
 * 
 * @param {string} csvDataString CSV data source in string format.
 * @param {string} dataSourceName the name of the data source.
 * @param {string} keyType the key type
 * @param {string} keyColName the key column name
 * @return The name of the created data source.
 * 
 */
aws.WeaveClient.prototype.addCSVDataSourceFromString = function (csvDataString, dataSourceName, keyType, keyColName) {
	
	if (dataSourceName == "") {
		 dataSourceName = this.weave.path().getValue('generateUniqueName("CSVDataSource")');
	}

	this.weave.path(dataSourceName)
		.request('CSVDataSource')
		.vars({data: csvDataString})
		.exec('setCSVDataString(data)');
		this.weave.path(dataSourceName).state({keyType : keyType,
											  keyColName : keyColName});
	
	return dataSourceName;
	
};

/**
 * This function accesses the weave instance and creates a new csv data source from a two dimensional array
 * 
 * @param {Array.<Array>} csvDataMatrix a two dimensional array.
 * @param {string} dataSourceName the name of the data source.
 * @param {string} keyType the key type
 * @param {string} keyColName the key column name
 * @return The name of the created data source.
 * 
 */
aws.WeaveClient.prototype.addCSVDataSource = function(csvDataMatrix, dataSourceName, keyType, keyColName)
{
	if(dataSourceName == ""){
		dataSourceName = this.weave.path().getValue('generateUniqueName("CSVDataSource")');
	}

	this.weave.path(dataSourceName)
		.request('CSVDataSource')
		.vars({rows: csvDataMatrix})
		.exec('setCSVData(rows)');
		this.weave.path(dataSourceName).state({keyType : keyType,
											   keyColName : keyColName});
	return dataSourceName;
	
};

/**
 * This function sets the session state of a column from another in the Weava instance
 * @param {string} csvDataSourceName CSV Datasource to choose column from
 * @param {WeavePathArray} columnPath relative path of the column
 * @param {string} columnName name of the column
 * @return void
 */
aws.WeaveClient.prototype.setCSVColumn = function (csvDataSourceName, columnPath, columnName){
//	this.weave.path([csvDataSourceName])
//			  .vars({i:columnName, p:columnPath})
//			  .exec('putColumn(i,p)');
	
	this.weave.path(csvDataSourceName)
			  .vars({i:columnName, p:columnPath})
			  .exec('putColumn(i,p)');
};

/**
 * This function accesses the weave instance and sets the global color attribute column
 * 
 * @param {string} colorColumnName
 * @param {string} csvDataSource // TODO specify the type
 * 
 * @return void
 */
aws.WeaveClient.prototype.setColorAttribute = function(colorColumnName, csvDataSource) {
	
	//this.setCSVColumn(csvDataSource,['defaultColorDataColumn', 'internalDynamicColumn'], colorColumnName);
	var colorPath = this.weave.path('defaultColorDataColumn', 'internalDynamicColumn').getPath();
	this.setCSVColumn(csvDataSource, colorPath, colorColumnName);
	};

/**
 * This function accesses the weave instance and sets the title of a visualization tool given the tool name
 * 
 * @param {string} toolName
 * @param {boolean} enableTitle
 * @param {string} title // TODO specify the type
 * 
 * @return void
 */
aws.WeaveClient.prototype.setVisualizationTitle = function(toolName, enableTitle, title) {
	
	this.weave.path(toolName, 'enableTitle').state(enableTitle);
	this.weave.path(toolName, 'panelTitle').state(title);
	
};

/**
 * This function clears the visualizations before any new query is run
 * it removes everything in the session state EXCEPT for the elements in the array sent as a parameter for setSessionSate()
 * in this case everything except 'WeaveDataSource' will be removed
 * @return void
 */
aws.WeaveClient.prototype.clearWeave = function(){
	
	this.weave.path().state(['WeaveDataSource']);
};


/**
 * this function can be added as a callback to any visualization to get a log of time for every interaction involving that tool
 * @param {string} message to append; activity to report time for
 * 
 */
aws.WeaveClient.prototype.reportToolInteractionTime = function(message){
	
	var time = aws.reportTime();
	
	this.weave.evaluateExpression([], "WeaveAPI.ProgressIndictor.getNormalizedProgress()", {},['weave.api.WeaveAPI']); 
	
	console.log(time);
	try{
		$("#LogBox").append(time + message + "\n");
	}catch(e){
		//ignore
	}	
};
