const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
// const httpServer = process.env.API || "../../server";
const { httpServer } = require('../../server');
chai.use(chaiHttp);

const path = require('path');
const db = require('../../config/models/modelAssociation');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const Seed = require('../../config/seeders');

before(async () => {
    await db.sequelize.sync({ force: true })
    .then(() => Seed())
    .catch((e) => {
        console.log(e);
    });
});

beforeEach(() => {

});

afterEach(() => {
    
});

describe("#signup()", () => {
    context('Without arguments', () => {
        it("Should return an error (500 | Internal Server Error).", (done) => {
            // Trying to sign up
            chai.request(httpServer)
            .post('/api/auth/signup-local')
            .end((err, res) => {
                expect(res.status).to.equal(500);
                done();
            });
        });
    })
    context('With an email used in database.', () => {
        let response;

        before(function(done) {
            const body = {
                user: {
                    firstname: "Client",
                    lastname: "Client",
                    newsletter: false,
                    birthdate: "2002-12-11",
                    email: "bm.mhoma@gmail.com",
                    password: "benbenben",
                },
            };

            // Trying to sign up
            chai.request(httpServer)
            .post('/api/auth/signup-local')
            .set('content-type', 'application/json')
            .send(body)
            .end((err, res) => {
                response = res;
                done();
            });
        });

        it("Response body should be an object", (done) => {
            expect(response.body).to.be.a('object');
            done();
        })

        it("Body property 'successful' should be equal to false", (done) => {
            expect(response.body.successful).to.equal(false);
            done();
        })

        it("Body property 'status' should be equal to 'email_already_used'", (done) => {
            expect(response.body.status).to.equal("email_already_used");
            done();
        })

        it("Response status should be equal to 400 (Bad Request)", (done) => {
            expect(response.status).to.equal(400);
            done();
        })
    });

    context('With a too short password.', () => {
        let response;

        before(function(done) {
            const body = {
                user: {
                    firstname: "Jean-Charles",
                    lastname: "Sabatier",
                    newsletter: false,
                    birthdate: "2002-12-11",
                    email: "tooshort@gmail.com",
                    password: "benb",
                },
            };

            // Trying to sign up
            chai.request(httpServer)
            .post('/api/auth/signup-local')
            .set('content-type', 'application/json')
            .send(body)
            .end((err, res) => {
                response = res;
                done();
            });
        });

        it("Response body should be an object", (done) => {
            expect(response.body).to.be.a("object");
            done();
        });
        
        it("Body property 'error' should be an object", (done) => {
            expect(response.body.error).to.be.a("object");
            done();
        });

        it("Body property 'error.status' should be equal to 'password_too_short'", (done) => {
            expect(response.body.error.status).to.equal("password_too_short");
            done();
        });

        it("Body property 'successful' should be equal to 'false'", (done) => {
            expect(response.body.successful).to.equal(false);
            done();
        });

        it("Response status should be equal to 400 (Bad Request)", (done) => {
            expect(response.status).to.equal(400);
            done();
        });

    });
    context('With a too recent birthdate (underage).', () => {
        let response;

        before(function(done) {
            const recentBirthdate = new Date().getFullYear();
            const body = {
                user: {
                    firstname: "Kevin",
                    lastname: "Mineur",
                    newsletter: false,
                    birthdate: recentBirthdate + "-12-11",
                    email: "underage@gmail.com",
                    password: "benbenben",
                },
            };

            // Trying to sign up
            chai.request(httpServer)
            .post('/api/auth/signup-local')
            .set('content-type', 'application/json')
            .send(body)
            .end((err, res) => {
                response = res;
                done();
            });
        });

        it("Response body should be an object", (done) => {
            expect(response.body).to.be.a('object');
            done();
        });

        it("Body property 'error' should be an object", (done) => {
            expect(response.body.error).to.be.a('object');
            done();
        });

        it("Body property 'error.status' should be equal to 'user_not_adult'", (done) => {
            expect(response.body.error.status).to.equal('user_not_adult');
            done();
        });

        it("Body property 'successful' should be equal to 'true'", (done) => {
            expect(response.body.successful).to.equal(false);
            done();
        });

        it("Response status should be equal to 400 (Bad Request)", (done) => {
            expect(response.status).to.equal(400);
            done();
        });
    });

    context('With valid data.', () => {
        let response;

        // Trying to sign up
        before( function(done) {
            const body = {
                user: {
                    firstname: "The",
                    lastname: "TipTop",
                    newsletter: false,
                    birthdate: "2000-12-11",
                    email: "thetiptop.obdn@gmail.com",
                    password: "benbenben",
                },
            };

            chai.request(httpServer)
            .post('/api/auth/signup-local')
            .set('content-type', 'application/json')
            .send(body)
            .end((err, res) => {
                response = res;
                done()
            });
        });

        it("Response body should be an object", (done) => {
            expect(response.body).to.be.a('object');
            done()
        })

        it("Body property 'successful' should be equal to 'true'", (done) => {
            expect(response.body.successful).to.equal(true);
            done()
        })

        it("Response body should have property 'userId'", (done) => {
            expect(response.body).to.have.property('userId');
            done()
        })

        it("Response status should be equal to 200", (done) => {
            expect(response.status).to.equal(200);
            done()
        })
    }); 
});

describe("#signin()", () => {
    context('Without arguments', () => {
        it("Should return an error (500 | Internal Server Error).", (done) => {
            
            // Trying to sign in
            chai.request(httpServer)
            .post('/api/auth/signin-local')
            .end((err, res) => {
                expect(res.status).to.equal(500);
                done();
            });
        });
    });
    context('With nonexistent credentials', () => {
        let response;

        before( function(done) {
            const body = {
                user: {
                    email: 'aragorn@mordor.com',
                    password: 'filsde',
                },
            };

            // Trying to sign in
            chai.request(httpServer)
            .post('/api/auth/signin-local')
            .set('content-type', 'application/json')
            .send(body)
            .end((err, res) => {
                response = res;
                done();
            });
        });

        it("Response body should be an object", (done) => {
            expect(response.body).to.be.a("object");
            done();
        })

        it("Body property 'successful' should be equal to 'false'", (done) => {
            expect(response.body.successful).to.equal(false);
            done();
        })

        it("Body property 'error' should be equal to 'user_not_found'", (done) => {
            expect(response.body.error).to.equal("user_not_found");
            done();
        })

        it("Response status should be equal to 404 (Not Found)", (done) => {
            expect(response.status).to.equal(404);
            done();
        })
    });

    context('With wrong credentials', () => {
        let response;

        before(function(done) {
            const body = {
                user: {
                    email: 'bm.mhoma@gmail.com',
                    password: 'ban',
                },
            };

            // Trying to signin
            chai.request(httpServer)
            .post('/api/auth/signin-local')
            .set('content-type', 'application/json')
            .send(body)
            .end((err, res) => {
                response = res;
                done();
            });
        });

        it("Response body should be an object", (done) => {
            expect(response.body).to.be.a("object");
            done();
        });

        it(" Body property 'successful' should be equal to 'false'", (done) => {
            expect(response.body.successful).to.equal(false);
            done();
        });

        it("Body property 'error' should be equal to 'invalid_credentials'", (done) => {
            expect(response.body.error).to.equal("invalid_credentials");
            done();
        });

        it("Response status should be equal to 401 (Unauthorized)", (done) => {
            expect(response.status).to.equal(401);
            done();
        });
    });
    context('With an inactive account', () => {
        let response;

        before(function(done) {
            const body = {
                user: {
                    email: 'inactive@gmail.com',
                    password: 'benbenben',
                },
            };

            // Trying to sign in
            chai.request(httpServer)
            .post('/api/auth/signin-local')
            .set('content-type', 'application/json')
            .send(body)
            .end((err, res) => {
                response = res;
                done();
            });
        });

        it("Response body should be an object", (done) => {
            expect(response.body).to.be.a("object");
            done();
        });

        it("Body property 'successful' should be equal to 'false'", (done) => {
            expect(response.body.successful).to.equal(false);
            done();
        });

        it("Body property 'error' should be equal to 'inactive_user'", (done) => {
            expect(response.body.error).to.equal("inactive_user");
            done();
        });

        it("Response status should be equal to 401 (Unauthorized)", (done) => {
            expect(response.status).to.equal(401);
            done();
        });
    });

    context('With valid credentials and active account', () => {
        let response;

        before(function(done) {
            const user = {
                user: {
                    email: 'bm.mhoma@gmail.com',
                    password: 'benbenben',
                },
            };

            // Trying to sign in
            chai.request(httpServer)
            .post('/api/auth/signin-local')
            .set('content-type', 'application/json')
            .send(user)
            .end((err, res) => {
                response = res;
                done();
            });
        });

        it("Response body should be an object", (done) => {
            expect(response.body).to.be.a("object");
            done();
        });

        it("Response body should have 'accessToken' property", (done) => {
            expect(response.body).to.have.property('accessToken');
            done();
        });

        it("Response body should have 'user' property", (done) => {
            expect(response.body).to.have.property('user');
            done();
        });

        it("Response body 'user' property should be an object", (done) => {
            expect(response.body.user).to.be.a('object');
            done();
        });

        it("Response body 'user' property should have an 'id' property which is a number", (done) => {
            expect(response.body.user).to.have.property('id').to.be.a('number');
            done();
        });

        it("Response body 'user' property should have a 'firstname' property which is a string", (done) => {
            expect(response.body.user).to.have.property('firstname').to.be.a('string');
            done();
        });

        it("Response body 'user' property should have a 'lastname' property which is a string", (done) => {
            expect(response.body.user).to.have.property('lastname').to.be.a('string');
            done();
        });

        it("Response body 'user' property should have a 'birthdate' property which has exactly 10 characters", (done) => {
            expect(response.body.user).to.have.property('birthdate').with.lengthOf(10);
            done();
        });

        it("Response body 'user' property should have an 'email' property which is a string", (done) => {
            expect(response.body.user).to.have.property('email').to.be.a('string');
            done();
        });

        it("Response body 'user' property should have an 'address' property which is a string", (done) => {
            expect(response.body.user).to.have.property('address');
            done();
        });

        it("Response body 'user' property should have a 'postcode'", (done) => {
            expect(response.body.user).to.have.property('postcode');
            done();
        });

        it("Response body 'user' property should have a 'city'", (done) => {
            expect(response.body.user).to.have.property('city');
            done();
        });
        
        it("Response status should be equal to 200 ()", (done) => {
            expect(response.status).to.equal(200)
            done();
        });
    });
});
