const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://admin_hieu:hieu2310@cluster0.t9kk1.mongodb.net/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});
// Use lodash
const {upperFirst,toLower} = require("lodash");
const { getDate, getDay } = require("./date");

// const items = ["Buy food","Clean the house", "Do homework"];

const app = express();
// ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Create my_schema
const itemsSchema = new mongoose.Schema({
    name: String
});
//Create model
const Item = mongoose.model('Item', itemsSchema);

//Crete document
const list1 = new Item({name: "Buy food"});
const list2 = new Item({name: "Clean the house"});
const list3 = new Item({name: "Learn Japanese"});

app.get("/",(req,res)=>{
    const currentDay = getDate(); // Node module
    Item.find({},function(err,item_s){
        if(item_s.length==0){
            Item.insertMany([list1,list2,list3],function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Success to insert list to item model");
                }
            });
            res.redirect("/");
        }else{
            res.render("list",{
                typeList: currentDay,
                newAddItem: item_s
            });
        }
    });
    
});

app.post("/",(req,res)=>{
    // console.log(typeof req.body.button);
    if(req.body.newItem != ""){
        // Type my list
        if(req.body.button === getDate()){
            const itemName = req.body.newItem;
            const new_item = new Item({name: itemName});
            new_item.save();
            res.redirect("/");
        // Type customer list
        }else{
            const itemName = req.body.newItem;
            const new_item = new Item({name: itemName});
            const currentPath = req.body.button;
            CustomerModel.updateOne({name: currentPath}, { $push: { item: new_item} },function(err){
                if(!err){
                    console.log("Push success");
                    res.redirect("/"+currentPath);
                }
            });

        }     
    }
});
app.post("/delete",(req,res)=>{
    const itemDel = req.body.check_box;
    if(req.body.type === getDate()){
        Item.deleteOne({_id: itemDel},function(err){
            if(!err){
                console.log("Delete success");
            }
        });
        res.redirect("/");
    }else{
        CustomerModel.updateOne({name: req.body.type},{ $pull: {item: {_id: itemDel } }  },function(err){
            if(!err){
                console.log("You delete success");
            }
        });
        res.redirect("/"+req.body.type);
    }
});



//CustomerTodolist

//Create customer_schema
const customersSchema = new mongoose.Schema({
    name: String,
    item: [itemsSchema]
});
//Create customer_model
const CustomerModel = mongoose.model('CustomerModel', customersSchema);


app.get("/:path",(req,res)=>{
    const path = upperFirst(toLower(req.params.path));
    
    CustomerModel.findOne({name: path},function(err,cus){
        if(!err){
            if(!cus){
                //Create new document
                const customerItem = new CustomerModel({
                    name: path,
                    item: []
                });
                //Save document into CustomerModel
                customerItem.save();
                //Access new document
                res.redirect("/"+path);
            }else{
                //Show exits document to web
                res.render("list",{
                    typeList: cus.name,
                    newAddItem: cus.item
                })
            }     
        }  
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,()=>{
    console.log("Server has started at successfully");
})