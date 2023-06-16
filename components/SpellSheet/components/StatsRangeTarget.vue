<template>
    <span v-if="!!range || !!area || !!target">
        <span class="font-weight-bold mr-1" v-if="!!range">Range</span>
        <span v-if="!!range">{{range}}; </span>
        <span class="font-weight-bold mr-1" v-if="!!area">Area</span>
        <span v-if="!!area">{{area.value}}-foot {{ area.type }}; </span>
        <span class="font-weight-bold mr-1" v-if="!!target">Targets</span>
        <span v-if="!!target">{{target}}</span>
    </span>
</template>

<script>
export default {
    props: {
        area: Object,
        range: String,
        target: String,
    },
}
</script>