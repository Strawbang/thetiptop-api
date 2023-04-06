const chai = require('chai');
const chaiHttp = require('chai-http');
// const httpServer = process.env.API || "http://localhost:8080/";
const { httpServer } = require('../../server');
const expect = chai.expect;

chai.use(chaiHttp);

beforeEach(() => {

});

afterEach(() => {

});


describe('#getRandomTicket()', () => {
    let response;

    before(function(done) {
        let accessToken;
        const credentials = {
            user: {
                email: 'bm.mhoma@gmail.com',
                password: 'benbenben',
            },
        };

        // Signing in
        chai.request(httpServer)
        .post('/api/auth/signin-local')
        .set('content-type', 'application/json')
        .send(credentials)
        .end((err, res) => {
            accessToken = res.body.accessToken;

            // Getting a random used ticket
            chai.request(httpServer)
            .get('/api/ticket?rand=1&userid=1&id=0')
            .set('x-access-token', accessToken)
            .end((err, res) => {
                response = res;
                done();
            });
        })
    });

    it("Response body should have a 'ticket' property", (done) => {
        expect(response.body).to.have.property('ticket');
        done();
    });

    it("Response body 'ticket' property should be an object", (done) => {
        expect(response.body.ticket).to.be.a('object');
        done();
    });

    it("Response body 'ticket' property should have an 'id' property", (done) => {
        expect(response.body.ticket).to.have.property('id');
        done();
    });

    it("Response body 'ticket.id' property should be a number", (done) => {
        expect(response.body.ticket.id).to.be.a('number');
        done();
    });

    it("Response body 'ticket' property should have a 'number' property", (done) => {
        expect(response.body.ticket).to.have.property('number');
        done();
    });

    it("Response body 'ticket.number' property should be a string", (done) => {
        expect(response.body.ticket.number).to.be.a('string');
        done();
    });

    it("Response body 'ticket' property should have a property 'prize'", (done) => {
        expect(response.body.ticket).to.have.property('prize');
        done();
    });

    it("Response body 'ticket.prize' property should be a string", (done) => {
        expect(response.body.ticket.prize).to.be.a('string');
        done();
    });

    
    it("Response body 'ticket.prize' property should be a string", (done) => {
        expect(response.body.ticket.prize).to.be.a('string');
        done();
    });

    it("Response body 'ticket' property should have a 'printed' property", (done) => {
        expect(response.body.ticket).to.have.property('printed');
        done();
    });

    it("Response body 'ticket.printed' property should be equal to true", (done) => {
        expect(response.body.ticket.printed).to.be.true;
        done();
    });

    it("Response body 'ticket' property should have a 'user' property", (done) => {
        expect(response.body.ticket).to.have.property('user');
        done();
    });

    it("Response body 'ticket.user' property should be an object", (done) => {
        expect(response.body.ticket.user).to.be.a('object');
        done();
    });

    it("Response body 'ticket.user' property should have an 'id' property which is a number", (done) => {
        expect(response.body.ticket.user).to.have.property('id').to.be.a('number');
        done();
    });

    it("Response body 'ticket.user' property should have a 'firstname' property which is a string", (done) => {
        expect(response.body.ticket.user).to.have.property('firstname').to.be.a('string');
        done();
    });

    it("Response body 'ticket.user' property should have a 'lastname' property which is a string", (done) => {
        expect(response.body.ticket.user).to.have.property('lastname').to.be.a('string');
        done();
    });

    it("Response body 'ticket.user' property should have a 'birthdate' property which is a string with exactly 10 characters", (done) => {
        expect(response.body.ticket.user).to.have.property('birthdate').to.be.a('string').with.lengthOf(10);
        done();
    });

    it("Response body 'ticket.user' property should have an 'email' property which is a string", (done) => {
        expect(response.body.ticket.user).to.have.property('email').to.be.a('string');
        done();
    });

    it("Response body 'ticket.user' property should have an 'address' property", (done) => {
        expect(response.body.ticket.user).to.have.property('address');
        done();
    });

    it("Response body 'ticket.user' property should have an 'postcode' property", (done) => {
        expect(response.body.ticket.user).to.have.property('postcode');
        done();
    });

    it("Response body 'ticket.user' property should have an 'city' property", (done) => {
        expect(response.body.ticket.user).to.have.property('city');
        done();
    });

    it("Response body should have an 'successful' property", (done) => {
        expect(response.body).to.have.property('successful');
        done();
    });

    it("Response body 'successful' property should be equal to 'true'", (done) => {
        expect(response.body.successful).to.be.true;
        done();
    });

    it("Response status should be equal to 200", (done) => {
        expect(response.status).to.equal(200);
        done();
    });
});

describe("#updateTicket()", () => {
    context('Without arguments and when user is not logged in', () => {
        it("Should return an error (403 | Forbidden)", (done) => {
            // Trying to update ticket
            chai.request(httpServer)
            .post('/api/ticket')
            .end((err, res) => {
                expect(res.status).to.equal(403);
                done();
            });
        });
    });
    context('Without arguments and user is logged in', () => {
        let response;

        before(function(done) {
            const credentials = {
                user: {
                    email: 'bm.mhoma@gmail.com',
                    password: 'benbenben',
                },
            };

            // Signing in
            chai.request(httpServer)
            .post('/api/auth/signin-local')
            .set('content-type', 'application/json')
            .send(credentials)
            .end((err, res) => {
                response = res.body;

                // Trying to update ticket
                chai.request(httpServer)
                .post('/api/ticket')
                .set('x-access-token', response.accessToken)
                .end((err, res) => {
                    response = res;
                    done();
                });
            });
        });

        it("Response body should have a 'successful' property", (done) => {
            expect(response.body).to.have.property('successful');
            done();
        });

        it("Response body 'successful' property should be equal to 'false'", (done) => {
            expect(response.body.successful).to.equal(false);
            done();
        });

        it("Response status should be equal to 400 (Bad Request)", (done) => {
            expect(response.status).to.equal(400);
            done();
        });
    });

    context('With a nonexistent ticket and user is logged in', () => {
        let response;

        before(function(done) {
            const credentials = {
                user: {
                    email: 'bm.mhoma@gmail.com',
                    password: 'benbenben',
                },
            };

            // Signing in
            chai.request(httpServer)
            .post('/api/auth/signin-local')
            .set('content-type', 'application/json')
            .send(credentials)
            .end((err, res) => {
                response = res.body;
                
                // Trying to update ticket
                chai.request(httpServer)
                .put('/api/ticket')
                .set('x-access-token', response.accessToken)
                .send({ number: "xxx" })
                .end((err, res) => {
                    response = res;
                    done();
                });
            });
        });

        it("Response body 'message' property should be equal to 'nonexistent_ticket'", (done) => {
            expect(response.body.message).to.equal('nonexistent_ticket');
            done();
        });

        it("Response status should be equal to 404 (Not Found)", (done) => {
            expect(response.status).to.equal(404);
            done();
        });
    });

    context('With an already used ticket and user is logged in', () => {
        let response;

        before(function(done) {
            let accessToken;
            const credentials = {
                user: {
                    email: 'bm.mhoma@gmail.com',
                    password: 'benbenben',
                },
            };

            // Signing in
            chai.request(httpServer)
            .post('/api/auth/signin-local')
            .set('content-type', 'application/json')
            .send(credentials)
            .end((err, res) => {
                accessToken = res.body.accessToken;

                // Getting a random used ticket
                chai.request(httpServer)
                .get('/api/ticket?rand=1&userid=1&id=0')
                .set('x-access-token', accessToken)
                .end((err, res) => {                    
                    response = res.body;

                    // Trying to update a ticket
                    chai.request(httpServer)
                    .put('/api/ticket')
                    .set('x-access-token', accessToken)
                    .send({ number: res.body.ticket.number })
                    .end((err, res) => {
                        response = res;
                        done();
                    });
                });
            });
        });

        it("Response body should be an object", (done) => {
            expect(response.body).to.be.a('object');
            done();
        });

        it("Response body 'message' property should be equal to 'ticket_already_used'", (done) => {
            expect(response.body.message).to.equal('ticket_already_used');
            done();
        });

        it("Response status should be equal to 403 (Forbidden)", (done) => {
            expect(response.status).to.equal(403);
            done();
        });
    });

    context('With a non-printed ticket and user is logged in', () => {
        let response;

        before(function(done) {
            let accessToken;
            const credentials = {
                user: {
                    email: 'bm.mhoma@gmail.com',
                    password: 'benbenben',
                },
            };

            // Signing in
            chai.request(httpServer)
            .post('/api/auth/signin-local')
            .set('content-type', 'application/json')
            .send(credentials)
            .end((err, res) => {
                accessToken = res.body.accessToken;

                // Getting a random non printed ticket
                chai.request(httpServer)
                .get('/api/ticket?rand=1&userid=0&id=0&printed=0')
                .set('x-access-token', accessToken)
                .end((err, res) => {
                    response = res.body;

                    // Trying to update a non-printed ticket
                    chai.request(httpServer)
                    .put('/api/ticket')
                    .set('x-access-token', accessToken)
                    .send({ number: response.ticket.number })
                    .end((err, res) => {
                        response = res;
                        done();
                    });
                });
            });
        });

        it("Response body should be an object", (done) => {
            expect(response.body).to.be.a('object');
            done();
        });

        it("Response body 'message' property should be equal to 'ticket_not_printed'", (done) => {
            expect(response.body.message).to.equal('ticket_not_printed');
            done();
        });

        
        it("Response status should be equal to 403 (Forbidden)", (done) => {
            expect(response.status).to.equal(403);
            done();
        });
    });

    context('With a valid ticket, printed, not used, and user is logged in', () => {
        let response;

        before(function(done) {
            let accessToken;
            const credentials = {
                user: {
                    email: 'bm.mhoma@gmail.com',
                    password: 'benbenben',
                },
            };

            // Signing in
            chai.request(httpServer)
            .post('/api/auth/signin-local')
            .set('content-type', 'application/json')
            .send(credentials)
            .end((err, res) => {
                accessToken = res.body.accessToken;

                // Getting a random valid printed ticket
                chai.request(httpServer)
                .get('/api/ticket?rand=1&userid=0&id=0&printed=1')
                .set('x-access-token', accessToken)
                .end((err, res) => {
                    // Trying to update valid printed ticket
                    chai.request(httpServer)
                    .put('/api/ticket')
                    .set('x-access-token', accessToken)
                    .send({ number: res.body.ticket.number })
                    .end((err, res) => {
                        response = res;
                        done();
                    });
                });
            });
        });

        it("Response body should have 'successful' property", (done) => {
            expect(response.body).to.have.property('successful');
            done();
        });

        it("Response body 'successful' property should be equal to true", (done) => {
            expect(response.body.successful).to.be.true;
            done();
        });

        it("Response status should be equal to 200", (done) => {
            expect(response.status).to.equal(200);
            done();
        });
    });
});

describe('#printTicket()', () => {
    context('Print randomly a ticket', () => {
        let response;

        before(function(done) {
            let accessToken;
            const credentials = {
                user: {
                    email: 'bm.mhoma@gmail.com',
                    password: 'benbenben',
                },
            };

            // Signing in
            chai.request(httpServer)
            .post('/api/auth/signin-local')
            .set('content-type', 'application/json')
            .send(credentials)
            .end((err, res) => {
                accessToken = res.body.accessToken;

                // Trying to print ticket
                chai.request(httpServer)
                .post('/api/ticket/print')
                .set('x-access-token', accessToken)
                .end((err, res) => {
                    response = res;
                    done();
                });
            });
        });


        it("Response body should have 'ticket' property", (done) => {
            expect(response.body).to.have.property('ticket');
            done();
        });

        it("Response body 'ticket' property should have 'id' property", (done) => {
            expect(response.body.ticket).to.have.property('id');
            done();
        });

        it("Response body 'ticket' property should have 'number' property", (done) => {
            expect(response.body.ticket).to.have.property('number');
            done();
        });

        it("Response body 'ticket.number' property should be a string", (done) => {
            expect(response.body.ticket.number).to.be.a('string');
            done();
        });
        
        it("Response body 'ticket' property should have 'prize' property", (done) => {
            expect(response.body.ticket).to.have.property('prize');
            done();
        });

        it("Response body 'ticket.prize' property should be a string", (done) => {
            expect(response.body.ticket.prize).to.be.a('string');
            done();
        });

        it("Response body 'ticket' property should have 'printed' property", (done) => {
            expect(response.body.ticket).to.have.property('printed');
            done();
        });

        it("Response body 'ticket.prize' property should be equal to true", (done) => {
            expect(response.body.ticket.printed).to.be.true;
            done();
        });

        it("Response body 'ticket' property should have 'userId' property", (done) => {
            expect(response.body.ticket).to.have.property('userId');
            done();
        });

        it("Response body 'ticket.userId' should be null", (done) => {
            expect(response.body.ticket.userId).to.be.null;
            done();
        });

        it("Response body should have 'successful' property", (done) => {
            expect(response.body).to.have.property('successful');
            done();
        });

        it("Response body 'successful' property should be equal to 'true'", (done) => {
            expect(response.body.successful).to.be.true;
            done();
        });

        it("Response status should be equal to 200", (done) => {
            expect(response.status).to.equal(200);
            done();
        });
    });
});