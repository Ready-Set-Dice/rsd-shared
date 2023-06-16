<template>
    <v-dialog
        v-model="shown"
        persistent
        :fullscreen="XSorSMOnly"
        max-width="600"
        @keydown.enter="agree"
        @keydown.esc="disagree"
    >
        <v-card>
            <v-card-title class="text-h5">
            {{title}}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="mt-4">{{text}}</v-card-text>
            <v-card-actions class="px-6">
                <v-btn
                    color="blue darken-1 white--text"
                    class="col-6 ml-n2 mr-2 px-0 mb-2"
                    @click="disagree"
                >
                    Disagree
                </v-btn>
                <v-btn
                    color="green darken-1 white--text"
                    class="col-6 ml-2 mr-0 px-0 mb-2"
                    @click="agree"
                >
                    Agree
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