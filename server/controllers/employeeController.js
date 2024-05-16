const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();

exports.getEmployeeHierarchy = async (req, res) => {
    const { employeeId } = req.params;
  
    try {
      const employee = await prisma.employee.findUnique({
        where: { id: Number(employeeId) },
        include: { manager: { include: { manager: true } } },
      });
      return res.status(200).json(employee);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.getEmployeeColleagues = async (req, res) => {
    const { employeeId } = req.params;
  
    try {
      const employee = await prisma.employee.findUnique({
        where: { id: Number(employeeId) },
        include: { colleagues: true },
      });
      return res.status(200).json(employee.colleagues);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.getEmployeeEntities = async (req, res) => {
    const { employeeId } = req.params;
  
    try {
      const entities = await prisma.entity.findMany({
        where: { employeeId: Number(employeeId) },
      });
      return res.status(200).json(entities);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  