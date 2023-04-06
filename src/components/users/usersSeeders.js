'use strict';
const db = require('../../config/models/modelAssociation');
const User = db.users;
const Role = db.roles;

module.exports = function() {
		const users = [
            {  
                id: '1',
                firstname: "Ben",
                lastname: "Masmoud",
                newsletter: 0,
                birthdate: "2000-12-11",
                email: "bm.mhoma@gmail.com",
                password: "benbenben",
                active: 1,
                roles: [1],
				createdAt: new Date(),
				updatedAt: new Date()
			},
            {  
                id: '2',
                firstname: "Caisse",
                lastname: "Lidl",
                newsletter: 0,
                birthdate: "2000-12-11",
                email: "contact@lidl.com",
                password: "benbenben",
                active: 1,
                roles: [4],
				createdAt: new Date(),
				updatedAt: new Date()
			},
            {  
                id: '3',
                firstname: "Bernard",
                lastname: "Inactif",
                newsletter: 0,
                birthdate: "2000-12-11",
                email: "inactive@gmail.com",
                active: 0,
                password: "benbenben",
                roles: [3],
				createdAt: new Date(),
				updatedAt: new Date()
			},
            {
                id: '4',
                firstname: 'jury',
                lastname: 'externe',
                newsletter: 0,
                birthdate: "2000-12-11",
                email : 'jury.externe@gmail.com',
                active : 1,
                password: 'YouShallNotPass',
                roles: [1,2,3,4],
                createdAt: new Date(),
				updatedAt: new Date()
            },
        ];

        return new Promise((resolve) => {
            try {
                users.forEach( async (user) => {
                    const roles = user.roles;

                    delete user.roles;

                    await User.create(
                        user
                    ).then( async (nUser) => {
                        await nUser.setRoles(roles)
                    });

                    resolve(true);
                });

            
            } catch (e) {
                resolve(false);
            }
        });
	};
