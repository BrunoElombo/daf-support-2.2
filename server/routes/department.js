const express = require("express");
const router = express().Router()
const PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient();

app.post("/departments", (req, res) => {
  const body = req.body;
  const response = prisma.department.create(body);
  res.send(response);
})

app.get('/departments', async (req, res) => {
    try {
      const departments = await prisma.department.findMany({
        include: {
          Entity: true,
          user: {
            select: { id: true },
          },
        },
      });
      res.json(departments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching departments' });
    }
});

app.get('/departments/:id', async (req, res) => {
const { id } = req.params;
try {
    const department = await prisma.department.findUnique({
    where: { uuid: id },
    include: {
        Entity: true,
        user: {
        select: { id: true },
        },
    },
    });
    if (department) {
    res.json(department);
    } else {
    res.status(404).json({ message: 'Department not found' });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching department' });
}
});

  

  module.exports = router;
  