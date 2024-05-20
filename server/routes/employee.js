const express = require("express");
const employeeRouter = express.Router()
const employeeController = require("../controllers/employeeController")
const verifyJWT = require("../middlewear/verifyJWT")


employeeRouter.get('/hierarchy', verifyJWT, employeeController.getEmployeeHierarchy);
employeeRouter.get('/:employeeId/colleagues', employeeController.getEmployeeColleagues);
employeeRouter.get('/:employeeId/entities', employeeController.getEmployeeEntities);
employeeRouter.get('/', employeeController.getEmployeeEntities);


module.exports = employeeRouter;

// router.get('/employees', async (req, res) => {
//     try {
//       const employees = await prisma.employee.findMany({
//         include: {
//           Fonction: true,
//           EchelonCategory: true,
//           Grade: true,
//           user: {
//             select: { id: true },
//           },
//         },
//       });
//       res.json(employees);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error fetching employees' });
//     }
//   });
  

//   app.get('/employees/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//       const employee = await prisma.employee.findUnique({
//         where: { uuid: id },
//         include: {
//           Fonction: true,
//           EchelonCategory: true,
//           Grade: true,
//           user: {
//             select: { id: true },
//           },
//         },
//       });
//       if (employee) {
//         res.json(employee);
//       } else {
//         res.status(404).json({ message: 'Employee not found' });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error fetching employee' });
//     }
//   });
  

  // module.exports = router