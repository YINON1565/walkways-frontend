import socket from '../services/socket.service.js'

export default {
    state: {
        msgs: null
    },
    getters: {
        msgs(state){
            return state.msgs
        }
    },
    mutations: {
        setMsg (state, {msgs}){
            state.msgs = msgs
        }
    },
    actions: {
        sendMsg(context, {msg}) {
            socket.emit('sendMsg', msg)
        },
        getChatHistory(context, {chatId}) {
            socket.emit('getHistory', chatId)
        },
        loadMsg(context, {topic}){
            const msgs = socket.loadMsg(topic)
            context.commit({type: 'setMsg', msgs})
        },
        pushMsg (context, {msg}){
            const msgs = socket.pushMsg(msg)
            context.commit({type: 'setMsg', msgs})
        }
    }
}