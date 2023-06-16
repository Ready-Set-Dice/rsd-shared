const EventEmitter = require('events')

class CampaignService extends EventEmitter {
    constructor() {
        super()
    }

    init(funcObj, isGM, store) {
        this.f = funcObj
        this.isGM = isGM
        this.$store = store

        this.reset()

        this.autoSelect = false

        // console.log("GMManagerService init")
    }

    unload() {
        this.reset()
        // this._dbPartyRef = null
    }

    reset() {
        if (!!this.isGM) { // GM side
            this._partyList = {}
            this._partyData = {}
            this._settings = {}
            
            this._gmcList = {}
            this._gmcStats = {}
            this._charData = {}

            this._gmid = null
            this._partyid = null

            this._pcStats = {}
            this._dbPCStatsRef = {}

            this._resetDBListener(this._dbPartyListRef)
            this._dbPartyListRef = null

            this._resetDBListener(this._dbPartyDataRef)
            this._dbPartyDataRef = null

            this._resetDBListener(this._dbCharDataRef)
            this._dbCharDataRef = null

            this._resetPCStatsListeners()
            this._resetGMCListeners()
            // this._resetCharCombatDataListeners()
        } else { // PC side
            this._pcList = {}
            this._pcLocalStats = {}

            this._partyData = {}
            this._settings = {}
            this._charData = {}
            // this._partyObj = {}
            this._gmcStats = {}

            this._gmid = null
            this._partyid = null

            this._pcStats = {}
            this._dbPCStatsRef = {}

            this._resetDBListener(this._dbPCListRef)
            this._dbPCListRef = null

            this._resetDBListener(this._dbPCLocalStatsRef)
            this._dbPCLocalStatsRef = null

            this._resetDBListener(this._dbPartyDataRef)
            this._dbPartyDataRef = null

            this._resetDBListener(this._dbCharDataRef)
            this._dbCharDataRef = null

            this._resetPCStatsListeners()
            this._resetGMCListeners()
        }
    }

    load() {
        const auth = this.f.getAuth()
        const curuser = auth.currentUser

        if (!!this.isGM) {
            if (!!curuser) {
                // console.log(curuser)
                this.useruid = curuser.uid
                
                this._dbGMCListRef = {}
                this._dbGMCStatsRef = {}
                this._dbCharDataRef = {}

                this._dbPartyListRef = this.f.ref(this.f.database, 'partylist/' + this.useruid + '/')
                this._dbPartyDataRef = this.f.ref(this.f.database, 'partydata/' + this.useruid + '/')
                this._dbSettingsRef = this.f.ref(this.f.database, 'settings/' + this.useruid + '/')
                // this._dbPartyRef = null

                this.f.onValue(this._dbPartyListRef, (snapshot) => {this.onPartyListValue(snapshot)})
                this.f.onValue(this._dbPartyDataRef, (snapshot) => {this.onPartyDataValue(snapshot)})
                this.f.onValue(this._dbSettingsRef, (snapshot) => {this.onSettingsValue(snapshot)})
            }
        } else {
            if (!!curuser) {
                this.useruid = curuser.uid

                this._dbPartyDataRef = null
                this._dbSettingsRef = null
                this._dbGMCStatsRef = null
                // this._dbMembersRef = {}

                this._dbPCListRef = this.f.ref(this.f.database, 'pclist/' + this.useruid)
                this._dbPCLocalStatsRef = this.f.ref(this.f.database, 'pcstats/' + this.useruid)
                // this._dbPCStatsRef = this.f.ref(this.f.database, 'pcstats/' + this.useruid)

                this.f.onValue(this._dbPCListRef, (snapshot) => {this.onPCListValue(snapshot)})
                this.f.onValue(this._dbPCLocalStatsRef, (snapshot) => {this.onPCLocalStatsValue(snapshot)})
            }
        }
    }

    setPartyIDs(partyid, gmid) {
        this._gmid = gmid
        this._partyid = partyid
    }

    loadGMCMembers() {
        this._resetGMCListeners()

        this._dbGMCListRef = this.f.ref(this.f.database, 'gmclist/' + this._gmid + '/' + this._partyid)
        this.f.onValue(this._dbGMCListRef, (snapshot) => {this.onGMCListOnValue(snapshot)})

        this._dbGMCStatsRef = this.f.ref(this.f.database, 'gmcstats/' + this._gmid + '/' + this._partyid)
        this.f.onValue(this._dbGMCStatsRef, (snapshot) => {this.onGMCStatsOnValue(snapshot)})
    }

    loadCharData() {
        this._dbCharDataRef = this.f.ref(this.f.database, 'chardata/' + this._gmid + '/' + this._partyid)
        this.f.onValue(this._dbCharDataRef, (snapshot) => {this.onCharDataOnValue(snapshot)})
    }

    /* Data functions */
    getPartyList() {
        return this._partyList
    }

    getPartyData() {
        return this._partyData
    }

    getPCStats() {
        return this._pcStats
    }

    getPCLocalStats() {
        return this._pcLocalStats
    }

    getPCList() {
        return this._pcList
    }

    getGMCList() {
        return this._gmcList
    }

    getGMCStats() {
        return this._gmcStats
    }

    getCharData() {
        return this._charData
    }

    getUID() {
        return !!this.useruid ? this.useruid : null
    }

    /* Party list functions */

    onPartyListValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._partyList = data

            if (!!this.data && !this.data.active && !!this.data.ids && this.data.ids.length > 0) {
                this.updatePartyActive(Object.keys(data.ids)[data.ids.length-1])
                this.autoSelect = false
            }
        } else {
            this._partyList = {}
        }

        this.$store.dispatch('remotedb/setPartyList', {content: this._partyList})
        this.emit('PartyList', this._partyList)

        const partyid = !!this._partyList && !!this._partyList.active ? this._partyList.active : null

        this.emit('SetParty', {partyid: partyid, gmid: this.useruid})
        this.loadParty()
    }

    onPartyDataValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._partyData = data
        } else {
            this._partyData = {}
        }
        
        this.$store.dispatch('remotedb/setPartyData', {content: this._partyData})
        this.emit('PartyData', this._partyData)

        if (!!this.isGM) {
            this.loadParty()
        } else {
            // console.log(this._partyData)
            this.loadGMCMembers()
            this.loadPCMembers(this._partyData.members)
            this.loadCharData()
        }
    }

    onSettingsValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._settings = data
        } else {
            this._settings = {}
        }
        
        this.$store.dispatch('remotedb/setSettings', {content: this._settings})
    }

    loadParty() {
        if (!!this.isGM) { // GM side
            // console.log("gm-side")
            if (!!this._partyList && !!this._partyList.active) {
                const active = this._partyList.active
                
                if (!!active && !!this._partyData && !!this._partyData[active]) {
                    this.setPartyIDs(active, this.useruid)
                    this.loadGMCMembers()
                    this.loadPCMembers(this._partyData[active].members)
                    this.loadCharData()
                } else {
                    this.setPartyIDs(null, null)
                    this._resetPCStatsListeners()
                    this._resetGMCListeners()

                    this.$store.dispatch('remotedb/setPCStats', {content: this._pcStats})
                    this.$store.dispatch('remotedb/setGMCList', {content: this._gmcList})
                    this.$store.dispatch('remotedb/setGMCStats', {content: this._gmcStats})
                    this.emit('PCStats', this._pcStats)
                    this.emit('GMCList', this._gmcList)
                    this.emit('GMCStats', this._gmcStats)
                }
            }
        } else { // PC side
            if (!!this._pcList && !!this._pcList.active) {
                const active = this._pcList.active

                this._resetDBListener(this._dbPartyDataRef)
                this._resetDBListener(this._dbSettingsRef)
                this._dbPartyDataRef = null
                this._dbSettingsRef = null
                this._partyData = {}

                if (!!active && !!this._pcLocalStats && !!this._pcLocalStats[active] && !!this._pcLocalStats[active].partyid && !!this._pcLocalStats[active].gmid) {
                    this.setPartyIDs(this._pcLocalStats[active].partyid, this._pcLocalStats[active].gmid)

                    this.emit('SetParty', {partyid: this._partyid, gmid: this._gmid})

                    this._dbPartyDataRef = this.f.ref(this.f.database, 'partydata/' + this._gmid + '/' + this._partyid)
                    this._dbSettingsRef = this.f.ref(this.f.database, 'settings/' + this._gmid + '/' )
                    this.f.onValue(this._dbPartyDataRef, (snapshot) => {this.onPartyDataValue(snapshot)})
                    this.f.onValue(this._dbSettingsRef, (snapshot) => {this.onSettingsValue(snapshot)})
                } else {
                    this.setPartyIDs(null, null)
                    this._resetPCStatsListeners()
                    this._resetGMCListeners()

                    this.$store.dispatch('remotedb/setPCStats', {content: this._pcStats})
                    this.$store.dispatch('remotedb/setGMCList', {content: this._gmcList})
                    this.$store.dispatch('remotedb/setGMCStats', {content: this._gmcStats})
                    this.emit('PCStats', this._pcStats)
                    this.emit('GMCList', this._gmcList)
                    this.emit('GMCStats', this._gmcStats)
                }
            }
        }
    }

    checkCharData() {
        if (!!this._pcList && !!this._pcList.active && !!this._pcLocalStats && Object.keys(this._pcLocalStats).length > 0 && !!this._charData && Object.keys(this._charData).length > 0) {
            // console.log("checkCharData", this._pcLocalStats, this._charData)
            if (!this._charData[this._pcList.active]) {
                const charDataHP = this._pcLocalStats[this._pcList.active].maxhp
                let newPCStats = {
                    ...this._pcLocalStats[this._pcList.active],
                    id: this._pcList.active,
                    hp: null,
                    temphp: null
                }

                this.savePCStats(newPCStats)
                this.saveCharData(this._pcList.active, {
                    hp: charDataHP,
                    temphp: 0
                })
            }
        }
    }

    loadPCMembers(members) {
        this._resetPCStatsListeners()

        let pcmembers = false

        if (members != null && Object.keys(members).length > 0) {
            Object.keys(members).forEach((i) => {
                if (members[i]) {
                    Object.keys(members[i]).forEach((j) => {
                        if (!!members[i][j] && members[i][j] == 'pc') {
                            pcmembers = true
                            this._dbPCStatsRef[j] = this.f.ref(this.f.database, 'pcstats/' + i + '/' + j + '/')
            
                            this.f.onValue(this._dbPCStatsRef[j], (snapshot) => {
                                this.getPCStatsOnValue(snapshot, i)
                            })
                        }
                    })
                }
            })
            if (!pcmembers) {
                this.$store.dispatch('remotedb/setPCStats', {content: this._pcStats})
                this.emit('PCStats', this._pcStats)
            }
        } else {
            this.$store.dispatch('remotedb/setPCStats', {content: this._pcStats})
            this.emit('PCStats', this._pcStats)
        }
    }

    /* PC list functions */
    onPCListValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._pcList = data
            // console.log("onPCListValue", data)

            // if (this.autoSelect) {
            //     this.updatePCActive(Object.keys(data.ids)[data.ids.length-1])
            //     this.autoSelect = false
            // }
        } else {
            this._pcList = {}
        }

        this.$store.dispatch('remotedb/setPCList', {content: this._pcList})
        this.emit('PCList', this._pcList)
        this.loadParty()
    }

    onPCLocalStatsValue(snapshot) {
        const data = snapshot.val()
        if (data) {
            this._pcLocalStats = data
        } else {
            this._pcLocalStats = {}
        }

        this.$store.dispatch('remotedb/setPCLocalStats', {content: this._pcLocalStats})
        this.emit('PCLocalStats', this._pcLocalStats)
        this.loadParty()
        if (!this.isGM) {
            this.checkCharData()
        }
    }

    updatePCActive(id) {
        if (!!id) {
            this.f.retrySet("updatePCActive", this.f.child(this._dbPCListRef, 'active'), id)
        }
    }

    updatePCData(pcid, data) {
        this.f.retrySet("updatePCData", this.f.child(this._dbCharDataRef, pcid), data)
    }

    /* GMC functions */

    onGMCListOnValue(snapshot) {
        const data = snapshot.val()
        if (!!data) {
            this._gmcList = data
        } else {
            this._gmcList = {}
        }

        this.$store.dispatch('remotedb/setGMCList', {content: this._gmcList})
        this.emit('GMCList', this._gmcList)
    }

    onGMCStatsOnValue(snapshot) {
        const data = snapshot.val()
        if (!!data) {
            this._gmcStats= data
        } else {
            this._gmcStats = {}
        }
        
        this.$store.dispatch('remotedb/setGMCStats', {content: this._gmcStats})
        this.emit('GMCStats', this._gmcStats)
    }

    addGMC(gmc) {
        let memberCount = 0
        if (this._gmcStats && Object.keys(this._gmcStats).length > 0) {
            memberCount += Object.keys(this._gmcStats).length
        }
        if (this._pcStats && Object.keys(this._pcStats).length > 0) {
            memberCount += Object.keys(this._pcStats).length
        }

        if (memberCount < 10 && !!this._gmcList) {
            const newGMCID = this.f.push(this._dbGMCListRef)
            const newGMCIDKey = newGMCID.key

            let newGMCList = null
            if (!!this._gmcList.ids && this._gmcList.ids.length > 0) {
                newGMCList = {...this._gmcList}
                newGMCList.ids.push({[newGMCIDKey]: true})
            } else {
                newGMCList = {ids: []}
                newGMCList.ids.push({[newGMCIDKey]: true})
            }

            this.f.retrySet("setGMCList", this._dbGMCListRef, newGMCList, () => {
                this.f.retrySet("setGMCStats", this.f.child(this._dbGMCStatsRef, newGMCIDKey), {...gmc})

                let charData = {
                    hp: gmc.maxhp,
                    temphp: 0,
                }
                this.f.retrySet("setCharData", this.f.child(this._dbCharDataRef, newGMCIDKey), {...charData})
                this.f.retrySet("setPartyData", this.f.child(this._dbPartyDataRef, this._partyid + '/members/' + this.useruid + '/' + newGMCIDKey), 'gmc')
            })
        }
    }

    saveGMC(gmc) {
        if (!!this._gmcList && !!this._gmcList.ids) {
            let index = this._gmcList.ids.findIndex((gl) => {
                let keys = Object.keys(gl)
                return !!keys && keys.length > 0 && keys[0] == gmc.id
            })
    
            if (index != -1) {
                let key = Object.keys(this._gmcList.ids[index])[0]
    
                delete gmc.id
                delete gmc.type
    
                this.f.retrySet("saveGMC", this.f.child(this._dbGMCStatsRef, key), gmc)
            }
        }
    }

    removeGMC(gmcid, callback = null) {
        if (!!this._partyid && !!this._gmcList && !!this._gmcList.ids && this._gmcList.ids.length > 0) { 
            let index = this._gmcList.ids.findIndex((gl) => {
                let keys = Object.keys(gl)
                return !!keys && keys.length > 0 && keys[0] == gmcid
            })

            if (index != -1) {
                let newGMCList = {...this._gmcList}

                newGMCList.ids.splice(index, 1)

                this.f.retryRemove("removePartyData", this.f.child(this._dbPartyDataRef, this._partyid + '/members/' + this.useruid + '/' + gmcid))
                this.f.retryRemove("removeCharData", this.f.child(this._dbCharDataRef, gmcid))

                this.f.retryRemove("removeGMCStats", this.f.child(this._dbGMCStatsRef, gmcid), () => {
                    // Remove cmalerts? 
                    this.f.retrySet("setGMCList", this._dbGMCListRef, newGMCList, callback)
                })
            }
        }
    }

    /* PC Functions */

    /* CharData Functions */

    onCharDataOnValue(snapshot) {
        const data = snapshot.val()
        if (!!data) {
            this._charData = data
        } else {
            this._charData = {}
        }
        
        this.$store.dispatch('remotedb/setCharData', {content: this._charData})
        this.emit('CharData', this._charData)

        if (!this.isGM) {
            this.checkCharData()
        }
    }

    updateCharSpecificData(combatantID, charData, callback = null) {
        this.f.retrySet("updateCharSpecificData", this.f.child(this._dbCharDataRef, combatantID), charData, callback)
    }

    /* Update functions */

    updatePartyActive(data) {
        this.f.retrySet("updatePartyActive", this.f.child(this._dbPartyListRef, 'active'), data)
    }

    updatePartyIDs(data) {
        this.f.retrySet("updatePartyIDs", this.f.child(this._dbPartyListRef, 'ids'), data)
    }

    updatePartyData(partyid, data, callback = null) {
        this.f.retrySet("updatePartyData", this.f.child(this._dbPartyDataRef, partyid), data, callback)
    }

    updatePartyMemberLevel(pcid, level) {
        this.f.retrySet("updatePartyMemberLevel", this.f.child(this._dbPCStatsRef[pcid], 'level'), level)
    }

    updatePartyLevel(partyid, level) {
        this.f.retrySet("updatePartyLevel", this.f.child(this._dbPartyDataRef, partyid + '/level'), level)
    }
    updatePCLevel(pcid, level) {
        this.f.retrySet("updatePCLevel", this.f.child(this._dbPCStatsRef[pcid], 'level'), level)
    }
    updateGMCLevel(gmcid, level) {
        this.f.retrySet("updateGMCLevel", this.f.child(this._dbGMCStatsRef, gmcid.toString() + '/level'), level)
    }

    updateGMCByID(gmcindex, data, callback = null) {
        this.f.retrySet("updateGMCByID", this.f.child(this._dbGMCStatsRef, gmcindex.toString()), data, callback)
    }

    updateSettings(data) {
        this.f.retrySet("updateSettings", this._dbSettingsRef, data)
    }
    updateSettingsByID(partyid, data) {
        this.f.retrySet("updateSettings", this.f.child(this._dbSettingsRef, partyid), data)
    }

    updateLocalPCStats(pcid, data) {
        this.f.retrySet("updateLocalPCData", this.f.child(this._dbPCLocalStatsRef, pcid), data)
    }
    updateLocalPCIds(data) {
        this.f.retrySet("updateLocalPCIds", this.f.child(this._dbPCListRef, 'ids'), data)
    }

    /* Member functions */

    getPCStatsOnValue(snapshot, useruid) {
        const data = snapshot.val()
        if (data) {
            this._pcStats[snapshot.key] = data
            this._pcStats[snapshot.key].useruid = useruid
        } else {
            if (this._pcStats[snapshot.key]) {
                delete this._pcStats[snapshot.key]
            }
        }
        this.$store.dispatch('remotedb/setPCStats', {content: this._pcStats})
        this.emit('PCStats', this._pcStats)

        // this._forcePartyMembersRefresh(parent)
    }

    /* PC functions */
    addPC(options) {
        let pcCount = 0
        if (!!this._pcList && !!this._pcList.ids && this._pcList.ids.length > 0) {
            pcCount += this._pcList.ids.length
        }

        if (pcCount < 10 && !!this._pcList) {
            const newPCID = this.f.push(this._dbPCListRef)
            const newPCIDKey = newPCID.key

            let newPCList = null
            if (!!this._pcList.ids && this._pcList.ids.length > 0) {
                newPCList = {...this._pcList}
                newPCList.ids.push({[newPCIDKey]: true})
            } else {
                newPCList = {ids: []}
                newPCList.ids.push({[newPCIDKey]: true})
            }

            this.f.retrySet("addPCList", this._dbPCListRef, newPCList, (sucess1) => {
                if (!!sucess1) {
                    if (!newPCList.active) {
                        newPCList.active = newPCIDKey
                        this.f.retrySet("setPCList", this._dbPCListRef, newPCList)
                    }

                    console.log('options', options)

                    this.f.retrySet("setPCLocalStats", this.f.child(this._dbPCLocalStatsRef, newPCIDKey), {
                        name: options.name,
                        level: options.level,
                        adv: options.adv,
                        color: !!options.color ? options.color : null,
                        icon: !!options.icon ? options.icon : null,
                        ac: 10,
                        maxhp: 8,
                        partyid: 'localcharacter',
                        gmid: this.useruid,
                        speed: 25,
                        perception: 1,
                        saves: !!options.adv ? [1,1,1] : [1,1,1],
                        scores: !!options.adv ? [10,10,10,10,10,10] : [10,10,10,10,10,10],
                        skills: !!options.adv ? [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    }, (sucess2) => {
                        if (!!sucess2) {
                            let localCharData = this.f.ref(this.f.database, 'chardata/' + this.useruid + '/' + 'localcharacter')
                            this.f.retrySet("setCharData", this.f.child(localCharData, newPCIDKey), {
                                hp: 8,
                                temphp: 0,
                            }, (success3) => {
                                this.f.off(localCharData)
                                console.log('success3', !!success3)
                            })
                        }
                    })
                }
            })

        }
    }

    savePCStats(pc) {
        let adv = pc.adv

        let newPC = {...pc, adv: adv}
        const key = pc.id

        if (this._pcLocalStats[pc.id]) {
            delete newPC.id
            delete newPC.useruid

            this.f.retrySet("savePCStats", this.f.child(this._dbPCLocalStatsRef, key), newPC)
        }
    }

    saveCharData(key, data) {
        this.f.retrySet("saveCharData", this.f.child(this._dbCharDataRef, key), data)
    }

    // TODO: Remove this PC from party. Maybe issue this before even startin this function?
    removePC(pcid, callback = null) {
        if (!!this._pcList && !!this._pcList.ids && this._pcList.ids.length > 0) { 
            let index = this._pcList.ids.findIndex((pl) => {
                let keys = Object.keys(pl)
                return !!keys && keys.length > 0 && keys[0] == pcid
            })

            if (index != -1) {
                let newPCCList = {...this._pcList}

                newPCCList.ids.splice(index, 1)
                newPCCList.active = null

                this.f.retryRemove("removePCLocalStats", this.f.child(this._dbPCLocalStatsRef, pcid), () => {
                    // Remove cmalerts? 
                    this.f.retrySet("setPCList", this._dbPCListRef, newPCCList, callback)
                })
            }
        }
    }

    /* Party functions */

    addParty(options) {
        let partyCount = 0
        if (!!this._partyList && !!this._partyList.ids && this._partyList.ids.length > 0) {
            partyCount += this._partyList.ids.length
        }

        if (partyCount < 10 && !!this._partyList) {
            const newPartyID = this.f.push(this._dbPartyListRef)
            const newPartyIDKey = newPartyID.key

            let newPartyList = null
            if (!!this._partyList.ids && this._partyList.ids.length > 0) {
                newPartyList = {...this._partyList}
                newPartyList.ids.push({[newPartyIDKey]: true})
            } else {
                newPartyList = {ids: []}
                newPartyList.ids.push({[newPartyIDKey]: true})
            }

            this.f.retrySet("addPartyList", this._dbPartyListRef, newPartyList, () => {
                // if (!newPartyList.active) {
                    newPartyList.active = newPartyIDKey
                    this.f.retrySet("setPartyList", this._dbPartyListRef, newPartyList)
                // }

                this.f.retrySet("setPartyData", this.f.child(this._dbPartyDataRef, newPartyIDKey), {
                    name: options.name,
                    bench: [],
                    color: !!options.color ? options.color : null,
                    icon: !!options.icon ? options.icon : null,
                    level: 1,
                    members: [],
                    settings: {
                        npcname: "full",
                        pchp: "full",
                    }
                })
            })

        }
    }

    removeParty(partyid, callback = null) {
        if (!!this._partyList && !!this._partyList.ids && this._partyList.ids.length > 0) {
            let index = this._partyList.ids.findIndex((pl) => {
                let keys = Object.keys(pl)
                return !!keys && keys.length > 0 && keys[0] == partyid
            })

            if (index != -1) {
                let newPartyList = {...this._partyList}
                let activeParty = false

                newPartyList.ids.splice(index, 1)
                if (!!newPartyList.active && newPartyList.active == partyid) {
                    activeParty = true
                    delete newPartyList.active
                }

                // Remove all combat stuff
                if (activeParty) {
                    this.f.retryRemove("removeCharData", this._dbCharDataRef, () => {
                        this._resetDBListener(this._dbCharDataRef)
                    })
                    this._dbCharDataRef = null
                    this._charData = {}
    
                    // Remove all GMC's
                    this.f.retryRemove("removeCharStats", this._dbGMCStatsRef, () => {
                        this._resetDBListener(this._dbGMCStatsRef)
                    })
                    this._dbGMCStatsRef = null
                    this._gmcStats = {}
    
                    this.f.retryRemove("removeGMCList", this._dbGMCListRef, () => {
                        this._resetDBListener(this._dbGMCListRef)
                    })
                    this._dbGMCListRef = null
                    this._gmcList = {}
    
                    // Remove all party data
                    this.f.retryRemove("removePartyData", this.f.child(this._dbPartyDataRef, partyid), () => {
                        this.f.retrySet("removePartyList", this._dbPartyListRef, newPartyList, callback)
                    })

                    // Remove all PC's from party
                } else {
                    let tempCharDataRef = this.f.ref(this.f.database, 'chardata/' + this._gmid + '/' + partyid)
                    this.f.retryRemove("removeCharData", tempCharDataRef)

                    let tempCharStatsRef = this.f.ref(this.f.database, 'gmcstats/' + this._gmid + '/' + partyid)
                    this.f.retryRemove("removeCharStats", tempCharStatsRef)

                    let tempGMCListRef = this.f.ref(this.f.database, 'gmclist/' + this._gmid + '/' + partyid)
                    this.f.retryRemove("removeGMCList", tempGMCListRef)

                    let tempPartyDataRef = this.f.ref(this.f.database, 'partydata/' + this._gmid + '/' + partyid)
                    this.f.retryRemove("removePartyData", tempPartyDataRef, () => {
                        this.f.retrySet("removePartyList", this._dbPartyListRef, newPartyList, callback)
                    })
                }
            }
        }

        // const data = {useruid: this.useruid, partyid: partyid, secret: secret}
        // this.f.axios.post('https://'+this.f.subdomain+'.readysetdice.com/party/delete', data)
        // .then((response) => {
        // })
        // .catch((error) => {
        //     console.log(error)
        // })
    }

    getPlayers(secret, partyid) {
        const data = {useruid: this.useruid, secret: secret, partyid: partyid}

        this.f.axios.post('https://'+this.f.subdomain+'.readysetdice.com/party/players', data)
        .then((response) => {
        })
        .catch((error) => {
            console.log(error)
        })
    }

    kickPartyMember(pcuid, pcid, partyid, secret) {
        const data = {memberid: pcuid, secret: secret, pcid: pcid, useruid: this.useruid, partyid: partyid}

        this.f.axios.post('https://'+this.f.subdomain+'.readysetdice.com/party/kick', data)
        .then((response) => {
        })
        .catch((error) => {
            console.log(error)
        })
    }

    /* Party remote functions */

    joinParty(secret, gmid, partyid, pcid) {
        const data = {useruid: this.useruid, secret: secret, pcid: pcid, gmid: gmid, partyid: partyid}

        this.f.axios.post('https://'+this.f.subdomain+'.readysetdice.com/party/join', data)
        .then((response) => {
            // window.location.hash = '#/character-manager'
            window.location.hash = '#/mobile'
            // window.location.search = '' // Mode history
            // console.log(response)
            // this.emit("PartyJoined")
            // if (response.data.slice(0,2) === 'OK') {
            //     parent.partyJoined = true
            //     parent.partyName = response.data.slice(3,response.data.length)
            //     setTimeout(()=>{parent.$router.replace('player-manager')}, 2000)
            // } else if (response.data === 'NO_PARTY') {
            //     parent.noParty = true
            //     setTimeout(()=>{parent.$router.replace('player-manager')}, 2000)
            // }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    leaveParty(secret, gmid, partyid, pcid, callback = null) {
        // console.log(gmid, partyid)

        if (!!partyid && !!gmid && partyid != 'localcharacter' && gmid != this.userid) {
            const data = {useruid: this.useruid, secret: secret, pcid: pcid, gmid: gmid, partyid: partyid}

            this.f.axios.post('https://'+this.f.subdomain+'.readysetdice.com/party/leave', data)
            .then((response) => {
                // console.log(response)
                // this.emit("PartyJoined")
                // console.log(response.data)
                if (!!response && !!response.data == 'OK') {
                    if (!!callback) {
                        callback(true);
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
        } else if (!!callback) {
            callback(true)
        }
    }

    /* Party link */

    getPartyJoinLink(partyid) {
        return 'https://pc.readysetdice.com/#/mobile?gmid=' + this.useruid + '&partyid=' + partyid
    }

    /* Internal function */

    _resetPCStatsListeners() {
        this._pcStats = {}
        if (!!this._dbPCStatsRef && Object.keys(this._dbPCStatsRef).length > 0) {
            Object.keys(this._dbPCStatsRef).forEach((i) => {
                this.f.off(this._dbPCStatsRef[i])
            })
        }
    }

    _resetGMCListeners() {
        this._gmcList = {}
        this._gmcStats = {}

        this._resetDBListener(this._dbGMCListRef)
        this._dbGMCListRef = null

        this._resetDBListener(this._dbGMCStatsRef)
        this._dbGMCStatsRef = null
    }

    _resetDBListener(name) {
        if (!!name && Object.keys(name).length > 0) {
            try { this.f.off(name) } catch(e) { console.error(e) }
        }
    }

    _forcePartyMembersRefresh() {
        const oldval = this._pcStats
        this._pcStats = null
        this._pcStats = ''
        this._pcStats = oldval
    }
}

export default new CampaignService();