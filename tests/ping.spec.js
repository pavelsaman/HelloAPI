const app = require('../index');
const request = require('supertest');
const { expect } = require('chai');

const API_VERSION = process.env.API_VERSION;

describe('Ping endpoint', () => {
  it('Should return 200', async () => {
    await request(app)
      .get(`/api/${API_VERSION}/ping`)
      .expect(res => {
        expect(res.body).to.have.keys('status', 'statusText', 'message');
      });
  });

  it('Should have properties', async () => {
    await request(app)
      .get(`/api/${API_VERSION}/ping`)
      .expect(res => {
        expect(res.body).to.have.keys('status', 'statusText', 'message');
      });
  });
});
