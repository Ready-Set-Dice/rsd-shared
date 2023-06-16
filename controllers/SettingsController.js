import { CampaignService, isGM  } from '@/services'
import { DefaultController } from './DefaultController'

const ERRCODES = {
    0: 'P00', // Error: value is not valid, a string or longer than 0.
}

export class SettingsController extends DefaultController {
    constructor(isDev) {
        super(isDev)
    }

    get all() { return this.$store.getters['remotedb/settings'] }
    get values() { return SETTINGS_VALUES }

    get(key) {
        if (!!key && (!!key.account || !!key.campaign)) {
            if (!!key.account) {
                return !!this.all && !!this.all.account ? this.all.account : null
            } else {
                return !!this.all && !!this.all[key.campaign] ? this.all[key.campaign] : null
            }
        } else {
            return null
        }
    }

    getActiveSettings() {
        const activeCampaign = !!this.$rsd.campaigns.activeKey ? this.$rsd.campaigns.activeKey : (!!this.$rsd.playercharacters.active ? this.$rsd.playercharacters.active.partyid : null)
        let settingsData = {...DEFAULT_SETTINGS.account}
        const accountData = this.get({account:true})
        const campaignData = !!activeCampaign ? this.get({account:false, campaign: activeCampaign}) : null

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

    getValue(category, value) {
        return !!category && (!!value || value == 0) && !!SETTINGS_VALUES[category] && !!SETTINGS_VALUES[category][value] ? SETTINGS_VALUES[category][value] : null
    }
    getIndex(category, value) {
        return !!category && !!value && !!SETTINGS_VALUES[category] ? SETTINGS_VALUES[category].findIndex(s => s == value) : null
    }
    
    saveData(key, category, newData) {
        if (!!key && (!!key.account || !!key.campaign) && !!category) {
            if (!!this.all) {
                const data = this.get(key)
                let settingsData = {...data}

                if (category == 'combat') {
                    const npcnameSet = (!!newData.npcname || newData.npcname == 0) && newData.npcname != -1
                    const pchpSet = (!!newData.pchp || newData.pchp == 0) && newData.pchp != -1
                
                    settingsData.npcname = !!npcnameSet ? newData.npcname : null
                    settingsData.pchp = !!pchpSet ? newData.pchp : null
                } else if (category == 'custom') {
                    const gitnameSet = !!newData.gitname ? newData.gitname : null
                    const gitownerSet = !!newData.gitowner ? newData.gitowner : null
                
                    settingsData.gitname = !!gitnameSet ? newData.gitname : null
                    settingsData.gitowner = !!gitownerSet ? newData.gitowner : null
                } else if (category == 'general') {
                    const profnolevelSet = !!newData.profnolevel ? newData.profnolevel : null
                
                    settingsData.profnolevel = !!profnolevelSet ? newData.profnolevel : null
                }

                CampaignService.updateSettingsByID(!!key.account ? 'account' : key.campaign, settingsData)
            } else {
                let settingsData = {...DEFAULT_SETTINGS}

                if (!key.account && !!key.campaign) {
                    settingsData[key.campaign] = {}
                }

                if (category == 'combat') {
                    const npcnameSet = (!!newData.npcname || newData.npcname == 0) && newData.npcname != -1
                    const pchpSet = (!!newData.pchp || newData.pchp == 0) && newData.pchp != -1
                
                    if (!!key.account) {
                        settingsData.account.npcname = !!npcnameSet ? newData.npcname : null
                    } else {
                        settingsData[key.campaign].npcname = !!npcnameSet ? newData.npcname : null
                    }
                    if (!!key.account) {
                        settingsData.account.pchp = !!pchpSet ? newData.pchp : null
                    } else {
                        settingsData[key.campaign].pchp = !!pchpSet ? newData.pchp: null
                    }
                } else if (category == 'custom') {
                    const gitnameSet = !!newData.gitname ? newData.gitname : null
                    const gitownerSet = !!newData.gitowner ? newData.gitowner : null
                
                    if (!!key.account) {
                        settingsData.account.gitname = !!gitnameSet ? newData.gitname : null
                    } else {
                        settingsData[key.campaign].gitname = !!gitnameSet ? newData.gitname : null
                    }
                    if (!!key.account) {
                        settingsData.account.gitowner = !!gitownerSet ? newData.gitowner : null
                    } else {
                        settingsData[key.campaign].gitowner = !!gitownerSet ? newData.gitowner : null
                    }
                } else if (category == 'general') {
                    const profnolevelSet = !!newData.profnolevel ? newData.profnolevel : null
                    if (!!key.account) {
                        settingsData.account.profnolevel = !!profnolevelSet ? newData.profnolevel : null
                    } else {
                        settingsData[key.campaign].profnolevel = !!profnolevelSet ? newData.profnolevel : null
                    }
                }

                CampaignService.updateSettings(settingsData)
            }
        }
    }
}

const SETTINGS_VALUES = {
    npcname: [
        'none',
        'full',
        'identifier and unique id',
        'unique id',
    ],
    pchp: [
        'none',
        'full',
        'partial',
    ]
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