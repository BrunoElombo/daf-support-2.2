const bcrypt = require('bcryptjs');
const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');


exports.getUser =async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        // const userId = req.params.userId;
        // Fetch user details along with related information
        const userDetails = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            employee: {
              include: {
                Departement: {
                  include: {
                    Function: true
                  }
                },
                Role: true
              }
            }
          }
        });


        // Fetch hierarchy and colleagues for each entity
        const entities = userDetails.employee.map(emp => emp.Departement.Entity);

        const hierarchy = await prisma.employee.findMany({
          where: {
            id_department: {
              in: entities.map(entity => entity.id)
            },
            id_user: {
              not: userId
            },
            Function: {
              power: {
                lt: {
                  power: userDetails.employee.Function.power
                }
              }
            }
          },
          include: {
            User: true
          }
        });

        const colleagues = await prisma.employee.findMany({
          where: {
            id_department: {
              in: entities.map(entity => entity.id)
            },
            id_user: {
              not: userId
            },
            Function: {
              power: {
                gte: {
                  power: userDetails.employee.Function.power
                }
              }
            }
          },
          include: {
            User: true
          }
        });

        // Respond with the user details and related information
        res.status(200).json({ userDetails, hierarchy, colleagues });
      } catch (error) {
        console.error('Error fetching user details:', error);
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