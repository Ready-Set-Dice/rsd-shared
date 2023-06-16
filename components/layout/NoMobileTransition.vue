<template>
    <v-expand-x-transition v-if="!MDDown">
        <slot></slot>
    </v-expand-x-transition>
    <div v-else>
        <slot></slot>
    </div>
</template>

<script>
export default {
}
</script>