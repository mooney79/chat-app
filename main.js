(function(){
    'use strict';

    const userName = prompt(`What's your name?`)

    function createElement(obj) {
        let name = obj.sender;
        let id = obj.id;
        let message = obj.text;
        let $nameDiv = document.createElement('div');
        let $delButton = document.createElement('button')
        $nameDiv.className += 'chat-name';
        $delButton.className += 'delete-button';
        $nameDiv.innerHTML = `${name}`
        $delButton.innerHTML = 'X';
        let $messageDiv = document.createElement('div'); 
        $messageDiv.className += "chat-bubble";
        $messageDiv.id = `${id}`;
        $messageDiv.innerHTML = `${message}`;
        const currentDiv = document.getElementById("div1");
        document.body.insertBefore($messageDiv, currentDiv);
        $messageDiv.appendChild($nameDiv);
        $messageDiv.appendChild($delButton);
        $delButton.id = `${id}del`
        $delButton.addEventListener('click', (Event) => {
            deleteMessage(Event.target.id);
            // console.log(Event.currentTarget.id)
          }); 
        // console.log(`${name} sent ${message}`);
    }


// PULL LIST OF MESSAGES ON PAGE LOAD
    fetch('https://tiny-taco-server.herokuapp.com/tacoboutit/')
        .then(response => response.json())
        .then(data => data.forEach(createElement)
        );
    
     const $textField = document.querySelector(".text-area");
     const $submit = document.querySelector(".submit");

     
     $submit.addEventListener("click", loadMessage);
    
     function loadMessage(){
        let outgoing = $textField.value;
        let sentPacket = {
            sender: userName,
            text: outgoing,
        }
         
        fetch('https://tiny-taco-server.herokuapp.com/tacoboutit/', {
            method: 'POST',
            headers: {
             'Content-Type': 'application/json',
            },
            body: JSON.stringify(sentPacket),
        })
        .then(response => {
            if(!response.ok) {
                throw new Error('Ooops! Something went wrong!')
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error=> console.log('Error: ', error)) // catches errors if detected
        // .finally(() => console.log(`API's are awesome!`)); //Always fires
        $textField.value = '';
        createElement(sentPacket);
     }

    const tacoboutit = 'https://tiny-taco-server.herokuapp.com/tacoboutit/';
    
    function deleteMessage(target){
         let deleteKey = tacoboutit + target;
         let arr = Array.from(deleteKey.split(''));
         for (let i = 0; i < 3; i++){
             arr.pop();}
        deleteKey = arr.join('');
         
        fetch(deleteKey, {  
            method: 'DELETE',    
        })
        .then (response => {
            if (!response.ok) {
                throw new Error('Oops! Something went wrong')
            }
            console.log ('Record deleted');
        })



    }


   











})();


// function refresh() {fetch('http://tiny-taco-server.herokuapp.com/tacoboutit/')
// .then(response => response.json())
// .then(data => data.forEach(createElement)
// );}


//  https://tiny-taco-server.herokuapp.com/tacoboutit/


// SetInterval to refresh?
// profiles