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
                name: 'temp-hp-dialog',
                labels: {
                    new: {
                        title: 'Set Temporary HP'
                    },
                    edit: {
                        title: 'Set Temporary HP'
                    }  
                },
                inputs: {
                    value: {
                        label: "Temp HP Amount",
                        type: "number",
                        min: 1,
                        max: 1000,
                        rule: 'largeNumber',
                        extra: {},
                    },
                    duration: {
                        label: "Duration (0 is permanent)",
                        type: 'number',
                        min: 0,
                        max: 50,
                        extra: {},
                        rule: 'tinyNumberWithZero',
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
            // if (!!options.color && options.color.r == 255 && options.color.g == 255 && options.color.b == 255 && options.color.a == 1) {
            //     delete options.color
            // }

            if (!!options && !!options.value && (!!options.duration || options.duration == 0) && !!options.affected && options.affected.length > 0) {
                options.affected.forEach(a => {
                    if (!!a) {
                        if (!!options.local && !!a.id) {
                            if (!!isGM) {
                                this.$rsd.members.doTemporaryHP(a.id, {value: options.value, duration: options.duration, memberType: a.type})
                            } else {
                                this.$rsd.playercharacters.doTemporaryHP(a.id, {value: options.value, duration: options.duration})
                            }
                        } else if (!!a._key || a._key == 0) {
                            this.$rsd.combat.doTemporaryHP(a._key, {value: options.value, duration: options.duration})
                        }
                    }
                })
            }

            // this.$emit('Save', options)
        }
    }
}
</script>