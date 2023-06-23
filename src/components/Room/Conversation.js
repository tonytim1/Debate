import React, { useEffect, useRef, useState, createRef } from "react";
import UsersShow from 'src/components/roomPage/UsersShow';
import AdminControl from 'src/components/roomPage/AdminControl';
import SpectatorsList from 'src/components/roomPage/SpectatorsList';
import { Typography, Stack, Button, Container, Grid, Card, CardActions, IconButton, Skeleton } from '@mui/material';
import Chat from 'src/components/messages/Chat';
import { useNavigate, useParams } from 'react-router-dom';
import Scrollbar from 'src/components/scrollbar';
import { Helmet } from 'react-helmet-async';
import Peer from "simple-peer";
import Video from 'src/components/conversation_room/Video';
import ChatIcon from '@mui/icons-material/Chat';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

const Conversation = ({ roomData, currUserId, roomId, isSpectator, socket, messageRef, setMessageRef, messages, setMessages }) => {
    const config = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302"
        }
      ]
    };
    const [ peers, setPeers ] = useState([]); //state for rendering and also have stream of peers
    const myVideo = createRef(); //for display own video
    const webcamStream = useRef(); //own webcam stream
    const peersRef = useRef([]); //collection of peers who are currently connect to a room
    const screenCaptureStream = useRef(); //screen capture stream
    const [ isVideoMuted, setIsVideoMuted ] = useState(false);
    const [ isAudioMuted, setIsAudioMuted ] = useState(false);
    const [ spectators, setSpectators ] = useState([]);
    const [ showChat, setShowChat ] = useState(true);
    const [ isMuted, setIsMuted ] = useState(false);
    const [ isVideoOff, setIsVideoOff ] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (isSpectator) {
        // if user is a spectator, then don't connect webcam stream
      }
      else {
        connectToSocketAndWebcamStream().then(() => {
          //socket.current.emit("WebcamReady", roomId); //sending to the server that a user joined to a room
          console.log("WebcamReady");

          Object.entries(roomData.users_list).forEach(([userId, user]) => {
            if (userId < currUserId) {   // only send to users with lower id so that we don't send the same message twice
              console.log("other user", userId);
              //creating connection between two user via simple-peer for video
              const peer = createPeer(user.sid, socket.current.id, webcamStream.current);
              peersRef.current.push({
                peerId: user.sid,
                userId: userId,
                peer
              });
              peers.push({
                peerId: user.sid,
                userId: userId,
                peer
              });
            }
          })
          setPeers(peers);
          console.log("peers", peers);  
    
          //server send array of socket id's of other user of same room so that new user can connect with other user via
          //simple-peer for video transmission and message will be served using socket io
          socket.current.on("usersInConversation", users => { //triggered in server and here receiving it
            const peers = [];
            users.forEach(otherUserSocketId => {
              //creating connection between two user via simple-peer for video
              const peer = createPeer(otherUserSocketId, socket.current.id, webcamStream.current);
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
          socket.current.on("sendingSignalAck", payload => {
            console.log("sendingSignalAck", payload);

            let item = peersRef.current.find(p => p.peerId === payload.callerId);
            if (item) {
              console.log("peer already exists!!!! this will duplicate the peer!", item);
            }

            let peer = addPeer(payload.signal, payload.callerId, webcamStream.current);
            peersRef.current.push({
              peer,
              peerId: payload.callerId,
              userId: payload.userId,
            });
            const peerObj = {
              peer,
              peerId: payload.callerId,
              userId: payload.userId,
            };  
            setPeers(users => [...users, peerObj]);
          });
    
          //receiving signal of other peer who is trying to connect and adding its signal at peersRef
          socket.current.on("returningSignalAck", payload => {
            const item = peersRef.current.find(p => p.peerId === payload.calleeId);
            console.log("got returningSignalAck! will signal item ", item);
            item.peer.signal(payload.signal);
          });
    
          //user left and server send its peerId to disconnect from that peer
          socket.current.on('userLeft', id => {
            const peerObj = peersRef.current.find(p => p.peerId === id);
            if(peerObj) peerObj.peer.destroy(); //cancel connection with disconnected peer
            const peers = peersRef.current.filter(p => p.peerId !== id);
            peersRef.current = peers;
            setPeers(peers);
          });
        });
      }
  
      return () => stopAllVideoAudioMedia();
      //eslint-disable-next-line
    }, []);
  
  
    const connectToSocketAndWebcamStream = async() => {
      //connecting to server using socket
      // webcamStream.current = null;
      // return
      webcamStream.current = await getWebcamStream();
      console.log(webcamStream.current);
      console.log(myVideo.current);
      myVideo.current.srcObject = webcamStream.current;
      if(!webcamStream.current.getAudioTracks()[0].enabled) webcamStream.current.getAudioTracks()[0].enabled = true;
    }
  
    //taking video(webcam) and audio of device
    const getWebcamStream = async () => {
      return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    }
  
    function createPeer(userSidToSendSignal, mySid, stream) {
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
        socket.current.emit("sendingSignal", { userId: currUserId, userSidToSendSignal: userSidToSendSignal, callerId: mySid, signal });
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
        socket.current.emit("returningSignal", { signal, callerId: callerId, userId: currUserId });
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
    }
  
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
      if(socket) {
        socket.current.emit('sendMessage', {
          roomId: roomId,
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
  
    const handleChatToggle = () => {
      setShowChat(!showChat);
    }

    const handleMuteToggle = () => {
      setIsMuted(!isMuted);
    }

    const handleVideoToggle = () => {
      setIsVideoMuted(!isVideoMuted);
    }

    return (
      <>
      <Helmet>
        <title> Debate Center | Debate </title>
      </Helmet>
      <Container style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        // maxWidth: '95vw',
      }}>
      <Card sx={{width: "100%", height: "fit-content"}}
          style={{
            display: 'flex',
            paddingBottom: '20px',
            paddingTop: '20px',
            backgroundColor: '#dbe4f3',
            maxHeight: '97%',
            minHeight: '97%',
            justifyContent: 'center',
        }}>
        <Stack style={{width: '97%',}} spacing={3}>
          <Typography variant="h3" align="center" gutterBottom style={{marginBottom: '0px'}}>
            {roomData.name}
          </Typography>
          {/*My own video stream, muted*/}
            <Card style={{backgroundColor:"#5a66a440", padding:'20px', marginTop:'10px', flexGrow:'1'}}>
            <Grid container spacing={2} style={{minHeight: "94%", justifyContent:'center'}}>  
              <Grid item>
                <Typography variant="h5" gutterBottom>{`Me (${currUserId})`}</Typography>
                <video muted autoPlay playsInline ref={myVideo} width="320" height="240"/>
              </Grid>
                  {/*Peers video and audio stream*/}
              {peers.map((peer) => (
                <Video controls peer={peer} />
              ))}
              <Grid item>
                <Typography variant="h5" gutterBottom>{`Loading ...`}</Typography>
                <Skeleton variant="rectangular" width={320} height={240} />
              </Grid>
              <Grid item>
                <Typography variant="h5" gutterBottom>{`Loading ...`}</Typography>
                <Skeleton variant="rectangular" width={320} height={240} />
              </Grid>
              <Grid item>
                <Typography variant="h5" gutterBottom>{`Loading ...`}</Typography>
                <Skeleton variant="rectangular" width={320} height={240} />
              </Grid>
              <Grid item>
                <Typography variant="h5" gutterBottom>{`Loading ...`}</Typography>
                <Skeleton variant="rectangular" width={320} height={240} />
              </Grid>
              

            </Grid>
            <CardActions style={{justifyContent: 'center'}}>
              <IconButton onClick={handleChatToggle}>
                {showChat ? (<SpeakerNotesOffIcon/>) : (<ChatIcon/>)}
              </IconButton>
              <IconButton onClick={handleMuteToggle}>
                {isMuted ? (<MicIcon/>) : (<MicOffIcon/>)}
              </IconButton>
              <IconButton onClick={handleVideoToggle}>
                {isVideoMuted ? (<VideocamIcon/>) : (<VideocamOffIcon/>)}
              </IconButton>
            </CardActions>
            </Card>
          {/*Video controls - possibly to be added*/}
          {showChat ? (<Stack direction="row" spacing={2} alignItems="center" style={{maxHeight:'35%'}}>
            {/*Chat container*/}
            <Chat style={{}} roomId={roomId} socket={socket} messageRef={messageRef} setMessageRef={setMessageRef} messages={messages} setMessages={setMessages} currUserId={currUserId}/>
            {/*Spectators*/}
            <SpectatorsList spectsList={roomData.spectators_list}/>
          </Stack>) : null}
          
        </Stack>
        </Card>
      </Container>
      </>
    );
  };

export default Conversation