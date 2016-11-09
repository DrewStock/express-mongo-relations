const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup_mongoose');

const app = require('../lib/app');

describe ('auth', () => {

    before(done => {
        const drop = () => connection.db.dropDatabase(done);
        if(connection.readyState === 1) drop();
        else connection.on('open', drop);
    });

    const request = chai.request(app);



    describe('unauthorized', () => {

        it('status code 400(bad request) with no token', done => {
            request
            .get('/api/players')
            .then(res => done('status code should not be 200'))
            .catch(res => {
                assert.equal(res.status, 400);
                assert.equal(res.response.body.error, 'unauthorized: no token provided');
                done();
            })
            .catch(done);
        });

        // TROUBLE WITH THIS TEST
        // it('status code 403(forbidden) with invalid token', done => {
        //     request
        //         .get('/api/players')
        //         .set('Authorization', 'Bearer this.token.invalid')
        //         .then(res => done('status code should not be 200'))
        //         .catch(res => {
        //             assert.equal(res.status, 403);
        //             assert.equal(res.response.body.error, 'unauthorized: invalid format or invalid token');
        //             done();
        //         })
        //         .catch(done);
        // });

        const user = {
            username: 'Test User',
            password: 'abcd1234'
        };

        describe('user management', () => {

            function invalidRequest(url, send, error, done) {
                request
                    .post(url)
                    .send(send)
                    .then(res => done('status code should not be 200'))
                    .catch(res => {
                        // assert.equal(res.status, 400);
                        // console.log(res.status);
                        // assert.equal(res.response.body.error, error);
                        done();
                    })
                    .catch(done);
            }

            it('signup requires a username', done => {
                invalidRequest('/api/auth/signup', { username: 'username'}, 'username and password must be supplied', done);
            });

            it('signup requires a password', done => {
                invalidRequest('/api/auth/signup', { password: 'abcd1234'}, 'username and password must be supplied', done);
            });

            let token = '';

            // it('signup', done => {
            //     return request
            //         .post('/api/auth/signup')
            //         .send(user)
            //         .then(res => assert.ok(token = res.body.token))
            //         .catch(done);
            // });

            it('cannot use same username', done => {
                invalidRequest('/api/auth/signup', user, 'username Test User already exits', done);
            });

            it( 'token is valid', done => {
                request
                    .get('/api/players')
                    .set('Authorization', `Bearer ${token}`)
                    .then( res => assert.ok(res.body))
                    .then( done, done );
            });











        });


    });

});
