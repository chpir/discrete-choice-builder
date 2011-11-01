// Add index to the attributes
 $.each(data['attributes'], function(i, item) {
   item['index'] = i
 })

 // Create template for checkboxes
 var checkboxTemplate = '\
 <ul class="inputs-list">\
 {{#attributes}}\
   <li><label><input type="checkbox" data-index="{{index}}" class="chck" {{^hidden}}checked="checked"{{/hidden}}> {{name}}</label></li>\
 {{/attributes}}\
 </ul>\
 ';

 // Create template for table
 var tableTemplate1 = '\
 <table> \
   <tr><th>Name</th><th>Choice A</th><th>Choice B</th></tr> \
   {{#attributes}}\
     {{^hidden}}\
       <tr><td width="200">{{name}}</td><td width="200">{{choice_a}}</td><td>{{choice_b}}</td></tr> \
     {{/hidden}}\
   {{/attributes}}\
 </table>\
 ';
 var tableTemplate2 = '\
 <table> \
   <tr><th>Name</th><th>Choice A</th><th>Choice B</th></tr> \
   {{#attributes}}\
     {{^hidden}}\
       <tr><td>{{name}}</td><td>{{choice_a}}</td><td>{{choice_b}}</td></tr> \
     {{/hidden}}\
   {{/attributes}}\
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
     var rand2 = Math.floor(Math.random()*attr['levels'].length)
     attr['choice_a'] = attr['levels'][rand1]
     attr['choice_b'] = attr['levels'][rand2]
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