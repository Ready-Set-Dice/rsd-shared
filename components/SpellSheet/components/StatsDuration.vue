<template>
    <span v-if="!!duration || !!save">
        <span class="font-weight-bold mr-1" v-if="!!save">Saving Throw</span>
        <span v-if="!!save">{{!!basicSave ? 'basic ' : ''}}{{$rsd.format.capitalize(save)}}; </span>
        <span class="font-weight-bold mr-1" v-if="!!duration">Duration</span>
        <span v-if="!!duration">{{duration}}</span>
    </span>
</template>

<script>
export default {
    props: {
        duration: String,
        save: String,
        basicSave: Boolean,
    },
}
</script>