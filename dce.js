// Add index to the attributes
 $.each(data['attributes'], function(i, item) {
   item['index'] = i
 })
 
 // Create template for table
 var tableTemplate1 = '\
 <table style="text-align:center width="80%"> \
 <col width=10%> \
 <col width=23%> \
 <col width=23%> \
   <tr> \
   <td></td>\
   <td style="text-align:center"><h3>Option A</td>\
   <td style="text-align:center"><h3>Option B</td>\
   </tr> \
   {{#attributes}}\
     {{^hidden}}\
       <tr><td style="padding:20"><b><font size=+1>{{{name}}}</b><br><br><br><br><br><br><br><br></td><td style="text-align:center"><font size=+1>{{{choice_a}}}</td><td style="text-align:center"><font size=+1>{{{choice_b}}}</td></tr> \
     {{/hidden}}\
   {{/attributes}}\
   <tr></tr>\
   <tr><td><h3>Please select one:</b></td>\
   <td style="text-align:center" onClick=window.location="#lower"><h3><font color="red">Option A</td>\
   <td style="text-align:center" onClick=window.location="#lower"><h3><font color="red">Option B</td>\
 </table>\
 ';
 var tableTemplate2 = '\
 <table > \
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
       <tr><td><b><font size=+1>{{name}}<br><br><br><br><br><br><br><br></font></td><td style="text-align:center"><font size=+1>{{{choice_a}}}</td><td style="text-align:center"><font size=+1>{{{choice_b}}}</td>\
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

 function randomizeAttributes(data) {
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
   return out;
}

 function randomizeLevels(data) {
   // Randomize option a and option b
   $.each(data['attributes'], function(i, attr){
     var rand1 = Math.floor(Math.random()*attr['levels']['english'].length)
     if($('#chck-fixed-'+attr['index']+':checked').length > 0) {
     	var rand2 = rand1
     }
     else {
    	 var rand2 = Math.floor(Math.random()*attr['levels'].length)
     }
     attr['choice_a_english'] = attr['levels']['english'][rand1]
     attr['choice_b_english'] = attr['levels']['english'][rand2]
     attr['choice_a_swahili'] = attr['levels']['swahili'][rand1]
     attr['choice_b_swahili'] = attr['levels']['swahili'][rand2]
   });
   return data;
 }

 function reRandomizeAttributes() {
   tableData = randomizeAttributes(tableData);
   updateTables(tableData);
 }
 
 function reRandomizeLevels() {
   tableData = randomizeLevels(tableData);
   updateTables(tableData);
 }

 function updateCheckboxes(template, data) {
   $('#checkboxes').html(Mustache.to_html(template, data));
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
 
 function updateTables(data) {
   $('#table1').html(Mustache.to_html(tableTemplate1, getDataForTable(data, 1)));
   
   $('#table2').html(Mustache.to_html(tableTemplate2, getDataForTable(data, 2)));
 }

 function english() {
	 var language = "English";
	 updateTables(tableData);
 }

 function swahili() {
	 var language = "Swahili";
	 updateTables(tableData);
 }

 // Initially randomize data
 var tableData = randomizeLevels(randomizeAttributes(data));
 var language = "English";


 $(function() { // This block runs on page load.
   
   updateCheckboxes(checkboxTemplate, data);
   updateTables(tableData);

   // bind listener to clicks on checkboxes
   $('.chck').click(function() {
     $this = $(this)
     $.each(tableData['attributes'], function(i, d){
       if (d['index'] == parseInt($this.data('index'))) {
         d['hidden'] = !$this.prop("checked");
         updateTables(tableData);
         return false; //break
       }
     });
   });
 })