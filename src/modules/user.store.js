import { userService } from '../services/user.service.js'

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
        },
         usersCount: null
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
         usersCount(state){
            return state.usersCount
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
        },
        setUsersCount(state, {usersCount}){
            state.usersCount = usersCount
        },
    },
    actions: {
        async loadUsersCount(context) {
            const usersCount = await userService.getUsersCount();
            context.commit({ type: 'setUsersCount' , usersCount })            
            return usersCount;
        },
        async login(context, { credentials }) {
            const user = await userService.login(credentials);
            if (user !== 'err') {
                context.commit({ type: 'setUser', user })
                context.commit({ type: 'setBy' })
            }            
            return user;
        },
        async signup(context, { newUserCred }) {
            const user = await userService.signup(newUserCred)
            context.commit({ type: 'setUser', user })
            context.commit({ type: 'setBy' })
            await userService.changeUsersCount(1)
            context.dispatch({ type: 'loadUsersCount'})
            return user;
        },
        async logout(context) {
            var res = await userService.logout()
            context.commit({ type: 'setUser', user: null })
            context.commit({ type: 'setBy' })
            return res
        },
        async loadUsers(context) {
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
            await userService.changeUsersCount(-1)
            context.dispatch({ type: 'loadUsersCount'})
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