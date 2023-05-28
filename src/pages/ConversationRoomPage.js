import Scrollbar from '../components/scrollbar';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import React, { useEffect, useRef, useState, createRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useNavigate } from "react-router-dom";

import Video from '../components/conversation_room/Video';
import Spectator from 'src/components/conversation_room/Spectator';
//import "./RoomScreen.css";
const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
}

const ConversationRoomPage = (props) => {
  const [ peers, setPeers ] = useState([]); //state for rendering and also have stream of peers
  const socketRef = useRef(); //own socket
  const myVideo = useRef(); //for display own video
  const webcamStream = useRef(); //own webcam stream
  const peersRef = useRef([]); //collection of peers who are currently connect to a room
  const screenCaptureStream = useRef(); //screen capture stream
  const conversationRoomId = "123456789"; // props.match.params.roomId; //joined room id
  const roomName = "cool room"; //props.match.params.roomName; //joined room name
  const [ isVideoMuted, setIsVideoMuted ] = useState(false);
  const [ isAudioMuted, setIsAudioMuted ] = useState(false);
  const [ messageRef, setMessageRef ] = useState(''); //message input
  const [ messages, setMessages ] = useState([]); //all messages state after joining the room
  const [ spectators, setSpectators ] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    connectToSocketAndWebcamStream().then(() => {
      socketRef.current.emit("joinRoom", conversationRoomId); //sending to the server that a user joined to a room

      //server send array of socket id's of other user of same room so that new user can connect with other user via
      //simple-peer for video transmission and message will be served using socket io
      socketRef.current.on("usersInRoom", users => { //triggered in server and here receiving it
        const peers = [];
        users.forEach(otherUserSocketId => {
          //creating connection between two user via simple-peer for video
          const peer = createPeer(otherUserSocketId, socketRef.current.id, webcamStream.current);
          peersRef.current.push({
            peerId: otherUserSocketId,
            peer
          });
          peers.push({
            peerId: otherUserSocketId,
            peer
          });
        })
        setPeers(peers);
      })

      //a new user joined at same room send signal,callerId(simple-peer) and stream to server and server give it to
      //us to create peer between two peer and connect
      socketRef.current.on("userJoined", payload => {
        let peer;
        if(screenCaptureStream.current) peer = addPeer(payload.signal, payload.callerId, screenCaptureStream.current);
        else peer = addPeer(payload.signal, payload.callerId, webcamStream.current);
        peersRef.current.push({
          peerId: payload.callerId,
          peer
        });
        const peerObj = {
          peer,
          peerId: payload.callerId
        };

        setPeers(users => [...users, peerObj]);
      });

      //receiving signal of other peer who is trying to connect and adding its signal at peersRef
      socketRef.current.on("returningSignalAck", payload => {
        const item = peersRef.current.find(p => p.peerId === payload.id);
        item.peer.signal(payload.signal);
      });

      //receiving message of an user and adding this at message state
      socketRef.current.on('receiveMessage', payload => {
        setMessages(messages => [...messages, payload]);
      });

      //user left and server send its peerId to disconnect from that peer
      socketRef.current.on('userLeft', id => {
        const peerObj = peersRef.current.find(p => p.peerId === id);
        if(peerObj) peerObj.peer.destroy(); //cancel connection with disconnected peer
        const peers = peersRef.current.filter(p => p.peerId !== id);
        peersRef.current = peers;
        setPeers(peers);
      });
    });

    return () => stopAllVideoAudioMedia();
    //eslint-disable-next-line
  }, []);


  const connectToSocketAndWebcamStream = async() => {
    //connecting to server using socket
    socketRef.current = io.connect(process.env.REACT_APP_BASE_URL, {
      query: {
        token: localStorage.getItem('Token')
      }
    });
    webcamStream.current = await getWebcamStream();
    myVideo.current.srcObject = webcamStream.current;
    if(!webcamStream.current.getAudioTracks()[0].enabled) webcamStream.current.getAudioTracks()[0].enabled = true;
  }

  //taking video(webcam) and audio of device
  const getWebcamStream = async () => {
    return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  }

  function createPeer(userToSendSignal, callerId, stream) {
    //if initiator is true then newly created peer will send a signal to other peer it those two peers accept signal
    // then connection will be established between those two peers
    //trickle for enable/disable trickle ICE candidates
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: config,
      stream //My own stream of video and audio
    });

    //sending signal to second peer and if that receive than other(second) peer also will send an signal to this peer
    peer.on("signal", signal => {
      socketRef.current.emit("sendingSignal", { userToSendSignal: userToSendSignal, callerId: callerId, signal });
    })
    return peer;
  }

  //after receiving of others user's signal adding to peer array and returning own signal to other user
  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    //other peer give its signal in signal object and this peer returning its own signal
    peer.on("signal", signal => {
      socketRef.current.emit("returningSignal", { signal, callerId: callerId });
    });
    peer.signal(incomingSignal);
    return peer;
  }

  // const shareScreen = async () => {
  //   //getting screen video
  //   screenCaptureStream.current = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
  //   //taking video track of stream
  //   const screenCaptureVideoStreamTrack = screenCaptureStream.current.getVideoTracks()[0];

  //   //replacing video track of each peer connected with getDisplayMedia video track and audio will remain as it is
  //   //as all browser does not return audio track with getDisplayMedia
  //   peers.map(peer => (
  //       peer.peer.replaceTrack(
  //           peer.peer.streams[0].getVideoTracks()[0],
  //           screenCaptureVideoStreamTrack,
  //           peer.peer.streams[0]
  //       )
  //   ))
  //   //destroying previous stream video track
  //   const previousWebcamStream = myVideo.current.srcObject;
  //   const previousWebcamStreamTracks = previousWebcamStream.getTracks();
  //   previousWebcamStreamTracks.forEach(function(track) {
  //       if(track.kind === 'video')  track.stop();
  //   });
  //   myVideo.current.srcObject = screenCaptureStream.current;

  //   //When user will stop share then own video(of webcam) will appears
  //   screenCaptureStream.current.getVideoTracks()[0].addEventListener('ended', () => {
  //       startWebCamVideo();
  //       setIsAudioMuted(false);
  //       setIsVideoMuted(false);
  //   });
  // }

  //Stopping webcam and screen media and audio also
  const stopAllVideoAudioMedia = async () => {
    //destroying previous stream(webcam stream)
    const previousWebcamStream = webcamStream.current;
    const previousWebcamStreamTracks = previousWebcamStream.getTracks();
    previousWebcamStreamTracks.forEach(track => {
      track.stop();
    });

  //   //destroying previous stream(screen capture stream)
  //   const previousScreenCaptureStream = screenCaptureStream.current;
  //   if(previousScreenCaptureStream) {
  //     const previousScreenCaptureStreamTracks = previousScreenCaptureStream.getTracks();
  //     previousScreenCaptureStreamTracks.forEach(track => {
  //       track.stop();
  //     });
  //   }
  // }

  // const startWebCamVideo = async () => {
  //   await stopAllVideoAudioMedia();

  //   const newWebcamStream = await getWebcamStream(); //getting webcam video and audio
  //   const videoStreamTrack = newWebcamStream.getVideoTracks()[0]; //taking video track of stream
  //   const audioStreamTrack = newWebcamStream.getAudioTracks()[0]; //taking audio track of stream
  //   //replacing all video track of all peer connected to this peer
  //   peers.map(peer => {
  //     //replacing video track
  //     peer.peer.replaceTrack(
  //       peer.peer.streams[0].getVideoTracks()[0],
  //       videoStreamTrack,
  //       peer.peer.streams[0]
  //     );
  //     //replacing audio track
  //     peer.peer.replaceTrack(
  //       peer.peer.streams[0].getAudioTracks()[0],
  //       audioStreamTrack,
  //       peer.peer.streams[0]
  //     );
  //   });
  //   myVideo.current.srcObject = newWebcamStream;
  //   webcamStream.current = newWebcamStream;
  //   screenCaptureStream.current = null;
  // }

  const sendMessage = (e) => {
    e.preventDefault();
    //sending message text with roomId to sever it will send message along other data to all connected user of current room
    if(socketRef.current) {
      socketRef.current.emit('sendMessage', {
        roomId: conversationRoomId,
        message: setMessageRef.current.value
      })
      setMessageRef.current.value = "";
    }
  }

  //Mute or unmute audio
  const muteOrUnmuteAudio = () => {
    if(!isAudioMuted) {
      webcamStream.current.getAudioTracks()[0].enabled = false;
      setIsAudioMuted(true);
    } else {
      webcamStream.current.getAudioTracks()[0].enabled = true;
      setIsAudioMuted(false);
    }
  }

  //stop or play video
  const playOrStopVideo = () => {
    if(!isVideoMuted) {
      myVideo.current.srcObject.getVideoTracks()[0].enabled = false;
      setIsVideoMuted(true);
    } else {
      myVideo.current.srcObject.getVideoTracks()[0].enabled = true;
      setIsVideoMuted(false);
    }
  }

  const leaveMeeting = () => {
    navigate.push('/');
  };

  return (
    <>
    <Helmet>
      <title> Debate Center | Debate </title>
    </Helmet>
    <Container>
      {/*Room title*/} 
      <Grid container alignItems="stretch" spacing={2}>
        <Grid item xs={12}>
        <Typography variant="h3" align="center" gutterBottom>
          {roomName}
        </Typography>
        </Grid>
        {/*My own video stream, muted*/}
        <Grid item xs={12} md={6}>  
          <Typography variant="h5" gutterBottom>{'Me'}</Typography>
          <video muted autoPlay playsInline ref={myVideo} />
        </Grid>
        {/*Peers video and audio stream*/}
        {peers.map((peer) => (
          <Video controls key={peer.peerId} peer={peer} />
        ))}
        {/*Video controls - possibly to be added*/}
        {/*Chat container*/}
        <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h5">Chat</Typography>
          <Scrollbar style={{ height: 400 }}>
          {messages.map((message, i) => {
            const user = message.author;
            return (
            <div key={i}>
              <Typography variant="subtitle1">
              <strong>{user.name}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
              {message.text}
              </Typography>
            </div>
            );
          })}
          </Scrollbar>
          {/*Send message container*/}
          <Grid container alignItems="center" justifyContent="space-between" marginTop={2}>
          <Grid item xs={9}>
            <TextField label="Type a message" value={messageRef} onChange={(e) => setMessageRef(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" onClick={sendMessage} fullWidth>
            Send
            </Button>
          </Grid>
          </Grid>
        </Card>
        </Grid>
        {/*Spectators*/}
        <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h5">Spectators</Typography>
          <Scrollbar style={{ height: 473 }}>
          <ul>
            {spectators.map((user, i) => (
              <Spectator user={user} i={i}/>
            ))}
          </ul>
          </Scrollbar>
        </Card>
        </Grid>
      </Grid>
    </Container>
    </>
  );
};
};

export default ConversationRoomPage
