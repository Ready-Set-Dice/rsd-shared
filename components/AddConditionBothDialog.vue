<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Add="add"
        @Save="save"
        @Remove="remove"
    />
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
            tmpl: {
                removeButton: true,
                name: 'condition-both-dialog',
                labels: {
                    new: {
                        title: 'Add Condition'
                    },
                    edit: {
                        title: 'Edit Condition'
                    }
                },
                inputs: {
                    duration: {
                        type: 'number',
                        label: 'Duration (0 is permanent)',
                        rule: 'tinyNumberWithZero',
                        min: 0,
                        max: 50,
                        extra: {},
                    },
                    value: {
                        type: 'number',
                        label: 'Value',
                        rule: 'tinyNumber',
                        min: 1,
                        max: 50,
                        extra: {},
                    },
                    reduce: {
                        type: 'choice',
                        label: "Reduce value at turn end",
                        choices: ['false','true'],
                    },
                    floor: {
                        type: 'choice',
                        label: "Can't reduce past 1",
                        choices: ['false','true'],
                    },
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}) {
            if (!!this.$refs && !!this.$refs.dialog) {
                if (!!options) {
                    options.reduce = !!options.reduce ? 1 : 0
                    options.floor = !!options.floor ? 1 : 0
                    options.duration = !!options.duration ? options.duration : 0
                    options.value = !!options.value ? options.value : 0

                    const type = this.$rsd.format.capitalize(options.type)
                    this.tmpl.labels.new.title = 'Add ' + type
                    this.tmpl.labels.edit.title = 'Edit ' + type
                }

                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options, true)
            }
        },
        add(options) {
            options.reduce = !!options.reduce
            options.floor = !!options.floor

            if (!!options && !!options.type && !!options.value && (!!options.duration || options.duration == 0) && !!options.affected && options.affected.length > 0) {
                options.affected.forEach(a => {
                    if (!!a && !!a.id) {
                        let data = {type: options.type, value: options.value, duration: options.duration}

                        if (!!options.reduce) { data.reduce = true }
                        if (!!options.floor) { data.floor = true }

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
            options.reduce = !!options.reduce
            options.floor = !!options.floor

            if (!!options && !!options.type && !!options.id && !!options.value && (!!options.duration || options.duration == 0) && (!!options._key || options._key == 0)) {
                let data = {id: options.id, type: options.type, value: options.value, duration: options.duration}

                if (!!options.reduce) { data.reduce = true }
                if (!!options.floor) { data.floor = true }

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