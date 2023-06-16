<template>
    <span v-if="!!stats" style="overflow-wrap: anywhere;">
        <span class="mr-1" v-if="!!stats.ac">
            <span class="font-weight-bold mr-1">AC</span>
            <span :class="!!stats.ac.modified ? 'red--text font-weight-medium' : ''">{{stats.ac.value}};</span>
        </span>
        <span 
            v-for="(name, index) in saveFullNames"
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
                        @click="roll(stats[name], name)"
                        v-show="stats[name].value != null"
                        class="pointer"
                        :class="!!stats[name].modified ? 'red--text font-weight-medium' : ''"
                    >
                        <span>
                            <span class="font-weight-bold mr-1">{{$rsd.format.capitalize(saveNames[index])}}</span>
                            <span>{{saveValue(stats[name].value)}}</span>
                        </span>
                    </span>
                </template>
                <span v-if="!!results[`${cidentifier}-${name}`]">
                    <span class="mr-1">{{$rsd.format.capitalize(saveFullNames[index])}}:</span>
                    <span class="mr-1"
                    :class="!!results[`${cidentifier}-${name}`].critfail ? 'red--text' : (!!results[`${cidentifier}-${name}`].critsuccess ? 'green--text' : '')"
                    >{{results[`${cidentifier}-${name}`].total}}</span>
                    <span>[{{results[`${cidentifier}-${name}`].roll}}, {{saveValue(stats[name].value)}}]</span>
                </span>
                <span v-else>Click to roll a {{$rsd.format.capitalize(saveFullNames[index])}} check</span>
            </v-tooltip>
            <span v-show="stats[name].value != 0" v-if="index != saveNames.length - 1">, </span>
        </span>
    </span>
</template>

<script>
export default {
    props: {
        stats: Object,
        cidentifier: String,
    },
    data() {
        return {
            saveNames: [
                'fort',
                'ref',
                'will',
            ],
            saveFullNames: [
                'fortitude',
                'reflex',
                'will'
            ],
            results: {
                fortitude: null,
                reflex: null,
                will: null,
            }
        }
    },
    methods: {
        roll(values, save) {
            const diceroll = Math.floor(Math.random() * 20 + 1)
            this.$set(this.results, `${this.cidentifier}-${save}`, {
                total: diceroll + values.value,
                roll: diceroll,
                critfail: diceroll == 1 ? true : false,
                critsuccess: diceroll == 20 ? true : false,
            })

            let eventhistory = {
                identifier: this.cidentifier,
                event: {
                    short: `${this.$rsd.format.capitalize(save)}: ${diceroll + values.value} [${diceroll},${this.saveValue(values.value)}]`,
                }
            }

            if (diceroll == 1) {
                eventhistory.event.critfail = true
            } else if (diceroll == 20) {
                eventhistory.event.critsuccess = true
            }
            
            this.$rsd.eventhistory.push(eventhistory)
        },
        saveValue(value) {
            return value >= 0 ? `+${value}` : value
        }
    },
}
</script>