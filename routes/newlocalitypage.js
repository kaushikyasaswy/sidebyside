var mysql = require('mysql');
var session = require('client-sessions');
var config = require('./../configuration/config');


var connection_data = {
	host     : config.db_host,
	user     : config.db_user,
	password : config.db_password,
	database : config.db_database
};

var process_individual_categories = function(res,categories_list, city, state, callback) {
       var state = state;
       var city = city;
       var categories_list_in = categories_list;
       var PythonShell = require('python-shell');
       console.log('Inside POST function');
       data = null;
       console.log('After Post function');
       var categories = categories_list_in.split(",");
       console.log('Categories:' + categories[0]);
       var connection_pool = mysql.createPool(connection_data);
       category_string = '';
       console.log('Category List: ' + categories); 
       var array = [];
       connection_pool.getConnection(function(err, connection)
       {
       for(var i = 0; i<categories.length; i++)
       {
       console.log('CATEGORY IS: ', categories[i]);
       var category_string = ' C2.category LIKE \'%' + categories[i] + '%\'';
       console.log('CATEGORY STRING IS: ', category_string);
       Query_string = 'select distinct B1.name, B1.full_address, B1.location, B1.stars, C3.price_range, C3.take_out, C3.waiter_service, C3.ambience_classy from business B1 inner join Categories C2 inner join Attributes C3 where B1.business_id = C2.business_id and C3.Business_id = C2.business_id and' + category_string + ' and B1.full_address LIKE \'%' + city + '%\' and B1.full_address LIKE \'%' + state + '%\' order by B1.stars desc;';
       console.log('Array Length: ' + array.length);
        if (err)
        {
              console.error('[neighborhood_form.js] : Error connecting to database : ' + err.stack);
              return;
        }  //Close_if
        console.log('Database successfully connected!');
        console.log('Category string: ', category_string);
        console.log('Query String: ' + Query_string);
        console.log('ARRAY IS: ' + array);
        connection.query(Query_string, function(err,rows,fields) {
        console.log('Rows are: ', rows);
        if(rows.length == 0) return null;
        console.log('Rows: ', rows[0].full_address);
                  var path = 'myfile.txt',
                  fs = require('fs');
                  data = null;
                  var location_keys = {};
                for(var i=0; i<rows.length; i++)
                {
                    console.log('Location is: ' + rows[i].location);
                    if((rows[i].location + "\n") in location_keys == true)
                        console.log('Continuing..');
                    else
                    {
                        location_keys[rows[i].location + "\n"] = 1;
                        console.log('Location Keys Updated!');
                        console.log('Location_Keys: ' + location_keys);
                    }
                }//for
                console.log('Location Keys: ', location_keys);
                for(var x in location_keys)
                {
                    if(data==null)
                      data = x + "\n";
                    else
                      data = data + x + "\n";
                }
                console.log("Data is: " + data);
                console.log("End of Data");
                write_address_contents(data);
                write_value_contents(rows);
                ret_val = execute_neighborhoods(res);
                console.log('NEIGHBORHOODS ARE: ' + ret_val);
                //res.render('neighborhood_form', { neighborhoods: ret_val});


        });
        //START


      }
      });
};


/*
var process_individual_categories = function(categories, city, state, callback) {
console.log('Categories: ', categories_list);
var categories_list = categories.split(",");
for(var i=0; i<categories_list.length; i++)
{
   console.log('Category is: ', categories_list[i]);

}
console.log('City: ', city);
console.log('State: ', state);
};
*/


var execute_neighborhoods = function(res) {
console.log('Before python call');
var Process = require("child_process").spawn('python', ["python/neighborhoods.py",0,1]);
console.log('After python call');
rows_data = null;
fs.readFile('neighborhoods.txt', 'utf8', function(err, data) {
  if (err) throw err;
  console.log('DATA IS: ' + data);
  var locations = [];
  var flag = false;
  var str = "";
  for (var i=0; i<data.length; i++) {
  	if (data[i] == '\'' && flag == false) {
  		flag = true;
  		continue;
  	}
  	else if (data[i] == '\'' && flag == true) {
  		if (str.length > 5) {
  			locations.push(str);
  		}
  		str = "";
  		flag = false;
  		continue;
  	}
  	else if (flag == true) {
  		str += data[i];
  		continue;
  	}
  }
  console.log('Locations are '+locations[1]);
  res.render('neighborhood_form', { neighborhoods: data });
});
}; 


var write_value_contents = function(val, callback){
  console.log('Rows length: ' + val.length);
  rows = val;
  fs.open('values.txt', 'w+', function(err, data) {
   if(err) {
          console.log('ERROR! ' + err);
   } else {
   for(var i=0; i<rows.length; i++)
   {
      console.log('i is: ' + i);
      values = rows[i].stars + "\t" + rows[i].price_range + "\t" + rows[i].take_out + "\t" + rows[i].waiter_service + "\t" + rows[i].ambience_classy;
      values = values + '\n';
      buffer = new Buffer(values);
      fs.write(data, buffer, 0, buffer.length, null, function(err) {
      if(err) console.log('ERROR! ' + err);
      fs.close(data, function() {
         console.log('All individual values written to file');
        })
      });
    }
console.log('Hi there!?!?!');
    }
}); //DONE
};

var write_address_contents = function(val, callback){
  fs = require('fs');
  console.log('Log is: ' + val);
  buffer = new Buffer(data);
  fs.open('address.txt', 'w+', function(err, data) {
  if(err) {
    console.log("Error opening file " + err);
  }
  fs.write(data, buffer, 0, buffer.length, null, function(err) { 
   if(err) console.log('ERROR! ' + err);
    fs.close(data, function() {
        console.log('All address values written to file');
      })
    });
});
};



exports.showlocations = function(req, res){
	var state = req.query.state;
       var city = req.query.city;
       var categories_list = req.query.categories_list;
       var PythonShell = require('python-shell');
       console.log('Inside POST function');
       data = null;
       console.log('After Post function');
	     console.log('State: ' + req.query.state);
	     console.log('City: ' + req.query.city);
	     console.log('Categories List:' + req.query.categories_list);
       var categories = req.query.categories_list.split(",");
       console.log('Categories:' + categories[0]);   
       var connection_pool = mysql.createPool(connection_data);
       category_string = '';
       for(var i = 0; i<categories.length; i++)
       {
          if(i==0)
             category_string = ' C2.category LIKE \'%' + categories[i] + '%\' ';
          else
             category_string = category_string + ' and C2.category LIKE \'%' + categories[i] + '%\' ';
       }  //Close_for
       connection_pool.getConnection(function(err, connection) 
       {
        if (err) 
        {
              console.error('[neighborhood_form.js] : Error connecting to database : ' + err.stack);
              return;
        }  //Close_if
        //SENTENCE LAST
        console.log('Database successfully connected!');
        Query_string = 'select distinct B1.name, B1.full_address, B1.location, B1.stars, C3.price_range, C3.take_out, C3.waiter_service, C3.ambience_classy from business B1 inner join Categories C2 inner join Attributes C3 where B1.business_id = C2.business_id and C3.Business_id = C2.business_id and' + category_string + ' and B1.full_address LIKE \'%' + req.query.city + '%\' and B1.full_address LIKE \'%' + req.query.state + '%\' order by B1.stars desc;'
        console.log('Query String: ' + Query_string);
        connection.query(Query_string, function(err,rows,fields) {
              if((rows==null) || (!rows.length)) 
              {
                console.log('Rows are: NULL');
        //Individial Category
                  for(var i = 0; i<categories.length; i++)
                  {
                      category_string = ' C2.category LIKE \'%' + categories[i] + '%\' ';
                       console.log('Category: ' + category_string);
                  }
                  process_individual_categories(res,categories_list, city, state); 
              } 
              else 
              {
                  console.log('Rows: ', rows[0].full_address);
                  var path = 'myfile.txt',
                  fs = require('fs');
                  data = null;
                  var location_keys = {};
                for(var i=0; i<rows.length; i++)
                {
  		    console.log('Location is: ' + rows[i].location); 
                    if((rows[i].location + "\n") in location_keys == true)
                        console.log('Continuing..');
                    else  
                    {
                        location_keys[rows[i].location + "\n"] = 1;
                        console.log('Location Keys Updated!');
                        console.log('Location_Keys: ' + location_keys);
                    }
                }//for
                console.log('Location Keys: ', location_keys);
                for(var x in location_keys)
                {
                    if(data==null)
                      data = x + "\n";
                    else
                      data = data + x + "\n";
                }
                console.log("Data is: " + data);
                console.log("End of Data");
                write_address_contents(data);
                write_value_contents(rows);
                execute_neighborhoods(res);
                //console.log('NEIGHBORHOODS ARE: ' + ret_val);
                //res.render('neighborhood_form', { neighborhoods: ret_val});
              }//else end
        });
  
	});
}