<template>
    <v-dialog
        v-model="shown"
        persistent
        :fullscreen="XSorSMOnly"
        content-class="no-border-radius"
        no-click-animation
        max-width="600"
        @keydown.enter="agree"
        @keydown.esc="disagree"
    >
        <v-card :tile="true" class="py-4">
            <v-card-title class="text-h6 py-0">
                <span class="noselect">{{title}}</span>
            </v-card-title>
            <v-card-text class="py-1 text-body-2">{{text}}</v-card-text>
            <v-card-actions class="px-6 d-flex">
                <v-btn
                    outlined
                    class="px-4 d-flex flex-grow-1"
                    tile
                    @click="agree"
                >
                    {{!!agreeText ? agreeText : 'Yes'}}
                </v-btn>
                <v-btn
                    outlined
                    class="px-4 d-flex flex-grow-1"
                    tile
                    @click="disagree"
                >
                    {{!!disagreeText ? disagreeText : 'No'}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            shown: false,
            title: '',
            text: '',
        }
    },
    computed: {
        XSorSMOnly () {
            return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm'
        },
    },
    props: {
        agreeText: String,
        disagreeText: String,
    },
    methods: {
        show(title, text) {
            this.title = title
            this.text = text
            this.shown = true
        },
        close() {
            this.shown = false
            this.title = ''
            this.text = ''
        },
        disagree() {
            this.close()
            this.$emit('Disagree')
        },
        agree() {
            this.close()
            this.$emit('Agree')
        }
    }
}
</script>

<style scoped>
div >>> .no-border-radius {
    border-radius: 0 !important;
}
</style>