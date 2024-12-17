import express from 'express';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';

import sequelize from './utils/db/connect';
import notFoundMiddleware from './middlewares/notfound.middleware';
import routes from './routes/api/v1';
import logger from './utils/logger';
import Users from './models/users.model';
import Todos from './models/todos.model';
import { errorHandlerMiddleware } from './middlewares/error';
dotenv.config();
const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
//Routes

//Health check
app.get('/healthcheck', (req, res) => {
  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    msg: 'Response',
  });
});

//All Routes
app.use('/api/v1/', routes);

//Route Not Found redirction
app.use(notFoundMiddleware);

//Error handling middleware
app.use(errorHandlerMiddleware);
const port = process.env.PORT || '3000';
const start = async () => {
  try {
    await sequelize.sync();
    Users.hasMany(Todos);
    Todos.belongsTo(Users); //Not necessary?
    logger.info('DB connected');
    app.listen(port, () => {
      logger.info(`App is running at http://localhost:${port}`);
    });
  } catch (err) {
    logger.error(err);
  }
};
start();
export default app;
