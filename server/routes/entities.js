const express = require("express");
const router = express().Router()
const PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient();


app.get('/entities', async (req, res) => {
    try {
      const entities = await prisma.entity.findMany();
      res.json(entities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching entities' });
    }
});
  