<template>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
    >
        <template v-for="(input, index) in tmpl.inputs">
            <v-row :key="index" v-if="!input.hidden && (input.type != 'text' && input.type != 'progress')" v-show="checkStepper(input)" class="my-n3">
                <v-col v-if="!!SMDown" v-show="checkStepper(input)" cols=12 class="mt-n1 mb-n3">
                    <span class="text-body-2 font-weight-medium">{{input.label}}</span>
                </v-col>
                <v-col cols=5 class="d-none d-sm-inline text-right mt-2" v-else>
                    <v-icon v-if="!!input.picon">{{input.picon}}</v-icon>
                    <span 
                        v-if="input.type != 'button'" 
                        class="text-body-2 font-weight-medium"
                        :class="!!input.class ? input.class : ''"
                    >{{input.label}}</span>
                    <v-icon v-if="!!input.aicon">{{input.aicon}}</v-icon>
                </v-col>
                <v-col cols=12 md=7 class="d-flex align-center pb-0 mb-n4">
                    <v-text-field
                        v-if="input.type == 'string'"
                        v-show="checkStepper(input)"
                        :id="!!tmpl.name ? `${tmpl.name}-${index}` : null"
                        :value="options[index]"
                        :key="'field-'+index"
                        :rules="input.rule ? rules[input.rule] : []"
                        :counter="!!input.counter ? input.counter : null"
                        :class="input.rule ? 'mb-3' : ''"
                        @focus="$event.target.select()"
                        @input="change(index, $event)"
                        :required="!!input.required"
                        :disabled="getDisabled(input)"
                        dense
                        outlined
                    ></v-text-field>
                    <v-textarea
                        v-else-if="input.type == 'textarea'"
                        v-show="checkStepper(input)"
                        :id="!!tmpl.name ? `${tmpl.name}-${index}` : null"
                        :value="options[index]"
                        :key="'field-'+index"
                        :rules="input.rule ? rules[input.rule] : []"
                        :counter="!!input.counter ? input.counter : null"
                        @focus="$event.target.select()"
                        @input="change(index, $event)"
                        :required="!!input.required"
                        :disabled="getDisabled(input)"
                        dense
                        outlined
                    ></v-textarea>
                    <v-select
                        v-else-if="input.type == 'select'"
                        v-show="checkStepper(input)"
                        :id="!!tmpl.name ? `${tmpl.name}-${index}` : null"
                        :value="options[index]"
                        :key="'field-'+index"
                        :required="!!input.required"
                        :items="input.items"
                        :disabled="getDisabled(input)"
                        @change="change(index, $event)"
                        dense
                        outlined
                    >
                    </v-select>
                    <v-autocomplete
                        v-else-if="input.type == 'autocomplete'"
                        v-show="checkStepper(input)"
                        :id="!!tmpl.name ? `${tmpl.name}-${index}` : null"
                        :value="options[index]"
                        :key="'field-'+index"
                        :required="!!input.required"
                        :items="input.items"
                        :disabled="getDisabled(input)"
                        @input="change(index, $event)"
                        dense
                        outlined
                    >
                    </v-autocomplete>
                    <v-autocomplete
                        v-else-if="input.type == 'gicons'"
                        v-show="checkStepper(input)"
                        :id="!!tmpl.name ? `${tmpl.name}-${index}` : null"
                        :value="options[index]"
                        :key="'field-'+index"
                        :required="!!input.required"
                        :items="input.items"
                        :disabled="getDisabled(input)"
                        @input="change(index, $event)"
                        dense
                        outlined
                    >
                        <template v-slot:selection="{ item }">
                            <span v-text="item"></span>
                            <span 
                                class="ml-1 gi-icon black"
                                :style="GameIcons.get.style(item, {r:0, g:0, b:0, a:255})"
                            ></span>
                        </template>
                        <template v-slot:item="{ item }">
                            <v-list-item-content>
                                <v-list-item-title>{{item}}</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <span 
                                    class="gi-icon black"
                                    :style="GameIcons.get.style(item, {r:0, g:0, b:0, a:255})"
                                ></span>
                            </v-list-item-action>
                        </template>
                    </v-autocomplete>
                    <v-btn-toggle
                        v-else-if="input.type == 'choice'"
                        v-show="checkStepper(input)"
                        :id="!!tmpl.name ? `${tmpl.name}-${index}` : null"
                        :value="options[index]"
                        :key="'field-'+index"
                        class="d-flex flex-grow-1"
                        :class="!!MDUp ? 'mt-n5' : 'mt-n3 mb-8'"
                        @change="change(index, $event)"
                        dense
                        outlined
                        mandatory
                    >
                        <template v-for="(choice, cindex) in input.choices">
                            <v-btn
                                small
                                :key="'choice-'+cindex"
                                class="flex-grow-1"
                                :disabled="getDisabled(input)"
                            >{{choice}}</v-btn>
                        </template>
                    </v-btn-toggle>
                    <v-color-picker
                        v-else-if="input.type == 'color'"
                        v-show="checkStepper(input)"
                        :id="!!tmpl.name ? `${tmpl.name}-${index}` : null"
                        :value="options[index]"
                        :key="'field-'+index"
                        :disabled="getDisabled(input)"
                        @input="change(index, $event)"
                        hide-inputs
                        mode="rgba"
                    >
                    </v-color-picker>
                    <v-text-field
                        v-else-if="input.type == 'number' && !!MDUp"
                        v-show="checkStepper(input)"
                        :id="!!tmpl.name ? `${tmpl.name}-${index}` : null"
                        :value="options[index]"
                        :key="'field-'+index"
                        :required="!!input.required"
                        :rules="input.rule ? rules[input.rule] : []"
                        type="number"
                        @focus="$event.target.select()"
                        @input="change(index, $event)"
                        :disabled="getDisabled(input)"
                        dense
                        outlined
                    ></v-text-field>
                    <v-btn
                        v-else-if="input.type == 'number' && !MDUp"
                        v-show="checkStepper(input)"
                        :id="!!tmpl.name ? `${tmpl.name}-${index}` : null"
                        :key="'field-'+index"
                        :required="!!input.required"
                        :disabled="getDisabled(input)"
                        class="mb-6"
                        style="width: 100%;"
                        @click="input.extra.visible = true"
                        dense
                        outlined
                    >{{options[index] || 'Select'}}</v-btn>
                    <v-text-field
                        v-else-if="input.type == 'numberfield'"
                        v-show="checkStepper(input)"
                        :id="!!tmpl.name ? `${tmpl.name}-${index}` : null"
                        :value="options[index]"
                        :key="'field-'+index"
                        :required="!!input.required"
                        :rules="input.rule ? rules[input.rule] : []"
                        type="number"
                        @focus="$event.target.select()"
                        @input="change(index, $event)"
                        :disabled="getDisabled(input)"
                        dense
                        outlined
                    ></v-text-field>
                    <v-slider
                        v-else-if="input.type == 'slider'"
                        v-show="checkStepper(input)"
                        :id="!!tmpl.name ? `${tmpl.name}-${index}` : null"
                        :value="options[index]"
                        :key="'field-'+index"
                        :class="!!MDUp ? 'mt-1 slider-offset' : 'mt-n3 slider-offset'"
                        :min="input.min ? input.min : 0"
                        :max="input.max ? input.max : 100"
                        :step="input.stepSize ? input.stepSize : 1"
                        :disabled="getDisabled(input)"
                        :label="!!options[index] || options[index] == 0 ? options[index].toString() : ''"
                        @input="change(index, $event)"
                        inverse-label
                        dense
                        outlined
                    >
                    </v-slider>
                    <v-btn
                        v-else-if="input.type == 'button'"
                        v-show="checkStepper(input)"
                        @click="click(input.click)"
                        :disabled="getDisabled(input)"
                        class="mt-n2 mb-6"
                        style="width: 100%;"
                        dense
                        outlined
                    >
                        {{input.label}}
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :key="index" v-else-if="!input.hidden && input.type == 'text'" v-show="checkStepper(input)" >
                <v-col cols=12 class="mb-0 pb-0">
                    <span 
                        class="text-body-2 font-weight-black" 
                        v-if="!!input.header"
                    >{{input.header}}</span>
                    <span 
                        class="text-body-2 font-weight-medium" 
                        v-if="!!input.text"
                    >{{input.text}}</span>
                    <span 
                        class="text-body-2 font-weight-medium" 
                        v-if="!!input.html"
                        v-html="$sanitize(input.html)"
                    ></span>
                </v-col>
            </v-row>
            <v-row :key="index" v-else-if="!input.hidden && input.type == 'progress'" v-show="checkStepper(input)">
                <v-col cols=12 class="mb-4 pb-0">
                    <span class="" v-show="!!input.label" v-html="$sanitize(input.label)"></span>
                    <v-progress-linear
                        v-show="!!input.value"
                        color="primary"
                        height="10"
                        :value="input.value"
                    ></v-progress-linear>
                </v-col>
            </v-row>
            <v-bottom-sheet
                v-if="input.type == 'number'"
                :key="'bottom-sheet-'+index" 
                v-model="input.extra.visible"
            >
                <v-sheet
                    class="text-center"
                    height="250px"
                >
                    <v-btn
                        class="mt-6 float-left"
                        text
                        color="red"
                        @click="input.extra.visible = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        class="mt-6 float-right"
                        text
                        color="green"
                        @click="saveNumberPicker(index, input)"
                    >
                        Confirm
                    </v-btn>
                    <div class="py-2">
                        <Picker :options="input.extra.items" v-model="input.extra.current" />
                    </div>
                </v-sheet>
            </v-bottom-sheet>
        </template>
    </v-form>
</template>

<script>
import Picker from 'vue-wheel-picker';

export default {
    components: {
        Picker,
    },
    data() {
        return {
            bottomSheets: [],
            focus: {},
            rules: {
                levelNumber: [
                    v => (typeof(Number(v)) == 'number') || 'This should be a number.',
                    v => v >= 1 && v <= 20 || 'Must be between 1 and 20'
                ],
                statNumber: [
                    v => (typeof(Number(v)) == 'number') || 'This should be a number.',
                    v => v >= 8 && v <= 21 || 'Must be between 8 and 21'
                ],
                basicStatNumber: [
                    v => (typeof(Number(v)) == 'number') || 'This should be a number.',
                    v => v >= 5 && v <= 30 || 'Must be between 5 and 30'
                ],
                tinyNumber: [
                    v => (typeof(Number(v)) == 'number') || 'This should be a number.',
                    v => (v >= 1 && v <= 50 && v && v.toString().length > 0) || 'Must be between 1 and 50'
                ],
                smallNumber: [
                    v => (typeof(Number(v)) == 'number') || 'This should be a number.',
                    v => (v >= 1 && v <= 100 && v && v.toString().length > 0) || 'Must be between 1 and 100'
                ],
                mediumNumber: [
                    v => (typeof(Number(v)) == 'number') || 'This should be a number.',
                    v => (v >= 1 && v <= 200 && v && v.toString().length > 0) || 'Must be between 1 and 200'
                ],
                largeNumber: [
                    v => (typeof(Number(v)) == 'number') || 'This should be a number.',
                    v => (v >= 1 && v <= 1000 && v && v.toString().length > 0) || 'Must be between 1 and 1000'
                ],
                partysizeNumber: [
                    v => (typeof(Number(v)) == 'number') || 'This should be a number!',
                    v => (v >= 1 && v <= 10 && v.toString().length > 0) || 'Must be between 1 and 10'
                ],
                initiativeNumber: [
                    v => (typeof(Number(v)) == 'number') || `This should be a number!`,
                    v => (v != null && v >= -1 && v <= 100 && v.toString().length > 0) || 'Must be between -1 and 100'
                ],
                tinyNumberWithZero: [
                    v => (typeof(Number(v)) == 'number') || `This should be a number. ${v}`,
                    v => v >= 0 && v <= 50 || 'Must be between 1 and 50'
                ],
                tinyNumberWithNegative: [
                    v => (typeof(Number(v)) == 'number') || `This should be a number. ${v}`,
                    v => v >= -2 && v <= 50 || 'Must be between -2 and 50'
                ],
                name: [
                    v => !!v || 'Name is required',
                    v => (v && v.length <= 30) || 'Must be smaller or equal than 30 characters'
                ],
                uniqueid: [
                    v => (!v || !!v && v.length <= 30) || 'Must be smaller or equal than 30 characters'
                ],
                alertTitle: [
                    v => (!v || !!v && v.length <= 120) || 'Must be smaller or equal than 20 characters'
                ],
                alertRule: [
                    v => !!v || 'Description is required',
                    v => (v && v.length <= 120) || 'Must be smaller or equal than 120 characters'
                ],
            },
            valid: false,
        }
    },
    props: {
        options: Object,
        tmpl: Object,
        stepper: Number,
    },
    methods: {
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
        change(index, event) {
            this.$emit('change', {index: index, state: event})
        },
        click(click) {
            this.$emit('click', {function: click})
        },
        checkStepper(input) {
            return (!!input.step || input.step == 0) && (!!this.stepper || this.stepper == 0)?  input.step == this.stepper : true
        },
        validate() {
            this.$refs.form.validate()
            return this.valid
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },
        updateNumber(index, event, updateSlider) {
            if (!!this.$refs) {
                if (!!updateSlider && !!this.$refs['slider-'+index]) {
                    this.$refs['slider-field-'+index].value = event
                } else if (!!this.$refs['slider-field-'+index]) {
                    this.$refs['slider-field-'+index].value = event
                }
            }
        },
        saveNumberPicker(index, input) {
            console.log(index, input, this.options)
            if ((!!this.options[index] || this.options[index] == 0) && !!input) {
                if (input.extra.current.value >= input.min && input.extra.current.value <= input.max) {
                    this.options[index] = input.extra.current.value
                }
                input.extra.visible = false
            }
        },
    }
}
</script>

<style scoped>
.row + .row {
    margin-top: 0;
}
div >>> ul.picker_chosen_list {
    padding-left: 0;
}
div >>> .picker {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    max-width: 50%;
    height: 200px;
    margin: 16px auto 0;
    background-color: #F8F8FA;
    border-radius: 4px;

    text-align: center;
    font-size: 18px;
    color: #bbbcc9;
}

div >>> .picker_chosen {
    background-color: #F8F8FA;
    border-top: 1px solid #dddde4;
    border-bottom: 1px solid #dddde4;
    color: #121212;
    font-size: 20px;
}
</style>