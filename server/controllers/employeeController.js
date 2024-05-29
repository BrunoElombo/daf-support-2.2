const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

exports.getEmployeeHierarchy = async (req, res) => {
  try {
    const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
    const userId = decodedToken.id
    const currentUser = await prisma.employee.findUnique({
      where:{
        id_user: userId, is_active: true
      },
      include: { role: true, Function: true },
    });

    const entityHierarchy = await prisma.employee.findMany({
      where:{
        AND:[
          { id_entity: currentUser.id_entity },
          {
            role: {
              power: { lte: currentUser.role ? currentUser.role.power : 0 },
            },
          }
        ]
      },
      select:{
        User: true,
        role:true,
        Function: true
      }
    });

    const departementHierarchy = await prisma.employee.findMany({
      where:{
        AND:[
          { id_department: currentUser.id_department },
          {
            Function: { 
              power: {lte: currentUser.Function ? currentUser.Function.power : 0}
             }
          }
        ]
      },
      include:{
        User:{
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
        role:true,
        Function:true
      }
    });

    res.json({"entity_hierarchy": (entityHierarchy), "department_hierarchy":(departementHierarchy)});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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
  
exports.getEmployeeEntities = async (req, res)=>{
  const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
  const userId = decodedToken.id;
  
  const entity_id = req.params.entity_id;
  
  if(entity_id){
    try {
      const employeeInEntity = await prisma.employee.findUnique({
        where:{
          id_user: userId
        },
        select:{
          User:{
            include:{
              employee:true
            }
          },
          entity:true,
          Function:true,
          role:{
            where:{
              OR: [
                {name: 'president'}, 
                {name:"general_manager"}, 
                {name:"budgetary_department_manager"}, 
                {name:"paymaster_general"},
                {name:"cordinator"},
                {name:"cashier"},
              ]
            },
            include:{
              employee:{
                include:{
                  User:{
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
                }
              },
            }
          },
          Departement:{
            include:{
              User:{
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
            }
          }
        }
      });

      console.log(employeeInEntity)
      res.status(200).send(employeeInEntity);
    } catch (error) {
      console.log(error)
      res.status(500).send(error);
    }
  }
  
}

exports.getEmployeeControllers = async (req, res)=>{
  const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
  const userId = decodedToken.id;

  try {
    const employee = await prisma.employee.findUnique({
      where:{id_user: userId}
    });

    const employees = await prisma.employee.findMany({
      where:{
        id_entity: employee.id_entity,
        Function:{
          is:{
            name: "coordinator"
          },
        }
      },
      select:{
        User:{
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
      }
    });

    return res.status(200).send(employees);
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message);
  }
}
  

exports.getEmployeeByEntity = async (req, res)=>{
  const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
  const userId = decodedToken.id
  try {
    const employee = await prisma.employee.findUnique({
      where:{id_user: userId}
    });

    const employees = await prisma.employee.findMany({
      where:{
        id_entity: employee.entity
      },
      include:{
        User:{
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
        role: true,
        Function: true,
        Departement: true
      }
    });

    return res.status(200).send(employees);
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message);
  }
}