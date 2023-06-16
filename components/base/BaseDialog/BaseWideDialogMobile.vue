<template>
    <v-dialog
        v-model="shown"
        :fullscreen="SMDown"
        ref="dialog"
        max-width="900"
        content-class="rounded-0"
        persistent
        no-click-animation
        :transition="''"
        @keydown.esc="close"
    >
        <v-card :tile="true">
            <v-card-title class="text-h5 py-1" :id="!!tmpl.name ? `${tmpl.name}_titlebar` : null" :class="!!tmpl.class ? tmpl.class : ''">
                <span class="noselect">{{getLabel('title')}}<br v-show="XSOnly" /><span v-show="SMUp && !!getLabel('subtitle', '')"> - </span>{{getLabel('subtitle', '')}}</span>
                <slot name="title-bar"></slot>
                <v-spacer></v-spacer>
                <v-btn
                    icon 
                    tile
                    @click="close"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-expand-transition>
                <div class="mx-2">
                    <v-card-text class="alt-scrollbar" :class="`card-container-mobile ${!!tmpl.overflow ? tmpl.overflow : 'overflow-auto'}`">
                        <div v-show="!tmpl.overlay">
                            <slot name="prepend-slot"></slot>
                            <FormComponent
                                ref="form"
                                :options="options" 
                                :tmpl="tmpl"
                                @change="formChange"
                                @select="formSelect"
                                @click="formClick"
                            />
                            <slot name="append-slot"></slot>
                        </div>
                        <div v-show="!!tmpl.overlay">
                            <div class="d-flex justify-start align-center mb-5" :style="'width: 100%;'">
                                <div>
                                    <v-btn icon small tile class="primary--text"
                                        @click="!!tmpl.overlay_back ? tmpl.overlay_back($event) : null"
                                    >
                                        <v-icon>mdi-chevron-left</v-icon>
                                    </v-btn>
                                </div>
                                <v-spacer></v-spacer>
                                <div>
                                    <v-btn small icon class="mr-3"
                                        @click="!!tmpl.overlay_left ? tmpl.overlay_left($event) : null"
                                    >
                                        <v-icon>mdi-arrow-left-drop-circle-outline</v-icon>
                                    </v-btn>
                                    <span>navigation</span>
                                    <v-btn small icon class="ml-3"
                                        @click="!!tmpl.overlay_right ? tmpl.overlay_right($event) : null"
                                    >
                                        <v-icon>mdi-arrow-right-drop-circle-outline</v-icon>
                                    </v-btn>
                                </div>
                            </div>
                            <BaseSheetTitle :title="!!tmpl && !!tmpl.overlay_title ? tmpl.overlay_title : ''" :type="!!tmpl && !!tmpl.overlay_type ? tmpl.overlay_type : ''" />
                            <slot name="slot-right"></slot>
                        </div>
                    </v-card-text>
                    <v-card-actions v-if="tmpl.noButton === null || tmpl.noButton !== false" class="px-4 d-flex justify-end">
                        <v-btn
                            v-if="!tmpl.hideFinish"
                            color="green darken-1 white--text"
                            :id="!!tmpl.name ? `${tmpl.name}_finish-button` : null"
                            class="my-2 px-4"
                            tile
                            :disabled="allRequired"
                            @click="finish"
                        >
                            {{getLabel('button')}}
                        </v-btn>
                        <v-btn
                            outlined
                            class="my-2 px-4"
                            tile
                            @click="close"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            v-if="!!this.edit && !!tmpl.removeButton"
                            color="red darken-1 white--text"
                            tile
                            outlined
                            class="my-2"
                            @click="remove"
                        ><v-icon>mdi-trash-can-outline</v-icon></v-btn>
                    </v-card-actions>
                </div>
            </v-expand-transition>
        </v-card>
    </v-dialog>
</template>

<script>
/*

:: Example of data tree

partyDialogT: {
    labels: {
        new: {
            title: 'Create party'
        },
        edit: {
            title: 'Edit party'
        }  
    },
    inputs: {
        header: {
            header: "This is a header",
            type: 'text',
        },
        name: {
            label: "Party name",
            type: "string",
            counter: 30,
            required: true,
            rule: 'name',
        },
        team: {
            label: "Team",
            type: "string",
            required: true,
        },
        choice: {
            label: "Make a choice",
            choices: [
                'Choice a',
                'Choice b',
            ],
            type: "choice",
        },
        str: {
            label: "This is a number",
            type: "number",
        }
    }
}

*/

import BaseSheetTitle from '../BaseSheetTitle'
import FormComponent from './FormComponent'

const dialogSelector = '.v-dialog.v-dialog--active';

export default {
    components: {
        BaseSheetTitle,
        FormComponent,
    },
    data() {
        return {
            allRequired: false,
            edit: false,
            options: {},
            stepper: 0,
            shown: false,
            valid: true,
        }
    },
    mounted() {
        // this.activateMultipleDraggableDialogs();
        if (!!this.tmpl) {
            Object.keys(this.tmpl.inputs).forEach(k => {
                this.options[k] = ''
            })
        }
    },
    computed: {
    },
    props: {
        tmpl: Object,
        current: Object,
    },
    methods: {
        show(edit = false, options = null, prefill = false) {
            this.edit = edit
            if ((!!edit && !!options) || (!!prefill && !!options)) {
                this.options = {...options}
            }
            if (!!this.$refs) {
                this.resetValidation()
            }
            this.valid = true
            this.shown = true
            this.stepper = 0

            this.resetDialogPosition()

            this.setAllRequired()
        },
        close(event) {
            Object.keys(this.options).forEach(o => {
                if (!!o && !!this.options[o]) {
                    this.options[o] = null
                }
            })

            this.$emit('Close')

            this.valid = true
            this.resetValidation()

            this.shown = false
            this.stepper = 0

            setTimeout(() => {
                this.resetDialogPosition()
            }, 150)
        },
        finish() {
            if (this.validate()) {
                this.process()

                if (this.edit) {
                    this.$emit('Save', {...this.options})
                } else {
                    this.$emit('Add', {...this.options})
                }
                this.close()
            }
        },
        validate() {
            if (!!this.$refs['form'] && !!this.$refs.form.validate) { 
                return this.$refs.form.validate() 
            }
        },
        resetValidation() {
            if (!!this.$refs) {

                Object.values(this.$refs).forEach(r => {
                    if (!!r && r.length > 0 && !!r[0] && !!r[0].resetValidation) {
                        r[0].resetValidation()
                    } else if (!!r && !!r.resetValidation) {
                        r.resetValidation()
                    }
                })
            }
        },
        resetDialogPosition() {
            if (!!this.$refs && !!this.$refs.dialog && !!this.$refs.dialog.$children && !!this.$refs.dialog.$children.length > 0) {
                if (!!this.$refs.dialog.$children[0].$el && !!this.$refs.dialog.$children[0].$el.childNodes && !!this.$refs.dialog.$children[0].$el.childNodes[0]) {
                    this.$refs.dialog.$children[0].$el.childNodes[0].style.left = null
                    this.$refs.dialog.$children[0].$el.childNodes[0].style.top = null
                }
            }
        },
        copy() {
            this.process()
            this.$emit('Copy', {...this.options})
            this.close()
        },
        cut() {
            this.process()
            this.$emit('Cut', {...this.options})
            this.close()
        },
        remove() {
            this.process()
            this.$emit('Remove', {...this.options})
            this.close()
        },
        process() {
            Object.keys(this.options).forEach(k => {
                if (!!k && !!this.options[k]) {
                    if (!!this.tmpl.inputs[k]) {
                        switch(this.tmpl.inputs[k].type) {
                            case 'number':
                                this.options[k] = Number(this.options[k])
                                break;
                            case 'color':
                                if (!!this.options[k] && !!this.options[k].rgba) {
                                    this.options[k] = {...this.options[k].rgba}
                                }
                                break;
                        }
                    }
                }
            })
        },
        formChange(event) {
            if (!!event && !!event.index && (!!event.state || event.state == 0) && !!this.options) {
                this.options[event.index] = event.state
                this.onChangeEvent()
            }
        },
        formSelect(event) {
            if (!!event && !!event.index && !!event.item && !!this.options) {
                this.options[event.index] = event.item
                this.onSelectEvent()
            }
        },
        formClick(event) {
            if (!!event && !!event.function) {
                event.function()
            }
        },
        getLabel(label, default_label = null) {
            if (!!label && !!this.tmpl && !!this.tmpl.labels) {
                if (!!this.edit) {
                    return !!this.tmpl.labels.edit && !!this.tmpl.labels.edit[label] ? this.tmpl.labels.edit[label] : (!!default_label || default_label == '' ? default_label : 'Save')
                } else {
                    return !!this.tmpl.labels.new && !!this.tmpl.labels.new[label] ? this.tmpl.labels.new[label] : (!!default_label || default_label == '' ? default_label : 'Create')
                }
            } else {
                return (!!default_label ? default_label : 'Create')
            }
        },
        getDisabled(input) {
            if (!!input.locked) { return !!input.locked }

            if (!!input.disabled) {
                if (!!input.disabled.empty && this.options[input.disabled.input] === '') { return true }
                
                if (!!this.options[input.disabled.input] || this.options[input.disabled.input] === 0) {
                    if (!!input.disabled.value || input.disabled.value === 0) {
                        return this.options[input.disabled.input] === input.disabled.value 
                    }
                    if (!!input.disabled.notvalue || input.disabled.notvalue === 0) {
                        return this.options[input.disabled.input] !== input.disabled.notvalue
                    }
                }
            }
            return false
        },
        getSaveButtonWidth() {
            let default_width = 12
            if (!!this.tmpl.removeButton) {
                default_width-=2
            }
            if (!!this.tmpl.cutButton && !!this.tmpl.copyButton) {
                default_width-=3
            } else if (!!this.tmpl.cutButton || !!this.tmpl.copyButton) {
                default_width-=2
            }
            return `col-${default_width}`
        },
        // getAllRequired() {
        //     let allRequiredFilled = true
        //     if (!!this.tmpl.inputs && !!Object.values(this.tmpl.inputs).length > 0) {
        //         Object.keys(this.tmpl.inputs).forEach(ik => {
        //             let iv = this.tmpl.inputs[ik]
                    
        //             if (!!iv.required && !this.options[ik]) {
        //                 if (!!this.tmpl.labels.new && !!this.tmpl.labels.new.title && this.tmpl.labels.new.title == 'New alert') {
        //                     console.log(ik, iv, this.options)
        //                 }
        //                 allRequiredFilled = false
        //             }
        //         })
        //     }

        //     return !allRequiredFilled
        // },
        setupNumbers(inputs, options) {
            Object.keys(inputs).forEach(key => {
                let curInput = inputs[key]
                if (curInput.type == 'number') {
                    // console.log(key, curInput)
                    curInput.extra = {
                        items: this.Format.numberValueTextArray(curInput.min, curInput.max, curInput.stepSize || 1),
                        visible: false,
                    }
                    if (!!options && (!!options[key] || options[key] == 0)) {
                        curInput.extra.current = {value: options[key], text: options[key]}
                    } else {
                        curInput.extra.current = {value: curInput.min, text: curInput.min}
                    }
                }
            })
        },
        setAllRequired() {
            let allRequiredFilled = true
            if (!!this.tmpl.inputs && !!Object.values(this.tmpl.inputs).length > 0) {
                Object.keys(this.tmpl.inputs).forEach(ik => {
                    let iv = this.tmpl.inputs[ik]
                    
                    if (!!iv.required && !this.options[ik] && this.options[ik] != 0) {
                        // if (!!this.tmpl.labels.new && !!this.tmpl.labels.new.title && this.tmpl.labels.new.title == 'New alert') {
                        //     console.log(ik, !!iv.required, !this.options[ik], this.options)
                        // }
                        allRequiredFilled = false
                    }
                })
            }

            // console.log(allRequiredFilled)

            this.allRequired = !allRequiredFilled
        },
        onChangeEvent() {
            this.$emit('OnChange', this.options)
            this.setAllRequired()
        },
        onSelectEvent() {
            this.$emit('OnSelect', this.options)
            this.setAllRequired()
        },
        setOption(index, value) {
            if (!!index && (!!value || value === 0)) {
                this.options[index] = value
            }
        },
    }
}
</script>

<style lang="less" scoped>
.card-container-mobile {
    max-height: calc(~"100vh - 128px");
    height: calc(~"100vh - 128px");
}
.overflow-auto {
    overflow-y: auto;
    overflow-x: hidden;
}
.overflow-hidden {
    overflow-y: hidden;
    overflow-x: hidden;
}
</style>