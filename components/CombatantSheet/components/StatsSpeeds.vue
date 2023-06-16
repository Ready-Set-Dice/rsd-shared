<template>
    <span v-if="!!speeds">
        <span class="font-weight-bold mr-1">Speed</span>
        <span v-show="!!speeds.movement">{{speeds.movement}} feet</span>
        <span v-show="Object.keys(speeds.other).length > 0">, </span>
        <span
            v-for="(other, index) in speeds.other"
            :key="'otherspeed-'+other+'-'+index"
        >
            <span>{{other}} {{index}},</span>
        </span>
    </span>
</template>

<script>
export default {
    props: {
        speeds: Object,
    },
}
</script>