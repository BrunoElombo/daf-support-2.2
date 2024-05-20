const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');


exports.createProduct = async (req, res) => {
  try {
    const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
    const userId = decodedToken.id;
    const employee = await prisma.employee.findUnique({
        where:{id_user: userId},
    });

    const { name, unit, description } = req.body;

    if(!name || !unit){
        return res.status(401).send("Invalid form");
    }

    const product = await prisma.product.create({
      data: {
        name,
        unit,
        description : (description !==undefined ? description : ""),
        Entity: { connect: { id: employee.id_entity } },
      },
    });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for retrieving all products
exports.getAllProducts = async (req, res) => {
  try {
    const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
    const userId = decodedToken.id;
    const employee = await prisma.employee.findUnique({
        where:{id_user: userId},
    });
    
    const products = await prisma.product.findMany({
        where:{
            id_entity: employee.id_entity
        }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for retrieving a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for updating a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, description, id_entity } = req.body;
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        unit,
        description,
        Entity: { connect: { id: id_entity } }, // Assuming id_entity exists
      },
    });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for deleting a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
