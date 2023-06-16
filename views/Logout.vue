<template>
  
</template>

<script>
import { getAuth } from 'firebase/auth';
import { subdomain } from '@/services'

export default {
    data() {
        return {

        }
    },
    mounted() {
        this.logout()
    },
    methods: {
        logout() {
            const auth = getAuth();
            auth.signOut().then(() => {
                // services.unload()
                this.$router.replace('login')
            })
        }
    }
}
</script>