export default {
    namespaced: true,
    state: {
        bottomsheet: {
            name: null,
            uid: null,
        },
        darkmode: false,
        dialog: {
            name: null,
            uid: null,
            attrs: null,
        },
        gamestate: {
            current: null,
            previous: null,
            menu: {
                campaign: {
                    combat: false,
                },
                builder: {
                    overview: true,
                    builder: false,
                    inventory: false,
                },
            },
            view: {
                combat: {
                    viewmode: 'column',
                    overlapShowTarget: false,
                    target: null,
                    usedSpellSlots: [],
                    selecting: false,
                    recentCondition: [
                        {type: 'frightened', reduce: true, value: 1},
                        {type: 'sickened', value: 1, duration: 5},
                        {type: 'off-guard'}
                    ],
                    recentDmgTypes: [
                        {type: 'slashing', value: 5},
                        {type: 'piercing', value: 5},
                        {type: 'bludgeoning', value: 5},
                    ],
                    recentPDmgTypes: [
                        {type: 'fire', value: 1},
                        {type: 'bleed', value: 1},
                        {type: 'electricity', value: 1},
                    ],
                },
                build: {
                    open: [],
                },
                game: {
                },
                encounter: {
                    viewmode: 'column',
                    overlapShowTarget: false,
                    partyAppropriate: true,
                    target: null,
                    refresh: false,
                    query: '',
                    results: [],
                },
                party: {
                    target: null,
                },
                search: {
                    type: 'Spells',
                    query: '',
                    results: [],
                    selected: null,
                },
                settings: {
                    account: true,
                    campaign: null,
                    page: 'combat',
                },
                help: {
                    topic: 'general',
                    page: 'welcome',
                },
                mobile: {

                }
            }
        },
        mininavbar: false,
        eventhistory: [],
        refresh: false,
        tours: [],
        user: {},
    },
    getters: {
        darkmode: state => {
            return state.darkmode
        },
        refresh: state => {
            return state.refresh
        },
        mininavbar: state => {
            return state.mininavbar
        },
        gamestate: state => {
            return state.gamestate
        },
        eventhistory: state => {
            return state.eventhistory
        },
        tours: state => {
            return state.tours
        },
        user: state => {
            return state.user
        },

        bottomsheet: state => {
            return state.bottomsheet
        },
        bottomsheetUID: state => {
            return state.bottomsheet.uid
        },

        dialog: state => {
            return state.dialog
        },
        dialogUID: state => {
            return state.dialog.uid
        },

        buildView: state => {
            return state.gamestate.view.build
        },
        mobileView: state => {
            return state.gamestate.view.mobile
        },
        gameView: state => {
            return state.gamestate.view.game
        },

        viewCombatMenu: state => {
            return state.gamestate.menu.campaign.combat
        },
        tindex: state => {
            if (state.gamestate.current == 'Combat' || (!state.gamestate.current && state.gamestate.previous == 'Combat')) {
                return state.gamestate.view.combat.target
            } else if (state.gamestate.current == 'Campaign' || (!state.gamestate.current && state.gamestate.previous == 'Campaign')) {
                return !!state.gamestate.menu.campaign.combat ? state.gamestate.view.combat.target : state.gamestate.view.encounter.target
            } else if (state.gamestate.current == 'Party' || (!state.gamestate.current && state.gamestate.previous == 'Party')) {
                return state.gamestate.view.party.target
            }
        },
        partyTarget: state => {
            return state.gamestate.view.party.target
        },

        recentCondition: state => {
            return state.gamestate.view.combat.recentCondition
        },
        recentDamage: state => {
            return state.gamestate.view.combat.recentDmgTypes
        },
        recentPDamage: state => {
            return state.gamestate.view.combat.recentPDmgTypes
        },
    },
    mutations: {
        /* Dialog */
        setDialog(state, data) {
            state.dialog.name = data.name
            state.dialog.uid = data.uid
            state.dialog.attrs = data.attrs
        },

        setBottomSheet(state, data) {
            state.bottomsheet.name = data.name
            state.bottomsheet.uid = data.uid
        },

        /* PC Specific */
        setBuilderState(state, data) {
            state.gamestate.menu.builder.overview = false
            state.gamestate.menu.builder.builder = false
            state.gamestate.menu.builder.inventory = false
            
            const keys = Object.keys(state.gamestate.menu.builder)
            if (!!data && !!keys.includes(data)) {
                state.gamestate.menu.builder[data] = true
            }
        },

        resetBuildViewOpen(state) {
            state.gamestate.view.build.open = []
        },
        setBuildViewOpen(state, data) {
            if (!!state.gamestate.view.build.open) {
                if (!!state.gamestate.view.build.open.includes(data)) {
                    const findex = state.gamestate.view.build.open.findIndex(i => i == data)
                    state.gamestate.view.build.open.splice(findex, 1)
                } else {
                    state.gamestate.view.build.open = [data]
                }
            } else {
                state.gamestate.view.build.open = [data]
            }
        },

        setGameView(state, data) {
            state.gamestate.view.game = {...state.gamestate.view.game, ...data}
        },

        /* GM & Maybe some shared stuff */
        /* TODO: sort out shared stuff */

        setGamePage(state, data) {
            state.gamestate.previous = state.gamestate.current
            state.gamestate.current = data
            delete state.campaignmenu
            delete state.combatview
            delete state.guistate
        },
        setCombatState(state, data) {
            state.gamestate.menu.campaign.combat = data
        },
        setCombatViewmode(state, data) {
            state.gamestate.view.combat.viewmode = data
            delete state.gamestate.view.combat.column
        },
        setCombatViewShowTarget(state, data) {
            state.gamestate.view.combat.overlapShowTarget = data
        },
        setCombatViewSelecting(state, data) {
            state.gamestate.view.combat.selecting = data
        },
        setCombatTarget(state, data) {
            state.gamestate.view.combat.target = data
        },
        pushCombatUsedSpellSlot(state, data) {
            state.gamestate.view.combat.usedSpellSlots.push(data)
        },
        clearCombatUsedSpellSlot(state) {
            state.gamestate.view.combat.usedSpellSlots = []
        },
        setEncounterViewmode(state, data) {
            state.gamestate.view.encounter.viewmode = data
        },
        setEncounterViewShowTarget(state, data) {
            state.gamestate.view.encounter.overlapShowTarget = data
        },
        setEncounterTarget(state, data) {
            state.gamestate.view.encounter.target = data
        },
        setEncounterResuts(state, data) {
            state.gamestate.view.encounter.results = data
        },
        setEncounterQuery(state, data) {
            state.gamestate.view.encounter.query = data
        },
        toggleEncounterPartyAppropriate(state) {
            state.gamestate.view.encounter.partyAppropriate = !state.gamestate.view.encounter.partyAppropriate
        },
        refreshEncounter(state, data) {
            state.gamestate.view.encounter.refresh = data
        },

        setPartyTarget(state, data) {
            state.gamestate.view.party.target = data
        },

        setSettingsPage(state, data) {
            state.gamestate.view.settings = {...state.gamestate.view.settings, ...data}
        },

        setHelpPage(state, data) {
            state.gamestate.view.help = {...state.gamestate.view.help, ...data}
        },

        setMobileView(state, data) {
            state.gamestate.view.mobile = {...state.gamestate.view.mobile, ...data}
        },

        setSearchResuts(state, data) {
            state.gamestate.view.search.results = data
        },
        setSearchQuery(state, data) {
            state.gamestate.view.search.query = data
        },
        setSearchType(state, data) {
            state.gamestate.view.search.type = data
        },
        setSearchSelected(state, data) {
            state.gamestate.view.search.selected = data
        },

        clearTour(state, tour) {
            state.tours = state.tours.filter(t => t != tour)
        },
        addTour(state, tour) {
            state.tours.push(tour)
        },

        toggleDarkMode(state) {
            state.darkmode = !state.darkmode
        },
        toggleRefresh(state, data) {
            state.refresh = data
        },
        toggleMiniNavbar(state) {
            state.mininavbar = !state.mininavbar
        },

        pushEventHistory(state, data) {
            if (!!state.eventhistory && state.eventhistory.length > 0) {
                let eventCount = 0
                state.eventhistory.forEach(rh => {
                    if (!!rh && !!rh.events) {
                        eventCount += rh.events.length
                    }
                })

                let latest = state.eventhistory.length - 1
                if (!!state.eventhistory[0] && state.eventhistory[0].identifier == data.identifier) {
                    if (eventCount >= 20) {
                        if (!!state.eventhistory[latest].events && state.eventhistory[latest].events.length > 0) {
                            state.eventhistory[latest].events.pop()
                        } else {
                            state.eventhistory.pop()
                        }
                    }
                    latest = state.eventhistory.length - 1
                    state.eventhistory[0].events.unshift(data.event)
                } else {
                    if (eventCount >= 20) {
                        if (!!state.eventhistory[latest].events && state.eventhistory[latest].events.length > 1) {
                            state.eventhistory[latest].events.pop()
                        } else {
                            state.eventhistory.pop()
                        }
                    }
                    state.eventhistory.unshift({
                        identifier: data.identifier,
                        events: [data.event]
                    })
                }
            } else {
                state.eventhistory.unshift({
                    identifier: data.identifier,
                    events: [data.event]
                })
            }
        },
        pushRecentCondition(state, data) {
            let newCondition = {
                type: data.type,
            }

            if (!!data.value) { newCondition.value = data.value }
            if (!!data.reduce) { newCondition.reduce = data.reduce }
            if (!!data.floor) { newCondition.floor = data.floor }
            if (!!data.duration) { newCondition.duration = data.duration }

            if (!!state.gamestate.view.combat.recentCondition && state.gamestate.view.combat.recentCondition.length > 0) {
                const duplicate = state.gamestate.view.combat.recentCondition.find(c => JSON.stringify(c) == JSON.stringify(newCondition))

                if (!duplicate && state.gamestate.view.combat.recentCondition.length >= 3) {
                    state.gamestate.view.combat.recentCondition.pop()
                    state.gamestate.view.combat.recentCondition.unshift(newCondition)
                } else if (!duplicate) {
                    state.gamestate.view.combat.recentCondition.unshift(newCondition)
                }
            } else {
                state.gamestate.view.combat.recentCondition.unshift(newCondition)
            }
        },
        pushRecentDamage(state, data) {
            let newDamage = {
                type: data.type,
                value: data.value
            }

            if (!!state.gamestate.view.combat.recentDmgTypes && state.gamestate.view.combat.recentDmgTypes.length > 0) {
                const duplicate = state.gamestate.view.combat.recentDmgTypes.find(c => JSON.stringify(c) == JSON.stringify(newDamage))

                if (!duplicate && state.gamestate.view.combat.recentDmgTypes.length >= 3) {
                    state.gamestate.view.combat.recentDmgTypes.pop()
                    state.gamestate.view.combat.recentDmgTypes.unshift(newDamage)
                } else if (!duplicate) {
                    state.gamestate.view.combat.recentDmgTypes.unshift(newDamage)
                }
            } else {
                state.gamestate.view.combat.recentDmgTypes.unshift(newDamage)
            }
        },
        pushRecentPDamage(state, data) {
            let newPDamage = {
                type: data.dmg,
                value: data.value
            }

            if (!!state.gamestate.view.combat.recentPDmgTypes && state.gamestate.view.combat.recentPDmgTypes.length > 0) {
                const duplicate = state.gamestate.view.combat.recentPDmgTypes.find(c => JSON.stringify(c) == JSON.stringify(newPDamage))

                if (!duplicate && state.gamestate.view.combat.recentPDmgTypes.length >= 3) {
                    state.gamestate.view.combat.recentPDmgTypes.pop()
                    state.gamestate.view.combat.recentPDmgTypes.unshift(newPDamage)
                } else if (!duplicate) {
                    state.gamestate.view.combat.recentPDmgTypes.unshift(newPDamage)
                }
            } else {
                state.gamestate.view.combat.recentPDmgTypes.unshift(newPDamage)
            }
        },
        setUser(state, data) {
            state.user = data
            delete state.loggedIn
        }
    },
    actions: {
        toggleDarkMode({ commit }) {
            commit('toggleDarkMode')
        },
        toggleMiniNavbar({ commit }) {
            commit('toggleMiniNavbar')
        },
        toggleRefresh({ commit }) {
            commit('toggleRefresh', true)
            setTimeout(() => {
                commit('toggleRefresh', false)
            }, 500)
        },

        /* Dialog */
        setBottomSheet( {commit}, data) {
            commit('setBottomSheet', data)
        },

        setDialog( {commit}, data) {
            commit('setDialog', data)
        },

        /* PC Specific */
        setBuilderState( {commit}, data) {
            commit('setBuilderState', data)
        },
        resetBuildViewOpen( {commit} ) {
            commit('resetBuildViewOpen')
        },
        setBuildViewOpen( {commit}, data) {
            commit('setBuildViewOpen', data)
        },
        setGameView( {commit}, data) {
            commit('setGameView', data)
        },

        /* GM & Maybe some shared stuff */
        /* TODO: sort out shared stuff */
        setGamePage({ commit }, data) {
            commit('setGamePage', data)
        },
        setCombatState({ commit }, data) {
            commit('setCombatState', data)
        },
        setCombatViewmode({ commit }, data) {
            commit('setCombatViewmode', data)
        },
        setCombatViewShowTarget({ commit }, data) {
            commit('setCombatViewShowTarget', data)
        },
        setCombatViewSelecting( {commit}, data) {
            commit('setCombatViewSelecting', data)
        },
        setCombatTarget({ commit }, data) {
            commit('setCombatTarget', data)
        },
        pushCombatUsedSpellSlot({ commit }, data) {
            commit('pushCombatUsedSpellSlot', data)
        },
        clearCombatUsedSpellSlot({ commit }) {
            commit('clearCombatUsedSpellSlot')
        },
        setEncounterViewmode({ commit }, data) {
            commit('setEncounterViewmode', data)
        },
        setEncounterViewShowTarget({ commit }, data) {
            commit('setEncounterViewShowTarget', data)
        },
        setEncounterTarget({ commit }, data) {
            commit('setEncounterTarget', data)
        },
        setEncounterResuts({ commit }, data) {
            commit('setEncounterResuts', data)
        },
        setEncounterQuery({ commit }, data) {
            commit('setEncounterQuery', data)
        },
        toggleEncounterPartyAppropriate({ commit }) {
            commit('toggleEncounterPartyAppropriate')
        },
        refreshEncounter({ commit }, data) {
            commit('refreshEncounter', data)
        },

        setPartyTarget({ commit }, data) {
            commit('setPartyTarget', data)
        },

        setSettingsPage({ commit }, data) {
            commit('setSettingsPage', data)
        },

        setHelpPage({ commit }, data) {
            commit('setHelpPage', data)
        },

        setMobileView({ commit }, data) {
            commit('setMobileView', data)
        },

        setSearchResuts({ commit }, data) {
            commit('setSearchResuts', data)
        },
        setSearchQuery({ commit }, data) {
            commit('setSearchQuery', data)
        },
        setSearchType({ commit }, data) {
            commit('setSearchType', data)
        },
        setSearchSelected({ commit }, data) {
            commit('setSearchSelected', data)
        },

        clearTour({ commit }, tour) {
            commit('clearTour', tour)
        },
        addTour({ commit }, tour) {
            commit('addTour', tour)
        },

        pushEventHistory({ commit }, data) {
            commit('pushEventHistory', data)
        },
        pushRecentCondition({ commit }, data) {
            if (!!data && !!data.type) {
                commit('pushRecentCondition', data)
            }
        },
        pushRecentDamage({ commit }, data) {
            if (!!data && !!data.type) {
                commit('pushRecentDamage', data)
            }
        },
        pushRecentPDamage({ commit }, data) {
            if (!!data && !!data.type) {
                commit('pushRecentPDamage', data)
            }
        },
        setUser({ commit }, data) {
            commit('setUser', data)
        },
    }
}