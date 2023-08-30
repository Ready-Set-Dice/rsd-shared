<template>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent
    >
        <template v-for="(input, index) in tmpl.inputs">
            <v-row :key="index" v-if="!input.hidden && (input.type != 'text' && input.type != 'progress' && input.type != 'boosts' && input.type != 'skills')" v-show="checkStepper(input)" class="my-n3">
                <v-col v-show="checkStepper(input)" cols=12 class="mt-n0 mb-n3">
                    <span v-if="!!input.label" class="text-body-2 font-weight-medium">{{input.label}}:</span>
                </v-col>
                <v-col cols=12 class="d-flex align-center py-1 mb-n4">
                    <v-icon v-if="!!input.icon" class="mt-n6">{{ input.icon }}</v-icon>
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
                        @keyup.enter="submit()"
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
                        v-else-if="input.type == 'pair'"
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
                    <v-select
                        v-else-if="input.type == 'select'"
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
                    </v-select>
                    <div
                        v-else-if="input.type == 'virtual-scroll'"
                        :key="'field-'+index"
                        class="flex-grow-1"
                        :class="!!input.container_class ? input.container_class : ''"
                        style="border-width: 1px; border-style:solid; border-color: black;"
                    >
                        <v-virtual-scroll
                            :id="!!tmpl.name ? `${tmpl.name}-${index}` : null"
                            :value="options[index]"
                            :item-height="!!input.item_height ? input.item_height : '24'"
                            :bench="input.benched"
                            :items="input.items"
                            :disabled="getDisabled(input)"
                            :class="!!rsd.darkmode ? 'theme--dark' : ''"
                            class="alt-scrollbar"
                        >
                            <template v-slot:default="{ item }">
                                <v-list-item 
                                    :key="item.value" 
                                    @click="select(index, item)"
                                    class="accent-item px-2 no-overflow-text"
                                    :class="virtualScrollSelected(index, item)"
                                    :style="`min-height:${!!input.item_height ? input.item_height : '24'}px; height:${!!input.item_height ? input.item_height : '24'}px;`"
                                >
                                    <span>{{item.text}}</span>
                                    <span v-if="$rsd.format.hasActionNumber(item)" class="action">
                                        {{$rsd.format.actionNumber(item)}}
                                    </span>
                                    <span class="float-right" v-if="!!item.level">
                                        <BaseTraitChip 
                                            :border_less='true'
                                            :trait="item.level+''"
                                            :custom_class="$rsd.format.rarityColor(!!item.rarity ? item.rarity : 'common')" 
                                        />
                                    </span>
                                </v-list-item>
                            </template>
                        </v-virtual-scroll>
                    </div>
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
                        class="d-flex flex-grow-1 mb-8"
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
                        :class="!!MDUp ? 'mt-1' : 'mt-n3'"
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
                        class="text-body-2 font-weight-medium red--text" 
                        v-if="!!input.warning"
                    >{{input.warning}}</span>
                    <span 
                        class="text-body-2 font-weight-medium" 
                        v-if="!!input.html"
                        v-html="$sanitize(input.html)"
                    ></span>
                </v-col>
            </v-row>
            <v-row :key="index" v-else-if="!input.hidden && input.type == 'progress'" v-show="checkStepper(input)">
                <v-col cols=12 class="mb-4 pb-0">
                    <span class="text-body-2 font-weight-medium" v-show="!!input.label" v-html="$sanitize(input.label)"></span>
                    <v-progress-linear
                        :color="!!input.color ? input.color : 'primary'"
                        height="16"
                        :value="!!input.value || input.value == 0 ? input.value : 100"
                    >
                        <span class="mr-1" v-if="!!input.health && !!input.health.hp >= 0">{{input.health.hp}}</span> 
                        <span v-if="!!input.health && input.health.temphp > 0" class="mr-1">(+{{input.health.temphp}})</span>
                        <span v-if="!!input.health && input.health.maxhp > 0">/ {{input.health.maxhp}}</span>
                    </v-progress-linear>
                </v-col>
            </v-row>
            <v-row :key="index" v-else-if="!input.hidden && input.type == 'boosts'" v-show="checkStepper(input)" >
                <v-col cols="12" class="mb-0 pb-0" v-if="!!options[index]">
                    <span class="text-body-2 font-weight-black">Free boosts ({{ 4 - options[index].length }} / 4)</span>
                </v-col>

                <template v-for="(score, sindex) in $rsd.format.scoreNamesShort" >
                    <v-col cols=12 sm=6 class="mb-0 pb-0" :key="'score-'+score">
                        <div class="d-flex flex-row justify-space-between" v-if="!!options[index]">
                            <v-simple-checkbox
                                :value="options[index].includes(score)"
                                dense
                                outlined
                                hide-details
                                :ripple="false"
                                @click="clickBoost($event, index, score)"
                            ></v-simple-checkbox>
                            <span>{{ score.toUpperCase() }}</span>
                            <span>{{ calcScoreModifier(input, sindex) }}</span>
                            <span>{{ calcScoreTotal(input, sindex) }}</span>
                        </div>
                    </v-col>
                </template>
            </v-row>
            <v-row :key="index" v-else-if="!input.hidden && input.type == 'skills'" v-show="checkStepper(input)" >
                <v-col cols="12" class="mb-0 pb-0" v-if="!!options[index]">
                    <span class="text-body-2 font-weight-black">Choose skills ({{ input.count - options[index].length }})</span>
                </v-col>

                <template v-for="(skill, sindex) in $rsd.format.skillNames" >
                    <v-col cols=12 class="mb-0 pb-0 pointer" :key="'score-'+skill" @click="clickSkill($event, index, skill, input, sindex)">
                        <v-row class="align-center" v-if="!!options[index]">
                            <v-col cols=4 class="py-1">
                                <span class="text-capitalize">{{skill}} {{!!calcSkillTotal(index, skill, input) >= 0 ? '+' : '-'}}{{calcSkillTotal(index, skill, input)}}</span>
                            </v-col>
                            <v-col cols=4 class="py-1">
                                <v-avatar :color="!!skillProficient(index, skill, input, 1) ? 'primary' : 'grey'" size="20">T</v-avatar>
                                <v-avatar :color="!!skillProficient(index, skill, input, 2) ? 'primary' : 'grey'" size="20">E</v-avatar>
                                <v-avatar :color="!!skillProficient(index, skill, input, 3) ? 'primary' : 'grey'" size="20">M</v-avatar>
                                <v-avatar :color="!!skillProficient(index, skill, input, 4) ? 'primary' : 'grey'" size="20">L</v-avatar>
                            </v-col>
                            <v-col cols=4 class="py-1">
                                <v-row>
                                    <v-col cols=4>
                                        <div class="d-flex flex-column align-center text-caption">
                                            <span class="mb-n1 text-capitalize">{{$rsd.format.skillScoreShort(skill)}}</span>
                                            <span class="mt-n1">{{!!input.scores ? (input.scores[$rsd.format.getSkillScore(skill)]-10)/2 : 0}}</span>
                                        </div>
                                        </v-col>
                                    <v-col cols=4>
                                        <div class="d-flex flex-column align-center text-caption">
                                            <span class="mb-n1 text-capitalize">Prof</span>
                                            <span class="mt-n1">{{!!skillProficient(index, skill, input, 1) ? calcSkillProf(index, skill, input) : 0}}</span>
                                        </div>
                                    </v-col>
                                    <v-col cols=4>
                                        <div class="d-flex flex-column align-center text-caption">
                                            <span class="mb-n1 text-capitalize">Item</span>
                                            <span class="mt-n1">0</span>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>
                </template>
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
import BaseTraitChip from '@root/.shared/components/base/BaseTraitChip'
import Picker from 'vue-wheel-picker';

export default {
    components: {
        BaseTraitChip,
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
                largeNumberWithZero: [
                    v => (typeof(Number(v)) == 'number') || 'This should be a number.',
                    v => v >= 0 && v <= 1000 || 'Must be between 0 and 1000'
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
                    v => v >= 0 && v <= 50 || 'Must be between 0 and 50'
                ],
                tinyNumberWithNegative: [
                    v => (typeof(Number(v)) == 'number') || `This should be a number. ${v}`,
                    v => v >= -2 && v <= 50 || 'Must be between -2 and 50'
                ],
                name: [
                    v => !!v || 'Name is required',
                    v => (v && v.length <= 30) || 'Must be smaller or equal than 30 characters'
                ],
                note: [
                    v => (!v || !!v && v.length <= 128) || 'Must be smaller or equal than 128 characters'
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
        select(index, item) {
            this.$emit('select', {index: index, item: item.value})
        },
        submit() {
            this.$emit('submit')
        },
        checkStepper(input) {
            return (!!input.step || input.step == 0) && (!!this.stepper || this.stepper == 0)?  input.step == this.stepper : true
        },
        validate() {
            this.$refs.form.validate()
            return this.valid
        },
        resetValidation() {
            if (!!this.$refs && !!this.$refs.form) {
                this.$refs.form.resetValidation()
            }
        },
        virtualScrollSelected(index, item) {
            let classes = !!this.options[index] && this.options[index] == item.value
            ? 'accent-selected ' : ''
            classes += !!this.rsd.darkmode ? 'theme--dark' : ''

            if (!!this.options && !!this.options.level && !!item.level && item.level > this.options.level) {
                classes += ' red--text text--darken-4'
            } else if (!item.allowed && typeof(item.allowed) == 'boolean') {
                classes += ' red--text text--darken-4'
            }
            
            return classes
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
            // console.log(index, input, this.options)
            setTimeout(() => {
                if ((!!this.options[index] || this.options[index] == 0) && !!input) {
                    if (input.extra.current.value >= input.min && input.extra.current.value <= input.max) {
                        this.options[index] = input.extra.current.value
                    }
                    input.extra.visible = false
                }
            }, 300)
            
        },
        clickBoost(event, index, score) {
            if (!!this.options[index] && this.options[index].length > 0) {
                if (!!this.options[index].includes(score)) {
                    const findex = this.options[index].findIndex(i => i == score)
                    this.options[index].splice(findex, 1)
                } else if (this.options[index].length < 4) {
                    this.options[index].push(score)
                }
            } else if (this.options[index].length < 4) {
                this.options[index].push(score)
            }
        },
        calcScoreModifier(input, score_index) {
            if (!!input && !!input.scores && (!!score_index || score_index == 0)) {
                // console.log('input', input, score, this.options)
                const score = this.calcScoreTotal(input, score_index)
                const modifier = Math.floor((score - 10)/2)
                return modifier >= 0 ? '+'+modifier : '-'+modifier
            }
        },
        calcScoreTotal(input, score_index) {
            if (!!input && !!input.scores && (!!score_index || score_index == 0)) {
                // console.log('input', input, score, this.options)
                const score_array = this.$rsd.build.getCalculatedScoresArray(input.scores, input.template, this.options)
                return score_array[score_index]
            }
        },
        clickSkill(event, index, skill, input, skill_index) {
            // level 1 only trained
            // above 1 expert
            // above 7 master
            // above 15 legendary
            // console.log(this.options[index], skill, input)
            if (!!input && !!skill, (!!index || index == 0) && !!this.options && !!this.options.level) {
                let allowed = true
                const shortName = skill.substr(0,3)

                if (!!this.options[index] && this.options[index].length > 0) {
                    if (!!this.options[index].includes(shortName)) {
                        const findex = this.options[index].findIndex(i => i == shortName)
                        this.options[index].splice(findex, 1)
                    } else if (this.options[index].length < input.count) {
                        const profCount = this.countSkillProf(index, skill, input)
                    
                        if (this.options.level == 1) {
                            if (profCount == 1) { allowed = false }
                        } else if (this.options.level > 1 && this.options.level < 7) {
                            if (profCount == 2) { allowed = false }
                        } else if (this.options.level > 7 && this.options.level < 15) {
                            if (profCount == 3) { allowed = false }
                        } else if (this.options.level > 15) {
                            if (profCount == 4) { allowed = false }
                        }

                        if (!!allowed) {
                            this.options[index].push(shortName)
                        }
                    }
                } else {
                    const profCount = this.countSkillProf(index, skill, input)
                    
                    if (this.options.level == 1) {
                        if (profCount == 1) { allowed = false }
                    } else if (this.options.level > 1 && this.options.level < 7) {
                        if (profCount == 2) { allowed = false }
                    } else if (this.options.level > 7 && this.options.level < 15) {
                        if (profCount == 3) { allowed = false }
                    } else if (this.options.level > 15) {
                        if (profCount == 4) { allowed = false }
                    }

                    if (!!allowed) {
                        this.options[index].push(shortName)
                    }
                }
            }
        },
        calcSkillProf(index, skill, input) {
            if (!!input && !!skill, (!!index || index == 0) && !!this.options && !!this.options.level) {
                return (this.options.level - input.profnolevel) + this.countSkillProf(index, skill, input)*2
            }
        },
        calcSkillTotal(index, skill, input) {
            if (!!input && !!input.scores && !!skill, (!!index || index == 0) && !!this.options && !!this.options.level) {
                let total = !!input.scores ? (input.scores[this.$rsd.format.getSkillScore(skill)]-10)/2 : 0
                if (this.skillProficient(index, skill, input, 1)) {
                    total = total + (this.options.level - input.profnolevel) + this.countSkillProf(index, skill, input)*2
                }
                return total
            }
        },
        countSkillProf(index, skill, input) {
            if (!!input && !!skill, (!!index || index == 0) && !!this.options) {
                const shortName = skill.substr(0,3)

                const counts = {};
                if (!!input.template) {
                    for (const num of input.template) {
                        counts[num] = counts[num] ? counts[num] + 1 : 1;
                    }
                }

                if (!!this.options[index] && !!this.options[index].includes(shortName)) {
                    counts[shortName] = counts[shortName] ? counts[shortName] + 1 : 1;
                }
                
                if (!!counts[shortName]) {
                    return counts[shortName]
                } else {
                    return 0
                }
            }
        },
        skillProficient(index, skill, input, required_prof) {
            if (!!input && !!skill, (!!index || index == 0) && !!required_prof && !!this.options) {
                return required_prof <= this.countSkillProf(index, skill, input)
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

<style lang="less" scoped>
.virtual-scroll-container {
    overflow-y: hidden;
    height: calc(~"60vh - 135px");
}
.virtual-scroll-container-mobile {
    overflow-y: hidden;
    height: calc(~"80vh - 135px");
}
.no-overflow-text {
    display: list-item;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>