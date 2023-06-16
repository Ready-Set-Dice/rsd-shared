<template>
    <span v-if="!!primarycheck">
        <span class="font-weight-bold mr-1">Primary Check</span>
        <span>{{primarycheck}}</span>
    </span>
</template>

<script>
export default {
    props: {
        primarycheck: String,
    },
}
</script>