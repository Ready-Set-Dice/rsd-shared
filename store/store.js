import Vue from 'vue'
import Vuex from 'vuex'
import createPersistentState from 'vuex-persistedstate'

import pf2e from './modules/pf2e'
import rsd from './modules/rsd'
import remotedb from './modules/remotedb'

Vue.use(Vuex)

export default new Vuex.Store({
    mutations: {
        clearOldState(state) {
            delete state.app
            delete state.action
            delete state.ancestry
            delete state.ancestryFeature
            delete state.archetype
            delete state.background
            delete state.bestiary
            delete state.campaignmenu
            delete state.cbestiary
            delete state.class
            delete state.classExtended
            delete state.classFeature
            delete state.combatview
            delete state.condition
            delete state.darkmode
            delete state.feat
            delete state.gamestate
            delete state.mininavbar
            delete state.eventhistory
            delete state.spell
            delete state.spellEffect
            delete state.static
            delete state.tours
            delete state.user
            delete state.rsd.rollhistory
            delete state.rsd.gamestate.view.mobile.editMode
            delete state.rsd.gamestate.view.mobile.combatActionMode
            delete state.rsd.gamestate.view.mobile.combatActionOption
        },
    },
    actions: {
        clearOldState({ commit }) {
            commit('clearOldState')
        },
    },
    modules: {
        pf2e,
        rsd,
        remotedb,
    },
    plugins: [createPersistentState()],
})
