const express = require("express");
const bodyParser = require("body-parser");
const { getDate, getDay } = require("./date");
const items = ["Buy food","Clean the house", "Learn Japanese"];
const workItems = [];
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    const currentDay = getDate(); // Node module
    
    res.render("list",{
        typeList: currentDay,
        newAddItem: items
    });
});

app.post("/",(req,res)=>{
    // console.log(typeof req.body.button);
    if(req.body.newItem != ""){
        // Type work list
        if(req.body.button === "Work List"){
            workItems.push(req.body.newItem);
            res.redirect("/work");
        // Type currentDay
        }else{
            items.push(req.body.newItem);
            res.redirect("/");
        }     
    }
});

app.get("/work",(req,res)=>{
    res.render("list",{
        typeList: "Work List",
        newAddItem: workItems
    })
});

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server start at port 3000");
})