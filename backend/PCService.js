class PCService {
  constructor() {
  }

  init(prodDB, devDB, subdomain, selectDB) {
    this._devPCList = {}
    this._prodPCList = {}

    this._devPCStats = {}
    this._prodPCStats = {}

    this._devPCCombatData = {}
    this._prodPCCombatData = {}

    this._devPartyRef = {}
    this._prodPartyRef = {}

    this.subdomain = subdomain
    this.prodDB = prodDB
    this.devDB = devDB
    this.selectDB = selectDB

    const devPCListRef = this.devDB.database().ref('pclist')
    const prodPCListRef = this.prodDB.database().ref('pclist')

    const devPCStatsRef = this.devDB.database().ref('pcstats')
    const prodPCStatsRef = this.prodDB.database().ref('pcstats')

    const devPCCombatDataRef = this.devDB.database().ref('pccombatdata')
    const prodPCCombatDataRef = this.prodDB.database().ref('pccombatdata')

    const devPartyRef = this.devDB.database().ref('party')
    const prodPartyRef = this.prodDB.database().ref('party')

    this._setupPCListener(devPCListRef, ' dev ', this._devPCList)
    this._setupPCListener(prodPCListRef, ' prod ', this._prodPCList)

    this._setupPCListener(devPCStatsRef, ' dev ', this._devPCStats)
    this._setupPCListener(prodPCStatsRef, ' prod ', this._prodPCStats)

    this._setupPCListener(devPCCombatDataRef, ' dev ', this._devPCCombatData)
    this._setupPCListener(prodPCCombatDataRef, ' prod ', this._prodPCCombatData)

    this._setupPCListener(devPartyRef, ' dev ', this._devPartyRef)
    this._setupPCListener(prodPartyRef, ' prod ', this._prodPartyRef)
  }

  setPartyService(PartyService) {
    this.PartyService = PartyService
  }

  getPCList = (origin, useruid) => {
    const pl = this._getEnvPCList(origin)
    return pl[useruid] ? pl[useruid] : null
  }

  getPCStats = (origin, useruid) => {
    const pl = this._getEnvPCStats(origin)
    return pl[useruid] ? pl[useruid] : null
  }

  getPartyList = (origin, useruid) => {
    const pl = this._getEnvPartyList(origin)
    return pl[useruid] ? pl[useruid] : null
  }

  getSpecificPCExists = (origin, useruid, pcid) => {
    const pl = this._getEnvPCList(origin)
    return pl[useruid] && pl[useruid].ids && pl[useruid].ids[pcid] ? pl[useruid].ids[pcid] : null
  }

  getSpecificPCStats = (origin, useruid, pcid) => {
    const pl = this._getEnvPCStats(origin)
    return pl[useruid] && pl[useruid][pcid] ? pl[useruid][pcid] : null
  }

  getSpecificPCCombatData = (origin, useruid, pcid) => {
    const pl = this._getEnvPCCombatData(origin)
    return pl[useruid] && pl[useruid][pcid] ? pl[useruid][pcid] : null
  }

  newPC = (origin, useruid, pcname, pclevel, restricted) => {
    const pcList = this.getPCList(origin, useruid)
    const pcCount = pcList && pcList.ids ? Object.keys(pcList.ids).length : 0
    
    if (!restricted || (restricted && pcCount < 10)) {
      const db = this.selectDB(origin, this.prodDB, this.devDB)
      const dbPCListRef = db.ref('pclist/' + useruid + '/ids')
      const dbPCStatsRef = db.ref('pcstats/' + useruid + '/')
      const dbPCCombatDataRef = db.ref('pccombatdata/' + useruid + '/')
      
      try {
        const newPCID = dbPCListRef.push()
        const newPCIDKey = newPCID.getKey()
        newPCID.set(true)
        dbPCStatsRef.child(newPCIDKey).set({
          ac: 10,
          maxhp: 10,
          perception: 0,
          speed: 25,
          fortitude: 0,
          reflex: 0,
          will: 0,
          name: pcname,
          gmid: '',
          partyid: '',
          level: pclevel,
        })
        dbPCCombatDataRef.child(newPCIDKey).set({
          initiative: -1,
          hp: 10,
          temphp: 0,
        })
        return "OK"
      } catch (e) {
        console.log(e)
        return "ERROR"
      }
    } else {
      return "PC_LIMIT"
    }
  }

  deletePC = (origin, useruid, pcid) => {
    const db = this.selectDB(origin, this.prodDB, this.devDB)
    const dbPCListRef = db.ref('pclist/' + useruid + '/')
    const dbPCStatsRef = db.ref('pcstats/' + useruid + '/')
    const dbPCCombatDataRef = db.ref('pccombatdata/' + useruid + '/')

    const pcList = this.getPCList(origin, useruid, pcid)
    const pcData = this.getSpecificPCStats(origin, useruid, pcid)

    if (!!pcList && !!pcData && !!pcCombatData) {
      if (pcData.partyid && pcData.gmid) {
        this.PartyService.leaveParty(origin, useruid, pcid, pcData.gmid, pcData.partyid)
        // const party = this.PartyService.getSpecificPartyData(origin, pcData.gmid, pcData.partyid)
        
        // if (party) {
        //   const dbPartyDataRef = db.ref('partydata/' + pcData.gmid + '/' + pcData.partyid + '/')
        //   try {
        //     dbPartyDataRef.child('members').child(useruid).child(pcid).remove()
        //   } catch(e) {
        //     console.log(e)
        //   }
        // }
      }

      try {
        if (pcList.active == pcid) {
          dbPCListRef.child('active').set(null)
        }

        dbPCStatsRef.child(pcid).remove()
        dbPCCombatDataRef.child(pcid).remove()
        dbPCListRef.child('ids').child(pcid).remove()
    
        return "OK"
      } catch(e) {
        console.log(e)
        return "ERROR"
      }
    } else {
      return "OK"
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

  _getEnvPCList(origin) {
    if (origin === 'https://'+this.subdomain+'.readysetdice.com') {
      return this._prodPCList
    } else if (origin === 'https://'+this.subdomain+'-dev.readysetdice.com') {
      return this._devPCList
    } else {
      return null
    }
  }

  _getEnvPCStats(origin) {
    if (origin === 'https://'+this.subdomain+'.readysetdice.com') {
      return this._prodPCStats
    } else if (origin === 'https://'+this.subdomain+'-dev.readysetdice.com') {
      return this._devPCStats
    } else {
      return null
    }
  }

  _getEnvPCCombatData(origin) {
    if (origin === 'https://'+this.subdomain+'.readysetdice.com') {
      return this._prodPCCombatData
    } else if (origin === 'https://'+this.subdomain+'-dev.readysetdice.com') {
      return this._devPCCombatData
    } else {
      return null
    }
  }

  _setupPCListener(ref, name, pcList) {
    ref.on('child_added', (snapshot) => {
      const data = snapshot.val()

      // Object.keys(data).forEach((p) => {
      //   if (!data[p].test) {
      //     // console.log(data[p])
      //     const childRef = ref.child(snapshot.key + '/' + p + '/test')
      //     if (childRef) {
      //       childRef.set('Wow!')
      //     }
      //   }
      // })

      pcList[snapshot.key] = data
    }, (error) => {
      console.log('The read failed: ' + error.name);
    })
  
    ref.on('child_changed', (snapshot) => {
      const data = snapshot.val()
      // console.log("child_changed", name, snapshot.key)
  
      if (pcList[snapshot.key] !== null) {
        pcList[snapshot.key] = data
      }
    }, (error) => {
      console.log('The read failed: ' + error.name);
    })
  
    ref.on('child_removed', (snapshot) => {
      // console.log("child_removed", name, snapshot.key)
      if (pcList[snapshot.key] !== null) {
        delete pcList[snapshot.key]
      }
    }, (error) => {
      console.log('The read failed: ' + error.name);
    })
    
  }
  
}

module.exports.PCService = new PCService()