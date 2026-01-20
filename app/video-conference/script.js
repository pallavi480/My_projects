const socket = io();
let localStream;
const peers = {};

const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');

const joinBtn = document.getElementById('joinBtn');
const roomIDInput = document.getElementById('roomID');
const toggleMicBtn = document.getElementById('toggleMic');
const toggleCamBtn = document.getElementById('toggleCam');
const shareScreenBtn = document.getElementById('shareScreen');

const chatContainer = document.getElementById('chatContainer');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChat');

// Get Media
async function getMedia() {
  localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
  localVideo.srcObject = localStream;
}

// Join Room
joinBtn.addEventListener('click', async () => {
  if(!roomIDInput.value) return alert("Enter Room ID!");
  await getMedia();
  socket.emit('join-room', roomIDInput.value);
});

// Handle New Users
socket.on('user-connected', userId => {
  const peer = createPeer(userId, true);
  peers[userId] = peer;
});

// Handle Signals
socket.on('signal', data => {
  if(!peers[data.from]){
    peers[data.from] = createPeer(data.from, false);
  }
  peers[data.from].signal(data.signal);
});

// Create Peer
function createPeer(userId, initiator) {
  const peer = new SimplePeer({
    initiator,
    trickle: false,
    stream: localStream
  });

  peer.on('signal', signal => {
    socket.emit('signal', {to: userId, signal});
  });

  peer.on('stream', stream => {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    remoteVideos.appendChild(video);
  });

  return peer;
}

// Mic / Cam Toggle
toggleMicBtn.addEventListener('click', ()=>{if(localStream)localStream.getAudioTracks()[0].enabled=!localStream.getAudioTracks()[0].enabled;});
toggleCamBtn.addEventListener('click', ()=>{if(localStream)localStream.getVideoTracks()[0].enabled=!localStream.getVideoTracks()[0].enabled;});

// Screen Share
shareScreenBtn.addEventListener('click', async ()=>{
  const screenStream = await navigator.mediaDevices.getDisplayMedia({video:true});
  const screenTrack = screenStream.getVideoTracks()[0];
  // Replace track in all peers
  for(let id in peers){
    const sender = peers[id]._pc.getSenders().find(s=>s.track.kind==='video');
    sender.replaceTrack(screenTrack);
  }
  localVideo.srcObject = screenStream;
  screenTrack.onended = () => { // revert to camera
    for(let id in peers){
      const sender = peers[id]._pc.getSenders().find(s=>s.track.kind==='video');
      sender.replaceTrack(localStream.getVideoTracks()[0]);
    }
    localVideo.srcObject = localStream;
  }
});

// Chat
sendChatBtn.addEventListener('click', ()=>{
  const msg = chatInput.value.trim();
  if(msg){
    socket.emit('chat-message', msg);
    chatInput.value = '';
  }
});

socket.on('chat-message', data => {
  const p = document.createElement('p');
  p.textContent = `${data.from.substring(0,5)}: ${data.message}`;
  chatContainer.appendChild(p);
  chatContainer.scrollTop = chatContainer.scrollHeight;
});
