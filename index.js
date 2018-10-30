const express=require('express');
const app=express();
const Users = require('./models').Users;

const bodyParser=require('body-parser');
const urlencodedParser=bodyParser.urlencoded({extended:true})

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(urlencodedParser);

const Sequelize=require('sequelize');
const connect=new Sequelize('demo_db','postgres','root',{
  host: 'localhost',
  dialect:'postgres',
  operatorsAliases:true
});
var User = connect.define('demo_dbb', {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING
});
User.sync();
app.get('/',function(req,res){
  res.send("hallo");
})

app.get('/api/users', (req, res) => {
  User.findAll()
  .then(users => res.send(users))
})

app.get('/api/users/:id',(req,res)=>{
  const user = parseInt(req.params.id);
  User.findById(user).then(function(users){
  res.send(users.dataValues);
  });
});

app.post('/api/users/update/:id',(req,res)=>{
  const user = parseInt(req.params.id);
  User.findById(user).then(function(users){
    users.name = req.body.name,
    users.email=req.body.email,
    users.password=req.body.password
    users.save().then(function(users){
    res.send(users);
    })
  });
});

app.post('/api/users/insert',(req,res) => {
  console.log(req.body);

  User.create({
    //id:req.body.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }).then(users => res.send(users))
})
app.get('/api/users/delete/:id',(req,res)=>{
  const user = parseInt(req.params.id);
  User.destroy({
    where:{
      id:user}
  }).then(function(users){
      res.send(users);
  })
});
app.listen(8000);
console.log("server..");
