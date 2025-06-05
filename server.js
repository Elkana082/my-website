
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer =require('nodemailer');
require('dotenv').config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
//serve your html files

//read orders file

//store order
app.post('/checkout',(req,res) => {const newOrder =req.body;
    fs.readFile('orders.json','utf8',(err, data) => {const orders=data ? 
    JSON.parse(data): '[]';
 orders.push(newOrder);
fs.writeFile('orders.json',JSON.stringify(orders, null, 2),(err)=>{
    if(err)return res.status(500).send('Error saving order');
    res.sendStatus(200);
 });
 });
});

// Serve orders for admin
 app.get('/orders', (req, res) => {
 fs.readFile('orders.json', 'utf8',(err,data) =>{if (err) {console.error('Error reading orders.json:',err); 
 res.status(500).send('server Error');
 }else{const orders=JSON.parse(data || '[]');
 res.json(orders);
 }
 });
});
//.Email section for nodemailer
app.post('/contact',(req,res)=>{const {name,phone,message}=req.body;
const transporter=nodemailer.createTransport({service:'gmail', auth: {user:process.env.EMAIL_USER,
  pass:process.env.EMAIL_PASS},
});
const mailOptions={from:process.env.EMAIL_USER, to:process.env.EMAIL_RECEIVER,subject:'New Contact Form Message',
  text:`Name: ${name}\nPhone: ${phone}\nMessage: ${message}`,};
transporter.sendMail(mailOptions,(error,info)=>{if(error){console.error('Failed to send your message.Please try again:',error);
  return res.send(`<script>alert('Failed to send message. Try again later.');window.location.href='/';</script>`);
} res.send(`<script>alert('Your Message has been sent successfully!');
  window.location.href='/index.html';</script>`);
});

});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});