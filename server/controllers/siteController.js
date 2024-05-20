const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');


exports.getAllSites = async (req, res)=>{
    try {
      const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
      const userId = decodedToken.id;
      const employee = await prisma.employee.findUnique({
          where:{id_user: userId},
      });

      const sites = await prisma.site.findMany({
        where:{id_entity: employee.id_entity}
      });
      return res.status(200).json(sites);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
    // const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
    // const userId = decodedToken.id;

}
