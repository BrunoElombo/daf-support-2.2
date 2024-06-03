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
  
  // Get all external entities
  getAllEntities: async (req, res) => {
    try {
      // Extract employee ID from JWT token payload
      const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
      const userId = decodedToken.id;
  
      // Fetch employee details along with related entities
      const employee = await prisma.employee.findUnique({
        where: {
          id_user: userId,
        },
        include:{
            entity:true
        }
      });
      
      const externalEntities = await prisma.associer.findMany({
        where:{
            id_entity: employee.entity.id,
        },
        select:{
            external_entity:true
        }
    });
  
      return res.status(200).json(externalEntities);
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
      res.send({})

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
  },

  // Get the list of banks of an external entity
  getExternalEntityBanks: async (req, res)=>{
    const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
    const userId = decodedToken.id;
    const id = req.params.id;
    try {
      const bankAccounts = await prisma.bankAccount.findMany({
        where: { id_external_entity: id },
      });
  
      const bankMap = new Map();
  
      for (const bankAccount of bankAccounts) {
        const bankId = bankAccount.id_bank;
  
        // Check if bankId already exists in the map
        if (!bankMap.has(bankId)) {
          const bank = await prisma.bank.findUnique({
            where: { id: bankId },
          });
  
          bankMap.set(bankId, {
            bank: bank,
            bankAccounts: [],
          });
        }
  
        // Add bank account to corresponding bank
        bankMap.get(bankId).bankAccounts.push(bankAccount);
      }
  
      // Convert map values to an array and send the response
      const result = Array.from(bankMap.values());
      return res.send(result);

    } catch (error) {
      console.log(error);
    }
  }

};

module.exports = EntityController;