const express = require('express');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3002;
require('./db/index');
const UserRouter = require('./routes/UserRouter');
const ProductRouter = require('./routes/ProductRouter');
const swaggerJsDoc=require('swagger-jsdoc');
const swaggerUi=require('swagger-ui-express');

const app = express();

app.use(cors());
app.use(express.json());

const options={
  definition:{
    openapi: '3.0.0',
    info :{
      title:'Car Management Assignment',
      version:'1.0.0'
    },
    servers:[
      {
        url:'https://carmanagementbackend.vercel.app'
      },
      {
        url:'http://localhost:3002'
      }
    ]
  },
  apis:['./routes/*js']
}

const swaggerspec=swaggerJsDoc(options);
app.use('/api/v1/docs',swaggerUi.serve, swaggerUi.setup(swaggerspec));

app.use('/api/v1/user', UserRouter);
app.use('/api/v1/products', ProductRouter);


app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
