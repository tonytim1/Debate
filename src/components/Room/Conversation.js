import React, { useEffect, useRef, useState, createRef } from "react";
import SpectatorsList from 'src/components/roomPage/SpectatorsList';
import { Typography, Stack, Snackbar, Alert, Box, Button, Container, Grid, Card, CardActions, IconButton, Skeleton } from '@mui/material';
import Chat from 'src/components/messages/Chat';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Peer from "simple-peer";
import Video from 'src/components/conversation_room/Video';
import ChatIcon from '@mui/icons-material/Chat';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideoGrid from "./VideoGrid";
import CloseIcon from '@mui/icons-material/Close';


const Conversation = ({ roomData, setRoomData, currUserId, roomId, isSpectator, socket, messageRef, setMessageRef, messages, setMessages }) => {
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
    const [ isVideoMuted, setIsVideoMuted ] = useState(false);
    const [ isAudioMuted, setIsAudioMuted ] = useState(false);
    const [ spectators, setSpectators ] = useState([]);
    const [ openSnackbar, setOpenSnackbar ] = useState(true);
    const spectatorsRef = useRef([]);
    const [ showChat, setShowChat ] = useState(true);
    const navigate = useNavigate();

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpenSnackbar(false);
    };

    useEffect(() => {
      if (isSpectator) {
        console.log("spectator joined");
        const peers = [];
        Object.entries(roomData.users_list).forEach(([userId, user]) => {
          if (user.camera_ready) {
            console.log("spectator adding other user", userId);
            const peer = createPeer(user.sid, socket.current.id, null);
            peersRef.current.push({
              peerId: user.sid,
              userId: userId,
              peer,
              from: "spectatorJoin",
            });
            peers.push({
              peerId: user.sid,
              userId: userId,
              peer,
              from: "spectatorJoin",
            });
          }
        });
        setPeers(peers);
        console.log("peers", peers);

        socket.current.on("userInConversationReady", payload => {
          console.log("userInConversationReady", payload);
          const peer = createPeer(payload.userSid, socket.current.id, null);
          peersRef.current.push({
            peerId: payload.userSid,
            userId: payload.userId,
            peer,
            from: "spectatorUserReady",
          });
          setPeers((users) => [...users, {
            peerId: payload.userSid,
            userId: payload.userId,
            peer,
            from: "spectatorUserReady",
          }]);
          console.log("peers ready", peers, peersRef.current);
        });

        socket.current.on("returningSignalAck", payload => {
          const item = peersRef.current.find(p => p.peerId === payload.calleeId);
          console.log("got returningSignalAck! will signal item ", item, "with payload", payload);
          item.peer.signal(payload.signal);
        });

        //user left and server send its peerId to disconnect from that peer
        socket.current.on('userLeft', payload => {
          const peerObj = peersRef.current.find(p => p.peerId === payload.sid);
          if(peerObj) {
            console.log("destroying peer", peerObj);
            peerObj.peer.destroy(); //cancel connection with disconnected peer
          }
          const peers = peersRef.current.filter(p => p.peerId !== payload.sid);
          peersRef.current = peers;
          setPeers(peers);
        });

        // if all users left, go back to home page
        socket.current.on('allUsersLeft', () => {
          console.log("allUsersLeft");
          navigate('/');
          if (isSpectator) {
            localStorage.setItem('showNotification', 'true');
          }
        });
      }

      else {
        connectToSocketAndWebcamStream().then(() => {
          console.log("WebcamReady");
          socket.current.emit("WebcamReady", { userId: currUserId, roomId: roomId });

          socket.current.on("userInConversationReady", payload => {
            console.log("userInConversationReady", payload);
            const peer = createPeer(payload.userSid, socket.current.id, webcamStream.current);
            peersRef.current.push({
              peerId: payload.userSid,
              userId: payload.userId,
              peer,
              from: "userInConversationReady",
            });
            peers.push({
              peerId: payload.userSid,
              userId: payload.userId,
              peer,
              from: "userInConversationReady",
            });
            setPeers(peers);
          });

          socket.current.on("usersInConversation", (roomData) => {
            setRoomData(roomData);
            console.log("usersInConversation", roomData.users_list);
            Object.entries(roomData.users_list).forEach(([userId, user]) => {
              if (userId !== currUserId && user.camera_ready) {
                console.log("adding other user", userId);
                const peer = createPeer(user.sid, socket.current.id, webcamStream.current);
                peersRef.current.push({
                  peerId: user.sid,
                  userId: userId,
                  peer,
                  from: "usersInConversation",
                });
                peers.push({
                  peerId: user.sid,
                  userId: userId,
                  peer,
                  from: "usersInConversation",
                });
              }
            });
            setPeers(peers);
          })

          // Object.entries(roomData.users_list).forEach(([userId, user]) => {
          //   if (userId !== currUserId) {   // only send to users with lower id so that we don't send the same message twice
          //     console.log("adding other user", userId);
          //     //creating connection between two user via simple-peer for video
          //     const peer = createPeer(user.sid, socket.current.id, webcamStream.current);
          //     peersRef.current.push({
          //       peerId: user.sid,
          //       userId: userId,
          //       peer
          //     });
          //     peers.push({
          //       peerId: user.sid,
          //       userId: userId,
          //       peer
          //     });
          //     setPeers(peers);
          //   }
          // })
          // setPeers(peers);
          // console.log("peers", peers);

          //a new user joined at same room send signal,callerId(simple-peer) and stream to server and server give it to
          //us to create peer between two peer and connect
          socket.current.on("sendingSignalAck", payload => {
            console.log("sendingSignalAck", payload);

            let item = peersRef.current.find(p => p.peerId === payload.callerId);
            if (item) {
              console.log("peer already exists!!!! this will duplicate the peer!", item);
            }

            let peer = addPeer(payload.signal, payload.callerId, webcamStream.current);
            const peerObj = {
              peer,
              peerId: payload.callerId,
              userId: payload.userId,
              from: "addPeer",
            };
            if (payload.isSpectator) {
              console.log("peer is a spectator so not adding to peers, instead adding to spectators", payload.userId);
              spectatorsRef.current.push({
                peer,
                peerId: payload.callerId,
                userId: payload.userId,
                from: "addPeer",
              });
              setSpectators(users => [...users, peerObj]);
              return;
            }
            peersRef.current.push({
              peer,
              peerId: payload.callerId,
              userId: payload.userId,
              from: "addPeer",
            });
            setPeers(users => [...users, peerObj]);
          });
    
          //receiving signal of other peer who is trying to connect and adding its signal at peersRef
          socket.current.on("returningSignalAck", payload => {
            const item = peersRef.current.find(p => p.peerId === payload.calleeId);
            console.log("got returningSignalAck! will signal item ", item, "with payload", payload);
            item.peer.signal(payload.signal);
          });
    
          //user left and server send its peerId to disconnect from that peer
          socket.current.on('userLeft', payload => {
            const peerObj = peersRef.current.find(p => p.peerId === payload.sid);
            if(peerObj) {
              console.log("destroying peer", peerObj);
              peerObj.peer.destroy(); //cancel connection with disconnected peer
            }
            const peers = peersRef.current.filter(p => p.peerId !== payload.sid);
            peersRef.current = peers;
            setPeers(peers);

            // const spectatorObj = spectatorsRef.current.filter(p => p.peerId !== id);
            // if(spectatorObj) {
            //   console.log("destroying spectator", spectatorObj)
            //   spectatorObj.peer.destroy(); //cancel connection with disconnected peer
            // }
            // const spectators = spectatorsRef.current.filter(p => p.peerId !== id);
            // setSpectators(spectators);
          });
        });
      }

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
      console.log("createPeer");
      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: config,
        stream //My own stream of video and audio
      });
  
      //sending signal to second peer and if that receive than other(second) peer also will send an signal to this peer
      peer.on("signal", signal => {
        console.log("createPeer sendingSignal", signal);
        socket.current.emit("sendingSignal", { userId: currUserId, userSidToSendSignal: userSidToSendSignal, callerId: mySid, isSpectator: isSpectator, signal });
      })
      console.log("createPeer returning peer", peer);
      return peer;
    }
  
    //after receiving of others user's signal adding to peer array and returning own signal to other user
    function addPeer(incomingSignal, callerId, stream) {
      console.log("addPeer", incomingSignal, callerId, stream);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream
      });
  
      //other peer give its signal in signal object and this peer returning its own signal
      peer.on("signal", signal => {
        console.log("addPeer returningSignal", signal);
        socket.current.emit("returningSignal", { signal, callerId: callerId, userId: currUserId });
      });
      peer.signal(incomingSignal);
      console.log("addPeer returning peer", peer);
      return peer;
    }
  
    const leaveMeeting = () => {
      if (webcamStream.current) {
        const webcamStreamTracks = webcamStream.current.getTracks();
        webcamStreamTracks.forEach(track => {
            track.stop();
        });
      }
      socket.current.emit('leave_click', { 'roomId': roomId, 'userId':currUserId });
      navigate('/');
    };
  
    const handleChatToggle = () => {
      setShowChat(!showChat);
    }

    const handleMuteToggle = () => {
      if(!isAudioMuted) {
        webcamStream.current.getAudioTracks()[0].enabled = false;
        setIsAudioMuted(true);
      } else {
        webcamStream.current.getAudioTracks()[0].enabled = true;
        setIsAudioMuted(false);
      }
    }

    const handleVideoToggle = () => {
      if(!isVideoMuted) {
        myVideo.current.srcObject.getVideoTracks()[0].enabled = false;
        setIsVideoMuted(true);
      } else {
        myVideo.current.srcObject.getVideoTracks()[0].enabled = true;
        setIsVideoMuted(false);
      }
    }

    return (
      <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert  severity="info" sx={{ width: '100%' }} onClose={handleClose}>
          If you have any issues with the video, try refreshing the page.
        </Alert>
      </Snackbar>
      
      <Helmet>
        <title> Debate Center | Debate </title>
      </Helmet>
      <Container style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        maxWidth: '100%',
      }}>
      <Card sx={{width: "100%", height: "fit-content"}}
          style={{
            display: 'flex',
            paddingBottom: '20px',
            // paddingTop: '20px',
            backgroundColor: '#dbe4f3',
            maxHeight: '97%',
            minHeight: '97%',
            justifyContent: 'center',
        }}>
        <Button variant="outlined" color="error" onClick={leaveMeeting} style={{position: 'absolute', top: '1.5%', left: '1.5%'}}>
          Leave
        </Button>
        <Stack style={{width: '97%',}} spacing={3}>
          <Typography variant="h3" align="center" gutterBottom style={{marginBottom: '0px'}}>
            {roomData.name}
          </Typography>
          {/*My own video stream, muted*/}
            <Card style={{backgroundColor:"#5a66a440", padding:'20px', marginTop:'10px', flexGrow:'1'}}>
            {/*<VideoGrid myVideo={myVideo} peers={peers} />*/}
            <VideoGrid myVideo={myVideo} peers={peers} isSpectator={isSpectator}/>
            <CardActions style={{justifyContent: 'center', position:'absolute', bottom:'0px', left:'0px', width:'100%'}}>
              <Stack direction={'row'} spacing={2} style={{width:'100%', justifyContent:'center'}}>
              <Stack style={{alignContent:'center'}}>
                <IconButton onClick={handleChatToggle} style={{width:'fit-content', alignSelf:'center'}}>
                  {!showChat ? (<SpeakerNotesOffIcon/>) : (<ChatIcon/>)}
                </IconButton>
                <Typography fontSize='small' alignSelf={'center'}>
                  {!showChat ? ('Show Chat') : ('Hide Chat')}
                </Typography>
              </Stack>
              { isSpectator ? (<></>) : (<Stack style={{alignContent:'center'}}>
                <IconButton onClick={handleMuteToggle} style={{width:'fit-content', alignSelf:'center'}}>
                  {!isAudioMuted ? (<MicIcon/>) : (<MicOffIcon/>)}
                </IconButton>
                <Typography fontSize='small' alignSelf={'center'}>
                  {!isAudioMuted ? ('Mute') : ('Unmute')}
                </Typography>
              </Stack>)}
              { isSpectator ? (<></>) : (<Stack style={{alignContent:'center'}}>
                <IconButton onClick={handleVideoToggle} style={{width:'fit-content', alignSelf:'center'}}>
                  {!isVideoMuted ? (<VideocamIcon/>) : (<VideocamOffIcon/>)}
                </IconButton>
                <Typography fontSize='small' alignSelf={'center'}>
                  {isVideoMuted ? ('Show') : ('Hide')}
                </Typography>
              </Stack>)}
              </Stack>
            </CardActions>
            </Card>
          {/*Video controls - possibly to be added*/}
          {showChat ? (<Stack direction="row" spacing={2} alignItems="center" style={{maxHeight:'35%', minHeight:'25%'}}>
            {/*Chat container*/}
            <Chat style={{}} roomId={roomId} socket={socket} messageRef={messageRef} setMessageRef={setMessageRef} messages={messages} setMessages={setMessages} currUserId={currUserId}/>
            {/*Spectators*/}
            <SpectatorsList isSpectator={isSpectator} spectsList={roomData.spectators_list} allowSpectators={roomData.allow_spectators} isConversation={true}/>
          </Stack>) : null}
          
        </Stack>
        </Card>
      </Container>
      </>
    );
  };

export default Conversation