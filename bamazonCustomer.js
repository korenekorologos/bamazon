//connects our required packages
var mysql = require("mysql"); 
var inquirer = ("inquirer"); 
var table = require("cli-table2");

//have the connection variable connect to mysql database
var connection = mysql.createConnection({
    host: "localhost",
    user: "", //left blank
    password: "", //left blank
    database: "bamazon_db", //schema name in mysql
    port: 3306 
}); 

//calls it 
connection.connect(); 

//displays the data tables 
var display = function() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log("-----------------------------");
      console.log("      Welcome To Bamazon    ");
      console.log("-----------------------------");
      console.log("");
      console.log("Find below our Products List");
      console.log("");
      var table = new Table({
        head: ["Product Id", "Product Description", "Cost"],
        colWidths: [12, 50, 8],
        colAligns: ["center", "left", "right"],
        style: {
          head: ["aqua"],
          compact: true
        }
      });
      //for loop 
      for (var i = 0; i < res.length; i++) {
        table.push([res[i].id, res[i].products_name, res[i].price]);
      }
  
      console.log(table.toString());
      console.log("");
      //shopping();
    }); //End Connection to products
  };
  display(); 



