const http = require("http");
const fs = require("fs");

const utils = require("./utils");

const server = http.createServer((req, res)=>{
    console.log(req.url);

    if( req.url === '/favicon.ico'){
        res.statusCode = 204;
        res.end();
        return;
    }

    if(req.url === '/getnum'){

        const num = utils.handleGet(res)
        
        if(num !== false){
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(num);
            res.end();    
        }
        
    }

    if(req.method === "POST" & req.url === '/update'){
        
        req.on('data', (rawData) => {
            const data = JSON.parse(rawData)
            
            
            if(!data || !utils.checkData(data)){
                utils.badReq(res);
            }
            
            utils.handlePost(data ,res)

            res.statusCode = 200;
            res.end()
        })
        
        return;
    }

    if( req.url === '/'){
        res.writeHead(200, {'Content-type': 'text/html'});
        let data = fs.createReadStream(__dirname + '/public/main.html');
        data.pipe(res);
        return;
    }
  
    if( req.url === '/css/style.css'){
        res.writeHead(200, {'Content-type': 'text/css'});
        let data = fs.createReadStream(__dirname + '/public/css/style.css');
        data.pipe(res);
        return;
    }

    if( req.url === '/js/main.js'){
        res.writeHead(200, {'Content-type': 'text/js'});
        let data = fs.createReadStream(__dirname + '/public/js/main.js');
        data.pipe(res);
        return;
    }
    
    // if url not exist
    res.writeHead(200, {'Content-type': 'text/html'});
    fs.createReadStream(__dirname + '/public/main.html').pipe(res);
});


const PORT = 3000;

server.listen(PORT, ()=> console.log('Server work in localhost:'+ PORT));