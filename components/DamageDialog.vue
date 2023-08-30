<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
        @Close="close"
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
import BaseDialog from '@/../../.shared/components/base/BaseDialog/BaseDialog'

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
                name: 'damage-dialog',
                labels: {
                    new: {
                        title: 'Damage'
                    },
                    edit: {
                        title: 'Damage'
                    }  
                },
                inputs: {
                    current: {
                        label: "Current HP",
                        type: "progress",
                        value: 100,
                        color: 1,
                        health: null,
                        hidden: true,
                    },
                    value: {
                        label: "Damage Amount",
                        type: "number",
                        min: 1,
                        max: 1000,
                        rule: 'largeNumber',
                        extra: {},
                    },
                    crit: {
                        type: 'choice',
                        label: "Critical Hit (only for dying value)",
                        choices: ['false','true'],
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

                    if (!!this.multiple) {
                        this.tmpl.labels.new.title = 'Damage Combatants'
                        this.tmpl.labels.edit.title = this.tmpl.labels.new.title
                        this.tmpl.inputs.current.hidden = true
                        this.tmpl.inputs.current.value = 100
                        this.tmpl.inputs.current.color = 1
                        this.tmpl.inputs.current.health = null
                    } else if (!!options.affected[0]) {
                        this.tmpl.labels.new.title = 'Damage ' + options.affected[0].name
                        this.tmpl.labels.edit.title = this.tmpl.labels.new.title
                        this.tmpl.inputs.current.hidden = false
                        this.tmpl.inputs.current.value = !!options.affected[0].health && !!options.affected[0].health.hp >= 0 ? 100*((options.affected[0].health.hp + (options.affected[0].health.temphp || 0))/options.affected[0].health.maxhp) : 100
                        this.tmpl.inputs.current.color = this.healthColor(options.affected[0])
                        this.tmpl.inputs.current.health = !!options.affected[0].health ? options.affected[0].health : null
                    }
                }

                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            options.crit = !!options.crit
            
            if (!!options && !!options.value && !!options.affected && options.affected.length > 0) {
                options.affected.forEach(a => {
                    if (!!a) {
                        if (!!options.local && !!a.id) {
                            if (!!isGM) {
                                this.$rsd.members.doDamage(a.id, {dmg: options.dmg, value: options.value, crit: options.crit, memberType: a.type})
                            } else {
                                this.$rsd.playercharacters.doDamage(a.id, {dmg: options.dmg, value: options.value, crit: options.crit})
                            }
                        } else if (!!a.id) {
                            this.$rsd.combat.doDamage(a.id, {dmg: options.dmg, value: options.value, crit: options.crit})
                        }
                    }
                })
            }
        },
        close() {
            this.$emit('Close')
        },
        healthColor(combatant) {
            if (!!combatant && !!combatant.health) {
                const percentConstant = 100 / Math.max(combatant.health.maxhp, combatant.health.hp)
                const hpPercent = combatant.health.hp * percentConstant / 100
                return this.$rsd.format.getColorBlend('#c70000', '#15c700', hpPercent)
            }
        },
    }
}
</script>