<template>
    <v-container>
        <v-card
            class="mx-auto my-5"
            elevation=5
        >
            <v-form
                ref="pwresetform"
                v-model="valid"
                lazy-validation
            >
                <v-row class="mx-0">
                    <v-col cols=12 sm=12 md=12 lg=6 class="text-center py-10">
                        <v-row class="px-2 px-sm-10">
                            <v-col cols="12">
                                <span class="text-h5 font-weight-medium">Reset your password.</span>
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
                                    disabled
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
                                    :rules="passwordCheckRules"
                                    @focus="$event.target.select()"
                                    required
                                    :type="showPasswordCheck ? 'text' : 'password'"
                                    :label="!!XSOnly ? 'Password check' : ''"
                                    :append-icon="showPasswordCheck ? 'mdi-eye' : 'mdi-eye-off' "
                                    @click:append="showPasswordCheck = !showPasswordCheck"
                                    placeholder=" "
                                    persistent-placeholder
                                    dense
                                    outlined
                                ></v-text-field>
                            </v-col>
                            <v-col cols=12 sm=8 class="text-center text-sm-right mt-2">
                                <v-btn
                                    color="success white--text"
                                    class="col-6"
                                    @click="doPasswordReset"
                                >
                                    Change
                                </v-btn>
                            </v-col>
                            <v-expand-transition>
                                <v-alert
                                    v-show="expandError"
                                    dense
                                    type="error"
                                    >
                                    An <strong>error</strong> has occurred.
                                </v-alert>
                            </v-expand-transition>
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
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

export default {
    name: "PWReset",
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
            email: '',
            oobCode: '',
            valid: true,
            password: '',
            passwordRules: [
                v => !!v || 'Password is required',
                v => v.length > 8 || 'Password needs to be at least 8 characters'
            ],
            passwordCheck: '',
            passwordCheckRules: [
                v => !!v || 'Password check is required',
                v => v === this.password || 'Password check must match Password'
            ],
            showPassword: false,
            showPasswordCheck: false,
            expandWarning: false,
            expandError: false
        }
    },

    mounted() {
        this.processUrlQuery()
    },

    methods: {
        login() {
            this.$router.push('login')
        },

        verifyResetCode(oobCode) {
            const auth = getAuth()
            verifyPasswordResetCode(auth, oobCode)
            .then((email) => {
                this.oobCode = oobCode
                this.email = email
            })
            .catch((err) => {
                switch(err.code) {
                    case 'auth/expired-action-code':
                        alert('This reset code has expired.')
                        break
                    case 'auth/invalid-action-code':
                        alert('This reset code is invalid.')
                        break
                    case 'auth/user-disabled':
                        alert('This user has been disabled.')
                        break
                }
                this.login()
            })
        },

        processUrlQuery() {
            const hrefsplit = window.location.href.split('?')
            if (hrefsplit && hrefsplit.length > 1) {
                const querysplit = hrefsplit[1].split('&')
                let mode = null
                let oobCode = null
                querysplit.forEach((e) => {
                    const varsplit = e.split('=')
                    if (varsplit[0] == 'mode') {
                        mode = varsplit[1]
                    } else if (varsplit[0] == 'oobCode') {
                        oobCode = varsplit[1]
                    }
                })
                
                if (mode == 'resetPassword' && oobCode) {
                    this.verifyResetCode(oobCode)
                }
            }
        },

        doPasswordReset() {
            if (this.$refs.pwresetform.validate()) {
                const auth = getAuth()
                confirmPasswordReset(auth, this.oobCode, this.password)
                .then(() => {
                    alert("You can now login with your new password!")
                    this.$router.replace('login')
                })
                .catch((err) => {
                    switch(err.code) {
                        case 'auth/expired-action-code':
                            alert('This reset code has expired.')
                            this.$router.replace('login')
                            break
                        case 'auth/invalid-action-code':
                            alert('This reset code is invalid.')
                            this.$router.replace('login')
                            break
                        case 'auth/user-disabled':
                            alert('This user has been disabled.')
                            this.$router.replace('login')
                            break
                        case 'auth/weak-password':
                            alert('This password is too weak.')
                            break
                    }   
                })
            }
        },
        // signup() {
        //     if (this.$refs.signupform.validate()) {
        //         this.email = this.email.trim()
        //         if (process.env.NODE_ENV === "development") {
        //             this.expandWarning = true
        //             setTimeout(()=>{this.expandWarning=false},10000);
        //         } else {
        //             // this.expandWarning = true
        //             // setTimeout(()=>{this.expandWarning=false},10000);
        //             const auth = getAuth();
        //             createUserWithEmailAndPassword(auth, this.email, this.password).then(
        //                 (user) => {
        //                     // console.log("User registered!")
        //                     services.load()
        //                     this.$router.replace('home')
        //                 },
        //                 (err) => {
        //                     switch(err.code) {
        //                         case 'auth/email-already-in-use':
        //                             this.expandError = true
        //                             setTimeout(()=>{this.expandError=false},10000);
        //                             break;
        //                         default:
        //                             console.error("error: ",err.code)
        //                             break;
        //                     }
        //                 }
        //             )
        //         }
        //     }
        // }
    }
}
</script>