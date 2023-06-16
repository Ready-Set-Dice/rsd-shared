<template>
    <span v-if="!!attacks">
        <span
            v-for="(attack, aindex) in attacks"
            :key="'attack-'+attack._id"
        >
            <div v-if="!!attack && !!attack.system">
                <span class="font-weight-bold">{{$rsd.format.capitalize(attack.system.weaponType.value)}}</span>
                <span class="action">{{!!attack.system.attack.value ? $rsd.format.capitalize(attack.system.attack.value) : 1}}</span>
                <span class="mr-1">{{$rsd.format.capitalize(attack.name)}}</span>
                <span 
                    v-for="(bonus, index) in getAttackValues(attack)" 
                    :key="'attack-bonus-'+index"
                >
                    <v-tooltip
                        top
                        content-class="no-transparancy"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <span
                                v-bind="attrs"
                                v-on="on"
                                @click="rollAttack(attack, index, bonus)"
                                class="pointer"
                            >
                                <span
                                :class="!!modified ? 'red--text font-weight-medium' : ''"
                                >{{attackValue(bonus)}}</span>
                                <span v-show="index < 2"> / </span>
                            </span>
                        </template>
                        <span v-if="!!attackResults && !!attackResults[`${cidentifier}-${attack._id}`] && !!attackResults[`${cidentifier}-${attack._id}`][index] && !!attackResults[`${cidentifier}-${attack._id}`][index].total">
                            <span class="mr-1">{{$rsd.format.capitalize(attack.name)}} ({{$rsd.format.getPrettyIndex(index)}}):</span>
                            <span class="mr-1"
                                :class="!!attackResults[`${cidentifier}-${attack._id}`][index].critfail ? 'red--text' : (!!attackResults[`${cidentifier}-${attack._id}`][index].critsuccess ? 'green--text' : '')"
                            >{{attackResults[`${cidentifier}-${attack._id}`][index].total}}</span>
                            <span>[{{attackResults[`${cidentifier}-${attack._id}`][index].roll}}, {{attackValue(bonus)}}]</span>
                        </span>
                        <span v-else>Click to roll for {{$rsd.format.capitalize(attack.name)}} {{$rsd.format.getPrettyIndex(index)}} attack</span>
                    </v-tooltip>
                </span>
                <span v-if="hasAttackTraits(attack)">
                    (<span 
                        v-for="(trait,index) in attack.system.traits.value"
                        :key="'weapon-trait-'+trait"
                    >
                        <v-menu
                            v-if="!!trait && !!getTraitDescription(trait)"
                            L
                            :close-on-content-click="false"
                            offset-x
                            :nudge-left="250"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <span
                                    v-on="on"
                                    v-bind="attrs"
                                    class="text-decoration-underline"
                                >{{trait}}</span>
                            </template>
                            <v-card
                                elevation="5"
                                width="500"
                            >
                                <v-card-title>{{getCapitalizedTrait(trait)}}</v-card-title>
                                <v-card-text>{{getTraitDescription(trait)}}</v-card-text>
                            </v-card>
                        </v-menu>
                        <span v-else>{{trait}}</span>
                        <span v-if="index != attack.system.traits.value.length - 1">, </span>
                    </span>)</span>
                <span>, </span>
                <span class="font-weight-bold">Damage </span>
                <!-- <span>{{getAttackDamageLine(attack)}}</span> -->
                <v-tooltip
                    top
                    content-class="no-transparancy"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <span
                            v-bind="attrs"
                            v-on="on"
                            @click="rollDamage(attack)"
                            class="pointer"
                            :class="!!modified ? 'red--text font-weight-medium' : ''"
                        >
                            <span>{{getAttackDamageLine(attack)}}</span>
                        </span>
                    </template>
                    <span v-if="!!damageResults && !!damageResults[`${cidentifier}-${attack._id}`]">
                        <span class="mr-1">{{$rsd.format.capitalize(attack.name)}}:</span>
                        <span class="">{{damageResults[`${cidentifier}-${attack._id}`].total}}</span>
                        <span>
                            ->
                            <span 
                                v-for="(damage,type) in damageResults[`${cidentifier}-${attack._id}`].types" 
                                :key="'damage-type-'+type"
                            >
                                <span>{{damage.total}} {{type}}
                                    [<span
                                        v-for="(part,index) in damage.parts"
                                        :key="'damage-type-'+type+'-part-'+index"
                                    >
                                        <span
                                            :class="!!part.critfail ? 'red--text' : (!!part.critsuccess ? 'green--text' : '')"
                                        >{{!part.roll && part.value > 0 ? '+' : ''}}{{part.value}}</span>
                                        <span v-if="index < damage.parts.length - 1">, </span>
                                    </span>],
                                </span>
                            </span>
                        </span>
                    </span>
                    <span v-else>Click to roll for {{$rsd.format.capitalize(attack.name)}} damage</span>
                </v-tooltip>
                <span>{{getAttackEffects(attack)}}</span>
                <!-- <span class="ml-1">
                    <v-btn x-small tile disabled>
                        Apply damage
                        <v-icon x-small>mdi-play-circle-outline</v-icon>
                    </v-btn>
                </span> -->
            </div>
        </span>
    </span>
</template>

<script>
export default {
    props: {
        attacks: Array,
        cidentifier: String,
        modified: Boolean,
    },
    data() {
        return {
            attackResults: {},
            damageResults: {}
        }
    },
    methods: {
        getAttackValues(attack) {
            const first = !!attack.system.bonus && !!attack.system.bonus.value ? attack.system.bonus.value : 0
            const traits = !!attack.system.traits ? attack.system.traits : null
            const hasAgile = !!traits && !!traits.value && !!traits.value.includes("agile")
            const second = !!hasAgile ? first - 4 : first - 5
            const third = !!hasAgile ? second - 4 : second - 5

            return [first, second, third]
        },
        getAttackValuesLine(attack) {
            const values = this.getAttackValues(attack)
            const firstPlus = values.first >= 0 ? '+' : ''
            const secondPlus = values.second >= 0 ? '+' : ''
            const thirdPlus = values.third >= 0 ? '+' : ''
            return `${firstPlus}${values.first} [${secondPlus}${values.second}/${thirdPlus}${values.third}]`
        },
        hasAttackTraits(attack) {
            return !!attack.system.traits && !!attack.system.traits.value && attack.system.traits.value.length > 0
        },
        getCapitalizedTrait(trait) {
            return this.$rsd.format.capitalize(trait.toLowerCase())
        },
        getTraitDescription(trait) {
            return this.$rsd.static.getTraitDescription(this.getCapitalizedTrait(trait))
        },
        getAttackDamageLine(attack) {
            const damageRolls = !!attack.system.damageRolls ? attack.system.damageRolls : null
            let damageLine = ''
            if (!!damageRolls) {
                Object.values(damageRolls).forEach(item => {
                    if (!!item.damage && !!item.damageType) {
                        damageLine += `${item.damage} ${item.damageType}, `
                    }
                })
            }
            return !!damageLine ? damageLine : null
        },
        getAttackEffects(attack) {
            const attackEffects = !!attack.system.attackEffects ? attack.system.attackEffects : null
            let effectsLine = ''
            if (!!attackEffects && (!!attackEffects.custom || !!attackEffects.value && attackEffects.value.length > 0)) {
                effectsLine = 'plus '
                if (!!attackEffects.custom) {
                    effectsLine += `${attackEffects.custom}, `
                }
                if (!!attackEffects.value && !!attackEffects.value.length > 0) {
                    attackEffects.value.forEach(item => {
                        if (!!item) {
                            effectsLine += `${item}, `
                        }
                    })
                }
                effectsLine = effectsLine.substring(0, effectsLine.length - 2)
            }
            return !!effectsLine ? effectsLine : null
        },
        rollDamage(attack) {
            const damageRolls = !!attack.system.damageRolls ? attack.system.damageRolls : null

            if (!!damageRolls) {
                const result = this.$rsd.random.getDiceRoll(damageRolls)
                this.$set(this.damageResults, `${this.cidentifier}-${attack._id}`, result)

                if (!!result && (!!result.total || result.total == 0) && !!result.types) {
                    let eventhistory = {
                        identifier: this.cidentifier,
                        event: {
                            short: `${this.$rsd.format.capitalize(attack.name)}: ${result.total} -> `,
                        }
                    }
                    Object.keys(result.types).forEach((type) => {
                        eventhistory.event.short += `${result.types[type].total} ${type},`
                    })

                    this.$rsd.eventhistory.push(eventhistory)
                }
            }
        },
        rollAttack(attack, index, bonus) {
            const diceroll = Math.floor(Math.random() * 20 + 1)
            if (!this.attackResults[`${this.cidentifier}-${attack._id}`]) {
                this.$set(this.attackResults, `${this.cidentifier}-${attack._id}`, [
                    {},{},{}
                ])
            }

            this.$set(this.attackResults[`${this.cidentifier}-${attack._id}`], index, {
                total: diceroll + bonus,
                roll: diceroll,
                critfail: diceroll == 1 ? true : false,
                critsuccess: diceroll == 20 ? true : false,
            })

            let eventhistory = {
                identifier: this.cidentifier,
                event: {
                    short: `${this.$rsd.format.capitalize(attack.name)} (${this.$rsd.format.getPrettyIndex(index)}): ${diceroll + bonus} [${diceroll},${this.attackValue(bonus)}]`,
                }
            }

            if (diceroll == 1) {
                eventhistory.event.critfail = true
            } else if (diceroll == 20) {
                eventhistory.event.critsuccess = true
            }
            
            this.$rsd.eventhistory.push(eventhistory)
        },
        attackValue(value) {
            return value >= 0 ? `+${value}` : value
        }
    }
}
</script>

<style lang="less" scoped>
.no-transparancy {
    background: #212121;
    opacity: 1;
}
</style>