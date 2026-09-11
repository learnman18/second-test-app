const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
console.log('Prisma client initialized, DB connectede through prisma client');
module.exports = prisma;