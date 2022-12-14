 import chalk from 'chalk';
 import net from 'net';
 
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
        const body = 
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
        ;
        socket.write(`HTTP/1.1 200 Ok
Content-Length: ${body.length}

${body}`)
       } else if(method == 'GET' && path == '/posts') {
        const object = JSON.stringify({
            name: 'niki',
            color: 'pink'
        });
        socket.write(`HTTP/1.1 200 Ok
Content-Length: ${JSON.stringify(object).length}
Content-Type: application/json

${JSON.stringify(object)}`
)
    } else if (method == 'POST' && path == '/mail') {
        socket.write(`HTTP/1.1 204 not found
Content-Length: 0
Content-Type: application/json

`)
            } 
            else {
                const notFound = 
                `<html>
                    <main>
                        <p>
                            N O T  F O U N D
                        </p>
                    </main>
                </html>`
            socket.write(`HTTP/1.1 404 not found
Content-Length: ${notFound.length}
Accept: application/json, text/html

${notFound}
`)
    }
    });
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