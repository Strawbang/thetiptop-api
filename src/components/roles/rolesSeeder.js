'use strict';
const db = require('../../config/models/modelAssociation');
const Role = db.roles;

module.exports = function() {
		return Role.bulkCreate([
			{  
                id: '1',
				name: 'Admin',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{   
                id: '2',
				name: 'Employee',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
                id: '3',
				name: 'Client',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
                id: '4',
				name: 'Checkout',
				createdAt: new Date(),
				updatedAt: new Date()
			},
		]);
	};
