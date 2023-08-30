<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
    />
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
            tmpl: {
                name: 'heal-dialog',
                labels: {
                    new: {
                        title: 'Heal Combatant'
                    },
                    edit: {
                        title: 'Heal Combatant'
                    }  
                },
                inputs: {
                    value: {
                        label: "Heal Amount",
                        type: "number",
                        min: 1,
                        max: 1000,
                        rule: 'largeNumber',
                        extra: {},
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            if (!!this.$refs && !!this.$refs.dialog) {
                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            if (!!options && !!options.value && !!options.affected && options.affected.length > 0) {
                options.affected.forEach(a => {
                    if (!!a) {
                        if (!!options.local && !!a.id) {
                            if (!!isGM) {
                                this.$rsd.members.doHeal(a.id, {hp: options.value, memberType: a.type})
                            } else {
                                this.$rsd.playercharacters.doHeal(a.id, {hp: options.value})
                            }
                        } else if (!!a.id) {
                            this.$rsd.combat.doHeal(a.id, {hp: options.value})
                        }
                    }
                })
            }
        }
    }
}
</script>