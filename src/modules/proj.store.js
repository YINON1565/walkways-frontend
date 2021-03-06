import { projService } from '../services/proj.service.js'

export default {
    state: {
        projs: [],
        currProjs: [],
        projsCount: null
        // currProj: null
    },
    getters: {
        projs(state) {
            return state.projs
        },
        currProjs(state) {
            return state.currProjs
        },
        currProj(state){
            return state.proj
        },
        projsCount(state){
            return state.projsCount
        },
        countries(state){
            let countriesArr = [];
            state.projs.forEach(proj => {
              !countriesArr.includes(proj.position.country)
                ? countriesArr.push(proj.position.country)
                : "";
            });
            return countriesArr.length;
        },
        creators(state){
            let creators = [];
            state.projs.forEach(proj => {
              !creators.includes(proj.createdBy.fullName)
                ? creators.push(proj.createdBy.fullName)
                : "";
            });
            return creators;
        },
    },
    mutations: {
        setProjs(state, { projs }) {
            state.projs = projs
        },
        setCurrProjs(state, { projs }) {
            state.currProjs = projs
        },
        pushToCurrProjs(state, { projs }){
            state.currProjs.push(...projs)
        },
        setProjsCount(state, {projsCount}){
            state.projsCount = projsCount
        },
        setProj(state, { proj }) {
            state.currProj = proj
        },
        addProj(state, { proj }) {
            state.projs.unshift(proj)
        },
        updateProj(state, { proj }) {
            const idx = state.projs.findIndex(currProj => currProj._id === proj._id)
            state.projs.splice(idx, 1, proj)
        },
        removeProj(state, { projId }) {
            const idx = state.projs.findIndex(currProj => currProj._id === projId)
            state.projs.splice(idx, 1)
        }
    },
   
    actions: {
        async loadProjsCount(context) {
            const projsCount = await projService.getProjsCount();
            context.commit({ type: 'setProjsCount' , projsCount })            
            return projsCount;
        },
        async loadProjs(context, { filterBy, limit, skip }) {
            const projs = await projService.query(filterBy, limit, skip)
            if (skip > 0) {
                context.commit({ type: 'pushToCurrProjs', projs })            
            }
            else if (limit || filterBy) {
                context.commit({ type: 'setCurrProjs', projs })            
            }
            else context.commit({ type: 'setProjs', projs })
            return projs
        },

        async loadProj(context, { projId }) {
            const proj = await projService.getById(projId)
            // context.commit({type: 'setProj', proj})
            return proj
        },
        async removeProj(context, { projId }) {
            const msg = await projService.remove(projId)
            context.commit({ type: 'removeProj', projId });
            await projService.changeProjsCount(-1)
            context.dispatch({ type: 'loadProjsCount'})
            return msg
        },
        async saveProj(context, { proj }) {
            const isEdit = !!proj._id;
            const savedProj = await projService.save(proj)
            context.commit({
                type: (isEdit) ? 'updateProj' : 'addProj',
                proj: savedProj
            })
            if (!isEdit && savedProj) {
                await projService.changeProjsCount(1)
                context.dispatch({ type: 'loadProjsCount'})
            }
            return savedProj
        },
        async getFilteredProjHeader(context, { filter }) {
            const filteredProjsHeader = await projService.getHeaderObj(filter)
            return filteredProjsHeader;
        },
        async getProjById(context, { id }) {
            const proj = await projService.getById(id)
            return proj;
        }
    },
}