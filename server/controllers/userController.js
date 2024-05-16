const bcrypt = require('bcryptjs');
const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();


exports.getUser= async (res, req)=>{
    const { id } = req.params;
  
    try {
      await prisma.user.findOne({ where: { id: Number(id) } });
        const users = await prisma.user.findOne();
        return res.status(200).json(users);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
}


exports.getAllUsers = async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.createUser = async (req, res) => {
    const { username, password, isAdmin, email, phone } = req.body;
    
    try {
      if(!username || !password){
        return res.status(401).json({ message: 'Invalid request' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name:username,
          password: hashedPassword,
          isAdmin,
          email,
          phone
        },
      });
      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.user.delete({ where: { id: Number(id) } });
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };