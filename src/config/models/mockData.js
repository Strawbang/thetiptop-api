const ticketMock = require('../../components/tickets/ticketsModelMock');
const userMock = require('../../components/users/usersModelMock');
const roleMock = require('../../components/roles/rolesModelMock');
const tokenMock = require('../../components/tokens/tokensModelMock');
const randomstring = require('randomstring');
const ticketCount = parseInt(process.env.TICKET_COUNT);

const loadData = () => {
    loadRoles();
    loadUsers();
    loadTickets();
};

const loadRoles = () => {
    roleMock.$queueResult([
        roleMock.build({  
            id: '1',
            name: 'Admin',
            createdAt: new Date(),
            updatedAt: new Date()
        }),
        roleMock.build({   
            id: '2',
            name: 'Employee',
            createdAt: new Date(),
            updatedAt: new Date()
        }),
        roleMock.build({
            id: '3',
            name: 'Client',
            createdAt: new Date(),
            updatedAt: new Date()
        }),
        roleMock.build({
            id: '4',
            name: 'Checkout',
            createdAt: new Date(),
            updatedAt: new Date()
        })
    ]);
}

const loadUsers = () => {
    userMock.$queueResult([
        userMock.build({  
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
        }),
        userMock.build({  
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
        }),
        userMock.build({  
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
        }),
        userMock.build({
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
        })
    ]);
}

const loadTickets = () => {
    const prizes = [
        'infuseur de thé',
        '100g thé détox ou infusion',
        '100g thé signature',
        'coffret découverte 39 €',
        'coffret découverte 69 €',
    ];
    
    const tickets = [];
    let prize;
    let printed;
    let userId;
    
    const counter = [0, 0, 0, 0, 0];
    const quotas = [
        Math.floor(ticketCount * 0.6),
        Math.floor(ticketCount * 0.2),
        Math.floor(ticketCount * 0.1),
        Math.floor(ticketCount * 0.06),
        Math.floor(ticketCount * 0.04),
    ];

    for (let i = 1; i < ticketCount + 1; i++) {
        if (i%2 == 0) {
            printed = 0;
            userId = null;
        }
        else {
            if (i < quotas[1]) {
                userId = 1;
            }
    
            printed = 1;
        }
            
        let random = Math.floor(Math.random() * quotas.length);
    
        if (counter[random] >= quotas[random]) {
            let allClear = true;
        
            counter.forEach((element, index) => {
                if (counter[index] <= quotas[index]) {
                    allClear = false;
                }
            });
    
            if (allClear === false) {
                counter.splice(random - 1, 1);
                quotas.splice(random - 1, 1);
            }
        }
        
        prize = prizes[Math.floor(Math.random() * quotas.length)];
        counter[random]++;
                        
        let newTicket = {
            id: `${i}`,
            number: randomstring.generate(10),
            prize: prize,
            printed: printed,
            userId: userId,
            claimed: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        
        tickets.push(ticketMock.build(newTicket));        
    }

    // ticketMock.$queueResult(tickets);
}

module.exports = {
    loadData,
};
