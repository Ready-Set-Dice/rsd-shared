const sha1 = require('js-sha1');
import { isGM } from '@/services'

export default {
    namespaced: true,
    state: {
        party: {
            list: {},
            data: {},
            _list: '',
            _data: '',
        },
        pc: {
            list: {},
            localStats: {},
            stats: {},
            _list: '',
            _localStats: '',
            _stats: '',
        },
        gmc: {
            list: {},
            stats: {},
            _list: '',
            _stats: '',
        },
        char: {
            data: {},
            _data: {},
        },
        encounter: {
            list: {},
            data: {},
            members: {},
            _list: '',
            _data: '',
            _members: '',
        },
        combat: {
            data: {},
            members: {},
            alerts: [],
            malerts: {},
            mdata: {},
            mconditions: {},
            _data: '',
            _members: '',
            _alerts: '',
            _malerts: '',
            _mdata: '',
            _mconditions: '',
        },
        settings: {
            data: {},
            _data: '',
        }
    },
    getters: {
        campaignIds: state => {
            return !!state.party && !!state.party.list && !!state.party.list.ids && state.party.list.ids.length > 0 ? state.party.list.ids : null
        },
        campaighData: state => {
            return !!state.party && !!state.party.data ? state.party.data : null
        },
        campaignActiveKey: state => {
            return !!state.party && !!state.party.list && !!state.party.list.active ? state.party.list.active : null
        },
        campaignActive: state => {
            return !!state.party && !!state.party.list && !!state.party.list.active && !!state.party.data &&
            !!state.party.data[state.party.list.active] ? state.party.data[state.party.list.active] : null
        },
        campaignActiveBench: state => {
            return !!state.party && !!state.party.list && !!state.party.list.active && !!state.party.data &&
            !!state.party.data[state.party.list.active] && !!state.party.data[state.party.list.active].bench ? state.party.data[state.party.list.active].bench : []
        },
        campaignArray: state => {
            let sorted = null
            if (!!state.party && !!state.party.data && !!state.party.list && !!state.party.list.ids && state.party.list.ids.length > 0) {
                sorted = new Array(state.party.list.ids.length)

                state.party.list.ids.forEach((partyID, index) => {
                    const valObj = Object.keys(partyID)
                    if (valObj.length == 1) {
                        sorted[index] = {
                            ...state.party.data[valObj[0]], 
                            _key: valObj[0],
                            id: valObj[0]
                        }
                    }
                })
            }

            return sorted
        },

        encounterIds: state => {
            return !!state.encounter && !!state.encounter.list && !!state.encounter.list.ids && state.encounter.list.ids.length > 0 ? state.encounter.list.ids : null
        },
        encounterData: state => {
            return !!state.encounter && !!state.encounter.data ? state.encounter.data : null
        },
        encounterActiveKey: state => {
            return !!state.encounter && !!state.encounter.list && !!state.encounter.list.active ? state.encounter.list.active : null
        },
        encounterActive: state => {
            return !!state.encounter && !!state.encounter.list && !!state.encounter.list.active && !!state.encounter.data &&
            !!state.encounter.data[state.encounter.list.active] ? state.encounter.data[state.encounter.list.active] : null
        },
        encounterArray: state => {
            let sorted = null
            if (!!state.encounter && !!state.encounter.data && !!state.encounter.list && !!state.encounter.list.ids && state.encounter.list.ids.length > 0) {
                sorted = new Array(state.encounter.list.ids.length)
    
                state.encounter.list.ids.forEach((encounterID, index) => {
                    const valObj = Object.keys(encounterID)
                    if (valObj.length == 1) {
                        const data = state.encounter.data[valObj[0]]
                        sorted[index] = {
                            ...data, 
                            _key: valObj[0],
                            id: valObj[0],
                            difficulty: getDifficulty(data),
                            difficultyColor: getDifficultyColor(data),
                            difficultyScale: getDifficultyScale(data)
                        }
                    }
                })
            }
            return sorted
        },
        encounterMembersArray: state => {
            return !!state.encounter && !!state.encounter.members && !!state.encounter.members.ids && state.encounter.members.ids.length > 0 ? state.encounter.members.ids : null
        },

        alerts: state => {
            return !!state.combat && !!state.combat.alerts ? state.combat.alerts : null
        },

        cindex: state => {
            return !!state.combat && !!state.combat.data ? state.combat.data.curInit : null
        },
        cround: state => {
            return !!state.combat && !!state.combat.data ? state.combat.data.round : null
        },
        combat: state => {
            return !!state.combat && !!state.combat.data ? state.combat.data : null
        },
        selectedMembers: state => {
            const combatMembers = !!state.combat && !!state.combat.members && !!state.combat.members.ids && state.combat.members.ids.length > 0 ? state.combat.members.ids : null
            if (!!combatMembers && combatMembers.length > 0) {
                return combatMembers.filter(cm => cm.type == 'pc' || cm.type == 'gmc')
            } else {
                return null
            }
        },
        combatMembers: state => {
            return !!state.combat && !!state.combat.data ? state.combat.data : null
        },
        characterData: state => {
            return !!state.char && !!state.char.data ? state.char.data : null
        },
        combatMembersData: state => {
            return !!state.combat && !!state.combat.mdata ? state.combat.mdata : null
        },
        combatMembersConditions: state => {
            return !!state.combat && !!state.combat.mconditions ? state.combat.mconditions : null
        },
        combatMembersIds: state => {
            return !!state.combat && !!state.combat.members && !!state.combat.members.ids && state.combat.members.ids.length > 0 ? state.combat.members.ids : null
        },
        combatMembersAlerts: state => {
            return !!state.combat && !!state.combat.malerts ? state.combat.malerts : null
        },
        combatRoundAlerts: state => {
            return !!state.combat && !!state.combat.alerts ? state.combat.alerts : null
        },
        combatantsArray: state => {
            let sorted = null
            if (!!state.combat && !!state.combat.mdata && !!state.combat.members && !!state.combat.members.ids && state.combat.members.ids.length > 0) {
                sorted = new Array(state.combat.members.ids.length)
    
                state.combat.members.ids.forEach((combatant, index) => {
                    // const basestats = getBaseStats(combatant)
                    const conditions = getConditions(state, combatant.id)
                    const alerts = getAlerts(state, combatant.id)
                    // const object = getObject(combatant)
                    // const stats = this.$rsd.conditions.getStatsObject(combatant, basestats, conditions, object)
    
                    let valObj = {
                        ...combatant,
                        name: !!combatant.name ? combatant.name : '',
                        // identifier: getIdentifier(combatant),
                        health: getHealth(state, combatant.type, combatant.id),
                        // basestats: basestats,
                        // stats: stats,
                        // object: object
                    }

                    if (!!conditions) {valObj.conditions = conditions}
                    if (!!alerts) {valObj.alerts = alerts}

                    // console.log(combatant)
                    // const valObj = Object.keys(partyID)
                    // if (valObj.length == 1) {
                    //     sorted[index] = {...this._PartyData[valObj[0]], _key: valObj[0]}
                    // }
                    sorted[index] = valObj
                })
    
                return sorted
            }
            return sorted
        },

        gmcArray: state => {
            let sorted = null
            if (!!state.gmc && !!state.gmc.stats && !!state.gmc.list && !!state.gmc.list.ids && state.gmc.list.ids.length > 0) {
                sorted = new Array(state.gmc.list.ids.length)

                state.gmc.list.ids.forEach((gmcID, index) => {
                    const valObj = Object.keys(gmcID)
                    if (valObj.length == 1) {
                        sorted[index] = {...state.gmc.stats[valObj[0]], _key: valObj[0]}
                    }
                })
            }

            return sorted
        },
        pcArray: state => {
            let sorted = null

            if (!!isGM) {
                if (!!state.pc && !!state.pc.stats && Object.keys(state.pc.stats).length > 0) {
                    const keys = Object.keys(state.pc.stats)
                    sorted = new Array(keys.length)

                    keys.forEach((pcID, index) => {
                        const valObj = Object.keys(state.pc.stats[pcID])
                        if (!!valObj) {
                            sorted[index] = {...state.pc.stats[pcID], _key: pcID}
                        }
                    })
                }
            } else {
                if (!!state.pc && !!state.pc.stats && !!state.pc.list && !!state.pc.list.ids && state.pc.list.ids.length > 0) {
                    sorted = new Array(state.pc.list.ids.length)
    
                    state.pc.list.ids.forEach((pcID, index) => {
                        const valObj = Object.keys(pcID)
                        if (valObj.length == 1) {
                            sorted[index] = {...state.pc.stats[valObj[0]], _key: valObj[0]}
                        }
                    })
                }
            }

            return sorted
        },

        membersArray: state => {
            let sorted = []
            if (!!state.pc && !!state.pc.stats && !!state.char && !!state.char.data &&  Object.keys(state.pc.stats).length > 0) {
                Object.keys(state.pc.stats).forEach((pcid) => {
                    const conditions = getConditions(state, pcid)
                    const stats = state.pc.stats[pcid]
                    let charData = {hp: stats.maxhp, maxhp: stats.maxhp, temphp: 0}
                    if (!!state.char.data[pcid]) {
                        charData = {...state.char.data[pcid], maxhp: stats.maxhp}
                    }
                    let valObj = {
                        // ...state.pc.stats[pcid],
                        name: stats.name,
                        health: charData,
                        type: 'pc',
                        uid: stats.useruid,
                        id: pcid,
                        stats: stats,
                        icon: !!stats.icon ? stats.icon : null,
                        color: !!stats.color ? stats.color : null,
                        abc: !!stats.abc ? stats.abc : null
                    }
                    if (!!conditions) {valObj.conditions = conditions}
                    sorted.push(valObj)
                })
            }
            if (!!state.gmc && !!state.gmc.stats && !!state.char && !!state.char.data && Object.keys(state.gmc.stats).length > 0) {
                Object.keys(state.gmc.stats).forEach((gmcid) => {
                    const conditions = getConditions(state, gmcid)
                    const stats = state.gmc.stats[gmcid]
                    let charData = {hp: stats.maxhp, maxhp:stats.maxhp, temphp: 0}
                    if (!!state.char.data[gmcid]) {
                        charData = {...state.char.data[gmcid], maxhp: stats.maxhp}
                    }
                    let valObj = {
                        // ...state.gmc.stats[gmcid],
                        name: stats.name,
                        health: charData,
                        type: 'gmc', 
                        id: gmcid,
                        stats: stats,
                        icon: !!stats.icon ? stats.icon : null,
                        color: !!stats.color ? stats.color : null,
                        abc: !!stats.abc ? stats.abc : null
                    }
                    if (!!conditions) {valObj.conditions = conditions}
                    sorted.push(valObj)
                })
            }

            return sorted
        },

        playerCharacterIds: state => {
            return !!state.pc && !!state.pc.list && !!state.pc.list.ids && state.pc.list.ids.length > 0 ? state.pc.list.ids : null
        },
        playerCharacterStats: state => {
            return !!state.pc && !!state.pc.localStats ? state.pc.localStats : null
        },
        playerCharacterActiveKey: state => {
            return !!state.pc && !!state.pc.list && !!state.pc.list.active ? state.pc.list.active : null
        },
        playerCharacterActive: state => {
            const pcid = !!state.pc && !!state.pc.list && !!state.pc.list.active ? state.pc.list.active : null
            if (!!pcid && !!state.pc.localStats && !!state.char && !!state.char.data && !!state.pc.localStats[pcid]) {
                const conditions = getConditions(state, pcid)
                const stats = state.pc.localStats[pcid]
                let charData = {hp: stats.maxhp, maxhp: stats.maxhp, temphp: 0}
                if (!!state.char.data[pcid]) {
                    charData = {...state.char.data[pcid], maxhp: stats.maxhp}
                }
                let valObj = {
                    // ...state.pc.stats[pcid],
                    ...stats,
                    health: charData,
                    type: 'pc',
                    id: pcid,
                }
                if (!!conditions) {valObj.conditions = conditions}

                return valObj
            } else {
                return null
            }
        },
        playerCharacterArray: state => {
            let sorted = null
            if (!!state.pc && !!state.pc.localStats && !!state.pc.list && !!state.pc.list.ids && state.pc.list.ids.length > 0) {
                sorted = new Array(state.pc.list.ids.length)

                state.pc.list.ids.forEach((playerID, index) => {
                    const valObj = Object.keys(playerID)
                    if (valObj.length == 1) {
                        sorted[index] = {...state.pc.localStats[valObj[0]], id: valObj[0], _key: valObj[0]}
                    }
                })
            }

            return sorted
        },

        settings: state => {
            if (!!state.settings && !!state.settings.data && Object.keys(state.settings.data).length > 0) {
                return state.settings.data
            } else {
                return DEFAULT_SETTINGS
            }
        },

        activeSettings: state => {
            const activeCampaign = !!state.party && !!state.party.list && !!state.party.list.active ? state.party.list.active : null
            let settingsData = {...DEFAULT_SETTINGS.account}
            const accountData = getSettings(state.settings.data, {account:true})
            const campaignData = !!activeCampaign ? getSettings(state.settings.data, {account:false, campaign: activeCampaign}) : null

            if (!!accountData && Object.keys(accountData).length > 0) {
                Object.keys(accountData).forEach(key => {
                    if (!!accountData[key]) {
                        settingsData[key] = accountData[key]
                    }
                })
            }
            if (!!campaignData && Object.keys(campaignData).length > 0) {
                Object.keys(campaignData).forEach(key => {
                    if (!!campaignData[key]) {
                        settingsData[key] = campaignData[key]
                    }
                })
            }

            return settingsData
        }
    },
    mutations: {
        setPartyData(state, data) {
            if (data.checksum != state.party._data) {
                state.party.data = data.content
                state.party._data = data.checksum
            }            
        },
        setPartyList(state, data) {
            if (data.checksum != state.party._list) {
                state.party.list = data.content
                state.party._list = data.checksum
            }
        },
        setEncounterData(state, data) {
            if (data.checksum != state.encounter._data) {
                state.encounter.data = data.content
                state.encounter._data = data.checksum
            }
        },
        setEncounterList(state, data) {
            if (data.checksum != state.encounter._list) {
                state.encounter.list = data.content
                state.encounter._list = data.checksum
            }
        },
        setEncounterMembers(state, data) {
            if (data.checksum != state.encounter._members) {
                state.encounter.members = data.content
                state.encounter._members = data.checksum
            }
        },
        setCombat(state, data) {
            if (data.checksum != state.combat._data) {
                state.combat.data = data.content
                state.combat._data = data.checksum
            }
        },
        setCombatMembers(state, data) {
            if (data.checksum != state.combat._members) {
                state.combat.members = data.content
                state.combat._members = data.checksum
            }
        },
        setCombatAlerts(state, data) {
            if (data.checksum != state.combat._alerts) {
                state.combat.alerts = data.content
                state.combat._alerts = data.checksum
            }
        },
        setCombatMembersData(state, data) {
            if (data.checksum != state.combat._mdata) {
                state.combat.mdata = data.content
                state.combat._mdata = data.checksum
            }
        },
        setCombatMembersAlerts(state, data) {
            if (data.checksum != state.combat._malerts) {
                state.combat.malerts = data.content
                state.combat._malerts = data.checksum
            }
        },
        setCombatMembersConditions(state, data) {
            if (data.checksum != state.combat._mconditions) {
                state.combat.mconditions = data.content
                state.combat._mconditions = data.checksum
            }
        },
        setSettings(state, data) {
            if (data.checksum != state.settings._data) {
                state.settings.data = data.content
                state.settings._data = data.checksum
            }            
        },

        setPCList(state, data) {
            if (data.checksum != state.pc._list) {
                state.pc.list = data.content
                state.pc._list = data.checksum
            }
        },
        setPCLocalStats(state, data) {
            if (data.checksum != state.pc._localStats) {
                state.pc.localStats = data.content
                state.pc._localStats = data.checksum
            }
        },
        setPCStats(state, data) {
            if (data.checksum != state.pc._stats) {
                state.pc.stats = data.content
                state.pc._stats = data.checksum
            }
        },
        setGMCList(state, data) {
            if (data.checksum != state.gmc._list) {
                state.gmc.list = data.content
                state.gmc._list = data.checksum
            }
        },
        setGMCStats(state, data) {
            if (data.checksum != state.gmc._stats) {
                state.gmc.stats = data.content
                state.gmc._stats = data.checksum
            }
        },
        setCharData(state, data) {
            if (data.checksum != state.char._data) {
                state.char.data = data.content
                state.char._data = data.checksum
            }
        },

    },
    actions: {
        setPartyData({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            commit('setPartyData', {content: data.content, checksum: checksum})
        },
        setPartyList({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            commit('setPartyList', {content: data.content, checksum: checksum})
        },
        setEncounterData({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setEncounterData', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
            
        },
        setEncounterList({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setEncounterList', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
        },
        setEncounterMembers({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setEncounterMembers', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
        },
        setSettings({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            commit('setSettings', {content: data.content, checksum: checksum})
        },

        setCombat({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            commit('setCombat', {content: data.content, checksum: checksum})
        },
        setCombatMembers({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setCombatMembers', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
        },
        setCombatAlerts({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setCombatAlerts', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
        },
        setCombatMembersData({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setCombatMembersData', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
        },
        setCombatMembersAlerts({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setCombatMembersAlerts', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
        },
        setCombatMembersConditions({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setCombatMembersConditions', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
        },

        setPCList({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setPCList', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
        },
        setPCLocalStats({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setPCLocalStats', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
        },
        setPCStats({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setPCStats', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
        },
        setGMCList({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setGMCList', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
        },
        setGMCStats({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setGMCStats', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
        },
        setCharData({commit}, data) {
            const checksum = sha1(JSON.stringify(data.content))
            setTimeout(() => {
                commit('setCharData', {content: data.content, checksum: checksum})
            }, !!data.instant ? 0 : DEFAULT_DELAY)
        },
    }
}

const DEFAULT_DELAY = 75

/* Combat functions */
const getAlerts = (state, key) => {
    return !!key && !!state.combat.malerts && !!state.combat.malerts[key] ? state.combat.malerts[key] : null
}

const getConditions = (state, key) => {
    return !!key && !!state.combat.mconditions && !!state.combat.mconditions[key] ? state.combat.mconditions[key] : null
}

const getHealth = (state, type, key) => {
    if ((type == 'npc' || type == 'hazard') && !!state.combat.mdata) {
        return !!key && !!state.combat.mdata && !!state.combat.mdata[key] ? state.combat.mdata[key] : null
    } else if (type == 'pc' || type == 'gmc') {
        return !!key && !!state.char.data && !!state.char.data[key] ? state.char.data[key] : null
    }
}

/* Encounter functions */

const getDifficulty = (encounter) => {
    let difficulty = 'trivial'

    if (!!encounter) {
        const adjustedScale = getDifficultyScale(encounter)

        if (!!adjustedScale) {
            Object.keys(adjustedScale).every(s => {
                if (encounter.totalxp <= adjustedScale[s]) {
                    difficulty = s
                    return false
                }
                return true
            })
        }
    }

    return difficulty
}

const getDifficultyScale = (encounter) => {
    let difficultyScale = {...ENCOUNTER_SCALING.difficultyScale}

    if (!!encounter) {
        const characterOffset = encounter.partysize - 4

        if (characterOffset != 0) {
            Object.keys(difficultyScale).forEach(ds => {
                difficultyScale[ds] += ENCOUNTER_SCALING.characterAdjustment[ds] * characterOffset
            })
        }
    }

    return difficultyScale
}

const getDifficultyColor = (encounter) => {
    const difficulty = getDifficulty(encounter)
    return ENCOUNTER_SCALING.difficultyColor[difficulty]
}

const getSettings = (settings, key) => {
    if (!!key && (!!key.account || !!key.campaign)) {
        if (!!key.account) {
            return !!settings && !!settings.account ? settings.account : null
        } else {
            return !!settings && !!settings[key.campaign] ? settings[key.campaign] : null
        }
    } else {
        return null
    }
}

const ENCOUNTER_SCALING = {
    name: '',
    totalxp: 0,
    level: 1,
    partysize: 4,
    difficultyScale: {
        trivial: 40,
        low: 60,
        moderate: 80,
        severe: 120,
        extreme: 160,
        deadly: 1000,
    },
    difficultyColor: {
        trivial: 'blue-grey lighten-4',
        low: 'cyan lighten-4',
        moderate: 'green lighten-4',
        severe: 'amber lighten-4',
        extreme: 'deep-orange lighten-4',
        deadly: 'grey lighten-1',
    },
    characterAdjustment: {
        trivial: 10,
        low: 15,
        moderate: 20,
        severe: 30,
        extreme: 40,
        deadly: 0,
    },
}

const DEFAULT_SETTINGS = {
    account: {
        gitname: '',
        gitowner: '',
        npcname: 0,
        pchp: 0,
        profnolevel: false,
    }
}