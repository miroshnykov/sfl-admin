<template>
    <div id="edit-segment">
        <topbar></topbar>
        <menunav></menunav>

        <h2 class="title"><span class="editingMode">Editing <i class="far fa-pencil"
                                                               data-fa-transform="shrink-2"></i></span> Segment
            ({{this.$route.params.type}})</h2>

        <b-row class="text-center">
            <b-col cols="1">
                <div class="condition__controls">
                    <label>ID</label>
                    <input type="text"
                           class="condition__matches campaign custom-input"
                           :value="id"
                           disabled
                    >
                </div>
            </b-col>
            <b-col cols="6">
                <div class="condition__controls">
                    <label>Segment Name</label>
                    <input type="text"
                           placeholder="ex: My First Segment"
                           class="condition__matches campaign custom-input"
                           :value="getSegmentName"
                           :id="defineSegmentNameId(id)"
                           @change="changeField($event, `segmentName`)"
                           maxlength="25"
                    >
                    <!--                    -->
                    <b-form-text id="lastModified">
                        Date added: {{getSegmentDateAdded && formatDate_(new Date(getSegmentDateAdded * 1000))}}
                        / Last updated: {{ formatDate_(new Date(Number(getSegmentDateUpdated))) }}
                    </b-form-text>
                </div>
            </b-col>

            <b-col cols="2">
                <div class="condition__controls">
                    <label>Status</label>
                    <select
                            :id="defineStatusId(id)"
                            class="condition__dimension-name condition__matches custom-select"
                            @change="changeField($event, `status`)"
                    >
                        <option
                                id="filterType"
                                v-for="{id, name} in getStatusList()"
                                :value="id"
                                :selected="capitalizeFirstLetter(name) === capitalizeFirstLetter(getSegmentStatus && getSegmentStatus || '')"
                                :key="id"
                        >{{name}}
                        </option>

                    </select>
                </div>
            </b-col>
            <!-- <b-col cols="3">
                <div class="condition__controls">
                    <label>Last Modified</label>
                    <input type="text"
                           class="condition__matches campaign custom-input"
                           disabled
                    >
                </div>
            </b-col> -->
        </b-row>

        <b-col cols="2">
            <label> Product override </label>
            <b-form-checkbox
                    class="active"
                    name="check-button"
                    :checked="!!getSegmentIsOverrideProduct"
                    @change="activeInactiveSwitch($event)"
                    switch
            >
            </b-form-checkbox>
        </b-col>

        <hr>


        <conditions :segmentFilter="this.getSegmentFilter"/>

        <hr>


    </div>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex'
    import conditions from './conditions.vue'
    import topbar from '../topbar.vue'
    import menunav from '../menunav.vue'
    import {formatData} from '../../helpers'

    export default {
        name: 'edit-segment',
        components: {menunav, topbar, conditions},
        computed: {
            ...mapGetters('segments', ['getSegments']),
            ...mapGetters('segment', [
                'getSegmentFilter',
                'getSegmentName',
                'getSegmentStatus',
                'getSegmentIsOverrideProduct',
                'getSegmentDateUpdated',
                'getSegmentDateAdded'
            ]),
        },
        segmentFilter: [],
        async mounted() {
            await this.$store.dispatch('segment/saveSegmentConditionsStore', this.id)
            let obj={}
            obj.segmentId = this.id

            await this.$store.dispatch('affiliates/saveAffiliatesStore',obj )
            await this.$store.dispatch('countries/saveCountriesStore')
            await this.$store.dispatch('dimensions/saveDimensionsStore')
            await this.$store.dispatch('campaigns/saveCampaignsStore', this.id)
            // await this.$store.dispatch('lp/saveLPStore')
            await this.$store.dispatch('prods/saveProdsStore')
            await this.$store.dispatch('affiliateWebsites/saveAffiliateWebsitesStore')
            await this.$store.dispatch('advertisers/saveAdvertisersStore')
        },
        methods: {
            ...mapMutations('segment', ['updateField','overrideProduct']),
            getFieldName(field) {
                return this.getCampaign.length > 0 && this.getCampaign[0][field]
            },
            activeInactiveSwitch(data) {
                this.overrideProduct(data)
            },
            async changeField(event, field) {

                if (event.target) {
                    if (field === 'segmentName') {
                        let el = document.querySelector(`#${field}-${this.id}`)
                        if (Number(event.target.value) === 0) {
                            el && el.classList.add('error')
                            this.$swal.fire({
                                title: 'Validation Error',
                                text: 'Please name your segment.',
                            })
                            return
                        } else {
                            el && el.classList.remove('error')
                        }
                    }

                    let updateFieldData = {}
                    updateFieldData.value = event.target.value
                    updateFieldData.field = field
                    this.updateField(updateFieldData)
                }

            },
            formatDate_(date) {
                return formatData(date)
            },
            defineStatusId(id) {
                return `status-${id}`
            },
            defineSegmentNameId(id) {
                return `segmentName-${id}`
            },
            capitalizeFirstLetter(str) {
                return str && str.charAt(0).toUpperCase() + str.slice(1)
            },
            getStatusList() {
                return [
                    {id: 0, name: 'Active'},
                    {id: 1, name: 'Inactive'}
                ]
            },
            async copyText(landingPage) {
                try {
                    await navigator.clipboard.writeText(landingPage);
                    this.$swal.fire({
                        type: 'success',
                        position: 'top-end',
                        title: `Copied URL: \n ${landingPage} \n   to clipboard `,
                        showConfirmButton: false,
                        timer: 2000
                    })
                } catch (err) {
                    console.error('Failed to copy: ', err);
                }
            },
        },
        data() {
            return {
                id: Number(this.$route.params.id)
            };
        }
    };
</script>

<style lang="sass">
    .container
        margin-left: 290px
</style>