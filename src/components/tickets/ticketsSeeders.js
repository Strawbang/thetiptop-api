'use strict';
const randomstring = require('randomstring');
const db = require('../../config/models/modelAssociation');
const Ticket = db.tickets;
const ticketCount = parseInt(process.env.TICKET_COUNT);

///// 1 500 000 Tickets /////
/// 900 000 Infuseur de thé
/// 300 000 100g thé détox ou infusion
/// 150 000 100g thé signature
/// 90 000 coffret découverte 39 €
/// 60 000 coffret découverte 69 €

const prizes = [
    'infuseur de thé',
    '100g thé détox ou infusion',
    '100g thé signature',
    'coffret découverte 39 €',
    'coffret découverte 69 €',
];

let newUser;
let tabUser = [];
let prize;
let printed;
let userId;

module.exports = function() {
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
                            
            newUser = {
                id: `${i}`,
                number: randomstring.generate(10),
                prize: prize,
                printed: printed,
                userId: userId,
                claimed: 0,
                createdAt: new Date(),
				updatedAt: new Date(),
            }
            tabUser.push(newUser);
        }
        
		return Ticket.bulkCreate(
			tabUser
		);
	};
