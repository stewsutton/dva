"use strict";
const Promise = require('bluebird');
const axios = require('axios');

/**
 * Constructs a `viz` object
 *
 * This module is designed to be isomorphic meaning that it
 * works on the server or in the browser (via webpack or browserify)
 */
module.exports = () => {

  let dataset = {
    load: (id) => {
      return new Promise(function(resolve, reject) {
        axios.get(`/datasets/${id}`).then(function (response) {
          resolve(response)
        })
      });
    },

    /**
     * apply a bucket mapping to a dataset
     */
    applyBucketMapping: (data, mapping) => {

	var seriesKeys = [];
	var groupKeys = [];
	var valueKeys = [];

	var i;
	//gets the series key fields
	for(i = 0; i < mapping.series.length; i++){
		seriesKeys.push(mapping.series[i]);	
	}

	//gets the group key fields
       for(i = 0; i < mapping.group.length; i++){
                groupKeys.push(mapping.group[i]);
        }
		
	//gets the value key fields
        for(i = 0; i < mapping.value.length; i++){
                valueKeys.push(mapping.value[i]);
        }

	var returnObj = [];

	var k;	
	for(k = 0; k < data.length; k++){

		var seriesFinal = [];
		var groupFinal = [];
		var valueFinal = [];
	
		//compiles the series field
		for(i = 0; i < seriesKeys.length; i++){
			seriesFinal.push(data[k][seriesKeys[i]]);
		}
	
		//compiles the group field
       		for(i = 0; i < groupKeys.length; i++){
              		groupFinal.push(data[k][groupKeys[i]]);
       		 }

		//compiles the value field
      		for(i = 0; i < valueKeys.length; i++){
               		valueFinal.push(data[k][valueKeys[i]]);
        	}

		//compiles the necessary values into a JSON message
		var tmpObj = new Object;
		tmpObj.series = seriesFinal;
		tmpObj.group = groupFinal;
		tmpObj.value = valueFinal;
		
		//pushed the individual JSON onto an array
		returnObj.push(tmpObj);

	}	

	return returnObj;

	 }
  }
  

  return { dataset }
}
