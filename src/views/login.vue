<template>
    <p>index</p>
    <button @click="toHome">toHome</button>
</template>
<script>
    import { useRouter } from 'vue-router'
    export default {
        setup () {
            const router = useRouter();
            const toHome = (() => {
                router.push({
                    name: 'home'
                })
            });
            return {
                toHome
            }
        },
    }
</script>
<style  scoped>
</style>