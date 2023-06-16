<template>
    <v-dialog
        v-model="shown"
        :fullscreen="XSorSMOnly"
        :max-width="maxwidth ? '900' : '590'"
        @keydown.esc="close"
    >
        <v-card>
            <v-card-title class="text-h5 pb-5">
                {{name}}
            </v-card-title>
            <v-card-subtitle v-if="description">
                <span v-html="$sanitize(description)"></span>
            </v-card-subtitle>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                >
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            valid: true,
            shown: false,
            name: null,
            description: null,
            maxwidth: false,
        }
    },
    computed: {
        XSorSMOnly () {
            return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm'
        },
    },
    props: {
    },
    methods: {
        show(name, description, maxwidth = false) {
            this.name = name
            this.description = description
            this.maxwidth = maxwidth
            this.shown = true
        },
        close() {
            this.shown = false
        },
    }
}
</script>