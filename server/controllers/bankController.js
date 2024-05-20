const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');


exports.getEmployeeBanks = async (req, res)=>{
    try {
      const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
      const userId = decodedToken.id;
      const employee = await prisma.employee.findUnique({
          where:{id_user: userId, is_active:true}
      });

      const employeeBanks = await prisma.bank.findMany({
        where:{
            id_employee: employee.id, is_active:true
        }
      });


      return res.status(200).json(employeeBanks);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getEntityBanks = async (req, res)=>{
    try {
      const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
      const userId = decodedToken.id;

      const employee = await prisma.employee.findUnique({
          where:{id_user: userId, is_active:true},
          include:{
            entity:true
          }
      });

      const entityBanks = await prisma.bank.findMany({
        where:{
            id_entity: employee.entity.id, is_active:true
        }
      });


      return res.status(200).json(entityBanks);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
