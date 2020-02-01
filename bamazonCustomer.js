//connects our required packages
var mysql = require("mysql"); 
var inquirer = ("inquirer"); 
var table = require("cli-table2");

//have the connection variable connect to mysql database
var connection = mysql.createConnection({
    host: "localhost",
    user: "", //will want to leave blank**
    password: "", //will want to leave blank**
    database: "bamazon_db", //schema name in mysql
    port: 3306
}); 

//calls it 
connection.connect(function(err){
  if (err) throw err;
});

var display = function() {
  connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
      console.table(results);
  })
};

var run = function() {
  //all products available for purchase in the query database 
  connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
      //prompt the user for which they'd like to purchase, once you have the products
      inquirer.prompt([
          {
              name: "product",
              type: "list",
              choices: function() {
                  var choiceArray = [];
                  for (var i = 0; i < results.length; i++) {
                      choiceArray.push(results[i].product_name);
                  }
                  return choiceArray;
              },
              message: "What are you looking to purchase?"
          },
          {
              name: "amount",
              type: "input",
              message: "How many would you like to buy?"
          }
      ]).then(function(answer) {
          var chosenProduct;
          for (var i = 0; i < results.length; i++) {
              if (results[i].product_name === answer.product) {
                  chosenProduct = results[i];
              }
          }

          if (chosenProduct.stock_quantity > parseInt(answer.amount)) {
              connection.query("UPDATE products SET ? WHERE ?", [
              {
                  stock_quantity: chosenProduct.stock_quantity - parseInt(answer.amount)
              },
              {
                  id: chosenProduct.id
              }], function(error) {
                  if (error) throw err;
                  console.log("\n\n");
                  console.log("==============================================");
                  console.log("Congrats, your product was purchased successfully!");
                  console.log("==============================================");
                  console.log("Here's your purchase summary");
                  console.log("-----------------------------");
                  console.log("Item Name: " +  chosenProduct.product_name);
                  console.log("Item Count: " + parseInt(answer.amount));
                  console.log("-----------------------------");
                  console.log("Total: " + "$" + (chosenProduct.price * parseInt(answer.amount)));
                  console.log("==============================================");
                  console.log("\n\n");
                  display();
                  run();
              })
          } else {
              console.log("==============================================");
              console.log("Insufficient stock.");
              console.log("==============================================");
              display();
              run();
          }
      });
  });
};

display();
run();




