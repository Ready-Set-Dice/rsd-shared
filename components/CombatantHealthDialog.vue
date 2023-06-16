<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Save="save"
    />
</template>

<script>
import { isGM } from '@/services'
import BaseDialog from '@/../../shared/components/base/BaseDialog/BaseDialog'

export default {
    components: {
        BaseDialog,
    },
    data() {
        return {
            tmpl: {
                name: 'combatant-health-dialog',
                labels: {
                    new: {
                        title: 'Set HP'
                    },
                    edit: {
                        title: 'Set HP'
                    }  
                },
                inputs: {
                    hp: {
                        label: "Current HP",
                        type: "number",
                        min: 0,
                        max: 1000,
                        rule: 'largeNumberWithZero',
                        extra: {},
                    },
                    temphp: {
                        label: "Temporary HP",
                        type: "number",
                        min: 0,
                        max: 1000,
                        rule: 'largeNumberWithZero',
                        extra: {},
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}, extra = {}) {
            if (!!this.$refs && !!this.$refs.dialog) {
                // TODO: figure out how to dynamically change the maxhp (number of items) in the picker
                // if (!!extra && !!extra.maxhp && extra.maxhp > 0) {
                //     this.$set(this.tmpl.inputs.hp, 'max', extra.maxhp)
                // } else {
                //     this.$set(this.tmpl.inputs.hp, 'max', 1000)
                // }

                if (!!options && !!options.name) {
                    this.tmpl.labels.new.title = `Set ${options.name}'s HP`
                    this.tmpl.labels.edit.title = this.tmpl.labels.new.title
                } else {
                    this.tmpl.labels.new.title = 'Set HP'
                    this.tmpl.labels.edit.title = this.tmpl.labels.new.title
                }

                // console.log('this.tmpl.inputs.hp.max', this.tmpl.inputs.hp.max, extra)

                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options, true)
            }
        },
        save(options) {
            if (!!options && (!!options.hp || options.hp == 0) && (!!options.temphp || options.temphp == 0) && !!options.id) {
                if (!!options.local) {
                    if (!!isGM) {
                        this.$rsd.members.setHealth(options.id, {hp: options.hp, temphp: options.temphp})
                    } else {
                        this.$rsd.playercharacters.setHealth(options.id, {hp: options.hp, temphp: options.temphp})
                    }
                } else {
                    this.$rsd.combat.updateMemberData(options.id, {hp: options.hp, temphp: options.temphp})
                }
            }
        }
    }
}
</script>