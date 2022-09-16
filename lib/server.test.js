import request from 'supertest';
import { serve } from './server.js';

describe('The TCP server', () => {
  let server = null;

  beforeEach(() => {
    // Deliberately omit the port so we get an available one.
    server = serve('localhost', undefined);
  });

  afterEach(() => {
    server.close();
  });

  // This test will fail initially since the project doesn't start with a
  // working HTTP server.
  it('connects on the default port', async () => {
    const res = await request(server)
      .get('/')
      .expect(200);
      expect(res.text).toEqual(
        `
        <html>
          <main>
            <h1>H E L L O</h1>
            <h1>W O R L D</h1>
              <article>
                <p>
                Happiness does not depend on what you have or who you are, it solely relies on what you think.
                </p>
              </article>
          </main>
        </html>
        `
      )});

  it('connects to the post route with JSON', async () => {
    await request(server)
    .get('/posts')
    .expect(200)
    .expect('Content-Type', 'application/json')
  })

  it('receives a 404 when requesting an unknown resource/method', async () => {
    await request(server)
      .put('/fictitious')
      .expect(404);
  });
  
  it('gets a 204 when a post request is made', async () => {
    await request(server)
    .post('/mail')
    .expect(204)
    .expect('Content-Type', 'application/json')
  })
});