
//로그인 시스템 대신 임시 방편
let username = prompt("아이디를 입력하세요: ");
let roomNum = prompt("채팅방 번호를 입력 하세요: ")


document.querySelector("#username").innerHTML = username;
document.querySelector("#roomNum").innerHTML = roomNum;


//SSE연결
const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);
eventSource.onmessage = (event) => {
    //console.log(1, event);
    const data = JSON.parse(event.data);
    //console.log(2, data);
    if(data.sender === username){ //로그인 유저시 파란박스
        initMyMessage(data);
    } else {
        initYourMessage(data);//다른 유저 회색박스
    }
}

//파란박스
function getSendMsgBox(data){  

    let year = data.createdAt.substring(0,5)
    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + year + md

    return `<div class="sent_msg">
    <p>${data.msg}</p>
    <span class="time_date"> ${convertTime}/<b>${data.sender}</b></span>
  </div>`;
}

//회색박스
function getReceiveMsgBox(data){  

    let year = data.createdAt.substring(0,5)
    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + year + md

    return `<div class="received_withd_msg">
    <p>${data.msg}</p>
    <span class="time_date"> ${convertTime}/<b>${data.sender}</b></span>
  </div>`;
}

//파란박스 초기화
function initMyMessage(data){
    let chatBox = document.querySelector("#chat-box");

    let sendBox = document.createElement("div");
    sendBox.className = "outgoing_msg";

    sendBox.innerHTML = getSendMsgBox(data);
    chatBox.append(sendBox);

    document.documentElement.scrollTop=document.body.scrollHeight;
}

//회색박스 초기화
function initYourMessage(data){
    let chatBox = document.querySelector("#chat-box");

    let receivedBox = document.createElement("div");
    receivedBox.className = "received_msg";

    receivedBox.innerHTML = getReceiveMsgBox(data);
    chatBox.append(receivedBox);

    document.documentElement.scrollTop=document.body.scrollHeight;
}


//버튼 이벤트들
document.querySelector("#chat-send").addEventListener("click", ()=>{
    //alert("클릭 됨");
    addMessage();
});

document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e)=>{
    // console.log(e.keyCode);
    if(e.keyCode === 13){
        //alert("엔터 됨");
        addMessage();
    }
});


//AJAX 채팅 메세지 통신용
async function addMessage(){

    let msgInput = document.querySelector("#chat-outgoing-msg");
    //alert(msgInput.value)
    
    let chat = {
        sender: username,
        roomNum: roomNum,
        msg: msgInput.value
    };

    fetch("http://localhost:8080/chat",{
        method:"post",
        body:JSON.stringify(chat),
        headers:{
            "Content-Type":"application/json; charset=utf-8"
        }
    });
    msgInput.value = "";
}










// function getSendMsgBox(msg, time){  
//     return `<div class="sent_msg">
//     <p>${msg}</p>
//     <span class="time_date"> ${time}</span>
//   </div>`;
// }


// function initMyMessage(data){
//     let chatBox = document.querySelector("#chat-box");
//     //alert(msgInput.value)

//     let year = data.createdAt.substring(0,5)
//     let md = data.createdAt.substring(5,10)
//     let tm = data.createdAt.substring(11,16)
//     convertTime = tm + " | " + year + md


//     let chatOutgoingBox = document.createElement("div");
//     chatOutgoingBox.className = "outgoing_msg";
//     chatOutgoingBox.innerHTML = getSendMsgBox(data.msg, convertTime);
//     chatBox.append(chatOutgoingBox);

// }