<template>
    <div v-if="visible" class="modal-mask modal-transition">

        <div class="modal-container">

            <h1>Caps
                <!-- <b-badge variant="light" class="capStatus">
                <i class="far fa-weight-hanging" data-fa-transform="shrink-4"></i> {{JSON.stringify(offerCap)}}
                </b-badge> -->
            </h1>

            <h3 class="line">Conversions cap</h3>

            <b-row class="clicks-amount text-center">

                <b-col cols="3">
                    <div class="condition__controls">
                        <label>Amount (Day)</label>
                        <input type="number"
                               step=1
                               placeholder="1000"
                               min="1" max="99999"
                               :value="offerCap.salesDay || 0"
                               @change="updateCap($event, `salesDay`)"
                               class="condition__matches budgetTotal custom-input"
                               pattern="^\d+(?:\.\d{1,2})?$"
                               onblur="this.parentNode.parentNode.style.backgroundColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'inherit':'transparent'
                                    ">
                    </div>
                </b-col>
                <b-col cols="3">
                    <div class="condition__controls">
                        <label>Amount (Week)</label>
                        <input type="number"
                               step=1
                               placeholder="1000"
                               min="1" max="99999"
                               :value="offerCap.salesWeek||0"
                               @change="updateCap($event, `salesWeek`)"
                               class="condition__matches budgetTotal custom-input"
                               pattern="^\d+(?:\.\d{1,2})?$"
                               onblur="this.parentNode.parentNode.style.backgroundColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'inherit':'transparent'
                                    ">

                    </div>
                </b-col>

                <b-col cols="3">
                    <div class="condition__controls">
                        <label>Amount (Month)</label>
                        <input type="number"
                               step=1
                               placeholder="1000"
                               min="1" max="99999"
                               :value="offerCap.salesMonth|| 0"
                               @change="updateCap($event, `salesMonth`)"
                               class="condition__matches budgetTotal custom-input"
                               pattern="^\d+(?:\.\d{1,2})?$"
                               onblur="this.parentNode.parentNode.style.backgroundColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'inherit':'transparent'
                                    ">

                    </div>
                </b-col>

                <!-- TODO: Future implementation to eventually have selectable Custom Day/Week/Month values, like the mock -->
                <!-- <b-col cols="3">
                    <div class="condition__controls">
                        <label>&nbsp;</label>
                        <div class="btn-group btn-group-toggle" data-toggle="buttons">
                            <label class="btn btn-secondary-">
                                <input
                                        type="checkbox"
                                        autocomplete="off"
                                > Custom
                            </label>
                            <label class="btn btn-secondary-">
                                <input
                                        type="checkbox"
                                        autocomplete="off"
                                > 10
                            </label>
                        </div>
                    </div>
                </b-col> -->
            </b-row>

            <b-row class="clicks-redirect" style="margin-top: -20px; margin-bottom: 40px">
                <!-- Hide for now -->
                <!-- <b-col cols="3">
                    <div class="condition__controls">
                        <label for="label-period">Redirect</label>
                        <div class="btn-group btn-group-toggle" data-toggle="buttons">
                            <label class="btn btn-secondary-">
                                <input
                                        type="checkbox"
                                        autocomplete="off"
                                > Default
                            </label>
                            <label class="btn btn-secondary-">
                                <input
                                        type="checkbox"
                                        autocomplete="off"
                                > Custom
                            </label>
                        </div>
                    </div>
                </b-col> -->
                <!-- TODO: Add conditional logic for checkbox to interact with model-select input, see below -->
                <b-col class="text-center" cols="3">
                    <div class="condition__controls">
                        <b-form-checkbox
                                size="lg"
                                type="checkbox"
                                class="condition__matches campaign offerCapCheckbox"
                                :checked="!!(offerCap.salesRedirectOfferUseDefault === null ? 1 : offerCap.salesRedirectOfferUseDefault)"
                                @change="updateCap($event,`salesRedirectOfferUseDefault`)"
                        >
                            Use default offer redirect
                        </b-form-checkbox>
                    </div>
                </b-col>
                <b-col cols="6">
                    <div class="condition__controls">
                        <!-- TODO: When checkbox is checked, this should be disabled -->
                        <model-select
                                :options="getOffersList()"
                                placeholder="... or select an offer to redirect traffic beyond the caps"
                                :value="offerCap && offerCap.salesRedirectOfferId|| 0"
                                @input="updateCap($event,`salesRedirectOfferId`)"
                                v-show="!!!(offerCap.salesRedirectOfferUseDefault === null ? 1 : offerCap.salesRedirectOfferUseDefault)"
                                class="offerCapInput"
                        >
                        </model-select>
                        <!-- <model-select
                                :options="getOffersList()"
                                placeholder="... or select an offer to redirect traffic beyond the caps"
                                :value="offerCap && offerCap[0].clicksRedirectOfferId|| 0"
                                @input="updateCap($event,`clicksRedirectOfferId`)"
                                v-show="checkedConversions"
                                class="disabled offerCapInput-disabled"
                                :id="defineId(`offerCap`,offerCap[0].clicksRedirectOfferId)"
                        >
                        </model-select> -->
                    </div>
                </b-col>
            </b-row>

            <h3 class="line">Clicks cap</h3>

            <b-row class="clicks-amount text-center">
                <b-col cols="3">
                    <div class="condition__controls">
                        <label>Amount (Day)</label>
                        <input type="number"
                               step=1
                               placeholder="1000"
                               min="1" max="99999"
                               :value="offerCap && offerCap.clickDay || 0"
                               @change="updateCap($event, `clickDay`)"
                               class="condition__matches budgetTotal custom-input"
                               pattern="^\d+(?:\.\d{1,2})?$"
                               onblur="this.parentNode.parentNode.style.backgroundColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'inherit':'transparent'
                                    ">
                    </div>
                </b-col>
                <b-col cols="3">
                    <div class="condition__controls">
                        <label>Amount (Week)</label>
                        <input type="number"
                               step=1
                               placeholder="1000"
                               min="1" max="99999"
                               :value="offerCap && offerCap.clickWeek || 0"
                               @change="updateCap($event, `clickWeek`)"
                               class="condition__matches budgetTotal custom-input"
                               pattern="^\d+(?:\.\d{1,2})?$"
                               onblur="this.parentNode.parentNode.style.backgroundColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'inherit':'transparent'
                                    ">
                    </div>
                </b-col>

                <b-col cols="3">
                    <div class="condition__controls">
                        <label>Amount (Month)</label>
                        <input type="number"
                               step=1
                               placeholder="1000"
                               min="1" max="99999"
                               :value="offerCap && offerCap.clickMonth || 0"
                               @change="updateCap($event, `clickMonth`)"
                               class="condition__matches budgetTotal custom-input"
                               pattern="^\d+(?:\.\d{1,2})?$"
                               onblur="this.parentNode.parentNode.style.backgroundColor=/^\d+(?:\.\d{1,2})?$/.test(this.value)?'inherit':'transparent'
                                    ">

                    </div>
                </b-col>

                <!-- TODO: Future implementation to eventually have selectable Custom Day/Week/Month values, like the mock -->
                <!-- <b-col cols="3">
                    <div class="condition__controls">
                        <label>&nbsp;</label>
                        <div class="btn-group btn-group-toggle" data-toggle="buttons">
                            <label class="btn btn-secondary-">
                                <input
                                        type="checkbox"
                                        autocomplete="off"
                                > Custom
                            </label>
                            <label class="btn btn-secondary-">
                                <input
                                        type="checkbox"
                                        autocomplete="off"
                                > 10
                            </label>
                        </div>
                    </div>
                </b-col> -->
            </b-row>
            <b-row class="clicks-redirect" style="margin-top: -20px">
                <!-- TODO: Add backend for checkbox -->
                <b-col cols="3">
                    <div class="condition__controls">
                        <b-form-checkbox
                                size="lg"
                                type="checkbox"
                                class="condition__matches campaign offerCapCheckbox"
                                :checked="!!(offerCap.clicksRedirectOfferUseDefault === null ? 1 : offerCap.clicksRedirectOfferUseDefault)"
                                @change="updateCap($event,`clicksRedirectOfferUseDefault`)"
                        >
                            Use default offer redirect
                        </b-form-checkbox>
                    </div>
                </b-col>

                <b-col cols="6">
                    <div class="condition__controls">
                        <model-select
                                :options="getOffersList()"
                                placeholder="... or select an offer to redirect traffic beyond the caps"
                                :value="offerCap.clicksRedirectOfferId"
                                @input="updateCap($event,`clicksRedirectOfferId`)"
                                class="offerCapInput"
                                v-show="!!!(offerCap.clicksRedirectOfferUseDefault === null ? 1 : offerCap.clicksRedirectOfferUseDefault)"
                        >
                        </model-select>
                    </div>
                </b-col>
            </b-row>

            <!-- <b-form-text>* Default redirect LP will be used for banned countries</b-form-text> -->

            <b-row class="text-center modal-footer-1">
                <b-col cols="12">
                    <button type="button" class="btn btn-cancel btn-secondary pull-left" @click="close">Cancel</button>
                    <button type="button" class="btn btn-savebucket btn-primary pull-right" @click="saveLp()">
                        Add or Update
                    </button>
                </b-col>
            </b-row>

            <div class="modal-footer">
            </div>

        </div>
    </div>

</template>

<script>
    import {ModelSelect} from 'vue-search-select'
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        data() {
            return {
                visible: false,
                editMode: false,
                segmentId: 0,
                weight: 0,
                lpId: 0,
                id: 0,
                checkedConversions: false,
                checkedClicks: false,
            }
        },
        props: ['offerId', 'offerCap', 'offers'],
        components: {ModelSelect},
        computed: {
            ...mapGetters('lp', ['getLandingPages']),
            ...mapGetters('countries', ['getCountries'])
        },
        // async mounted() {
        //    debugger
        //     let rule = this.geoRules
        //     debugger
        // },
        methods: {
            ...mapMutations('offer', [
                'changeGeo',
                'allowAll',
                'banAll',
                'updOfferCap',
                'preSaveCap',
                'cancelCap'
            ]),
            ...mapMutations('countries', ['filterCountry']),
            // changeColor() {
            //     this.isInactive = !this.isInactive
            // },
            useDefaultOfferRedirect() {

                // if(this.checkedConversions.checked == true) {
                //     document.querySelector('.offerCapInput').style.display = 'none'
                //     document.querySelector('.offerCapInput-disabled').style.display = 'block'
                //     // return true
                //     return disabled
                // }
                // let addClass = checkedConversions === true ? false : 'disabled'
                // return `${addClass} disabled`
            },
            allowAllEvent() {
                this.allowAll()
            },
            getOffersList() {
                return this.offers
            },
            getClassDisabled(flag) {
                if (flag) {
                    return 'disabled'
                }
            },
            updateCap(event, field) {
                let obj = {}
                obj.fieldName = field
                if (field === `salesRedirectOfferId`
                    || field === `clicksRedirectOfferId`
                    || field === `clicksRedirectOfferUseDefault`
                    || field === `salesRedirectOfferUseDefault`
                ) {
                    if (field === 'clicksRedirectOfferUseDefault'
                        || field === 'salesRedirectOfferUseDefault') {
                        obj.value = Number(event)
                    } else {

                        obj.value = event
                    }
                } else {
                    obj.value = event.target.value
                }

                this.updOfferCap(obj)

            },
            banAllEvent() {
                this.banAll(this.getCountries)
            },
            searchCountry(event) {
                let searchValue = event.target.value
                this.filterCountry(searchValue)
            },
            changeCountry(event, code) {
                console.log(event.target.checked)
                console.log(code)
                let obj = {}
                obj.countryCode = code
                obj.checked = event.target.checked
                this.changeGeo(obj)
            },
            getClassActiveOrNotCountry(code) {
                let include = true
                let exclude = false

                if (this.geoRules) {
                    let rules = JSON.parse(this.geoRules)
                    let match = rules.geo.filter(item => {
                        return item.country === code
                    })
                    if (match.length !== 0) {
                        if (match[0].include === true) {
                            return include
                        } else {
                            return exclude
                        }

                    } else {
                        return exclude
                    }
                }

                return exclude

            },
            defineId(name, id) {
                return `${name}-${id}`
            },
            show(id) {
                this.visible = true
            },
            saveLp(data) {
                this.visible = false
                this.preSaveCap()
                this.$swal.fire({
                    type: 'success',
                    position: 'center',
                    text: `Cap settings saved`,
                    showConfirmButton: false,
                    timer: 1000
                })
            },
            close() {
                this.visible = false
                this.cancelCap()
            },

        }
    }
</script>


<style lang="sass">

    .modal-mask
        position: fixed
        z-index: 9998
        top: 0
        left: 0
        width: 100vw
        height: 100vh
        background-color: rgba(0, 0, 0, .7)
        transition: opacity .3s ease
        display: flex
        align-items: center
        justify-content: center


        .modal-container
            min-width: 60vw
            max-width: 60vw
            max-height: 100vh !important
            padding: 30px 30px 0px 30px
            background: #fff
            box-shadow: 0 2px 8px rgba(0, 0, 0, .33)
            transition: all .3s ease
            overflow: auto


        .modal-body
            margin: 20px 0


        .modal-enter,
        .modal-leave
            opacity: 0


        .modal-enter .modal-container,
        .modal-leave .modal-container
            transform: scale(1.1)
</style>
