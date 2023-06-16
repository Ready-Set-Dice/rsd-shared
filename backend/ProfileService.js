class ProfileService {
  constructor() {
  }

  init(prodDB, devDB, subdomain) {
    this._devProfileList = {}
    this._prodProfileList = {}

    this.subdomain = subdomain
    this.prodDB = prodDB
    this.devDB = devDB

    const prodProfileRef = this.prodDB.database().ref('profile')
    const devProfileRef = this.devDB.database().ref('profile')

    this.setupProfileListener(prodProfileRef, ' prod ', this._prodProfileList)
    this.setupProfileListener(devProfileRef, ' dev ', this._devProfileList)
  }

  getProfile = (origin, useruid) => {
    const pl = this.getEnvProfileList(origin)
    return pl && pl[useruid] ? pl[useruid] : null
  }

  getEnvProfileList(origin) {
    if (origin === 'https://'+this.subdomain+'.readysetdice.com') {
      return this._prodProfileList
    } else if (origin === 'https://'+this.subdomain+'-dev.readysetdice.com') {
      return this._devProfileList
    } else {
      return null
    }
  }

  setupProfileListener(ref, name, profileList) {
    ref.on('child_added', (snapshot) => {
      const data = snapshot.val()
      // console.log("child_added", name, snapshot.key, data)
      profileList[snapshot.key] = data
    }, (error) => {
      console.log('The read failed: ' + error.name);
    })
  
    ref.on('child_changed', (snapshot) => {
      const data = snapshot.val()
      // console.log("child_changed", name, snapshot.key)
  
      if (profileList[snapshot.key] !== null) {
        profileList[snapshot.key] = data
      }
    }, (error) => {
      console.log('The read failed: ' + error.name);
    })
  
    ref.on('child_removed', (snapshot) => {
      // console.log("child_removed", name, snapshot.key)
      if (profileList[snapshot.key] !== null) {
        delete profileList[snapshot.key]
      }
    }, (error) => {
      console.log('The read failed: ' + error.name);
    })
    
  }  
}

module.exports.ProfileService = new ProfileService()