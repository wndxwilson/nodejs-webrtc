const { RTCVideoSink, RTCVideoSource, i420ToRgba, rgbaToI420 } = require('wrtc').nonstandard;

//client.js
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {reconnect: true});

//Simple peer
var Peer = require('simple-peer')
var wrtc = require('wrtc')

const source = new RTCVideoSource();
const track = source.createTrack();
const sink = new RTCVideoSink(track);

const width = 320;
const height = 240;
const data = new Uint8ClampedArray(width * height * 1.5);
const frame = { width, height, data };
const stream =  new wrtc.MediaStream()

stream.addTrack(track)  



var peer1 = new Peer({ initiator: true, stream: stream  ,wrtc: wrtc})
var peer2 = new Peer({wrtc: wrtc})

peer1.on('signal', data => {
  // when peer1 has signaling data, give it to peer2 somehow
  peer2.signal(data)
})

peer2.on('signal', data => {
  // when peer2 has signaling data, give it to peer1 somehow
  peer1.signal(data)
})

peer1.on('connect', () => {
  // wait for 'connect' event before using the data channel
  peer1.send('hey peer2, how is it going?')
})

peer2.on('data', data => {
  // got a data channel message
  console.log('got a message from peer1: ' + data)
})

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});
socket.emit('demo', 'me', 'test msg');