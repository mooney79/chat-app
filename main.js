(function(){
    'use strict';

    const userName = prompt(`What's your name?`)
    

    function createElement(obj) {
        // const obj2 = obj.sort("timestamp");
        let name = obj.sender;
        let id = obj.id;
        let message = obj.text;

        let divs = [];
        let $divs = document.getElementsByTagName('div');
        for (let i=0; i < $divs.length; i++){
            divs.push(document.getElementsByTagName('div')[i].id);
        }
        setTimeout( () => {
        if (!(divs.includes(obj.id.toString()))) {

            //Create elements
            let $nameDiv = document.createElement('div');
            let $delButton = document.createElement('button')
            let $messageDiv = document.createElement('div');
            let $editButton = document.createElement('button');
            //Give them classes
            $nameDiv.className += 'chat-name';
            $delButton.className += 'delete-button';
            $messageDiv.className += "chat-bubble";
            $editButton.className += "edit-button";
            //Fill the text
            $nameDiv.innerHTML = `${name}`
            $delButton.innerHTML = 'X';
            $messageDiv.innerHTML = `${message}`;
            $editButton.innerHTML = '<i class="far fa-edit"></i>';
            //Append an ID
            $messageDiv.id = `${id}`;
            $delButton.id = `${id}del`;
            $editButton.id = `${id}edt`;

            const currentDiv = document.getElementById("div1");
            // Put elements on the DOM
            document.body.insertBefore($messageDiv, currentDiv);
            $messageDiv.appendChild($nameDiv);
            $messageDiv.appendChild($editButton);
            $messageDiv.appendChild($delButton);
            
            // Add event listeners
            $delButton.addEventListener('click', (Event) => {
                deleteMessage(Event.target.id);
            }); 
            $editButton.addEventListener('click', (Event) => {
                editMessage(Event.currentTarget.id);
            }); 
        } //if
        }, 0);
    }

// PULL LIST OF MESSAGES ON PAGE LOAD
    function fetchData() {
        fetch('https://tiny-taco-server.herokuapp.com/tacoboutit/')
        .then(response => response.json())
        .then(data => {
            // data["timestamp"].sort();
            data.forEach(createElement)});
    }

    fetchData();
    
     const $textField = document.querySelector(".text-area");
     const $submit = document.querySelector(".submit");

     
     $submit.addEventListener("click", loadMessage);
    
     function loadMessage(){
        let outgoing = $textField.value;
        let creationTime = Date.now();
        let sentPacket = {
            sender: userName,
            text: outgoing,
            timestamp: creationTime,
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

    function editMessage(target){
           console.log(target); 
           let editKey = tacoboutit + target;
           let arr = Array.from(editKey.split(''));
           for (let i = 0; i < 3; i++){
                arr.pop();}
           editKey = arr.join('');
           let newMess = prompt('Edit your message:');
           let obj = {
               'sender': userName,
               'text': newMess}
            
           fetch(editKey, {  
               method: 'PUT',
               headers: {
                'Content-Type': 'application/json',
               },
           body: JSON.stringify(obj),    
           })
           .then (response => {
               if (!response.ok) {
                   throw new Error('Oops! Something went wrong')
               }
               console.log ('Record edited');
           })
           

    }


    // fetchData(); //Manual call for testing.
let intervalID = setInterval(fetchData, 5000);


})();

        /*

        WORK LIST:

        Sort by created date? So need to pass in creation time, then use .sort
        Replace with innerHTML instead of appending new stuffs?

        //On-submit event listener on my submit button? Or on the form?

        */
