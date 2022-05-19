const fs = require("fs");

//--------------------------------------------

function handleGet(res){
    let data = fs.readFileSync('./data.json',{encoding:'utf8', flag:'r'})
    data = JSON.parse(data)
    
    try{  
        if( data == "" || isNaN(parseFloat(data.num))){
            
            createFormat()
            return serverErr(res)
        }
        
        return JSON.stringify(data);

    }catch(err){
        
        createFormat()
        return serverErr(res)
    }
   
}

function handlePost(userData, res){
   let data = fs.readFileSync('./data.json',{encoding:'utf8', flag:'r'})
   
   data = JSON.parse(data)
   if( !data.num && data.num !== 0){
       createFormat()
       return serverErr(res);
   }

   if( isNaN(data.num) && isNaN(userData.num) ) return badReq(res);

   data.num = addAndLower(data.num, userData);

   fs.writeFile('./data.json', JSON.stringify(data), err => {
       if(err){
            createFormat()
            return serverErr(res);
       } 
   })

}

function createFormat(){
    fs.writeFile('./data.json', JSON.stringify({'num':0}), err => {
        if(err){
            console.log(err);
        }
    }) 
}


//--------------------------------------------
//basic

function addAndLower(dataBaseNum, { num:userNum, op}){
    let result;

    if(op === 'Add'){
        return result = dataBaseNum + userNum;
    }
    if(op === 'Lower'){
        return result = dataBaseNum - userNum;
    }  

}

function checkData(data){
    let valid = true
    data.num = parseFloat(data.num);
    
    if(!data || data == ''){
        valid = false;
    }

    if(valid && !data.num && data.num !== 0 ){
        valid = false;
    }

    if(valid){
        const test =  data.num + data.num;
        if(isNaN(test)) valid = false;
    }
    
    if(valid && !data.op || !inArray(data.op, ['Add', 'Lower']) ){
        valid = false;
    }

    if(valid){
        return true;
    }else{
        return false;
    }
    
}

function inArray(element, array){
    for (let i = 0; i < array.length; i++) {
        if(element == array[i]) return true        
    }
    return false
}

function badReq(res){
    res.statusCode = 400;
    res.end()
}

function serverErr(res){
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({"num":0}));
    res.end()
    return false;
}

module.exports = {checkData, handlePost, handleGet, badReq }