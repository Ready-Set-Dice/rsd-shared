<template>
    <span v-if="!!casting">
        <span
            v-for="(entry) in casting.entries"
            :key="'spellcasting-entry-'+entry.name+'-'+cuid"
            class="d-block"
        >
            <span class="font-weight-bold">{{entry.name}} </span>
            <span :class="!!modified ? 'red--text font-weight-medium' : ''">DC {{getSpellDC(entry)}};&nbsp;</span>
            <span :class="!!modified ? 'red--text font-weight-medium' : ''">Attack +{{getSpellAttack(entry)}};&nbsp;</span>
            <span 
                v-for="(spellLevels, spellType) in getRelatedSpells(entry._id, casting.spells, entry)"
                :key="'entry-'+entry+'-type-'+spellType+'-'+cuid"
            >
                <span 
                    v-for="(spells, level) in spellLevels"
                    :key="'spell-type-'+spellType+'-level-'+level+'-'+cuid"
                >
                    <span class="font-weight-bold">{{level}} </span>
                    <span>{{!!isFocusCasting(entry) ? `(${availableFocusPoints} Focus Point)` : ''}} </span>
                    <span
                        v-for="(spell, index) in spells" 
                        :key="'spell-level-'+level+'-spell-'+spell.name+'-'+cuid"
                    >
                        <span
                            class="pointer"
                            :class="!isSpellAvailable(spell._data, entry) ? 'text-decoration-line-through' : 'text-decoration-underline'"
                            @click="openSpellSheetDialog(spell._data, entry)"
                        >{{spell.name}}</span>
                        <span v-if="!!isSlotCasting(entry)">{{getPreparedSlots(spell._data, entry)}}</span>
                        <span v-if="index < spells.length - 1">, </span>
                        <span v-else>&nbsp;</span>
                    </span>
                </span>
            </span>
        </span>
        <SpellSheetDialog ref="spellSheetDialog" :usable="slots" :cuid="cuid" />
    </span>
</template>

<script>
import SpellSheetDialog from '@/../../.shared/components/SpellSheet/SpellSheetDialog'

export default {
    data() {
        return {
        }
    },
    props: {
        casting: Object,
        cuid: String,
        slots: Boolean,
        focuspoints: Number,
        modified: Boolean,
    },
    components: {
        SpellSheetDialog,
    },
    computed: {
        getHighestSpellLevel() {
            let level = 0
            if (!!this.casting && !!this.casting.spells) {
                this.casting.spells.forEach(spell => {
                    if (!!spell && !!spell.system && !!spell.system.level && !!spell.system.level.value) {
                        const newLevel = Number(spell.system.level.value)
                        level = newLevel > level ? newLevel : level
                    }
                })
            }
            return level
        },
        usedSpellSlots() {
            return !!this.rsd && !!this.rsd.gamestate ? this.rsd.gamestate.view.combat.usedSpellSlots : null
        },
        availableFocusPoints() {
            if (!!this.usedSpellSlots && (!!this.focuspoints || this.focuspoints == 0)) {
                const spellCount = this.usedSpellSlots.filter(uss => uss.cuid == this.cuid && !!uss.focus)
                
                if (!!spellCount) {
                    return (this.focuspoints - spellCount.length)
                } else {
                    return this.focuspoints
                }
            } else if (!!this.focuspoints || this.focuspoints == 0) {
                return this.focuspoints
            } else {
                return 0
            }
        },
    },
    methods: {
        openSpellSheetDialog(spell, entry) {
            if (!!this.$refs && !!this.$refs.spellSheetDialog) {
                this.$refs.spellSheetDialog.show(spell, {
                    available: this.isSpellAvailable(spell, entry),
                    always: this.isAlwaysCast(spell, entry),
                    focus: this.isFocusCasting(entry),
                    entry: entry._id,
                })
            }
        },
        getSpellLevelHeading(constant, level, cantrip) {
            let heading = null
            if (!!level) {
                let prettyLevel = null
                if (!!cantrip) {
                    prettyLevel = 'Cantrips'
                    if (this.getHighestSpellLevel > 1) {
                        prettyLevel += ' (' + this.$rsd.format.getPrettyIndex(this.getHighestSpellLevel-1) + ')'
                    }
                } else {
                    prettyLevel = this.$rsd.format.getPrettyIndex(Number(level)-1)
                }

                if (!!constant) {
                    heading = `Constant (${prettyLevel})`
                } else {
                    heading = prettyLevel
                }
            }
            return heading
        },
        getSpellDC(entry) {
            return !!entry && !!entry.system && !!entry.system.spelldc && !!entry.system.spelldc.dc ? entry.system.spelldc.dc : null
        },
        getSpellAttack(entry) {
            return !!entry && !!entry.system && !!entry.system.spelldc && !!entry.system.spelldc.value ? entry.system.spelldc.value : null
        },
        getRelatedSpells(entryID, spells, entry) {
            const relatedSpells = spells.filter(sp => !!sp && !!sp.system && !!sp.system.location && !!sp.system.location.value && sp.system.location.value == entryID)
            let spellObject = null
            
            if (!!relatedSpells && relatedSpells.length > 0) {
                spellObject = {
                    regular: {},
                    constant: {},
                }

                relatedSpells.forEach(rs => {
                    if (!!rs && !!rs.system) {
                        const level = !!this.isFocusCasting(entry) ? this.getHighestSpellLevel : (!!rs.system.level && !!rs.system.level.value ? Number(rs.system.level.value) : null)
                        const constant = rs.name.toLowerCase().includes('(constant)')
                        const cantrip = !!rs.system.traits && !!rs.system.traits.value ? rs.system.traits.value.includes('cantrip') : -1
                        const name = rs.name.replace(' (Constant)', '')
                        if (cantrip != -1) {
                            const heading = this.getSpellLevelHeading(constant, level, cantrip)
                            if (!!level && !!heading) {
                                if (!!spellObject.constant[heading]) {
                                    spellObject.constant[heading].push({name: name, _data: rs})
                                } else if (!spellObject.constant[heading]) {
                                    spellObject.constant[heading] = [{name: name, _data: rs}]
                                }
                            }
                        }
                    }
                })
            }

            return spellObject
        },

        countAvailableSlots(spell, entry) {
            const castingType = this.getSpellcastingType(entry)
            const slots = !!entry && !!entry.system && !!entry.system.slots ? entry.system.slots : null
            let returnValue = ''

            if (!!spell && !!spell.system && !!slots && !!castingType) {
                const cantrip = !!spell.system.traits && !!spell.system.traits.value ? spell.system.traits.value.includes('cantrip') : -1
                const level = !!spell.system.level && !!spell.system.level.value ? spell.system.level.value : null

                if (cantrip != -1 && !!level) {
                    const prepared = Object.values(slots['slot'+level].prepared)
                    const count = !!prepared && prepared.length > 0 ? prepared.filter(p => p.id == spell._id).length : null

                    return count
                }
            }
            return 0
        },
        getPreparedSlots(spell, entry) {
            let returnValue = ''
            const count = this.countAvailableSlots(spell, entry)
            if (!!count && count > 1) {
                returnValue = '('+count+')'
            }

            return returnValue
        },
        isSpellAvailable(spell, entry) {
            if (!!this.slots) {
                const castType = this.getSpellcastingType(entry)
                const alwaysCast = this.isAlwaysCast(spell, entry)

                if (!!alwaysCast) {
                    return true
                } else if (!!this.usedSpellSlots && this.usedSpellSlots.length > 0) {
                    // const findSpell

                    if (castType == 'focus') {
                        return this.availableFocusPoints
                    } else if (castType == 'innate' || castType == 'prepared') {
                        const spellCount = this.usedSpellSlots.filter(uss => uss.cuid == this.cuid && uss.entry == entry._id && uss.spell == spell._id)
                        const availableSlots = this.countAvailableSlots(spell, entry)
                        
                        return !spellCount || spellCount.length < availableSlots
                    }
                }
            }

            return true
        },

        isAlwaysCast(spell, entry) {
            const castType = this.getSpellcastingType(entry)
            return !!castType && castType == 'ritual' || 
            (!!spell && !!spell.system && !!spell.system.traits && !!spell.system.traits.value && !!spell.system.traits.value.includes('cantrip')) ||
            (!!spell && !!spell.name && (spell.name.toLowerCase().includes('(at will)') 
            || spell.name.toLowerCase().includes('(constant)')))
        },
        isSlotCasting(entry) {
            const castType = this.getSpellcastingType(entry)
            return !!this.slots && !!castType && (castType == 'prepared' || castType == 'innate')
        },
        isFocusCasting(entry) {
            const castType = this.getSpellcastingType(entry)
            return !!castType && castType == 'focus'
        },
        getSpellcastingType(entry) {
            if (!!entry && !!entry.system) {
                if (!!entry.system.prepared && !!entry.system.prepared.value) {
                    return entry.system.prepared.value
                }
            }
            return null
        },
    }
}
</script>

<style scoped>
</style>