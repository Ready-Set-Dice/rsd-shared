const EventEmitter = require('events')

class CombatManagerService extends EventEmitter {
    constructor() {
        super()
    }

    init(funcObj, isGM, store) {
        this.f = funcObj
        this.isGM = isGM
        this.$store = store

        this.reset()
        // console.log("GMManagerService init")
        
    }

    unload() {
        this.reset()
    }

    load() {
        const auth = this.f.getAuth()
        const curuser = auth.currentUser
        if (curuser) {
            // console.log(curuser)
            this.useruid = curuser.uid

            this._dbCurrentCombat = null
            this._dbCurrentAlerts = null
            this._dbCurrentMembers = null
            this._dbCurrentMembersData = null
            this._dbCurrentMembersStats = null
            this._dbCurrentMembersAlerts = null
            this._dbCurrentMembersConditions = null
        }
    }

    reset() {
        this._partyid = null
        this._combat = {
            round: 0, 
            curInit: 0, 
            started: false,
        }
        this._members = {ids: []}
        this._alerts = []
        this._membersData = {}
        this._membersStats = {}
        this._membersAlerts = []
        this._membersConditions = {}
        this._selectedPartyMembers = []

        if (this._dbCurrentCombat)
            this.f.off(this._dbCurrentCombat)
        this._dbCurrentCombat = null
        
        if (this._dbCurrentAlerts)
            this.f.off(this._dbCurrentAlerts)
        this._dbCurrentAlerts = null

        if (this._dbCurrentMembers)
            this.f.off(this._dbCurrentMembers)
        this._dbCurrentMembers = null

        if (this._dbCurrentMembersData)
            this.f.off(this._dbCurrentMembersData)
        this._dbCurrentMembersData = null

        if (this._dbCurrentMembersStats)
            this.f.off(this._dbCurrentMembersStats)
        this._dbCurrentMembersStats = null

        if (this._dbCurrentMembersAlerts)
            this.f.off(this._dbCurrentMembersAlerts)
        this._dbCurrentMembersAlerts = null

        if (this._dbCurrentMembersConditions)
            this.f.off(this._dbCurrentMembersConditions)
        this._dbCurrentMembersConditions = null
    }

    loadCurrentCombat(partyid, gmid = null) {
        this._partyid = partyid
        this._gmid = gmid || this.useruid
        this._dbCurrentCombat = this.f.ref(this.f.database, 'combat/' + this._gmid + '/' + this._partyid)
        this._dbCurrentAlerts = this.f.ref(this.f.database, 'combatalerts/' + this._gmid + '/' + this._partyid)
        this._dbCurrentMembers = this.f.ref(this.f.database, 'combatmembers/' + this._gmid + '/' + this._partyid)
        this._dbCurrentMembersData = this.f.ref(this.f.database, 'cmdata/' + this._gmid + '/' + this._partyid)
        this._dbCurrentMembersStats = this.f.ref(this.f.database, 'cmstats/' + this._gmid + '/' + this._partyid)
        this._dbCurrentMembersAlerts = this.f.ref(this.f.database, 'cmalerts/' + this._gmid + '/' + this._partyid)
        this._dbCurrentMembersConditions = this.f.ref(this.f.database, 'cmconditions/' + this._gmid + '/' + this._partyid)

        this.f.onValue(this._dbCurrentCombat, (snapshot) => {this.getCombatOnValue(snapshot)})
        this.f.onValue(this._dbCurrentAlerts, (snapshot) => {this.getAlertsOnValue(snapshot)})
        this.f.onValue(this._dbCurrentMembers, (snapshot) => {this.getMembersOnValue(snapshot)})
        this.f.onValue(this._dbCurrentMembersData, (snapshot) => {this.getMembersDataOnValue(snapshot)})
        this.f.onValue(this._dbCurrentMembersStats, (snapshot) => {this.getMembersStatsOnValue(snapshot)})
        this.f.onValue(this._dbCurrentMembersAlerts, (snapshot) => {this.getMembersAlertsOnValue(snapshot)})
        this.f.onValue(this._dbCurrentMembersConditions, (snapshot) => {this.getMembersConditionsOnValue(snapshot)})
    }

    /* Data reference functions */

    // getCombatRef() {
    //     return this._dbCurrentCombat
    // }

    // getMembersRef() {
    //     return this._dbCurrentMembers
    // }

    // getAlertsRef() {
    //     return this._dbCurrentAlerts
    // }

    // getMembersDataRef() {
    //     return this._dbCurrentMembersData
    // }

    // getMembersAlertsRef() {
    //     return this._dbCurrentMembersAlerts
    // }

    // getMembersConditionsRef() {
    //     return this._dbCurrentMembersConditions
    // }

    /* Data functions */

    getCombat() {
        return this._combat
    }

    getMembers() {
        return this._members
    }

    getPCMembers(){
        return this._selectedPartyMembers
    }

    getAlerts() {
        return this._alerts
    }

    getCombatMembersData() {
        return this._membersData
    }

    getCombatMembersStats() {
        return this._membersStats
    }

    getMembersAlerts() {
        return this._membersAlerts
    }

    getMembersConditions() {
        return this._membersConditions
    }

    /* Combat functions */

    getCombatOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._combat = data
        } else {
            this._combat = {
                round: 0, 
                curInit: 0, 
                started: false,
            }
        }
        this.$store.dispatch('remotedb/setCombat', {content: this._combat})
        this.emit('Combat', this._combat)
    }

    /* Combat members functions */

    getMembersOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._members = data
            

            this._selectedPartyMembers = []

            if (!!data && !!data.ids) {
                Object.values(data.ids).forEach((member) => {
                    if (member.type == 'pc' || member.type == 'gmc') {
                        this._selectedPartyMembers.push(member.id)
                    }
                })
            }
        } else {
            this._members = {ids: []}
            this._selectedPartyMembers = []
        }

        this.$store.dispatch('remotedb/setCombatMembers', {content: this._members})
        this.emit('CombatMembers', this._members)

        // if (data != null) {
        //     parent.receiveMembers(data)

        //     // console.log(data)

        //     if (data != null) {
        //         Object.keys(data).forEach((i) => {
        //             if (!parent.selectedPartyMembers.includes(data[i].id)) {
        //                 parent.selectedPartyMembers.push(data[i].id)
        //             }
        //         })
        //     }

        // } else {
        //     parent.resetMembers()
        // }
    }

    /* Combat alerts functions */
    getAlertsOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._alerts = data
        } else {
            this._alerts = []
        }
        this.$store.dispatch('remotedb/setCombatAlerts', {content: this._alerts})
        this.emit('CombatAlerts', this._alerts)
    }

    /* Combat members data functions */
    getMembersDataOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._membersData = data
        } else {
            this._membersData = {}
        }
        this.$store.dispatch('remotedb/setCombatMembersData', {content: this._membersData})
        this.emit('CombatMembersData', this._membersData)
    }

    /* Combat members stats functions */
    getMembersStatsOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._membersStats = data
        } else {
            this._membersStats = {}
        }
        
        this.emit('CombatMembersStats', this._membersStats)
    }

    /* Combat members alerts functions */
    getMembersAlertsOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._membersAlerts = data
        } else {
            this._membersAlerts = []
        }
        this.$store.dispatch('remotedb/setCombatMembersAlerts', {content: this._membersAlerts})
        this.emit('CombatMembersAlerts', this._membersAlerts)
    }

    /* Combat members conditions functions */
    getMembersConditionsOnValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._membersConditions = data
        } else {
            this._membersConditions = {}
        }
        this.$store.dispatch('remotedb/setCombatMembersConditions', {content: this._membersConditions})
        this.emit('CombatMembersConditions', this._membersConditions)
    }

    /* Encounter to combat functions */
    clearCombat(preserve = false) {
        this.updateCombat({
            round: 0, 
            curInit: 0, 
            started: false,
        })

        let newMembers = {ids:[]}
        let newConditions = {}
        let newMemberAlerts = {}

        let partyMembers = this.getPCMembers()
        let currentMembers = this.getMembers()

        // console.log([...partyMembers], {...currentMembers})

        if (!!preserve || currentMembers.ids.length > partyMembers.length) {
            let index = 0
            Object.keys(currentMembers.ids).filter(ckey => {
                return partyMembers.includes(currentMembers.ids[ckey].id)
            }).forEach(cl => {
                newMembers.ids[index] = currentMembers.ids[cl]
                index = index + 1
            })

            let currentConditions = this.getMembersConditions()
            Object.keys(currentConditions).filter(ckey => {
                return partyMembers.includes(ckey)
            }).forEach(cl => {
                newConditions[cl] = currentConditions[cl]
            })

            let currentMembersAlerts = this.getMembersAlerts()
            Object.keys(currentMembersAlerts).filter(ckey => {
                return partyMembers.includes(ckey)
            }).forEach(cl => {
                newMemberAlerts[cl] = currentMembersAlerts[cl]
            })
        }

        // console.log('newMembers', newMembers)

        this.updateCombatMembers({...newMembers})
        this.updateCombatAlerts({})
        this.updateCombatMembersData({})
        this.updateCombatMembersStats({})
        this.updateCombatMembersAlerts({...newMemberAlerts})
        this.updateCombatMembersConditions({...newConditions})
    }

    useEncounter(encounterMembers, CompareInitiative) {
        // console.log("useEncounter", encounterMembers)

        this.clearCombat()

        if (encounterMembers && encounterMembers.length > 0) {
            let members = this.getMembers() || {ids: []}
            // console.log(members)
            let membersdata = {}
            let membersstats = {}
            encounterMembers.forEach(m => {
                const memberNoStats = {...m}
                const memberStats = {...m.data, hp: null}
                const memberData = {
                    hp: m.data.hp,
                    temphp: 0,
                }
                memberNoStats.data = null

                members.ids.push(memberNoStats)
                membersstats[m.id] = memberStats
                membersdata[m.id] = memberData
            })

            members.ids.sort(CompareInitiative)

            this.updateCombatMembers(members)
            this.updateCombatMembersData(membersdata)
            this.updateCombatMembersStats(membersstats)
        }
    }

    useEncounterAlt(encounterMembers, CompareInitiative) {
        // console.log("useEncounter", encounterMembers)

        this.clearCombat(true)

        if (encounterMembers && encounterMembers.length > 0) {
            let members = this.getMembers() || {ids: []}
            // console.log(members)
            let membersdata = {}
            encounterMembers.forEach(m => {
                const memberNoStats = {
                    adj: m.adj,
                    bid: m.bid,
                    color: !!m.color ? m.color : null,
                    note: !!m.note ? m.note : null,
                    id: m.id,
                    initiative: m.initiative,
                    name: m.name,
                    type: m.type,
                }
                const memberData = {
                    hp: m.hp,
                    temphp: 0,
                }

                members.ids.push(memberNoStats)
                membersdata[m.id] = memberData
            })

            members.ids.sort(CompareInitiative)

            this.updateCombatMembers(members)
            this.updateCombatMembersData(membersdata)

            return true
        }
        return false
    }

    /* Add functions */
    addCombatMemberAlt(combatant, CompareInitiative) {
        const memberNoStats = {...combatant}
        const memberData = {
            hp: combatant.hp,
            temphp: 0,
        }
        memberNoStats.hp = null

        if (!!memberNoStats && !!memberNoStats.id && !!memberData && (!this._members || !this._members.ids || (!!this._members.ids && this._members.ids.length < 30))) {
            let newCombatMembersNoStats = null
            let newCombatMembersData = null
            if (!!this._members.ids && this._members.ids.length > 0) {
                newCombatMembersNoStats = {...this._members}
                newCombatMembersNoStats.ids.push({...memberNoStats})
            } else {
                newCombatMembersNoStats = {ids: []}
                newCombatMembersNoStats.ids.push({...memberNoStats})
            }

            if (!!this._membersData && Object.keys(this._membersData).length > 0) {
                newCombatMembersData = {...this._membersData}
                newCombatMembersData[memberNoStats.id] = memberData
            } else {
                newCombatMembersData = {}
                newCombatMembersData[memberNoStats.id] = memberData
            }

            newCombatMembersNoStats.ids.sort(CompareInitiative)

            this.updateCombatMembers(newCombatMembersNoStats)
            this.updateCombatMembersData(newCombatMembersData)
        }
    }

    addCombatMember(combatant, CompareInitiative) {
        const memberNoStats = {...combatant}
        const memberStats = {...combatant.data, hp: null}
        const memberData = {
            hp: combatant.data.hp,
            temphp: 0,
        }
        memberNoStats.data = null

        if (!!memberNoStats && !!memberNoStats.id && !!memberStats && !!memberData && (!this._members || !this._members.ids || (!!this._members.ids && this._members.ids.length < 30))) {
            let newCombatMembersNoStats = null
            let newCombatMembersStats = null
            let newCombatMembersData = null
            if (!!this._members.ids && this._members.ids.length > 0) {
                newCombatMembersNoStats = {...this._members}
                newCombatMembersNoStats.ids.push({...memberNoStats})
            } else {
                newCombatMembersNoStats = {ids: []}
                newCombatMembersNoStats.ids.push({...memberNoStats})
            }

            if (!!this._membersStats && Object.keys(this._membersStats).length > 0) {
                newCombatMembersStats = {...this._membersStats}
                newCombatMembersStats[memberNoStats.id] = memberStats
            } else {
                newCombatMembersStats = {}
                newCombatMembersStats[memberNoStats.id] = memberStats
            }

            if (!!this._membersData && Object.keys(this._membersData).length > 0) {
                newCombatMembersData = {...this._membersData}
                newCombatMembersData[memberNoStats.id] = memberData
            } else {
                newCombatMembersData = {}
                newCombatMembersData[memberNoStats.id] = memberData
            }

            newCombatMembersNoStats.ids.sort(CompareInitiative)

            this.updateCombatMembers(newCombatMembersNoStats)
            this.updateCombatMembersData(newCombatMembersData)
            this.updateCombatMembersStats(newCombatMembersStats)
        }
    }

    saveCombatMember(combatantIndex, combatant, CompareInitiative) {
        // console.log(combatant)
        
        // Remove member
        if (!!this._members.ids[combatantIndex]) {
            let newMembers = {...this._members}
            newMembers.ids[combatantIndex] = combatant
            newMembers.ids.sort(CompareInitiative)

            this.updateCombatMembers(newMembers)
        }
    }

    removeCombatMember(combatant, CompareInitiative) {
        // console.log(combatant)

        // Remove stats - if not pc/gmc
        // Remove data - if not pc/gmc
        if (combatant.type == 'npc') {
            if (!!this._membersStats[combatant.id]) {
                this.f.remove(this.f.child(this._dbCurrentMembersStats, combatant.id))
            }
            if (!!this._membersData[combatant.id]) {
                this.f.remove(this.f.child(this._dbCurrentMembersData, combatant.id))
            }
        }
        // Remove conditions
        // Remove alerts
        if (!!this._membersConditions[combatant.id]) {
            this.f.remove(this.f.child(this._dbCurrentMembersConditions, combatant.id))
        }
        if (!!this._membersAlerts[combatant.id]) {
            this.f.remove(this.f.child(this._dbCurrentMembersAlerts, combatant.id))
        }
        
        // Remove member
        if (!!this._members.ids[combatant.index]) {
            let newMembers = {...this._members}
            newMembers.ids.splice(combatant.index, 1)
            this.updateCombatMembers(newMembers)
        }
    }

    removeCombatMemberData(combatant, callback = null) {
        // console.log(combatant)
        let callbackAdded = false
        const delayedCallback = (success) => {
            setTimeout(() => {
                if (!!success && !!callback) {
                    callback(true)
                }
            }, 100)
        }

        // Remove stats - if not pc/gmc
        // Remove data - if not pc/gmc
        // Remove conditions - if not pc/gmc
        if (combatant.type == 'npc') {
            if (!!this._membersStats[combatant.id]) {
                const newCallback = !!callbackAdded ? null : delayedCallback
                callbackAdded = true
                this.f.retryRemove('removeMemberStats', this.f.child(this._dbCurrentMembersStats, combatant.id), newCallback)
            }
            if (!!this._membersData[combatant.id]) {
                const newCallback = !!callbackAdded ? null : delayedCallback
                callbackAdded = true
                this.f.retryRemove('removeMemberData', this.f.child(this._dbCurrentMembersData, combatant.id), newCallback)
            }
            if (!!this._membersConditions[combatant.id]) {
                const newCallback = !!callbackAdded ? null : delayedCallback
                callbackAdded = true
                this.f.retryRemove('removeMemberCondition', this.f.child(this._dbCurrentMembersConditions, combatant.id), newCallback)
            }
        }
        
        // Remove alerts
        if (!!this._membersAlerts[combatant.id]) {
            const newCallback = !!callbackAdded ? null : delayedCallback
            callbackAdded = true
            this.f.retryRemove('removeMemberAlert',this.f.child(this._dbCurrentMembersAlerts, combatant.id), newCallback)
        }

        if (!callbackAdded && !!callback) {
            delayedCallback(true)
        }
    }

    addPartyMember(partyMember, CompareInitiative) {
        let newCombatMember = {
            id: partyMember.id,
            type: partyMember.type,
            name: partyMember.name,
            initiative: partyMember.initiative,
        }

        // console.log(newCombatMember)

        if (!!newCombatMember && !!newCombatMember.id) {
            let newCombatMembers = null
            if (!!this._members.ids && this._members.ids.length > 0) {
                newCombatMembers = {...this._members}
                newCombatMembers.ids.push({...newCombatMember})
            } else {
                newCombatMembers = {ids: []}
                newCombatMembers.ids.push({...newCombatMember})
            }

            newCombatMembers.ids.sort(CompareInitiative)
            this.updateCombatMembers(newCombatMembers)
        }

        // console.log("partyMember", partyMember)
        // console.log("newCombatMember", newCombatMember)
    }

    addCombatMemberCondition(combatantID, condition) {
        if (!!condition && !!combatantID) {
            let newMembersConditions = null
            if (!!this._membersConditions) {
                if (!!this._membersConditions[combatantID] && this._membersConditions[combatantID].length > 0) {
                    newMembersConditions = [...this._membersConditions[combatantID]]
                    newMembersConditions.push({...condition})
                } else {
                    newMembersConditions = [{...condition}]
                }

                this.f.retrySet("addCombatMemberCondition", this.f.child(this._dbCurrentMembersConditions, combatantID), newMembersConditions)
            } else {
                newMembersConditions = {}
                newMembersConditions[combatantID] = [{...condition}]
                this.f.retrySet("addCombatMemberCondition", this._dbCurrentMembersConditions, newMembersConditions)
            }
        }
    }

    updateCombatMemberConditionList(combatantID, conditionlist) {
        // console.log("update list", combatantID, [...conditionlist])
        if (!!conditionlist && !!combatantID) {
            this.f.retrySet("updateCombatMemberConditionList", this.f.child(this._dbCurrentMembersConditions, combatantID), conditionlist)
        }
    }

    updateCombatMemberSpecificCondition(combatantID, conditionIndex, condition) {
        // console.log("update specific", combatantID, {...condition})
        if (!!condition && !!combatantID && (!!conditionIndex || conditionIndex == 0)) {
            this.f.retrySet("updateCombatMemberSpecificCondition", this.f.child(this._dbCurrentMembersConditions, `${combatantID}/${conditionIndex}` ), {...condition})
        }
    }

    updateCombatMembersSpecificData(combatantID, membersData) {
        this.f.retrySet("updateCombatMembersSpecificData", this.f.child(this._dbCurrentMembersData, combatantID), membersData)
    }

    /* Update functions */

    updateCombat(combat) {
        this.f.retrySet('updateCombat', this._dbCurrentCombat, combat)
    }

    updateCombatMembers(members) {
        this.f.retrySet('updateCombatMembers', this._dbCurrentMembers, members)
    }

    updateCombatMembersIds(data, callback = null) {
        this.f.retrySet('updateCombatMembersIds', this.f.child(this._dbCurrentMembers, 'ids'), data, callback)
    }

    updateCombatMembersByIndex(index, data) {
        this.f.retrySet('updateCombatMembersByIndex', this.f.child(this.f.child(this._dbCurrentMembers, 'ids'), index.toString()), data)
    }

    updateCombatAlerts(alerts) {
        this.f.retrySet('updateCombatAlerts', this._dbCurrentAlerts, alerts)
    }

    updateCombatMembersStats(membersStats) {
        this.f.retrySet('updateCombatMembersStats', this._dbCurrentMembersStats, membersStats)
    }

    updateCombatMembersData(membersData) {
        this.f.retrySet('updateCombatMembersData', this._dbCurrentMembersData, membersData)
    }

    updateCombatMembersById(id, data, callback = null) {
        this.f.retrySet('updateCombatMembersById', this.f.child(this._dbCurrentMembersData, id), data, callback)
    }

    updateCombatMembersAlerts(membersAlerts) {
        this.f.retrySet('updateCombatMembersAlerts', this._dbCurrentMembersAlerts, membersAlerts)
    }

    updateCombatMembersConditions(membersConditions) {
        this.f.retrySet('updateCombatMembersConditions', this._dbCurrentMembersConditions, membersConditions)
    }

    updateCombatMembersConditionsById(id, data, callback = null) {
        this.f.retrySet('updateCombatMembersConditionsById', this.f.child(this._dbCurrentMembersConditions, id), data, callback)
    }

    // updateCombatMembersConditionsByID(combatantID, membersConditions) {
    //     if (!!combatantID && !!membersConditions) {
    //         this.f.set(this.f.child(this._dbCurrentMembersConditions, combatantID), membersConditions)
    //     }
    // }

    rollForInitiative(secret, partyid) {
        const data = {useruid: this.useruid, secret: secret, partyid: partyid}

        this.f.axios.post('https://'+this.f.subdomain+'.readysetdice.com/party/initiative', data)
        .then((response) => {
        })
        .catch((error) => {
            console.log(error)
        })
    }

}

export default new CombatManagerService();