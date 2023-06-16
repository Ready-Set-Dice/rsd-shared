<template>
    <span v-if="!!traditions && ((!!traditions.value && !!traditions.value.length > 0) || !!traditions.custom)">
        <span class="font-weight-bold mr-1">Traditions</span>
        <span 
            v-for="(tradition, index) in traditions.value"
            :key="'tradition-'+tradition"
        >
            <v-menu
                v-if="!!tradition"
                :close-on-content-click="false"
                offset-x
                :nudge-left="250"
            >
                <template v-slot:activator="{ on, attrs }">
                    <span
                        v-bind="attrs"
                        v-on="on"
                        class="text-decoration-underline"
                    >{{tradition}}</span>
                </template>
                <v-card
                    elevation="5"
                    width="500"
                >
                    <v-card-title>{{tradition}}</v-card-title>
                    <v-card-text v-html="$sanitize(traitDescription(tradition))"></v-card-text>
                </v-card>
            </v-menu>
            <span v-else>{{tradition}}</span>
            <span v-if="index != traditions.value.length - 1">, </span>
        </span>
    </span>
</template>

<script>
export default {
    props: {
        traditions: Object,
    },
    methods: {
        traitDescription(trait) {
            return this.$rsd.static.getTraitDescription(this.$rsd.format.capitalize(trait))
        }
    }
}
</script>