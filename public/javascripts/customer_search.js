// var count = 0;
// var mysql = require("mysql");
// var session = require('client-sessions');
// var connection_data = {
// host     : 'startmeup.csnhsdifow1k.us-east-1.rds.amazonaws.com',
// user     : 'startmeup',
// password : 'puemtrats',
// database : 'project_yelp'
// };

$(function(){
  var states = [
    { value: 'Arizona', data: 'AZ' },
    { value: 'Pennsylvania', data: 'PA' },
    { value: 'Nevada', data: 'NV' },
    { value: 'North Carolina', data: 'NC' },
    { value: 'Wisconsin', data: 'WI' },
    { value: 'Illinois', data: 'IL' },
    { value: 'South Carolina', data: 'SC' },
    { value: 'Massachusetts', data: 'MA' },
  ];
  
  // setup autocomplete function pulling from currencies[] array
  $('#autocomplete').autocomplete({
    lookup: states,
    onSelect: function (suggestion) {
      var thehtml = '<strong>Currency Name:</strong> ' + suggestion.value + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
      $('#outputcontent').html(thehtml);
      createShape(suggestion.value);
      populate_restaurant(suggestion.value);
    }
  });

  $('#states').autocomplete({
    lookup: states,
    onSelect: function (suggestion) {
      var thehtml = '<strong>Currency Name:</strong> ' + suggestion.value + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
      $('#outputcontent').html(thehtml);
      createShape(suggestion.value);
      get_state(suggestion.data);
    }
  });

  $('#city').autocomplete({
    lookup: states,
    onSelect: function (suggestion) {
      var thehtml = '<strong>Currency Name:</strong> ' + suggestion.value + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
      $('#outputcontent').html(thehtml);
      createShape(suggestion.value);
      populate_restaurant(suggestion.value);
    }
  });
  
  function createShape(value) {
    if (count == 0) {
        $('#pictures').css("background-image", "url(indian.jpeg)");  
    }
  }

  function populate_restaurant() {
    var table = document.getElementById("results_table");
    first_row = table.rows[0];

    if (typeof first_row === 'undefined' || first_row.cells.length%2 == 0) {
        var row = table.insertRow(0);
        var cell = row.insertCell(0);
        cell.colspan = "2";
        cell.innerHTML = "a";
    } else {
        var row = table.rows[0];
        cell = row.getElementsByTagName("td");
        cell.colspan = "1";
        var cell2 = row.insertCell(1);
        cell2.innerHTML = "a";
    }
  }

  function get_state(data) {
    
  }

  function query_db(state) 
  {
    var connection_pool = mysql.createPool(connection_data);
    connection_pool.getConnection(function(err, connection) 
    {
        if (err) 
        {
            console.log("No connection bhai!");
            return;
        } 
  
    else 
    { 
      console.log("select distinct city from business where state='"+state+"'");
      connection.query("select distinct city from business where state='"+state+"'", [], function(err, results) 
      { 
        if ( err ) 
        { 
          console.log(err); 
        } 
        else 
        { 
          
          console.log(results[0]);
          connection.release(); 
          return results;
        } 
      }
      ); // end 
        //connection.execute 
    } 
    
  }); // end oracle.connect 
} 


});
