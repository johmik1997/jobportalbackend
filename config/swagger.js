const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const swaggerDefinition = {
openapi: '3.0.0',
info: {
title: 'TalentHub',
version: '1.0.0',
description: 'TalentHub is a modern mini job portal that allows employers to post jobs, manage users, and track applications, while providing developers and job seekers a platform to manage their profiles and view opportunities. Built with React, Redux Toolkit Query (RTK Query), and Node.js backend, TalentHub is lightweight, responsive, and easy to extend.',
},
};

const options = {
swaggerDefinition,
apis: [path.join(__dirname, "../routers/*.js"), path.join(__dirname, "../Models/*.js")], 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;