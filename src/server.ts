import express from 'express';
import dotenv from 'dotenv';
import sequelize from './utils/db/connect';
import notFoundMiddleware from './middlewares/notfound.middleware';
import routes from './routes/api/v1';
import { StatusCodes } from 'http-status-codes';
import logger from './utils/db/logger';
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
app.use('/api/v1/', routes);
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
    logger.info('DB connected');
    app.listen(port, () => {
      logger.info(`App is running at http://localhost:${port}`);
    });
  } catch (err) {
    logger.error(err);
  }
};
start();
