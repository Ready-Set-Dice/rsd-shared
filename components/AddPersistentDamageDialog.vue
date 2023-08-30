<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Add="add"
        @Save="save"
        @Remove="remove"
    >
        <template v-slot:append-slot>
            <div v-show="!multiple">
                <div v-show="!!isImmune" class="pt-3 red--text font-weight-medium">
                    <span>Note, this creature is immune to {{ type }}.</span>
                </div>
                <div v-show="!!isResistant" class="pt-3 red--text font-weight-medium">
                    <span>Note, this creature is resistant to {{ type }}.</span>
                </div>
                <div v-show="!!isVulnerable" class="pt-3 red--text font-weight-medium">
                    <span>Note, this creature is vulnerable to {{ type }}.</span>
                </div>
            </div>
            <div v-show="!!multiple">
                <div v-show="!!isImmune" class="pt-3 red--text font-weight-medium">
                    <span>Note, one of the creatures is immune to {{ type }}.</span>
                </div>
                <div v-show="!!isResistant" class="pt-3 red--text font-weight-medium">
                    <span>Note, one of the creatures is resistant to {{ type }}.</span>
                </div>
                <div v-show="!!isVulnerable" class="pt-3 red--text font-weight-medium">
                    <span>Note, one of the creatures is vulnerable to {{ type }}.</span>
                </div>
            </div>
        </template>
    </BaseDialog>
</template>

<script>
import { isGM } from '@/services'
import BaseDialog from '@root/.shared/components/base/BaseDialog/BaseDialog'

export default {
    components: {
        BaseDialog,
    },
    data() {
        return {
            isImmune: false,
            isResistant: false,
            isVulnerable: false,
            multiple: false,
            type: '',
            tmpl: {
                removeButton: true,
                name: 'persistent-damage-dialog',
                labels: {
                    new: {
                        title: 'Add Persistent Damage'
                    },
                    edit: {
                        title: 'Edit Persistent Damage'
                    }  
                },
                inputs: {
                    value: {
                        type: 'number',
                        label: 'Value',
                        rule: 'tinyNumber',
                        min: 1,
                        max: 50,
                        extra: {},
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}, hpinfo = {immune: false, resistant: false, vulnerable: false}) {
            if (!!this.$refs && !!this.$refs.dialog) {
                this.isImmune = hpinfo.immune
                this.isResistant = hpinfo.resistant
                this.isVulnerable = hpinfo.vulnerable

                this.type = options.dmg

                if (!!options && !!options.affected) {
                    this.multiple = options.affected.length > 1
                }
                
                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options, true)
            }
        },
        add(options) {
            if (!!options && !!options.type && !!options.value && !!options.dmg && !!options.affected && options.affected.length > 0) {
                options.affected.forEach(a => {
                    if (!!a && !!a.id) {
                        const data = {type: options.type, dmg: options.dmg, value: options.value}

                        if (!!options.local) {
                            if (!!isGM) {
                                this.$rsd.members.addCondition(a.id, a.type, data)
                            } else {
                                this.$rsd.playercharacters.addCondition(a.id, data)
                            }
                        } else {
                            this.$rsd.combat.addCondition(a.id, data)
                        }
                    }
                })
            }
        },
        save(options) {
            if (!!options && !!options.type && !!options.id && !!options.value && (!!options._key || options._key == 0)) {
                let data = {id: options.id, type: options.type, value: options.value, dmg: options.dmg}

                if (!!options.local) {
                    if (!!isGM) {
                        this.$rsd.members.updateCondition(options._key, options.memberType, data)
                    } else {
                        this.$rsd.playercharacters.updateCondition(options._key, data)
                    }
                } else {
                    this.$rsd.combat.updateCondition(options._key, data)
                }
            }
        },
        remove(options) {
            if (!!options && !!options.type && !!options.id && (!!options._key || options._key == 0)) {
                const data = {id: options.id, type: options.type}
                if (!!options.local) {
                    if (!!isGM) {
                        this.$rsd.members.removeCondition(options._key, options.memberType, data)
                    } else {
                        this.$rsd.playercharacters.removeCondition(options._key, data)
                    }
                } else {
                    this.$rsd.combat.removeCondition(options._key, data)
                }
            }
        },
    }
}
</script>