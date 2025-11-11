const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const {userRouter} = require("./routes/user")
const {adminRouter} = require("./routes/admin")


app.use(express.json());
app.use(cors());


app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});
      
async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`Example app listening at http:/user//user/localhost:${port}`);
    });
  }
  main()