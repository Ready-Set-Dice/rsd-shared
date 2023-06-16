<template>
    <v-container>
        <v-card
            class="mx-auto my-5"
            elevation=5
        >
            <v-form
                ref="signupform"
                v-model="valid"
                lazy-validation
            >
                <v-row class="mx-0">
                    <v-col cols=12 sm=12 md=12 lg=6 class="text-center py-10">
                        <v-row class="px-2 px-sm-10">
                            <v-col cols="12">
                                <span class="text-h5 font-weight-medium">Create a free account!</span>
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
                                    placeholder=" "
                                    persistent-placeholder
                                    dense
                                    outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols=4 class="d-none d-sm-inline text-right mt-2">
                                <span class="text-body-2 font-weight-medium">Password</span>
                            </v-col>
                            <v-col cols=12 sm=8 class="d-flex align-center pb-0 mb-n4">
                                <v-text-field
                                    v-model="password"
                                    id="password"
                                    :rules="passwordRules"
                                    @focus="$event.target.select()"
                                    required
                                    :type="showPassword ? 'text' : 'password'"
                                    :label="!!XSOnly ? 'Password' : ''"
                                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off' "
                                    @click:append="showPassword = !showPassword"
                                    placeholder=" "
                                    persistent-placeholder
                                    dense
                                    outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols=4 class="d-none d-sm-inline text-right mt-2">
                                <span class="text-body-2 font-weight-medium">Password check</span>
                            </v-col>
                            <v-col cols=12 sm=8 class="d-flex align-center pb-0 mb-n4">
                                <v-text-field
                                    v-model="passwordCheck"
                                    id="passwordCheck"
                                    :rules="passwordRules"
                                    @focus="$event.target.select()"
                                    required
                                    :type="showPassword ? 'text' : 'password'"
                                    :label="!!XSOnly ? 'Password check' : ''"
                                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off' "
                                    @click:append="showPassword = !showPassword"
                                    placeholder=" "
                                    persistent-placeholder
                                    v-on:keyup.enter="signup"
                                    dense
                                    outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols=12 sm=4>
                            </v-col>
                            <v-col cols=12 sm=8 class="text-center text-sm-right mt-2">
                                <v-btn
                                    color="success white--text"
                                    class="col-6"
                                    @click="signup"
                                >
                                    Sign-up
                                </v-btn>
                            </v-col>
                            <v-col cols=12>
                                <v-expand-transition>
                                    <div
                                        v-show="expandError"
                                    >
                                        <v-alert
                                            dense
                                            type="error"
                                            >
                                            An unknown <strong>error</strong> has occurred.
                                        </v-alert>
                                    </div>
                                </v-expand-transition>
                                <v-expand-transition>
                                    <div v-show="expandWarning">
                                        <v-alert
                                            dense
                                            type="warning"
                                            >
                                            Sign-up is currently <strong>disabled</strong>.
                                        </v-alert>
                                    </div>
                                </v-expand-transition>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols=12 sm=12 md=12 lg=6 class="py-10 py-lg-15 list_even text-center">
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
                                <span class="text-body-2">Already have an account? Continue to login.</span>
                            </v-col>
                            <v-col cols=12>
                                <v-btn
                                    color="success white--text"
                                    class="col-6"
                                    @click="login"
                                >
                                    Login
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
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { subdomain } from '@/services'

export default {
    name: "Signup",
    computed: {
        btnwidth() {
            switch(this.$vuetify.breakpoint.name) {
                case 'xs': return '100%';
                default: return 79;
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
            password: '',
            passwordRules: [
                v => !!v || 'Password is required',
                v => v.length >= 8 || 'Password needs to be at least 8 characters'
            ],
            passwordCheck: '',
            passwordCheckRules: [
                v => !!v || 'Password check is required',
                v => v === this.password || 'Password check must match Password'
            ],
            showPassword: false,
            showPasswordCheck: false,
            expandWarning: false,
            expandError: false,
            emailfield: null,
            pwfield: null,
            pwcheckfield: null,
        }
    },

    mounted() {
        // This is a fix for password managers
        this.emailfield = document.getElementById('email')
        this.emailfield.addEventListener('change', this.emailListerner)

        this.pwfield = document.getElementById('password')
        this.pwfield.addEventListener('change', this.pwListener)

        this.pwcheckfield = document.getElementById('passwordCheck')
        this.pwcheckfield.addEventListener('change', this.pwCheckListener)
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

        login() {
            this.$router.push('login')
        },
        home() {
            this.$router.replace('home')
        },
        emailListerner(event) {
            this.email = event.target.value
        },
        pwListener(event) {
            this.password = event.target.value
        },
        pwCheckListener(event) {
            this.passwordCheck = event.target.value
        },
        signup() {
            // console.log("TODO: Signup function")
            if (this.$refs.signupform.validate()) {
                this.email = this.email.trim()
                if (process.env.NODE_ENV === "development") {
                    this.expandWarning = true
                    setTimeout(()=>{this.expandWarning=false},10000);
                } else {
                    // this.expandWarning = true
                    // setTimeout(()=>{this.expandWarning=false},10000);
                    const auth = getAuth();
                    createUserWithEmailAndPassword(auth, this.email, this.password).then(
                        (user) => {
                            console.log("User registered!")
                            // services.load()
                            // For whatever reason Router is struggling with router.replace due to history mode
                            this.home()
                            // this.$router.replace('home')
                        },
                        (err) => {
                            // console.log(err.code)
                            switch(err.code) {
                                case 'auth/email-already-in-use':
                                    this.expandError = true
                                    setTimeout(()=>{this.expandError=false},10000);
                                    break;
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
}
</script>