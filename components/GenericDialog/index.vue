<template>
    <v-dialog
        v-model="shown"
        :fullscreen="SMDown"
        :hide-overlay="!SMDown"
        ref="dialog"
        max-width="600"
        :content-class="!!minimize ? 'width-fit-content' : null"
        persistent
        no-click-animation
        @keydown.esc="close"
    >
        <v-card>
            <v-card-title class="text-h6 main lighten-1 py-1 white--text popup-header" :id="!!tmpl.name ? `${tmpl.name}_titlebar` : null" :class="!!tmpl.class ? tmpl.class : ''">
                <span class="noselect v-card__span">{{getLabel('title')}}<br v-show="XSOnly" /><span v-show="SMUp && !!getLabel('subtitle', '')"> - </span>{{getLabel('subtitle', '')}}</span>
                <v-spacer></v-spacer>
                <v-btn
                    v-show="!SMDown"
                    color="white"
                    icon 
                    tile
                    @click="minimize = !minimize"
                >
                    <v-icon>{{!minimize ? 'mdi-minus' : 'mdi-plus'}}</v-icon>
                </v-btn>
                <v-btn
                    color="white"
                    icon 
                    tile
                    @click="close"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-expand-transition>
                <div v-show="!minimize">
                    <v-card-text class="py-8" style="overflow-y: auto;" :style="!!SMDown ? 'max-height: 85vh;' : 'max-height: 60vh;'">
                        <template v-if="!!tmpl.steps && !!tmpl.steps.enabled">
                            <v-stepper v-model="stepper">
                                <v-stepper-header>
                                    <template v-for="(sv, si) in tmpl.steps.items">
                                        <v-stepper-step
                                            :complete="stepper > si"
                                            :step="si"
                                            :key="'dialog-step-'+si"
                                        >
                                            {{sv}}
                                        </v-stepper-step>

                                        <v-divider :key="'dialog-divider-'+si" v-if="si != tmpl.steps.items.length-1"></v-divider>
                                    </template>
                                </v-stepper-header>
                                <v-stepper-items>
                                    <template v-for="(sv, si) in tmpl.steps.items">
                                        <v-stepper-content :step="si" :key="'dialog-step-content-'+si">
                                            <FormComponent
                                                :ref="'form-'+si"
                                                class="pa-4"
                                                :options="options" 
                                                :tmpl="tmpl"
                                                :stepper="si"
                                                @change="formChange"
                                                @click="formClick"
                                            />
                                        </v-stepper-content>
                                    </template>
                                </v-stepper-items>
                            </v-stepper>
                        </template>
                        <template v-else>
                            <FormComponent
                                ref="form"
                                :options="options" 
                                :tmpl="tmpl"
                                @change="formChange"
                                @click="formClick"
                            />
                        </template>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions v-if="tmpl.noButton === null || tmpl.noButton !== false">
                        <v-btn
                            v-if="!tmpl.steps || (!!tmpl.steps && !!tmpl.steps.enabled && stepper >= tmpl.steps.items.length-1)"
                            color="green darken-1 white--text"
                            :id="!!tmpl.name ? `${tmpl.name}_finish-button` : null"
                            class="my-2"
                            :class="getSaveButtonWidth()"
                            :disabled="allRequired"
                            @click="finish"
                        >
                            {{getLabel('button')}}
                        </v-btn>
                        <v-btn
                            v-if="!!tmpl.steps && !!tmpl.steps.enabled && stepper < tmpl.steps.items.length-1"
                            color="green darken-1 white--text"
                            class="my-2"
                            :class="getSaveButtonWidth()"
                            :disabled="allRequired"
                            @click="nextStep"
                        >
                            {{!!tmpl.steps.nextCheck && tmpl.steps.nextCheck(options) || !tmpl.steps.nextCheck
                            ? getLabel('next', 'Next') : getLabel('cancel', 'Cancel')}}
                        </v-btn>
                        <v-spacer v-if="!!tmpl.copyButton || !!tmpl.cutButton || !!tmpl.removeButton"></v-spacer>
                        <v-btn
                            v-if="!!tmpl.copyButton"
                            color="green darken-1 white--text"
                            class="col-1 my-2"
                            @click="copy"
                        ><v-icon>mdi-content-copy</v-icon></v-btn>
                        <v-btn
                            v-if="!!tmpl.cutButton"
                            color="blue darken-1 white--text"
                            class="col-1 my-2"
                            @click="cut"
                        ><v-icon>mdi-content-cut</v-icon></v-btn>
                        <v-btn
                            v-if="!!tmpl.removeButton"
                            color="red darken-1 white--text"
                            class="col-1 my-2"
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

import FormComponent from './FormComponent'

const dialogSelector = '.v-dialog.v-dialog--active';

export default {
    components: {
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
            minimize: false,
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

            this.minimize = false
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
            if (!!this.tmpl.steps && !!this.tmpl.steps.enabled) {
                let validated = true
                this.tmpl.steps.items.forEach((sv, si) => {
                    if (!!this.$refs['form-'+si] && this.$refs['form-'+si].length > 0) {
                        validated = validated && this.$refs['form-'+si][0].validate()
                    }
                })
                return validated
            } else if (!!this.$refs['form'] && !!this.$refs.form.validate) { 
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
            this.minimize = false
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
        formClick(event) {
            if (!!event && !!event.function) {
                event.function()
            }
        },
        nextStep() {
            if (!!this.tmpl && !!this.tmpl.steps && (!!this.tmpl.steps.nextCheck && this.tmpl.steps.nextCheck(this.options) || !this.tmpl.steps.nextCheck)) {
                this.stepper += 1
            } else {
                this.close()
            }
            // console.log("nextStep", !!this.tmpl.steps.nextCheck, this.tmpl.steps.nextCheck())
            // this.stepper += 1
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
        setOption(index, value) {
            if (!!index && (!!value || value === 0)) {
                this.options[index] = value
            }
        },
    }
}
</script>

<style scoped>
.slider-offset > .v-input__control > .v-input__slot {
    margin-top: 20px !important;
}
@media (min-width: 600px) {
    .slider-offset > .v-input__control > .v-input__slot {
        margin-top: 8px !important;
    }
}
.slider-label {
    position: absolute;
    left: 12px;
    top: -20px;
    width: 80vw !important;
    max-width: 80vw !important;
}
.width-fit-content {
    width: fit-content !important;
}
.v-dialog.v-dialog--active .popup-header {
    cursor: grab;
}

.v-dialog.v-dialog--active .popup-header:active {
    cursor: grabbing;
}
</style>