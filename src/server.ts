import express from 'express';
import dotenv from 'dotenv';
import sequelize from './db/connect';
import notFoundMiddleware from './middlewares/notfound.middleware';
dotenv.config();
const app = express();

app.use(express.json());
//Routes

// app.use("/api/v1/"); //
//Route Not Found redirction
app.use(notFoundMiddleware);
//Error handling middleware

const port = process.env.PORT || '3000';
app.use('/', (req, res) => {
  res.send('Hello');
});
const start = async () => {
  try {
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};
start();
