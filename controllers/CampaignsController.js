import { CampaignService, EncounterBuilderService, isGM} from '@/services'
import { DefaultController } from './DefaultController'

const ERRCODES = {
    0: 'C00', // Error: party.name [${party.name}] is not of type string.
    1: 'C01', // Error: party [${party}] is not valid or empty.
    2: 'C02', // Error: PartyList is not valid or no ids.
    3: 'C03', // Error: Error: PartyData is not valid.
    4: 'C04', // Error: PartyData is not valid, id [${id}] was not valid or no data was found.
    5: 'C05', // Error: PartyData is not valid, id [${id}] was not valid or no data was found.
    6: 'C06', // Error: ID [${newID}] is not valid.
    7: 'C07', // Error: ID [${newID}] is not of type string or is empty.
    8: 'C08', // Error: level [${newLevel}] is not of type numer or is empty.
    9: 'C09', // Error: Party [${newParty}] is not valid.
    10: 'C10', // Error: Not a GM.
    11: 'C11', // Error: settings [${newSettings}] is not of type object or is not valid.
    12: 'C12', // Error: npcname [${newSettings.npcname}] or pchp [${newSettings.pchp}] is not valid.
    13: 'C13', // Error: array [${array}] is not of type object or is empty.
    14: 'C14', // Error: newIds [${newIds}] is not valid or is empty.
    15: 'C15', // Error: newData [${newData}] is not of type object or is not valid.
    16: 'C16', // Error: newData.name [${newData.name}] is not of type string.
    17: 'C17', // Error: newData.color [${newData.color}] is not correct.
    18: 'C18', // Error: newData.icon [${newData.icon}] is not of type string.
    19: 'C19', // Error: cid [${cid}] was not valid or empty.
    20: 'C20', // Error: id [${id}] was not valid or empty.
    21: 'C21', // Error: cid [${cid}] is not valid, not a GM or EncounterBuilderService is not available.
    22: 'C22', // Error: cid [${cid}] is not valid, not a GM or pcuid/pcid/secret are not valid or empty.
    23: 'C23', // Error: pcuid/pcid/secret are not of type string.
    24: 'C24', // Error: key [${key}] or [${newName}] are not valid.
    25: 'C25', // Error: key [${key}], [${icon}] or [${color}] are not valid.
}

export class CampaignsController extends DefaultController {
    constructor(isDev) {
        super(isDev)
    }

    /* Internal functions */

    _validParty(party) {
        if (!!party && !!party.name) {
            if (typeof(party.name) != 'string') {
                this.error(ERRCODES[0],`Error: party.name [${party.name}] is not of type string.`)
                return false
            }
            return true
        } else {
            this.error(ERRCODES[1],`Error: party [${party}] is not valid or empty.`)
            return false
        }
    }

    _getcid(id) {
        if (typeof(id) == 'number') {
            const cid = !!this.ids && id < this.ids.length ? this.ids[id] : null
            if (!!cid) {
                const keys = Object.keys(cid)
                return !!keys && !!keys[0] ? keys[0] : null
            } else {
                this.error(ERRCODES[19],`Error: cid [${cid}] was not valid or empty.`)
                return null
            }
        } else if (typeof(id) == 'string') {
            if (!!id) {
                return id
            } else {
                this.error(ERRCODES[20],`Error: id [${id}] was not valid or empty.`)
                return null
            }
        } else {
            this.error(ERRCODES[5],`Error: type of id [${id}] was not a number or string.`)
            return null
        }
    }

    /* Getters */
    get uid() {
        return CampaignService.getUID()
    }

    get activeKey() { return this.$store.getters['remotedb/campaignActiveKey'] }
    get active() { return this.$store.getters['remotedb/campaignActive'] }
    get ids() { return this.$store.getters['remotedb/campaignIds'] }
    get data() { return this.$store.getters['remotedb/campaighData'] }

    getInviteLink(id = this.activeKey) {
        return !!id ? CampaignService.getPartyJoinLink(id) : ''
    }

    get(id) {
        const cid = this._getcid(id)
        // console.log('cid', cid)
        return !!cid && !!this.data && !!this.data[cid] ? this.data[cid] : null
    }

    /* Setters */
    set activeKey(newID) {
        if (!!newID && typeof(newID) == 'string') {
            if (!!this.ids && !!this.includesKey(this.ids, newID)) {
                CampaignService.updatePartyActive(newID)
            } else {
                this.error(ERRCODES[6],`Error: ID [${newID}] is not valid.`)
            }
        } else {
            this.error(ERRCODES[7],`Error: ID [${newID}] is not of type string or is empty.`)
        }
    }

    set active(newData) {
        if (!!newData && typeof(newData) == 'object') {
            if (!!this.active && !!this.activeKey) {
                if (!!newData.name && typeof(newData.name) != 'string') {
                    this.error(ERRCODES[16],`Error: newData.name [${newData.name}] is not of type string.`)
                    return
                }
                if (!!newData.color && typeof(newData.color) != 'object' && typeof(newData.color.a) == 'number'
                    && typeof(newData.color.r) == 'number' && typeof(newData.color.g) == 'number' && typeof(newData.color.b) == 'number') {
                    this.error(ERRCODES[17],`Error: newData.color [${newData.color}] is not correct.`)
                    return
                }
                if (!!newData.icon && typeof(newData.icon) != 'string') {
                    this.error(ERRCODES[18],`Error: newData.icon [${newData.icon}] is not of type string.`)
                    return
                }

                CampaignService.updatePartyData(this.activeKey, {
                    ...this.active,
                    name: !!newData.name ? newData.name.substr(0,30) : this.active.name,
                    color: !!newData.color ? newData.color : this.active.color,
                    icon: !!newData.icon ? newData.icon : this.active.icon
                })
            }
        } else {
            this.error(ERRCODES[15],`Error: newData [${newData}] is not of type object or is not valid.`)
        }
    }

    set level(newLevel) {
        if ((!!newLevel || newLevel == 0) && typeof(newLevel) == 'number') {
            if (!!this.activeKey && !!this.active) {
                // TODO: Set the level of all members
                CampaignService.updatePartyData(this.activeKey, {
                    ...this.active,
                    level: newLevel
                })
            }
        } else {
            this.error(ERRCODES[8],`Error: level [${newLevel}] is not of type numer or is empty.`)
        }
    }

    set settings(newSettings) {
        if (!!newSettings && typeof(newSettings) == 'object') {
            if (!!newSettings.npcname && !!newSettings.pchp) {
                if (!!this.activeKey && !!this.active) {
                    // TODO: Check all valid options for the setting fields, maybe also switch over to non-string?
                    CampaignService.updatePartyData(this.activeKey, {
                        ...this.active,
                        settings: {
                            npcname: newSettings.npcname,
                            pchp: newSettings.pchp
                        }
                    })
                }
            } else {
                this.error(ERRCODES[12],`Error: npcname [${newSettings.npcname}] or pchp [${newSettings.pchp}] is not valid.`)
            }
        } else {
            this.error(ERRCODES[11],`Error: settings [${newSettings}] is not of type object or is not valid.`)
        }
    }

    setArray(array) {
        if (!!array && typeof(array) == 'object' && array.length > 0) {
            if (!!this.ids) {
                let newIds = new Array(array.length)
                array.forEach((party, index) => {
                    newIds[index] = { [party._key]: true }
                })

                if (!!newIds && newIds.length >= 1) {
                    if (JSON.stringify(newIds) != JSON.stringify(this.ids)) {
                        CampaignService.updatePartyIDs(newIds)
                    }
                } else {
                    this.error(ERRCODES[14],`Error: newIds [${newIds}] is not valid or is empty.`)
                }
            }
        } else {
            this.error(ERRCODES[13],`Error: array [${array}] is not of type object or is empty.`)
        }
    }

    /* Adders */
    addParty(newParty) {
        if (!!newParty && !!this._validParty(newParty)) {
            if (!!isGM) {
                CampaignService.addParty(newParty)
            } else {
                this.error(ERRCODES[10],`Error: Not a GM.`)
            }
        } else {
            this.error(ERRCODES[9],`Error: Party [${newParty}] is not valid.`)
        }
    }

    /* Modifiers */
    updateName(id, newName) {
        const key = this._getcid(id)
        if (!!key && !!newName) {
            const data = this.get(key)
            if (!!isGM && !!data) {
                CampaignService.updatePartyData(key, {...data, name: newName})
            } else {
                this.error(ERRCODES[10],`Error: Not a GM.`)
            }
        } else {
            this.error(ERRCODES[24],`Error: key [${key}] or [${newName}] are not valid.`)
        }
    }

    updateStyle(id, icon, color) {
        const key = this._getcid(id)
        if (!!key && !!icon, !!color) {
            const data = this.get(key)
            if (!!isGM && !!data) {
                CampaignService.updatePartyData(key, {...data, icon: icon, color: color})
            } else {
                this.error(ERRCODES[10],`Error: Not a GM.`)
            }
        } else {
            this.error(ERRCODES[25],`Error: key [${key}], [${icon}] or [${color}] are not valid.`)
        }
    }

    updateMemberBench(id, member, callback = null) {
        const key = this._getcid(id)
        if (!!key, !!member && !!member.type) {
            const data = this.get(key)
            if (!!data) {
                let memberIdentifier = ''
                if (member.type.toLowerCase() == 'gmc' && !!member.id) {
                    memberIdentifier = 'GMC/' + member.id
                } else if (member.type.toLowerCase() == 'pc' && !!member.uid && !!member.id) {
                    memberIdentifier =  member.uid + '/' + member.id
                }

                let newBench = []

                if (!!data.bench && data.bench.length > 0) {
                    data.bench.forEach(b => {
                        if (b != memberIdentifier) {
                            newBench.push(b)
                        }
                    })

                    if (!data.bench.includes(memberIdentifier)) {
                        newBench.push(memberIdentifier)
                    }
                } else {
                    newBench = [memberIdentifier]
                }

                CampaignService.updatePartyData(key, {...data, bench: newBench}, callback)
            }
        }
    }

    updateLevel(id, level) {
        const key = this._getcid(id)
        if (!!key && !!level) {
            const data = this.get(key)
            if (!!isGM && !!data) {
                CampaignService.updatePartyLevel(key, level)

                const members = this.$rsd.members.all
                if (!!members && members.length > 0) {
                    members.forEach(m => {
                        if (m.type.toLowerCase() == 'pc') {
                            CampaignService.updatePCLevel(m.id, level)
                        } else if (m.type.toLowerCase() == 'gmc') {
                            CampaignService.updateGMCLevel(m.id, level)
                        }
                    })
                }
            } else {
                this.error(ERRCODES[10],`Error: Not a GM.`)
            }
        } else {
            this.error(ERRCODES[25],`Error: key [${key}], [${icon}] or [${color}] are not valid.`)
        }
    }

    /* Deleters */
    removeParty(id = this.activeKey, callback = null) {
        const cid = this._getcid(id)
        if (!!cid && !!isGM && !!EncounterBuilderService) {
            EncounterBuilderService.removeEncountersForParty(cid)
            CampaignService.removeParty(cid, callback)
        } else {
            this.error(ERRCODES[21],`Error: cid [${cid}] is not valid, not a GM or EncounterBuilderService is not available.`)
        }
    }

    removePCMember(pcuid, pcid, secret, partyid = this.activeKey) {
        const cid = this._getcid(partyid)
        if (!!cid && !!isGM && !!pcuid && !!pcid && !!secret) {
            if (typeof(pcuid) == 'string' && typeof(pcid) == 'string' && typeof(secret) == 'string') {
                CampaignService.kickPartyMember(pcuid, pcid, cid, secret)
            } else {
                this.error(ERRCODES[23],`Error: pcuid/pcid/secret are not of type string.`)
            }
        } else {
            this.error(ERRCODES[22],`Error: cid [${cid}] is not valid, not a GM or pcuid/pcid/secret are not valid or empty.`)
        }
    }
}