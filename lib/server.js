 import chalk from 'chalk';
 import net from 'net';
import { start } from 'repl';
 
 const logOut = (...args) => {

   if(process.env['NODE_ENV'] !== 'test') {
     console.log(chalk.cyan('[server]'), ...args);
   }
 }
 const logErr = (...args) => {

   if(process.env['NODE_ENV'] !== 'test') {
     console.error(chalk.cyan('[server]'), ...args);
   }
 }

 export const serve = (host, port) => {
   const server = net.createServer((socket) => {
     logOut(`Got a connection!`);
     socket.on('data', (data) => {
        const dataStr = data.toString()
       logOut('Got data', dataStr);
       const lines = dataStr.split('\n')
       const startLine = lines[0];
       const [ method, path, ] = startLine.split(' ');
       if(method == 'GET' && path == '/') {
        const body = `
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
        </html>`;
        socket.write(`HTTP/1.1 200 Ok
Content-Length: ${body.length}

${body}`)
       } else if(method == 'GET' && path == '/posts') {
        const object = {
            name: 'niki',
            color: 'pink'
        }
        socket.write(`HTTP/1.1 200 Ok
Content-Length: ${JSON.stringify(object).length}
Content-Type: application/json

${JSON.stringify(object)}`)
       }
    });

       // Just echo it back.
       socket.on('end', () => {
           logOut('disconnected');
     });

     socket.on('error', (err) => {
       logErr('Error with socket', err);
     });

     socket.on('close', () => {
       logOut('Connection was dropped.');
     });
   });

   server.listen(port, host, () => {
     logOut(`Established server on ${host}:${port}!`);
   });
   logOut(`Listening to ${host}:${port}...`)
   return server;
 }