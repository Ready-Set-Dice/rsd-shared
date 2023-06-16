<template>
    <span v-if="!!castTime && !!components">
        <span class="font-weight-bold mr-1">Cast</span>
        <span v-if="!!isCastAction" v-html="$sanitize(castAction)"></span>
        <span v-else>{{castTime}}</span>
        <span v-if="!isCastAction && !!components && (!!components.material || !!components.verbal || !!components.material)"> ( </span>
        <span 
            v-for="(valid, component) in components"
            :key="'tradition-'+component"
        >
            <span v-if="!!valid">
                <span>{{component}}</span>
                <span>, </span>
            </span>
        </span>
        <span v-if="!isCastAction && !!components && (!!components.material || !!components.verbal || !!components.material)">)</span>
        <span v-if="!!materials">
            <span>; </span>
            <span class="font-weight-bold mr-1">Requirements</span>
            <span>{{materials}}</span>
        </span>
    </span>
</template>

<script>
export default {
    props: {
        castTime: String,
        components: Object,
        materials: String,
    },
    computed: {
        isCastAction() {
            if (!!this.castTime) {
                return this.castTime == '1' || this.castTime == '2' || this.castTime == '3' || this.castTime == '1 to 3' || this.castTime == 'reaction' || this.castTime == 'free'
            } else {
                return false
            }
        },
        castAction() {
            if (!!this.isCastAction) {
                if (this.castTime == '1' || this.castTime == '2' || this.castTime == '3') {
                    return `<span class="action">${this.castTime}</span>`
                } else if (this.castTime == 'reaction' || this.castTime == 'free') {
                    return `<span class="action">${this.castTime[0]}</span>`
                } else if (this.castTime == '1 to 3' || this.castTime == '2 to 3' || this.castTime == '1 to 2') {
                    const values = this.castTime.split(' to ')
                    return `<span class="action">${values[0]}</span>to<span class="action">${values[1]}</span>`
                }
            }
        }
    },
    methods: {
        traitDescription(trait) {
            return this.$rsd.static.getTraitDescription(this.$rsd.format.capitalize(trait))
        }
    }
}
</script>