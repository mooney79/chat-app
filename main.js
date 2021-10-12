/*
KNOWN ISSUES LIST --
--If I use "sentPacket" object in LoadMessage() to create a visual representation of the message being posted, it
lacks an ID, so when the fetchData function runs, that message will be duplicated until the page is refreshed.
I tried to get around this by calling fetchData at the end of loadMessage, but it doesn't appear to work or
maybe lags long enough to be REALLY noticable.
--If I try to create my own IDs in LoadMessage to get around the above issue, Tiny Taco Server is unable to find
my IDs and thus those messages are stuck forever (or until server is cleaned).
--Rework the CSS, which got extensively broken in my refactor.
*/

(function(){
    'use strict';

    const tacoboutit = 'https://tiny-taco-server.herokuapp.com/tacoboutit/';
    const sender = prompt('Please enter your name: ');

    function createElement(obj) {
        const name = obj.sender;
        const id = obj.id;
        const message = obj.text;

        setTimeout( () => {
            const $idChecker = document.getElementById(id);
            if (!$idChecker) {
                const htmlStr = 
                `<section class="chat-bubble" id="${id}"> 
                    <div class="profile"> 
                        <i class="fas fa-user"></i>
                        <h3 class="chat-name" id="${id}chn">
                        ${name} 
                        </h3> 
                        <button class="edit-button" id="${id}edt"><i class="far fa-edit"></i></button> 
                        <button class="delete-button" id="${id}del">X</button> 
                    </div> 
                    <p id="${id}msg">${message}</p> 
                </section>`;        
                
                //Grab DOM elements
                const $div1 = document.getElementById('div1');
                
                // Insert the HTML
                $div1.insertAdjacentHTML('beforeend', htmlStr);

                //Grab newly created DOM elements
                const $delButton = document.getElementById(`${id}del`);
                const $editButton = document.getElementById(`${id}edt`);
                
                // Add event listeners
                $delButton.addEventListener('click', (Event) => {
                    deleteMessage(Event.target.id);
                }); 
                $editButton.addEventListener('click', (Event) => {
                    editMessage(Event.currentTarget.id);
                }); 
            } //if
        }, 100); //Timeout
    } //Function

    function fetchData() {
        fetch(tacoboutit)
        .then(response => response.json())
        .then(data => {
            data.sort((first, second) => {
                return first.timestamp - second.timestamp
            })
            data.forEach(createElement)
            
        });
    }

    function deleteMessage(target){
        const deleteKey = `${tacoboutit}${target}`.slice(0, -3);    
        const idKey = target.slice(0, -3);
        const $targetDiv = document.getElementById(idKey);
        console.log(deleteKey)
        fetch(deleteKey, {  
            method: 'DELETE',    
        })
        .then (response => {
        if (!response.ok) {
            throw new Error('Oops! Something went wrong')
        }
        console.log ('Record deleted');
        })
        $targetDiv.remove();
    }    

    function editMessage(target){
        const editKey = `${tacoboutit}${target}`.slice(0, -3);
        let newMess = prompt('Edit your message:');
        const idKey = editKey.slice(-3);
        const $msgName = document.getElementById(`${idKey}chn`);
        const $msg = document.getElementById(`${idKey}msg`);
        $msg.textContent = newMess;

        let obj = {
            'sender': $msgName.textContent,
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
        });
    }

    function loadMessage(){
        let outgoing = $textField.value;
        let creationTime = Date.now();
        // const id=`${creationTime}`.slice(-3)/1;
        let sentPacket = {
            sender: sender,
            text: outgoing,
            timestamp: creationTime,
            // id: id,
        }
        // createElement(sentPacket);
        
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
        fetchData();
    }

    const $textField = document.querySelector(".text-area");
    const $submit = document.querySelector(".submit");
    $submit.addEventListener("click", loadMessage);

    fetchData();

    let intervalID = setInterval(fetchData, 5000);
})();