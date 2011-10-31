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
 var tableTemplate = '\
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

 function randomizeData(data) {
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

   // Randomize option a and option b
   $.each(out['attributes'], function(i, attr){
     var rand1 = rand2 = Math.floor(Math.random()*attr['levels'].length)
     while (rand1 == rand2) {
       rand2 = Math.floor(Math.random()*attr['levels'].length)
     }
     attr['choice_a'] = attr['levels'][rand1]
     attr['choice_b'] = attr['levels'][rand2]
   });
   return out;
 }

 function reRandomize() {
   tableData = randomizeData(tableData);
   updateTable(tableTemplate, tableData);
 }

 function updateCheckboxes(template, data) {
   $('#checkboxes').html(Mustache.to_html(template, data));
 }

 function updateTable(template, data) {
   $('#table').html(Mustache.to_html(template, data));
 }


 // Initially randomize data
 var tableData = randomizeData(data);


 $(function() { // This block runs on page load.
   
   updateCheckboxes(checkboxTemplate, data);
   updateTable(tableTemplate, tableData);
   
   // bind listener to clicks on checkboxes
   $('.chck').click(function() {
     $this = $(this)
     $.each(tableData['attributes'], function(i, d){
       if (d['index'] == parseInt($this.data('index'))) {
         d['hidden'] = !$this.prop("checked");
         updateTable(tableTemplate, tableData);
         return false; //break
       }
     });
   });
 })