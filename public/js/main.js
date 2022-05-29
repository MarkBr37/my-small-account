

document.getElementById('Add').addEventListener('click', handleSendPost);
document.getElementById('Lower').addEventListener('click', handleSendPost);


let inputNum = document.getElementById('inputNum');
let theStoregeNum = document.getElementById('theStorageNum');

async function getNumFromServer(){
    const res = await fetch('http://localhost:3000/getnum')
    const data = await res.json()
    if(res.status == 500) alert('There was problem in server soo the dataBase was reset');
    theStoregeNum.innerText = parseFloat(data.num);

}

getNumFromServer()


function addAndLower(eventName){
    
    if(eventName === 'Add'){
        theStoregeNum.innerText = parseFloat(theStoregeNum.innerText) + parseFloat(inputNum.value);
        return;
    }else if(eventName === 'Lower'){
        theStoregeNum.innerText = parseFloat(theStoregeNum.innerText) - parseFloat(inputNum.value);
        return;
    }   
}

function checkIfValid(userNum, stoNum){
    if(!userNum){
        alert('Please put a number')
        inputNum.focus()
        return false
    }

    let testNum = parseFloat(stoNum) + parseFloat(userNum);
    if(isNaN(testNum)){
        location.reload();
        // just im case
        return false
    }

    return true;
}

async function handleSendPost(e){
    e.preventDefault();

    if(!checkIfValid(inputNum.value, theStoregeNum.innerText)) return;

    try{
    const res = await fetch('http://localhost:3000/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "num":inputNum.value,
            "op": e.target.defaultValue
        })

    });

    if(res.status == 200) addAndLower(e.target.defaultValue);
        
    
    if(res.status == 400) location.reload();

    // handle status code 500
    if(res.status == 500) alert('There was problem in server the dataBase was reset');

    }catch(error){
        console.log(error)
    }
    

}