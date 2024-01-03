import express from 'express';
import userManager from './data/files/userManager.js';
import productManager from './data/files/productManager.js';

const server = express();
const port = 3000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));


const ready = () => ("server ready on port" + port)
server.listen(port, ready);


// usuarios
server.get('/api/users', async (req, res,) => {
  try {
    const all = await userManager.read();

    if(all.length === 0) {
      // throw new Error("Not found users");

      return res.json({ 
        statuscode: 404, 
        message: error.message,
    });
  }
    console.log(all);
    return res.json({
      statuscode: 200,
      Response: all,
    });

  } catch (error) {
    console.log(error);
    return res.json({
      statuscode: 500,
      message: error.message,
    })
  }
});

server.get('/api/users/:uid', async (req, res) => {
try {
  const {uid} = req.params;
  const one = await userManager.readOne(uid);
  if(!one) {
    return res.json({
      statuscode: 404, 
      message: "user not found",
    })
  }
  console.log(one);

  return res.json({
    statuscode: 200,
    Response: one,
  });
} catch (error) {
  console.log(error);
    return res.json({
      statuscode: 500,
      message: error.message,
    });
}
});

// product
server.get('/api/products', async (req, res) => { 
  try {
    const all = await productManager.read();

    if (all.length === 0) {
      return res.json({
        statuscode: 404,
        message: 'Products not found'
      })
    }
    return res.json({
      statuscode: 200,
      response: all,
    })
    
  } catch (error) {
    console.log(error);
    return res.json({
      statuscode: 500,
      message: error.message
    });
  }


});

server.get('/api/products/:pid', async (req, res) => { 
  try {
    const { pid } = req.params;
    const one = await productManager.readOne(pid);
    
    if (!one) {

      return res.json({
        statuscode: 404,
        message: 'Product not found'
      });
    }else {
      return res.json({
        statuscode: 200,
        response: one,
      })
    }
  } catch (error) {
    console.log(error);
    return res.json({
      statuscode: 500,
      message: error.message,

    });
  }


});