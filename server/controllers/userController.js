const bcrypt = require('bcryptjs');
const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');


  exports.getUser =async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
      // Extract employee ID from JWT token payload
      const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
      const userId = decodedToken.id;
  
      // Fetch employee details along with related entities
      const employee = await prisma.employee.findUnique({
        where: {
          id_user: userId,
        },
        include: {
          User: {
            select:{
              id: true,
              name: true,
              email: true,
              phone: true,
              profile_picture: true,
              gender: true,
              niu: true,
              is_admin: true,
              is_staff: true
            }
          },
          entity:true,
          role:true,
          Departement:true
        },
      });

      console.log(employee);
  
      // if (!employee) {
      //   return res.status(200).json({ employee });
      // }
  
      // Extract entities from the employee's departments
      // const entities = employee.Departement.map((department) => department.Entity);
  
      return res.status(200).json(employee);
    } catch (error) {
      console.error('Error fetching employee entities:', error);
      res.status(500).json({ error: 'Internal server error' });
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