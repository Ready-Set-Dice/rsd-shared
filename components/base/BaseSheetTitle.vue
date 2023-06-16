<template>
    <div v-if="!!title && !!type">
        <div class="d-flex flex-row align-center text-uppercase">
            <div class="d-flex flex-column">
                <span class="text-h6 roboto-condensed mb-n1">{{title}}</span>
            </div>
            <v-spacer></v-spacer>
            <div class="text-h6">
                <span>{{type}}</span>
            </div>
        </div>
        <hr class="mb-1"/>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        type: String,
    }
}
</script>