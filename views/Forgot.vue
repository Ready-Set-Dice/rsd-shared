<template>
    <v-container>
        <v-card
            class="mx-auto my-5"
            elevation=5
        >
            <v-form
                ref="forgotpwform"
                v-model="valid"
                lazy-validation
            >
                <v-row class="mx-0">
                    <v-col cols=12 sm=12 md=12 lg=6 class="text-center py-10">
                        <v-row class="px-2 px-sm-10">
                            <v-col cols="12">
                                <span class="text-h5 font-weight-medium">Send reset mail</span>
                            </v-col>
                            <v-col cols=4 class="d-none d-sm-inline text-right mt-2">
                                <span class="text-body-2 font-weight-medium">E-mail</span>
                            </v-col>
                            <v-col cols=12 sm=8 class="d-flex align-center pb-0 mb-n4">
                                <v-text-field
                                    v-model="email"
                                    id="email"
                                    :rules="emailRules"
                                    type="email"
                                    @focus="$event.target.select()"
                                    required
                                    :label="!!XSOnly ? 'E-mail' : ''"
                                    v-on:keyup.enter="sendresetlink"
                                    placeholder=" "
                                    persistent-placeholder
                                    dense
                                    outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols=12 sm=4 class="d-none d-sm-inline-block text-sm-right mt-2 px-2">
                                <a 
                                    class="text-body-2"
                                    href="#"
                                    @click="login"
                                >Login instead?</a>
                            </v-col>
                            <v-col cols=12 sm=8 class="text-center text-sm-right mt-2">
                                <v-btn
                                    color="success white--text"
                                    class="col-6"
                                    @click="sendresetlink"
                                >
                                    Reset
                                </v-btn>
                            </v-col>
                            <v-col cols=12 class="d-inline-block d-sm-none text-center mt-2">
                                <a 
                                    class="text-body-2"
                                    href="#"
                                    @click="login"
                                >Login instead?</a>
                            </v-col>
                            <v-col cols=12>
                                <v-expand-transition>
                                    <div
                                        v-show="expand"
                                    >
                                        <v-alert
                                            dense
                                            type="error"
                                            >
                                            An unknown <strong>error</strong> has occurred.
                                        </v-alert>
                                    </div>
                                </v-expand-transition>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols=12 sm=12 md=12 lg=6 class="py-10 list_even text-center">
                        <v-row class="px-2 px-sm-10 my-auto">
                            <v-col cols=12>
                                <v-avatar
                                    class="mx-auto"
                                    color="main lighten-2"
                                    size="64"
                                    rounded
                                >
                                    <v-img 
                                        lazy-src="/img/rsd-logo.png"
                                        src="/img/rsd-logo.png"
                                        
                                    ></v-img>
                                </v-avatar>
                            </v-col>
                            <v-col cols=12>
                                <span class="text-h5 font-weight-bold">Ready Set Dice</span><br />
                                <span class="text-body-2">New to Ready Set Dice? You can sign up for free!</span>
                            </v-col>
                            <v-col cols=12>
                                <v-btn
                                    color="success white--text"
                                    class="col-6"
                                    @click="signup"
                                >
                                    Sign-up
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
    </v-container>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { subdomain } from '@/services'

export default {
    name: "Forgot",
    computed: {
        btnwidth() {
            switch(this.$vuetify.breakpoint.name) {
                case 'xs': return '100%';
                default: return 178;
            }
        }
    },

    data() {
        return {
            valid: true,
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            expand: false,
            emailfield: null,
        }
    },
    mounted() {
        // This is a fix for password managers
        this.emailfield = document.getElementById('email')
        this.emailfield.addEventListener('change', this.emailListerner)
    },
    methods: {
        validate() {
            this.$refs.form.validate()
        },
        reset() {
            this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },
        signup() {
            this.$router.push('signup')
        },
        login() {
            this.$router.push('login')
        },
        home() {
            this.$router.replace('home')
        },
        emailListerner(event) {
            this.email = event.target.value
        },
        sendresetlink() {
            if (this.$refs.forgotpwform.validate()) {
                this.email = this.email.trim()
                const auth = getAuth();

                const actionCodeSettings = {
                    url: `https://${subdomain}.readysetdice.com/reset?email=${this.email}`,
                };
                sendPasswordResetEmail(auth, this.email).then(
                    () => {
                        this.login()
                    },
                    (err) => {
                        switch(err.code) {
                            default:
                                console.error("error: ",err.code)
                                break;
                        }
                    }
                )
            }
        }
    }
}
</script>