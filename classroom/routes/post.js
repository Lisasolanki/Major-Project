const express=require("express");
const router=express.Router();

//POST
//Index
router.get("/",(req,res)=>{
    res.send("GET for posts");
})
//Show
router.get("/:id",(req,res)=>{
    res.send("GET for  show posts");
})
//Post
router.get("/",(req,res)=>{
    res.send("POST for posts");
})
//DELETE
router.post("/:id",(req,res)=>{
    res.send("DELETE for posts id");
})
module.exports=router;