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

        </b-row>


        <table class="table table-striped child-row tableFixHead lp-table">
            <thead>
            <tr>
                <th scope="col">Position</th>
                <th scope="col">Rules</th>
                <th scope="col">Dim Name</th>
                <th scope="col">Value</th>
                <th scope="col">Action</th>
            </tr>
            </thead>

            <tr :id="defineRowId(segmentItem.position)" scope="row" v-for="segmentItem in this.getSegmentFilter">

                <td>{{ JSON.stringify(segmentItem.position) }}</td>
                <td>{{ JSON.stringify(segmentItem.segmentRuleIndex) }}</td>
                <td>{{ JSON.stringify(segmentItem.dimensionName) }}</td>
                <td>{{ JSON.stringify(segmentItem.value) }}</td>
<!--                <td>enable:{{JSON.stringify(editEnableDisable[segmentItem.position])}}</td>-->
                <td>

                    <b-button variant="light" class="btn-add-line" style="float:left;" @click="editEnableDisableSwitcher(segmentItem.position)">
                        <i class="far fa-plus"></i> Edit
                    </b-button>

                    <span class="detailsBlock" v-if="editEnableDisable[segmentItem.position]">
                        <b-button variant="primary btn-sm" v-b-modal.modal-scrollable
                                  @click="showEditConditionsModal(segmentItem.position)"
                        >
                            <i class="far fa-layer-plus" data-fa-transform="shrink-1"></i> Edit
                        </b-button>

                        <EditConditions
                                :ref="`modal_conditions_` + segmentItem.position"
                                :segmentItem="segmentItem"
                        >
                        </EditConditions>
                    </span>

                    <button
                            @click="addCondition(segmentItem.segmentRuleIndex)"
                            class="add-condition"
                            v-b-tooltip.hover.top="'Add OR condition'"
                            v-show="segmentItem.orAndDisabled"
                    >
                        OR
                    </button>

                    <button
                            @click="addFilter(segmentItem)"
                            class="add-condition"
                            v-b-tooltip.hover.top="'Add AND condition'"
                            v-show="segmentItem.orAndDisabled"
                    >
                        AND
                    </button>
                </td>
                <td style="visibility:hidden;">{{detailsAreVisible}}</td>
            </tr>
        </table>


    </div>
</template>

<script>
    import {mapState, mapGetters, mapMutations} from 'vuex'
    import conditions from './conditions.vue'
    import topbar from '../topbar.vue'
    import menunav from '../menunav.vue'
    import {formatData} from '../../helpers'
    import EditConditions from './editConditions'
    import Caps from '../offers/caps'

    export default {
        name: 'edit-segment',
        components: {menunav, topbar, conditions, EditConditions, Caps},
        computed: {
            ...mapGetters('segments', ['getSegments']),
            ...mapGetters('segment', ['getSegmentFilter', 'getSegmentName', 'getSegmentStatus', 'getSegmentDateUpdated', 'getSegmentDateAdded']),
        },
        segmentFilter: [],
        async mounted() {
            await this.$store.dispatch('segment/saveSegmentConditionsStore', this.id)
            let position = this.$route.params.position
            if (position) {
                let positionMove = Number(position) - 5
                if (positionMove > 0) {
                    const el = document.getElementById(`segmentRow-${positionMove}`)
                    el.scrollIntoView({behavior: "smooth"})

                    const elColor = document.getElementById(`segmentRow-${position}`)
                    elColor.style.background = 'azure'
                }


            }


            // await this.$store.dispatch('affiliates/saveAffiliatesStore')
            // await this.$store.dispatch('countries/saveCountriesStore')
            // await this.$store.dispatch('dimensions/saveDimensionsStore')
            // await this.$store.dispatch('campaigns/saveCampaignsStore')
            // await this.$store.dispatch('lp/saveLPStore')
            // await this.$store.dispatch('prods/saveProdsStore')
            // await this.$store.dispatch('affiliateWebsites/saveAffiliateWebsitesStore')
        },
        methods: {
            ...mapMutations('segment', ['updateField', 'addCondition', 'addFilter']),
            editEnableDisableSwitcher(position) {
                this.editEnableDisable[position] = !this.editEnableDisable[position]
                this.detailsAreVisible = !this.detailsAreVisible;
            },
            showEditConditionsModal(id) {
                let modal_id = 'modal_conditions_' + id
                this.$refs[modal_id][0].show(id)

                console.log('this.$refs[modal_id]-', this.$refs[modal_id])
            },
            getFieldName(field) {
                return this.getCampaign.length > 0 && this.getCampaign[0][field]
            },
            editRule(item) {
                // /segment/:type/:id/rule/:position
                // debugger
                this.$router.push(`/segmentEditRules/${this.$route.params.type}/${this.id}/rule/${item.position}`)
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
            defineRowId(id) {
                return `segmentRow-${id}`
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
                id: Number(this.$route.params.id),
                detailsAreVisible: false,
                editEnableDisable: [],
            };
        }
    };
</script>

<style lang="sass">
    .container
        margin-left: 290px
</style>