import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'
// import projApp from '../pages/walkways-app.vue'
import Login from '../pages/Login.vue';
import userProfile from '../pages/user/user-profile.vue'
import projListFiltered from '../pages/proj/proj-list-filtered.vue'
import projDetailsEdit from '../pages/proj/proj-details-edit.vue'
import projList from '../pages/proj/proj-list.vue'


Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    // {
    //     path: '/',
    //     name: 'projApp',
    //     component: projApp
    // },
    {
        path: '/projs/aroundTheWorld',
        name: 'aroundTheWorld',
        component: projList
    },
    {
        path: '/projs/:filter',
        name: 'projsListFiltered',
        component: projListFiltered
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/user/:id',
        name: 'userProfile',
        component: userProfile
    },
    {
        path: '/proj/:id?',
        name: 'projDetails',
        component: projDetailsEdit
    },
]

const router = new VueRouter({
    routes
})

export default router