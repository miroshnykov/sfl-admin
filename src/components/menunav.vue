<template>
    <div class="menu-nav">
        <b-nav vertical class="w-25">
            <a class="logo"></a>
<!--            <a href="http://localhost:8084/offer?prod=8&ref=5066372" class="logo animated fadeIn"> URL  </a>-->
            <span class="nav-active">
                <b-nav-item active class="nav-blockedSegments"><a @click="this.blockSegmentsPage"><i class="far fa-ban"></i> Blocked Segments</a></b-nav-item>
                <b-nav-item active class="nav-standardSegments"><a @click="this.standardSegmentsPage"><i class="far fa-project-diagram"></i> Standard Segments</a></b-nav-item>
                <b-nav-item active class="nav-customOffers"><a @click="this.offersPage"><i class="far fa-bullhorn"></i> Custom Offers Segments</a></b-nav-item>
                <hr class="line">
<!--                <b-nav-item active class="nav-customOffers"><a @click="this.importPage"><i class="far fa-file-import"></i> Import data</a></b-nav-item>-->
            </span>

            <span class="nav-disabled" style="display: none;cursor: not-allowed;">
                <b-nav-item disabled><a><i class="far fa-ban"></i> Blocked Segments</a></b-nav-item>
                <b-nav-item disabled><a><i class="far fa-project-diagram"></i> Standard Segments</a></b-nav-item>
                <b-nav-item disabled><a><i class="far fa-bullhorn"></i> Custom Offers Segments</a></b-nav-item>
                <hr class="line">
<!--                <b-nav-item disabled class="nav-customOffers"><a @click="this.importPage"><i class="far fa-file-import"></i> Import data</a></b-nav-item>-->
            </span>
            

            <hr class="nav">

            <img class="user-avatar" :src="getUrlAvatar()" />
            <b-nav class="user-menu">
                <b-nav-item-dropdown
                        id="user-dropdown"
                        toggle-class="nav-link-custom"
                        right
                >
                    <template v-slot:button-content>
                        <span class="username">{{getUserName()}}</span>
                    </template>
                    <b-dropdown-item>
                        You are currently signed in as<br>
                        <strong>{{getUserEmail()}}</strong>
                    </b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item>
                        <router-link class="sign-out" exact to="/logout">
                            <span @click="loginOut">Sign Out <i class="fad fa-sign-out"></i></span>
                        </router-link>
                    </b-dropdown-item>
                </b-nav-item-dropdown>
            </b-nav>

            <!-- <b-nav-item active><a @click="this.sflAdvertisers"><i class="far fa-sign-in-alt"></i> Go to SFL Advertisers</a></b-nav-item> -->
        </b-nav>
    </div>
</template>

<script>
    import {deleteCookie} from '../helpers'
    import {mapState} from 'vuex'

    export default {
        data() {
            return {}
        },
        methods: {
            sflAdvertisers() {
                this.$router.push('https://sfl-advertiser.jatun.systems/')
            },
            offersPage() {
                this.$router.push('/offers')
                location.reload()
            },
            importPage() {
                this.$router.push('/import')
                location.reload()
            },
            standardSegmentsPage() {
                this.$router.push('/segments/standard')
                location.reload()
            },
            blockSegmentsPage() {
                this.$router.push('/segments/block')
                location.reload()
            },
            mainPage() {
                this.$router.push('/')
                location.reload()
            },

            getUrlAvatar() {
                return this.user.length > 0 && this.user[0].picture
            },
            getUserEmail() {
                return this.user.length > 0 && this.user[0].email
            },
            getUserName() {
                return this.user.length > 0 && this.user[0].name
            },
            getUserFirstName() {
                return this.user.length > 0 && this.user[0].given_name
            },
            loginOut() {
                deleteCookie('accessToken')
                this.$router.push(`/`)
                location.reload()
            },
        },
        computed: {
            ...mapState('user', ['user']),
        },
    }
</script>

<style lang="sass">
.menu-nav
    background: #3A3852
    height: 100%
    width: 250px
    padding: 30px
    position: fixed
    left: 0
    top: 0
    z-index: 99

    hr.line
        border: 1px solid #DFE0EB
        opacity: 0.1
        width: 95px
        margin: 20px 0px 20px

    hr.nav
        border: 1px solid #DFE0EB
        opacity: 0.1
        width: 180px
        margin: 100px auto 40px

    .logo
        display: block
        width: 183px
        height: 32px
        margin: 20px 0px
        background: url('../assets/logo.svg')
        background-size: cover
        transition: all 0.5s ease
        margin-bottom: 50px

    .nav-link
        display: block
        padding: 1.5rem 0rem
        margin-left: 0px
        margin-right: -15px
        cursor: pointer

    a.nav-link.active
        font-size: 14px
        letter-spacing: 0.3px
        color: rgba(255, 255, 255, 0.9)
    //  background: rgba(255, 255, 255, 0.1)

    a.nav-link.disabled
        font-size: 14px
        font-weight: 400
        letter-spacing: 0.3px
        color: rgba(255, 255, 255, 0.2)
        pointer-events: none
        cursor: not-allowed

    li.nav-item a svg
        margin-right: 5px

    span.nav-space
        margin-left: 27px

    .user-avatar
        float: left
        border-radius: 100%
        width: 2.5em
        height: 2.5em

    .header-icons
        color: #ACC3CF
        float: right

        span
            margin-left: 10px
            cursor: pointer

            &:hover
                color: #7F98A5

        span.user
            float: right


.user-menu
    .nav-item
        li
            .nav-item a svg
                margin-right: 5px

            span.nav-space
                margin-left: 27px

        .dropdown-toggle
            white-space: nowrap
            padding: 0
            transition: all 0.5s ease

            span
                color: #fff
                font-size: 12px
                font-weight: 700
                letter-spacing: 0.5px
                text-decoration: none
                line-height: 1rem
                text-align: left
                margin-left: 50px

                &:hover
                    color: #67E6F5
                    cursor: pointer

            &::after
                // content: ""
                // border-top: 0.3em solid
                // border-right: 0.3em solid transparent
                // border-bottom: 0
                // border-left: 0.3em solid transparent

                margin-left: 3em
                vertical-align: middle
                color: rgba(255, 255, 255, 0.5)
                content: '\F107'
                font-family: "Font Awesome 5 Free"
                font-weight: 900
                font-size: 14px
                border-top: none


    li#user-dropdown
        top: -25px
</style>