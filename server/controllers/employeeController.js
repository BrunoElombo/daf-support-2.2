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
              power: { lt: currentUser.role ? currentUser.role.power : 0 },
            }
          }
          // {
          //   OR:[
          //   ]
          // }
        ]
      },
      include:{
        User: true,
      }
    });

    const departementHierarchy = await prisma.employee.findMany({
      where:{
        AND:[
          { id_department: currentUser.id_department },
          {
            Function: { 
              power: {lt: currentUser.Function ? currentUser.Function.power : 0}
             }
          }
          // {
          //   OR:[
          //   ]
          // }
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
      }
    });

    console.log([...entityHierarchy, ...departementHierarchy]);
    res.json([...entityHierarchy, ...departementHierarchy]);

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
  
  // exports.getEmployeeEntities = async (req, res) => {
  //   const { employeeId } = req.params;
  
  //   try {
  //     const entities = await prisma.entity.findMany({
  //       where: { employeeId: Number(employeeId) },
  //     });
  //     return res.status(200).json(entities);
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: 'Server error' });
  //   }
  // };

  exports.getEmployeeEntities = async (req, res)=>{
    const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1]);
    const userId = decodedToken.id;

    const entity_id = req.query.entity_id;
    
    if(entity_id){
      try {
        const employeeInEntity = await prisma.employee.findUnique({
          where:{
            id_user: userId
          },
          include:{
            
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
        res.status(200).send(employeeInEntity);
      } catch (error) {
        res.status(500).send(error);
      }
    }
    
  }
  