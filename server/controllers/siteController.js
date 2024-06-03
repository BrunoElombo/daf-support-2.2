const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');


exports.getAllSites = async (req, res)=>{
    try {
      const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
      const userId = decodedToken.id;

      const employee = await prisma.employee.findUnique({
          where:{id_user: userId},
          include: {
            Function: true,
            role: true,
          }
      });

      if(employee.Function != null){
        if(employee.Function.name === "gueritte_chef" || employee.Function.name === "coordinator"){
          const sites = await prisma.site.findMany({
            where:{id_entity: employee.id_entity, type: "ONFIELD"}
          });
          return res.status(200).json(sites);
        }

        const sites = await prisma.site.findMany({
          where:{id_entity: employee.id_entity, type: "HEADQUARTER"}
        });
        return res.status(200).json(sites);

      }
      const sites = await prisma.site.findMany({
        where:{id_entity: employee.id_entity, type: "HEADQUARTER"}
      });
      return res.status(200).json(sites);
    } catch (error) {
      console.log(error)
        return res.status(500).json({ error: 'Internal server error' });
    }
    // const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
    // const userId = decodedToken.id;

}
