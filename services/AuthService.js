import rtdb from '@/rtdb'
import { getAuth } from 'firebase/auth'
import store from '@root/.shared/store/store'
// import services from '@/services'

// const getFBAuth = () => import('@firebase/auth')
const getServices = () => import('@/services')

// if (!services.initialized()) {
//     services.init(store)
// }

const initializeAuth = new Promise(resolve => {
    getAuth().onAuthStateChanged((user) => {
        // console.log("onAuthStateChanged", user)

        if (user) {
            if (process.env.NODE_ENV === "development") {
                console.log('logged in')
            }
        
            store.dispatch('rsd/setUser', user)

            getServices().then(mod => {
                if (!mod.ServiceManager.initialized()) {
                    mod.ServiceManager.init(store)
                }

                if (!mod.ServiceManager.loaded()) {
                    mod.ServiceManager.load()
                }
            })
        } else {
            if (process.env.NODE_ENV === "development") {
                console.log('logged out')
            }

            store.dispatch('rsd/setUser', null)
            getServices().then(mod => {
                if (!mod.ServiceManager.initialized()) {
                    mod.ServiceManager.init(store)
                }

                if (!!mod.ServiceManager.loaded()) {
                    mod.ServiceManager.unload()
                }
            })
        }

        resolve()
    });
})

const getProfile = new Promise(resolve => {
    getServices().then(mod => {
        mod.ProfileManagerService.on("Profile", () => {
            resolve(mod.ProfileManagerService.getProfile())
        })
    })
})

const authService = {
    authenticated: async () => {
        return initializeAuth.then(_ => {
            return store.state.rsd.user
        })
    },

    profile: async () => {
        return getProfile.then(profile => {
            return profile
        })
    },

    
}

export default authService