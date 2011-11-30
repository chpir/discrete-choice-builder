// Add index to the attributes
 $.each(data['attributes'], function(i, item) {
   item['index'] = i
 })
 
 // Create template for table
 var tableTemplate1 = '\
 <table style="text-align:center width="80%"> \
 <col width=12%> \
 <col width=22%> \
 <col width=22%> \
   <tr> \
   <td></td>\
   <td style="text-align:center"><h3>Option A</td>\
   <td style="text-align:center"><h3>Option B</td>\
   </tr> \
   {{#attributes}}\
     {{^hidden}}\
       <tr><td style="padding:20"><b><font size=+0>{{{name}}}</b><br><br><br><br><br><br><br><br></td><td style="text-align:center"><font size=+0>{{{choice_a}}}<br>{{#choice_a_image}}<img class="level-image" src="gr/{{{choice_a_image}}}" {{{choice_a_specs}}}>{{/choice_a_image}}</td><td style="text-align:center"><font size=+0>{{{choice_b}}}<br>{{#choice_b_image}}<img class="level-image" src="gr/{{{choice_b_image}}}" {{{choice_b_specs}}}>{{/choice_b_image}}</td></tr> \
     {{/hidden}}\
   {{/attributes}}\
   <tr></tr>\
   <tr><td><h4></b></td>\
   <td style="text-align:center" onClick=window.location="#lower"><h3><font color="red">Option A</td>\
   <td style="text-align:center" onClick=window.location="#lower"><h3><font color="red">Option B</td>\
 </table>\
 ';
 var tableTemplate2 = '\
 <table style="text-align:center width="80%"> \
 <col width=10%> \
 <col width=23%> \
 <col width=23%> \
 <col width=15%> \
   <tr> \
   <td></td>\
   <td style="text-align:center"><h3>Option A</td>\
   <td style="text-align:center"><h3>Option B</td> \
   <td style="text-align:center"><h3>Not now</td></tr> \
   {{#attributes}}\
     {{^hidden}}\
       <tr><td><b><font size=+1>{{name}}<br><br><br><br><br><br><br><br></font></td><td style="text-align:center"><font size=+1>{{{choice_a}}}<br>{{#choice_a_image}}<img class="level-image" src="gr/{{{choice_a_image}}}"  {{{choice_a_specs}}}>{{/choice_a_image}}</td><td style="text-align:center"><font size=+1>{{{choice_b}}}<br>{{#choice_b_image}}<img class="level-image" src="gr/{{{choice_b_image}}}"  {{{choice_b_specs}}}>{{/choice_b_image}}</td>\
       <td></td></tr> \
     {{/hidden}}\
   {{/attributes}}\
   <tr><td><h3>Please select one:</b></td>\
   <td style="text-align:center" onClick=window.location="#upper"><h3><font color="red">Option A</td>\
   <td style="text-align:center" onClick=window.location="#upper"><h3><font color="red">Option B</td>\
   <td style="text-align:center" onClick=window.location="#upper"><h3><font color="red">Not now</td></tr> \
 </table>\
 ';
 

// Create template for checkboxes
 var checkboxTemplate = '\
 <table> \
 <col width=20%> \
 <col width=40%> \
 <col width=10%> \
 <col width=10%> \
 <col width=10%> \
 <tr><td><b>Attribute</td><td><b>Levels</td><td style="text-align:center"><b>Fixed?</td><td style="text-align:center"><b>Table</td><td style="text-align:center"><b>With</td></tr>\
 <ul class="inputs-list">\
 {{#attributes}}\
 <tr><td>\
<input type="checkbox" data-index="{{index}}" class="chck" {{^hidden}}checked="checked"{{/hidden}}> {{{name}}}\
 </td><td class="levels">\
	{{{levels}}}\
 </td>\
 <td class="chck" style="text-align:center">\
   <input type="checkbox" id="chck-fixed-{{index}}" {{#fixed}}checked="checked"{{/fixed}}>\
 </td><td style="text-align:center">\
 	{{table}}\
 </td><td style="text-align:center">\
 	{{with}}\
 </td>\
  </tr>\
 {{/attributes}}\
 </ul>\
 </table>\
 ';
 // From http://sedition.com/perl/javascript-fy.html
 function fisherYates ( myArray ) {
   var i = myArray.length;
   if ( i == 0 ) return false;
   while ( --i ) {
      var j = Math.floor( Math.random() * ( i + 1 ) );
      var tempi = myArray[i];
      var tempj = myArray[j];
      myArray[i] = tempj;
      myArray[j] = tempi;
    }
 }

 function randomizeAttributes() {
   var out = {'attributes': []}
   var len = data['attributes'].length;

   // Randomize display order of attributes
   var order = []
   for(var i=0; i<len; i++) {
     order[i] = i;
   }
   fisherYates(order);
   while(order.length > 0) {
     o = order[0];
     var w = data['attributes'][o]['with']
     if(w === false) {
       out['attributes'].push(data['attributes'][o])

       // Remove from order so it isn't added again
       order.splice($.inArray(o, order), 1);
     }
     else {
       // Find all the attribute objects with this "with" identifier
       $.each(data['attributes'], function (j, a) {
         if(a['with'] == w) {
           // Add to out
           out['attributes'].push(a)

           // Remove from order so it isn't added again
           order.splice($.inArray(j, order), 1);
         }
       });
     }
   }
   data = out;
   englishData = dataForLanguage("english", data);
   swahiliData = dataForLanguage("swahili", data);
   if(data['attributes'][0]['choice_a_index']) {
     addRandomLevelsToLanguages();
   }
}

 function randomizeLevels() {
   // Randomize option a and option b
   $.each(data['attributes'], function(i, attr){
     var rand1 = Math.floor(Math.random()*attr['levels']['english'].length)
     if($('#chck-fixed-'+attr['index']+':checked').length > 0) {
     	var rand2 = rand1
     }
     else {
    	 var rand2 = Math.floor(Math.random()*attr['levels']['english'].length)
     }
     attr['choice_a_index'] = rand1
     attr['choice_b_index'] = rand2
     addRandomLevelsToLanguages();
     
     implementConstraints();
   });
 }

function implementConstraints() {
   $.each(englishData['attributes'], function(i, attr){
   });
}

function addRandomLevelsToLanguages() {
  $.each(data['attributes'], function(i, attr){
    englishData['attributes'][i]['choice_a'] = attr['levels']['english'][attr['choice_a_index']] 
    englishData['attributes'][i]['choice_b'] = attr['levels']['english'][attr['choice_b_index']]
    englishData['attributes'][i]['choice_a_image'] = attr['images'][attr['choice_a_index']] 
    englishData['attributes'][i]['choice_b_image'] = attr['images'][attr['choice_b_index']]

	if (attr['imagespecs'][attr['choice_a_index']] =="") {
    	englishData['attributes'][i]['choice_a_specs'] = "width=\"150\" height=\"110\""
    	swahiliData['attributes'][i]['choice_a_specs'] = "width=\"150\" height=\"110\""
	}
	else {
    	englishData['attributes'][i]['choice_a_specs'] = attr['imagespecs'][attr['choice_a_index']]
    	swahiliData['attributes'][i]['choice_a_specs'] = attr['imagespecs'][attr['choice_a_index']]
	}
	if (attr['imagespecs'][attr['choice_b_index']] =="") {
    	englishData['attributes'][i]['choice_b_specs'] = "width=\"150\" height=\"110\""
    	swahiliData['attributes'][i]['choice_b_specs'] = "width=\"150\" height=\"110\""
	}
	else {
    	englishData['attributes'][i]['choice_b_specs'] = attr['imagespecs'][attr['choice_b_index']]
    	swahiliData['attributes'][i]['choice_b_specs'] = attr['imagespecs'][attr['choice_b_index']]
	}
    swahiliData['attributes'][i]['choice_a'] = attr['levels']['swahili'][attr['choice_a_index']]
    swahiliData['attributes'][i]['choice_b'] = attr['levels']['swahili'][attr['choice_b_index']]
    swahiliData['attributes'][i]['choice_a_image'] = attr['images'][attr['choice_a_index']]
    swahiliData['attributes'][i]['choice_b_image'] = attr['images'][attr['choice_b_index']]

    swahiliData['attributes'][i]['choice_a_specs'] = "width=\"150\" height=\"110\"" 
    swahiliData['attributes'][i]['choice_b_specs'] = "width=\"150\" height=\"110\"" 

  });
}


 function reRandomizeAttributes() {
   randomizeAttributes();
    updateTables();
 }
 
 function reRandomizeLevels() {
   randomizeLevels();
   updateTables();
 }

 function updateCheckboxes(template) {
  var d;
   if(language == "English") {
    d = englishData;
   }
   else if(language == "Swahili") {
    d = swahiliData;
  }
   $('#checkboxes').html(Mustache.to_html(template, d));
   $('.levels').each(function(i, elem) {
   		var $elem = $(elem);
   		var newHtml = "<ol>"+$.map($elem.text().split(/,/g), function(val) {
   			return "<li>"+val+"</li>"
   		}).join('')+"</ol>";
   		$elem.html(newHtml);
  	});
 }

 function getDataForTable(data, tableNumber) {
 	var out = {'attributes': []}
	for (i=0; i<data['attributes'].length; i++) {
		if(data['attributes'][i]['table'] == tableNumber) {
		 	out['attributes'].push(data['attributes'][i]);	
		}
	}
	return out;
 }
 
 function updateTables() {
  var d;
   if(language == "English") {
    d = englishData;
   }
   else if(language == "Swahili") {
    d = swahiliData;
  }
  $('#table1').html(Mustache.to_html(tableTemplate1, getDataForTable(d, 1)));
  
  $('#table2').html(Mustache.to_html(tableTemplate2, getDataForTable(d, 2)));

 }

 function english() {
	 language = "English";
	 updateTables();
   updateCheckboxes(checkboxTemplate);
 }

 function swahili() {
	 language = "Swahili";
	 updateTables();
   updateCheckboxes(checkboxTemplate);
 }

function dataForLanguage(language, data) {
  var languageData = $.extend(true, {}, data); // Deep clone of data
  $.each(languageData['attributes'], function(i){
    languageData['attributes'][i]['name'] = languageData['attributes'][i]['name'][language];
    languageData['attributes'][i]['levels'] = languageData['attributes'][i]['levels'][language];    
  });
  return languageData;
}

 // Initially randomize data
 var englishData;
 var swahiliData;
 randomizeAttributes(); // must run before randomizeLevels to instantiate the lang-specific obj
 randomizeLevels();
 var language = "English";



 $(function() { // This block runs on page load.
   updateCheckboxes(checkboxTemplate);
   updateTables();

   // bind listener to clicks on checkboxes
   $('.chck').click(function() {
     $this = $(this)
     $.each(data['attributes'], function(i, d){
       if (d['index'] == parseInt($this.data('index'))) {
         d['hidden'] = !$this.prop("checked");
         reRandomizeLevels();
         return false; //break
       };
     });
   });
 })