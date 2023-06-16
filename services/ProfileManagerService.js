const EventEmitter = require('events')

class ProfileManagerService extends EventEmitter {
    constructor() {
        super()
    }

    init(funcObj) {
        this.f = funcObj

        this.reset()
    }

    unload() {
        this.reset()
    }

    reset() {
        this.useruid = null
        this.email = null
        this._profile = {}

        if (this._dbProfileRef)
            this.f.off(this._dbProfileRef)
        this._dbProfileRef = null
    }

    load() {
        const auth = this.f.getAuth()
        const curuser = auth.currentUser

        if (curuser) {
            // console.log(curuser)
            this.useruid = curuser.uid
            this.email = curuser.email

            /* Profile */
            this._dbProfileRef = this.f.ref(this.f.database, 'profile/' + this.useruid)
            this.f.onValue(this._dbProfileRef, (snapshot) => { this.getProfileOnValue(snapshot) })
        }
    }

    getProfile() {
        return this._profile
    }

    getProfileOnValue(snapshot) {
        const data = snapshot.val()
        if (data !== null) {
            this._profile = data
            this.emit('Profile')
        } else {
            this.f.axios.post('https://'+this.f.subdomain+'.readysetdice.com/account-setup', {email: this.email, useruid: this.useruid})
            .then((response) => {
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }
}

export default new ProfileManagerService();