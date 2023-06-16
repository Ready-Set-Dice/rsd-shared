<template>
    <span v-if="!!languages">
        <span class="font-weight-bold mr-1">Languages</span>
        <span v-show="languages.length == 0">-</span>
        <span
            v-for="(language, index) in languages"
            :key="'sense-'+language"
        >
            <span>{{$rsd.format.capitalize(language)}}</span>
            <span v-if="index != languages.length - 1">, </span>
        </span>
    </span>
</template>

<script>
export default {
    props: {
        languages: Array,
    },
}
</script>