// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import store from './store'
import VueCookies from 'vue-cookies'
import './style/style.sass'
import {getCookie} from './helpers'
import {
    ClientTable
} from 'vue-tables-2'

import BootstrapVue from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'vue-search-select/dist/VueSearchSelect.css'

// Vue.config.productionTip = false
Vue.use(ClientTable)
Vue.use(VueRouter)
Vue.use(VueCookies)
Vue.use(VueSweetalert2)
Vue.use(BootstrapVue)
import {mapState} from 'vuex'
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    async created() {
        try {
            await store.dispatch('user/SaveGoogleAuthUrl')
            let token = getCookie('accessToken')
            if (token) {
                await store.dispatch('user/VerifyTokenEmailSave', token)

                if (!this.verifyTokenEmail) {
                    throw new Error('invalid token')
                }
                await store.dispatch('user/saveUserStore', this.verifyTokenEmail)
                //
                // await store.dispatch('affiliates/saveAffiliatesStore')
                // await store.dispatch('countries/saveCountriesStore')
                // await store.dispatch('dimensions/saveDimensionsStore')
                // await store.dispatch('campaigns/saveCampaignsStore')
                // await store.dispatch('lp/saveLPStore')
                // await store.dispatch('prods/saveProdsStore')
                // await store.dispatch('affiliateWebsites/saveAffiliateWebsitesStore')

            } else {
                let checkPatch = this.$root._route.path.includes('successLogin')
                    || this.$root._route.path.includes('errorLogin')

                if (!checkPatch) {
                    router.push('/').catch(err => {
                        // Ignore the vuex err regarding navigating to the page they are already on.
                        if (
                          err.name !== 'NavigationDuplicated' &&
                          !err.message.includes('Avoided redundant navigation to current location')
                        ) {
                          // But print any other errors to the console
                          console.log(err)
                        }
                    });
                }

            }
        } catch (err) {
            console.log(err)
            router.push('/')
        }

    },
    computed: {
        ...mapState('user', ['user', 'verifyTokenEmail'])
    },
})
