const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const EntityController = {
  // Create Entity
  createEntity: async (req, res) => {
    try {
      const entity = req.body;
      const createdEntity = await prisma.entity.create({
        data: entity,
        include: {
          department: true,
          role: true
        }
      });
      res.status(201).json(createdEntity);
    } catch (error) {
      console.error('Error creating entity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  getAllEntities: async (req, res) => {
    try {
      // Extract employee ID from JWT token payload
      const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
      const employeeId = decodedToken.id;
  
      // Fetch employee details along with related entities
      const employee = await prisma.employee.findUnique({
        where: {
          id: employeeId,
        },
        include: {
          Departement: {
            include: {
              Entity: true,
            },
          },
        },
      });
  
      if (!employee) {
        return res.status(200).json({ employee });
      }
  
      // Extract entities from the employee's departments
      const entities = employee.Departement.map((department) => department.Entity);
  
      res.status(200).json(entities);
    } catch (error) {
      console.error('Error fetching employee entities:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get Entity by ID
  getEntityById: async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const userInfo = await prisma.user.findUnique({
        where:{id: userId},
        select:{
          id: true,
          name: true,
          email: true,
          phone: true,
          profile_picture: true,
          gender: true,
          niu: true,
          is_admin: true,
          is_staff: true,
        },
      });

      const employeeInfo = await prisma.employee.findUnique({
        where: {id_user:userInfo.id}
      })

      const memberInfo = {
        ...userInfo,
        ...employeeInfo
      }

      // Get the user entity by id
      const entityId = req.params.id;
      const entity = await prisma.entity.findUnique({
        where: { id: entityId },
        include: {
          department: {
            include: {
              User: {
                select:{
                  id:true,
                  name: true,
                  email: true,
                  phone: true,
                  profile_picture: true,
                  gender: true,
                  niu: true,
                  is_admin: true,
                  is_staff: true
                }
              }, // Include the User model associated with the department
            },
          },
          role: {
            include:{
              EmployeeRole: {
                select:{
                  Employee:{
                    include: {
                      User: {
                        select:{
                          id:true,
                          name: true,
                          email: true,
                          phone: true,
                          profile_picture: true,
                          gender: true,
                          niu: true,
                          is_admin: true,
                          is_staff: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });





      const result = {
        member: memberInfo,
        entity: entity,
      }

      if (!entity) {
        return res.status(404).json({ error: 'Entity not found' });
      }
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching entity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update Entity
  updateEntity: async (req, res) => {
    try {
      const entityId = req.params.id;
      const updatedEntity = await prisma.entity.update({
        where: { id: entityId },
        data: req.body,
        include: {
          department: true,
          role: true
        }
      });
      res.status(200).json(updatedEntity);
    } catch (error) {
      console.error('Error updating entity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete Entity
  deleteEntity: async (req, res) => {
    try {
      const entityId = req.params.id;
      await prisma.entity.delete({
        where: { id: entityId }
      });
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting entity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get entity detail including specific employees
  getEntityDetail: async (req, res) => {
    try {
      const idEntity = req.params.id_entity;

      // Fetch specific employees within the entity
      const president = await EntityController.getEmployeeByRole(idEntity, 'president');
      const generalManager = await EntityController.getEmployeeByRole(idEntity, 'general manager');
      const budgetaryController = await EntityController.getEmployeeByRole(idEntity, 'budgetary controller');
      const functionPowerZero = await EntityController.getEmployeeByFunctionPower(idEntity, 0);

      res.status(200).json({
        president,
        generalManager,
        budgetaryController,
        functionPowerZero
      });
    } catch (error) {
      console.error('Error fetching entity detail:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get employee by role within the entity
  getEmployeeByRole: async (idEntity, roleName) => {
    return await prisma.employee.findFirst({
      where: {
        id_department: {
          in: {
            id_entity
          }
        },
        Role: {
          name: roleName
        }
      },
      include: {
        User: true
      }
    });
  },

  // Get employee with function power equals to 0 within the entity
  getEmployeeByFunctionPower: async (idEntity, power) => {
    return await prisma.employee.findMany({
      where: {
        id_department: {
          in: {
            id_entity
          }
        },
        Function: {
          power
        }
      },
      include: {
        User: true
      }
    });
  }
};

module.exports = EntityController;
