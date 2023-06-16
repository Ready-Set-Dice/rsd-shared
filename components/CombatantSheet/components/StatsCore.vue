<template>
    <span v-if="!!core" style="overflow-wrap: anywhere;">
        <span 
            v-for="(name, index) in coreNames"
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
                        @click="roll(core[name], name)"
                        class="pointer"
                    >
                        <span>
                            <span class="font-weight-bold mr-1">{{$rsd.format.capitalize(name)}}</span>
                            <span>{{coreValue(core[name].mod)}}</span>
                        </span>
                    </span>
                </template>
                <span v-if="!!results[`${cidentifier}-${name}`] || results[`${cidentifier}-${name}`] == 0">
                    <span class="mr-1">{{$rsd.format.capitalize(coreFullNames[index])}}:</span>
                    <span class="mr-1">{{results[`${cidentifier}-${name}`].total}}</span>
                    <span>[{{results[`${cidentifier}-${name}`].roll}}, {{coreValue(core[name].mod)}}]</span>
                </span>
                <span v-else>Click to roll a {{$rsd.format.capitalize(coreFullNames[index])}} check</span>
            </v-tooltip>
            <span v-if="index != Object.keys(core).length - 1">, </span>
        </span>
    </span>
</template>

<script>
export default {
    props: {
        core: Object,
        cidentifier: String,
    },
    data() {
        return {
            coreNames: [
                'str',
                'dex',
                'con',
                'int',
                'wis',
                'cha',
            ],
            coreFullNames: [
                'strength',
                'dexterity',
                'contitution',
                'intelligence',
                'wisdom',
                'charisma',
            ],
            results: {
                str: null,
                dex: null,
                con: null,
                int: null,
                wis: null,
                cha: null,
            }
        }
    },
    methods: {
        roll(values, skill) {
            const diceroll = Math.floor(Math.random() * 20 + 1)
            this.$set(this.results, `${this.cidentifier}-${skill}`, {
                total: diceroll + values.mod,
                roll: diceroll,
            })

            let eventhistory = {
                identifier: this.cidentifier,
                event: {
                    short: `${this.$rsd.format.capitalize(skill)}: ${diceroll + values.mod} [${diceroll},${this.coreValue(values.mod)}]`,
                }
            }

            if (diceroll == 1) {
                eventhistory.event.critfail = true
            } else if (diceroll == 20) {
                eventhistory.event.critsuccess = true
            }
            
            this.$rsd.eventhistory.push(eventhistory)
        },
        coreValue(value) {
            return value >= 0 ? `+${value}` : value
        }
    },
}
</script>