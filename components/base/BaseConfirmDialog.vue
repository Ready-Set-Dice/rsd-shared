<template>
    <v-dialog
        v-model="shown"
        persistent
        :fullscreen="!!XSorSMOnly"
        content-class="no-border-radius"
        no-click-animation
        max-width="600"
        @keydown.enter="agree"
        @keydown.esc="disagree"
    >
        <v-card 
            :tile="true" 
            class="py-4"
            :class="!!XSorSMOnly ? 'align-center d-flex' : ''"
        >
            <div :class="!!XSorSMOnly ? 'd-flex align-center flex-column flex-grow-1 text-center' : ''">
                <v-card-title class="text-h6 py-0">
                    <span class="noselect">{{title}}</span>
                </v-card-title>
                <v-card-text class="py-1 text-body-2">{{text}}</v-card-text>
                <v-card-actions class="px-6 d-flex">
                    <v-btn
                        outlined
                        class="d-flex flex-grow-1"
                        :class="!!XSorSMOnly ? 'px-6 mr-5' : 'px-4'"
                        tile
                        @click="agree"
                    >
                        {{!!agreeText ? agreeText : 'Yes'}}
                    </v-btn>
                    <v-btn
                        outlined
                        class="d-flex flex-grow-1"
                        :class="!!XSorSMOnly ? 'px-6 ml-5' : 'px-4'"
                        tile
                        @click="disagree"
                    >
                        {{!!disagreeText ? disagreeText : 'No'}}
                    </v-btn>
                </v-card-actions>
            </div>
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
            agreeText: 'Yes',
            disagreeText: 'No',
            agreeFunction: () => {},
            disagreeFunction: () => {}
        }
    },
    computed: {
        XSorSMOnly () {
            return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm'
        },
    },
    methods: {
        show(title = '', text = '', agreeFunction = () => {}, disagreeFunction = () => {}, agreeText = 'Yes', disagreeText = 'No') {
            this.title = title
            this.text = text
            this.agreeText = agreeText
            this.disagreeText = disagreeText
            this.agreeFunction = agreeFunction
            this.disagreeFunction = disagreeFunction
            this.shown = true
        },
        close() {
            this.shown = false
        },
        disagree() {
            this.close()
            if (!!this.disagreeFunction) {
                this.disagreeFunction()
            }
        },
        agree() {
            this.close()
            if (!!this.agreeFunction) {
                this.agreeFunction()
            }
        }
    }
}
</script>

<style scoped>
div >>> .no-border-radius {
    border-radius: 0 !important;
}
</style>