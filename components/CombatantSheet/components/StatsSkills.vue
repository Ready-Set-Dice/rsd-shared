<template>
    <span v-if="!!skills" style="overflow-wrap: anywhere;">
        <span class="font-weight-bold mr-1">Skills</span>
        <span 
            v-for="(name, index) in skillsNames"
            :key="'skill-'+name"
        >
            <v-tooltip
                top
                content-class="no-transparancy"
            >
                <template v-slot:activator="{ on, attrs }">
                    <span
                        v-bind="attrs"
                        v-on="on"
                        @click="roll(skills[name], name)"
                        v-show="skills[name].value != 0"
                        class="pointer"
                        :class="!!skills[name].modified ? 'red--text font-weight-medium' : ''"
                    >
                        <span>{{$rsd.format.capitalize(name)}} {{skillValue(skills[name].value)}}</span>
                    </span>
                </template>
                <span v-if="!!results[`${cidentifier}-${name}`]">
                    <span class="mr-1">{{$rsd.format.capitalize(name)}}:</span>
                    <span class="mr-1">{{results[`${cidentifier}-${name}`].total}}</span>
                    <span>[{{results[`${cidentifier}-${name}`].roll}}, {{skillValue(skills[name].value)}}]</span>
                </span>
                <span v-else>Click to roll a {{$rsd.format.capitalize(name)}} check</span>
            </v-tooltip>
            <span v-show="skills[name].value != 0" v-if="index != skillsNames.length - 1">, </span>
        </span>
    </span>
</template>

<script>
export default {
    props: {
        skills: Object,
        cidentifier: String,
    },
    data() {
        return {
            skillsNames: [
                'acrobatics',
                'arcana',
                'athletics',
                'crafting',
                'deception',
                'diplomacy',
                'intimidation',
                'lore',
                'medicine',
                'nature',
                'occultism',
                'performance',
                'religion',
                'society',
                'stealth',
                'survival',
                'thievery',
            ],
            results: {
                acrobatics: null,
                arcana: null,
                athletics: null,
                crafting: null,
                deception: null,
                diplomacy: null,
                intimidation: null,
                lore: null,
                medicine: null,
                nature: null,
                occultism: null,
                performance: null,
                religion: null,
                society: null,
                stealth: null,
                survival: null,
                thievery: null,
            }
        }
    },
    methods: {
        roll(values, skill) {
            const diceroll = Math.floor(Math.random() * 20 + 1)
            this.$set(this.results, `${this.cidentifier}-${skill}`, {
                total: diceroll + values.value,
                roll: diceroll,
            })

            let eventhistory = {
                identifier: this.cidentifier,
                event: {
                    short: `${this.$rsd.format.capitalize(skill)}: ${diceroll + values.value} [${diceroll},${this.skillValue(values.value)}]`,
                }
            }

            if (diceroll == 1) {
                eventhistory.event.critfail = true
            } else if (diceroll == 20) {
                eventhistory.event.critsuccess = true
            }
            
            this.$rsd.eventhistory.push(eventhistory)
        },
        skillValue(value) {
            return value >= 0 ? `+${value}` : value
        }
    },
}
</script>