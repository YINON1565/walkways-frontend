import io from 'socket.io-client';
import {storageService} from './storage.service.js'

const BASE_URL = process.env.NODE_ENV === 'production' ?
    '/' :
    '//localhost:3030'
var socket;

export default {
    setup,
    terminate,
    on,
    off,
    emit,
    loadMsg,
    pushMsg
}

function setup() {
    socket = io(BASE_URL);
}

function terminate() {
    socket = null;
}

function on(eventName, cb) {
    socket.on(eventName, cb)
}

function off(eventName, cb) {
    socket.off(eventName, cb)
}

function emit(eventName, data) {
    socket.emit(eventName, data)
}

function loadMsg(topic){
    return storageService.load(topic)
}
function pushMsg(msg){
    var msgs = storageService.load(msg.topic)
    msgs ? msgs.push(msg): msgs = [msg] 
    storageService.store(msg.topic, msgs)
    return msgs;
}