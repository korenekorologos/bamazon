//connects our required packages
var mysql = require("mysql"); 
var inquirer = require("inquirer"); 
var tables = require("cli-table2");


//connection variable that connects to mysql database 
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bamazon_db",
    port: 3306
  });
  
  //calls it
  connection.connect();
  
  //use cli-table2 package to display the data table from mysql 
  var display = function() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log("-----------------------------");  //the decoration 
      console.log("Hey There, Welcome To Bamazon!");
      console.log("-----------------------------");
      console.log("");
      console.log("Check out our products list bellow...");
      console.log("");

      //our table variable that connects to the cli table 
      var table = new tables({
        head: ["Product Id", "Product Description", "Cost"],
        colWidths: [12, 50, 8],
        colAligns: ["center", "left", "right"],
        style: {
          head: ["aqua"],
          compact: true
        }
      });
  
  //for loop that uses the length of the result and then pushes the product name and price 
      for (var i = 0; i < res.length; i++) {
        table.push([res[i].id, res[i].products_name, res[i].price]);
      }
  
      console.log(table.toString());
      console.log("");
    //  shopping();
    }); 
  };
  
  //inquirer will prompt the user through a series of questions determine what product they would like 
     //to buy and also the quanity of the item  
  var shopping = function() {
    inquirer
      .prompt({
        name: "productToBuy",
        type: "input",
        message: "Enter the Product Id of the item you wish to buy."
      })
      .then(function(answer1) {
        var selection = answer1.productToBuy;
        connection.query("SELECT * FROM products WHERE Id=?", selection, function(
       //this^ connects the query to the database 
          err,
          res
        ) {
          if (err) throw err;  //throws error if they slect something that is not on the poduct list 
          if (res.length === 0) {
            console.log(
              "The product entered does not exist. Please choose a product id from the list above"
            );
              //calls it 
            shopping();
          } else {
            //builds the quanity input
            inquirer
              .prompt({
                name: "quantity",
                type: "input",
                message: "How many items woul you like to purchase?"
              })
              .then(function(answer2) {
                var quantity = answer2.quantity;
                if (quantity > res[0].stock_quantity) {
                  console.log(
                    "It looks like we only have " +
                      res[0].stock_quantity +
                      " items of the product selected"
                  );
                  //calls it 
                  shopping();
                } else {
                  console.log("");
                  console.log(res[0].products_name + " purchased");
                  console.log(quantity + " qty @ $" + res[0].price);  //consoles out the name, price and quanity 
  
                  //variable will update the stop quanity in the database 
                  var newQuantity = res[0].stock_quantity - quantity;
                  connection.query(
                    "UPDATE products SET stock_quantity = " +
                      newQuantity +
                      " WHERE id = " +
                      res[0].id,
                    function(err, resUpdate) {
                      if (err) throw err;
                      console.log("");
                      console.log("Congrats, your order has been processed");
                      console.log("Thanks so much for shopping with us!");
                      console.log("");
                      connection.end();
                    }
                  );
                }
              });
          }
        }); 
      });  
  };
  
  display();