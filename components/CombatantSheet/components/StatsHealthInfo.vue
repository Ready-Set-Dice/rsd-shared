<template>
    <span v-if="!!hpmax">
        <span class="font-weight-bold mr-1">HP</span>
        <span class="mr-1" :class="!!hpmax.modified ? 'red--text font-weight-medium' : ''">{{hpmax.value}};</span>
        <span 
            v-for="(values, category) in hpinfo"
            :key="'hpinfo-'+category"
            class="mr-1"
        >
            <span v-if="!!values && category == 'resistances'">
                <span class="font-weight-bold mr-1">{{$rsd.format.capitalize(category)}}</span>
                <span v-for="(value, index) in values" :key="'hpinfo-'+category+'-'+value.type">
                    <span class="mr-1">{{value.type}}</span>
                    <span>{{value.value}}</span>
                    <span v-if="!!value.exceptions && value.exceptions.length > 0" class="ml-1">(except {{value.exceptions.toString()}})</span>
                    <span v-if="index != values.length - 1">, </span>
                </span>
            </span>
            <span v-else-if="!!values && category != 'resistances'">
                <span class="font-weight-bold mr-1">{{$rsd.format.capitalize(category)}}</span>
                <span v-for="(value, index) in values" :key="'hpinfo-'+category+'-'+value.type">
                    <span class="mr-1">{{value.type}}</span>
                    <span>{{value.value}}</span>
                    <span v-if="index != values.length - 1">, </span>
                </span>
            </span>
        </span>
    </span>
</template>

<script>
export default {
    props: {
        hpmax: Object,
        hpinfo: Object,
    }
}
</script>