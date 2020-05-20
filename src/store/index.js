import Vue from 'vue'
import Vuex from 'vuex';
import projStore from '../modules/proj.store.js'
import mapStore from '../modules/map.store.js'
import userStore from '../modules/user.store.js';
import reviewStore from '../modules/review.store.js';
import socketStore from '../modules/socket.store.js';
import cloudinaryService from '../services/cloudinary.service.js'


Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
 
  mutations: {
    
  },
  getters: {
   
  }, 
  actions: {
    async addImg(context, { imgEv }) {
      const img = await cloudinaryService.uploadImg(imgEv)   
      console.log(img.secure_url);
         
      return img.secure_url
  },

  },
  modules: {
    projStore,
    userStore,
    reviewStore,
    mapStore,
    socketStore
  }
})
