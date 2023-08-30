<template>
    <BaseDialog 
        ref="dialog" 
        :tmpl="tmpl"
        @Add="add"
        @Save="save"
        @Remove="remove"
        >
        <template v-slot:append-slot>
            <div v-show="!!isImmune" class="pt-3 red--text font-weight-medium">
                <span>Note, this creature is immune to being {{ type }}.</span>
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
            type: '',
            tmpl: {
                removeButton: true,
                name: 'condition-duration-dialog',
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
                }
            }
        }
    },
    methods: {
        show(edit = false, options = {}, extra = {}) {
            if (!!this.$refs && !!this.$refs.dialog) {
                this.isImmune = extra.immune || false

                if (!!options) {
                    options.duration = !!options.duration ? options.duration : 0

                    const type = this.$rsd.format.capitalize(options.type)
                    this.tmpl.labels.new.title = 'Add ' + type
                    this.tmpl.labels.edit.title = 'Edit ' + type

                    this.type = options.type
                }
                this.$refs.dialog.setupNumbers(this.tmpl.inputs, options)
                this.$refs.dialog.show(edit, options, true)
            }
        },
        add(options) {
            if (!!options && !!options.type && (!!options.duration || options.duration == 0) && !!options.affected && options.affected.length > 0) {
                options.affected.forEach(a => {
                    if (!!a && !!a.id) {
                        const data = {type: options.type, duration: options.duration}
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
            if (!!options && !!options.type && !!options.id && (!!options.duration || options.duration == 0) && (!!options._key || options._key == 0)) {
                const data = {id: options.id, type: options.type, duration: options.duration}
                
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