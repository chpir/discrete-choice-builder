// Add index to the attributes
 $.each(data['attributes'], function(i, item) {
   item['index'] = i
 })

// Create template for checkboxes
 var checkboxTemplate = '\
 <table> \
 <tr><th width="200">Attribute</th><th >Levels</th><th >Fixed?</th><th >Table</th></tr>\
 <ul class="inputs-list">\
 {{#attributes}}\
 <tr><td>\
   <input type="checkbox" data-index="{{index}}" class="chck" {{^hidden}}checked="checked"{{/hidden}}> {{name}}\
 </td><td class="levels">\
	{{{levels}}}\
 </td>\
 </td><td class="chck">\
   <input type="checkbox" id="chck-fixed-{{index}}" {{#fixed}}checked="checked"{{/fixed}}>\
 </td><td>\
 	{{table}}\
 </td></tr>\
 {{/attributes}}\
 </ul>\
 </table>\
 ';
 
 // Create template for table
 var tableTemplate1 = '\
 <br><b>First, please tell me which of these HIV testing options you would prefer:</b><br>\
 <table class="zebra-striped"> \
   <tr><th width="150">Test characteristics</th><th width="150">Option A</th><th width="150">Option B</th></tr> \
   {{#attributes}}\
     {{^hidden}}\
       <tr><td>{{name}}</td><td>{{{choice_a}}}</td><td>{{{choice_b}}}</td></tr> \
     {{/hidden}}\
   {{/attributes}}\
   <tr></tr>\
   <tr><td colspan=3 align="center"><b>Which option do you prefer (A or B)?</b></td></tr> \
 </table>\
 ';
 var tableTemplate2 = '\
 <br><br><b>If this test were actually offered to you, in which location, if any, would you choose to test?</b><br>\
 <table class="zebra-striped"> \
   <tr><th width=180>Test Location</th><th width=165>Option A</th><th width=165>Option B</th><th width=50>No Test</th></tr> \
   {{#attributes}}\
     {{^hidden}}\
       <tr><td>{{name}}</td><td>{{choice_a}}</td><td>{{choice_b}}</td><td></td></tr> \
     {{/hidden}}\
   {{/attributes}}\
   <tr><td colspan=4><b>Which option would you choose (A, B, or No test)?</b></td></tr> \
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
     var rand1 = Math.floor(Math.random()*attr['levels'].length)
     if($('#chck-fixed-'+attr['index']+':checked').length > 0) {
     	var rand2 = rand1
     }
     else {
    	 var rand2 = Math.floor(Math.random()*attr['levels'].length)
     }
     attr['choice_a'] = attr['levels'][rand1]
     attr['choice_b'] = attr['levels'][rand2]

     attr['choice_a'] = attr['choice_a'].replace(">","\" width=\"150\" height=\"110\">")
     attr['choice_a'] = attr['choice_a'].replace("<","<br><img src=\"gr\\")
     
     attr['choice_b'] = attr['choice_b'].replace(">","\" width=\"150\" height=\"110\">")
     attr['choice_b'] = attr['choice_b'].replace("<","<br><img src=\"gr\\")

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


 // Initially randomize data
 var tableData = randomizeLevels(randomizeAttributes(data));


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