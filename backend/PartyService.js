class PartyService {
  constructor() {
  }

  init(prodDB, devDB, subdomain, selectDB) {
    this._devPartyList = {}
    this._prodPartyList = {}

    this._devPartyData = {}
    this._prodPartyData = {}

    this._devCharData = {}
    this._prodCharData = {}

    // this._devPCList = {}
    // this._prodPCList = {}

    this.subdomain = subdomain
    this.prodDB = prodDB
    this.devDB = devDB
    this.selectDB = selectDB

    const devPartyListRef = this.devDB.database().ref('partylist')
    const prodPartyListRef = this.prodDB.database().ref('partylist')

    const devPartyDataRef = this.devDB.database().ref('partydata')
    const prodPartyDataRef = this.prodDB.database().ref('partydata')

    const devCharDataRef = this.devDB.database().ref('chardata')
    const prodCharDataRef = this.prodDB.database().ref('chardata')

    // const devPCRef = this.devDB.database().ref('playercharacter')
    // const prodPCRef = this.prodDB.database().ref('playercharacter')

    this._setupPartyListener(devPartyListRef, ' dev ', this._devPartyList)
    this._setupPartyListener(prodPartyListRef, ' prod ', this._prodPartyList)

    this._setupPartyListener(devPartyDataRef, ' dev ', this._devPartyData)
    this._setupPartyListener(prodPartyDataRef, ' prod ', this._prodPartyData)

    this._setupPartyListener(devCharDataRef, ' dev ', this._devCharData)
    this._setupPartyListener(prodCharDataRef, ' prod ', this._prodCharData)
    
    // this._setupPartyListener(devPCRef, ' dev ', this._devPCList)
    // this._setupPartyListener(prodPCRef, ' prod ', this._prodPCList)
  }

  setPCService(PCService) {
    this.PCService = PCService
  }

  getPartyList = (origin, useruid) => {
    const pl = this._getEnvPartyList(origin)
    return pl[useruid] ? pl[useruid] : null
  }

  getPartyData = (origin, useruid) => {
    const pl = this._getEnvPartyData(origin)
    return pl[useruid] ? pl[useruid] : null
  }

  getSpecificPartyExists = (origin, useruid, partyid) => {
    const pl = this._getEnvPartyList(origin)
    return pl[useruid] && pl[useruid].ids[partyid] ? pl[useruid].ids[partyid] : null
  }

  getSpecificPartyData = (origin, useruid, partyid) => {
    const pl = this._getEnvPartyData(origin)
    return pl[useruid] && pl[useruid][partyid] ? pl[useruid][partyid] : null
  }

  newParty = (origin, useruid, partyname, restricted) => {
    const partyList = this.getPartyList(origin, useruid)
    const partyCount = partyList && partyList.ids ? Object.keys(partyList.ids).length : 0

    if (!restricted || (restricted && partyCount < 10)) {
      const db = this.selectDB(origin, this.prodDB, this.devDB)
      const dbPartyListRef = db.ref('partylist/' + useruid + '/ids')
      const dbPartyDataRef = db.ref('partydata/' + useruid + '/')
      
      try {
        const newPartyID = dbPartyListRef.push()
        const newPartyIDKey = newPartyID.getKey()
        newPartyID.set(true)
        dbPartyDataRef.child(newPartyIDKey).set({
          name: partyname,
          level: 1,
          members: []
        })

        // dbPartyRef.push().set({
        //     name: partyname,
        //     players: []
        // })
        return "OK"
      } catch (e) {
        console.log(e)
        return "ERROR"
      }
    } else {
      return "PARTY_LIMIT"
    }
  }

  deleteParty = (origin, useruid, partyid) => {
    const db = this.selectDB(origin, this.prodDB, this.devDB)

    const partyData = this.getSpecificPartyData(origin, useruid, partyid)

    if (partyData && partyData.members) {
      // console.log(partyData.members)
      Object.keys(partyData.members).forEach((i) => {
        Object.keys(partyData.members[i]).forEach((j) => {
          const dbPCStatsRef = db.ref('pcstats/' + i + '/' + j + '/')
          try {
            dbPCStatsRef.child('partyid').set('')
            dbPCStatsRef.child('gmid').set('')
          } catch(e) {
            console.log(e)
          }
        })
      })
    }

    const dbPartyListRef = db.ref('partylist/' + useruid + '/')
    const dbPartyDataRef = db.ref('partydata/' + useruid + '/')

    const dbCharDataRef = db.ref('chardata/' + useruid + '/')
    const dbGMCStatsRef = db.ref('gmcstats/' + useruid + '/')
    const dbGMCListRef = db.ref('gmclist/' + useruid + '/')

    // Remove combat connections too!
    const dbCombatRef = db.ref('combat/' + useruid + '/')
    const dbCombatAlertsRef = db.ref('combatalerts/' + useruid + '/')
    const dbCombatMembersRef = db.ref('combatmembers/' + useruid + '/')
    const dbCombatMembersDataRef = db.ref('cmdata/' + useruid + '/')
    const dbCombatMembersAlertsRef = db.ref('cmalerts/' + useruid + '/')
    const dbCombatMembersConditionsRef = db.ref('cmconditions/' + useruid + '/')

    const partyList = this.getPartyList(origin, useruid)

    if (partyList.ids[partyid]) {
      try {
        if (partyList.active == partyid) {
          dbPartyListRef.child('active').set(null)
        }

        dbPartyDataRef.child(partyid).remove()
        dbPartyListRef.child('ids').child(partyid).remove()

        dbCharDataRef.child(partyid).remove()
        dbGMCStatsRef.child(partyid).remove()
        dbGMCListRef.child(partyid).remove()

        dbCombatRef.child(partyid).remove()
        dbCombatAlertsRef.child(partyid).remove()
        dbCombatMembersRef.child(partyid).remove()
        dbCombatMembersDataRef.child(partyid).remove()
        dbCombatMembersAlertsRef.child(partyid).remove()
        dbCombatMembersConditionsRef.child(partyid).remove()
    
        return "OK"
      } catch(e) {
        console.log(e)
        return "ERROR"
      }
    } else {
      return "OK"
    }
  }

  joinParty = (origin, useruid, pcid, gmid, partyid) => {
    const db = this.selectDB(origin, this.prodDB, this.devDB)
    // const dbPartyListRef = db.ref('partylist/' + gmid + '/')
    // const dbPartyDataRef = db.ref('partydata/' + gmid + '/')

    const activePC = this.PCService.getSpecificPCStats(origin, useruid, pcid)
    
    if (!!activePC) {
      const dbPCStatsRef = db.ref('pcstats/' + useruid + '/' + pcid + '/')

      if (!!activePC.partyid && !!activePC.gmid) {
        const oldPartyID = partyid
        const oldGMID = gmid

        try {
          dbPCStatsRef.child('partyid').set(null)
          dbPCStatsRef.child('gmid').set(null)
          dbPCStatsRef.child('hp').set(null)
          dbPCStatsRef.child('temphp').set(null)
        } catch(e) {
          console.log(e)
          return "ERROR"
        }

        // const dbPartyDataRef = db.ref('partydata/' + gmid + '/' + partyid)
        const oldParty = this.getSpecificPartyData(origin, oldGMID, oldPartyID)
        if (!!oldParty && !!oldParty.members && !!oldParty.players) {
          const dbPartyDataRef = db.ref('partydata/' + oldGMID + '/' + oldPartyID)
          const dbCMConditionsRef = db.ref('cmconditions/' + oldGMID + '/' + oldPartyID)
          const dbCMAlertsRef = db.ref('cmalerts/' + oldGMID + '/' + oldPartyID)
          const dbCharDataRef = db.ref('chardata/' + oldGMID + '/' + oldPartyID)
          try {
            dbPartyDataRef.child('members').child(useruid).child(pcid).remove()
            dbCMConditionsRef.child(pcid).remove()
            dbCMAlertsRef.child(pcid).remove()
            dbCharDataRef.child(pcid).remove()
          } catch(e) {
            console.log(e)
            return "ERROR"
          }
        }
      }

      const newParty = this.getSpecificPartyData(origin, gmid, partyid)
      const memberCount = newParty && newParty.members ? Object.keys(newParty.members).length : 0
      if (!!newParty && memberCount < 10) {
        const dbPartyDataRef = db.ref('partydata/' + gmid + '/' + partyid)
        const dbCharDataRef = db.ref('chardata/' + gmid + '/' + partyid)
        try {
          dbPartyDataRef.child('members').child(useruid).child(pcid).set('pc')
          dbPCStatsRef.child('partyid').set(partyid)
          dbPCStatsRef.child('gmid').set(gmid)
          dbPCStatsRef.child('level').set(newParty.level)
          dbCharDataRef.child(pcid).set({
            hp: activePC.maxhp,
            temphp: 0,
          })
        } catch(e) {
          console.log(e)
          return "ERROR"
        }
      } else {
        return "NO_PARTY"
      }
    } else {
      return "NO_PC"
    }
  }

  leaveParty = (origin, useruid, pcid, gmid, partyid) => {
    const db = this.selectDB(origin, this.prodDB, this.devDB)
    // const dbPartyListRef = db.ref('partylist/' + gmid + '/')
    // const dbPartyDataRef = db.ref('partydata/' + gmid + '/')

    const activePC = this.PCService.getSpecificPCStats(origin, useruid, pcid)
    const party = this.getSpecificPartyData(origin, gmid, partyid)
    if (!!party) {
      const dbPCStatsRef = db.ref('pcstats/' + useruid + '/' + pcid + '/')
      const dbPartyDataRef = db.ref('partydata/' + gmid + '/' + partyid + '/')
      const dbCMConditionsRef = db.ref('cmconditions/' + gmid + '/' + partyid)
      const dbCMAlertsRef = db.ref('cmalerts/' + gmid + '/' + partyid)
      const dbCharDataRef = db.ref('chardata/' + gmid + '/' + partyid)
      try {
        dbPartyDataRef.child('members').child(useruid).child(pcid).remove()
        dbCMConditionsRef.child(pcid).remove()
        dbCMAlertsRef.child(pcid).remove()
        dbCharDataRef.child(pcid).remove()

        if (!!activePC) {
          dbPCStatsRef.child('partyid').set(null)
          dbPCStatsRef.child('gmid').set(null)
          dbPCStatsRef.child('hp').set(activePC.maxhp || 0)
          dbPCStatsRef.child('temphp').set(0)
        }
        return "OK"
      } catch(e) {
        console.log(e)
        return "ERROR"
      }
    }
  }
  
  rollInitiative = (origin, useruid, partyid) => {
    const db = this.selectDB(origin, this.prodDB, this.devDB)

    const partyData = this.getSpecificPartyData(origin, useruid, partyid)

    if (partyData) {
      const members = partyData.members

      try {
        Object.keys(members).forEach((i) => {
          Object.keys(members[i]).forEach((j) => {
            
            const dbPCStatsRef = db.ref('pcstats/' + i + '/' + j + '/')
            dbPCStatsRef.child('initiative').set(-1)
          })
        })
        return "OK"
      } catch(e) {
        console.log(e)
        return "ERROR"
      }
    }
  }

  _getEnvPartyList(origin) {
    if (origin === 'https://'+this.subdomain+'.readysetdice.com') {
      return this._prodPartyList
    } else if (origin === 'https://'+this.subdomain+'-dev.readysetdice.com') {
      return this._devPartyList
    } else {
      return null
    }
  }

  _getEnvPartyData(origin) {
    if (origin === 'https://'+this.subdomain+'.readysetdice.com') {
      return this._prodPartyData
    } else if (origin === 'https://'+this.subdomain+'-dev.readysetdice.com') {
      return this._devPartyData
    } else {
      return null
    }
  }

  _checkPartyByID(partyid, partyList, pcurl = null) {
    if (pcurl !== null) {
      const findPlayer = partyList[partyid].players.findIndex((e,i) => {
        // console.log("Inside: ",e,i, pcurl)
        return e == pcurl
      })
      // console.log('Ouside')
      // console.log(partyList)
      // console.log(pcurl)
      // console.log(findPlayer)
      if (findPlayer != -1) {
        const partyCheck = partyList[partyid]
        return partyCheck
      } else {
        return false
      }
    } else {
      const partyCheck = partyList[partyid]
      return partyCheck
    }
  }

  _setupPartyListener(ref, name, partyList) {
    ref.on('child_added', (snapshot) => {
      const data = snapshot.val()
      // console.log("child_added", name, snapshot.key, data)
      partyList[snapshot.key] = data
    }, (error) => {
      console.log('The read failed: ' + error.name);
    })
  
    ref.on('child_changed', (snapshot) => {
      const data = snapshot.val()
      // console.log("child_changed", name, snapshot.key)
  
      if (partyList[snapshot.key] !== null) {
        partyList[snapshot.key] = data
      }
    }, (error) => {
      console.log('The read failed: ' + error.name);
    })
  
    ref.on('child_removed', (snapshot) => {
      // console.log("child_removed", name, snapshot.key)
      if (partyList[snapshot.key] !== null) {
        delete partyList[snapshot.key]
      }
    }, (error) => {
      console.log('The read failed: ' + error.name);
    })
    
  }
  
}

module.exports.PartyService = new PartyService()