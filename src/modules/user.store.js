import { userService } from '../services/user.service.js'
// import socketService from '../services/socket.service.js';
// import Swal from "sweetalert2"


var localLoggedinUser = null;
if (sessionStorage.loggedinUser) localLoggedinUser = JSON.parse(sessionStorage.loggedinUser);

export default {
    state: {
        loggedinUser: localLoggedinUser,
        users: [],
        newUserCred: {
            username: "",
            password: "",
            fullName: "",
            imgUrl: "",
            isAdmin: false,
            notifications: []
        }
    },
    getters: {
        users(state) {
            
            return state.users;
        },
        loggedinUser(state) {                        
            return state.loggedinUser
        },
        newUserCred(state) {
            return state.newUserCred
        },
        
    },
    mutations: {
        setUser(state, { user }) {
            state.loggedinUser = user;
        },
        setUsers(state, { users }) {
            state.users = users;
        },
        removeUser(state, { userId }) {
            state.users = state.users.filter(user => user._id !== userId)
        },
        setNewUserCred(state, {newUserCred}){
            
            state.newUserCred = newUserCred
        }
    },
    actions: {
        async login(context, { credentials }) {
            const user = await userService.login(credentials);
            if (user !== 'err') {
                context.commit({ type: 'setUser', user })
            }            
            return user;
        },
        async signup(context, { newUserCred }) {
            const user = await userService.signup(newUserCred)
            context.commit({ type: 'setUser', user })
            return user;
        },
        async logout(context) {
            var res = await userService.logout()
            context.commit({ type: 'setUser', user: null })
            return res
        },
        async loadUsers(context) {
            // console.log('users in store');
            const users = await userService.getUsers();
            
            context.commit({ type: 'setUsers', users })
            return users;
        },
        async getById(context, {userId}) {
           return await userService.getById(userId)
        },
        async removeUser(context, { userId }) {
            var msg = await userService.remove(userId);
            context.commit({ type: 'removeUser', userId })
            return msg;
        },
        async updateUser(context, { user }) {   
            const updatedUser = await userService.update(user);
            if (context.state.loggedinUser) {
                context.commit({ type: 'setUser', user: updatedUser })
            }
            return updatedUser;
        },
        // async setUser(context, {user}){
        //     context.commit({ type: 'setUser', user })
        // },
        async setNewUserCred(context, {newUserCred}){
            
           context.commit({type:'setNewUserCred', newUserCred})
        }
    }
}