<template>
    <div id="campaigns">
        <menunav></menunav>
        <h1>Manage Custom Offers</h1>

        <div class="segment-panel">
            <!-- <input type="text" class="search-box"  placeholder="Search offers..."/> -->
            <b-button variant="primary" @click="addOffer">
                Create New Offer
            </b-button>

            <div class="offers">
                <v-client-table :data="getOffers" :columns="columns" :options="options">

                <div slot="id" slot-scope="props" class="text-center">
                    <span class="id">{{props.row.id}}</span>
                </div>

            <!-- <div slot="offerId" slot-scope="props" class="text-center">
                <span class="offerId">{{ offer.id }}</span>
                </div> -->

                <div slot="name" slot-scope="{row, update, setEditing, isEditing, revertValue}">
                    <span @click="edit(row)">
                        <!-- <span class="segment-name" @click="edit(row)">{{row.name}}</span> -->
                        <span class="segment-name" v-if="row.name.length<=15" @click="edit(row)">
                            {{ row.name }}
                        </span>
                        <span class="segment-name" v-if="row.name.length>=16" v-b-tooltip.hover.focus.bottom="row.name" @click="edit(row)">
                            {{ row.name.substring(0,16)+"..." }}
                        </span>
                    </span>
                    <b-form-text id="spent-values">
                        Updated {{timeSince_(row.dateUpdated)}} ago
                    </b-form-text>
                </div>

                <div slot="advertiserName" slot-scope="props">
                    <span v-if="props.row.advertiserName.length<=15">
                        {{props.row.advertiserName}}
                    </span>
                    <span v-if="props.row.advertiserName.length>=16" v-b-tooltip.hover.focus.bottom="props.row.advertiserName">
                        {{ props.row.advertiserName.substring(0,16)+"..." }}
                    </span>
                </div>

                <div slot="payIn" slot-scope="props">
                    <span class="budget-daily">
                        <span v-if="props.row.currencyId === 1">$</span>
                        <span v-else-if="props.row.currencyId === 2">€</span>
                        <span v-else-if="props.row.currencyId === 3">R$</span>
                        <span v-else-if="props.row.currencyId === 4">£</span>
                        {{props.row.payIn}}
                    </span>

                    <b-form-text id="currency">
                    <span v-if="props.row.currencyId === 1">USD</span>
                    <span v-else-if="props.row.currencyId === 2">EUR</span>
                    <span v-else-if="props.row.currencyId === 3">BRL</span>
                    <span v-else-if="props.row.currencyId === 4">GPB</span>
                    </b-form-text>
                </div>

                <div slot="payOut" slot-scope="props">
                    <span class="budget-daily">
                        <span v-if="props.row.currencyId === 1">$</span>
                        <span v-else-if="props.row.currencyId === 2">€</span>
                        <span v-else-if="props.row.currencyId === 3">R$</span>
                        <span v-else-if="props.row.currencyId === 4">£</span>
                        {{props.row.payOut}}
                    </span>

                    <b-form-text id="currency">
                    <span v-if="props.row.currencyId === 1">USD</span>
                    <span v-else-if="props.row.currencyId === 2">EUR</span>
                    <span v-else-if="props.row.currencyId === 3">BRL</span>
                    <span v-else-if="props.row.currencyId === 4">GPB</span>
                    </b-form-text>
                </div>

                <div slot="landingPage" slot-scope="props">
                <span class="landing-page-box" v-b-tooltip.hover.focus.bottom="props.row.urlLandingPage">
                    <!-- <span class="landing-page-name">
                        {{props.row.nameLandingPage}}
                    </span> -->
                    <span class="landing-page-name" v-if="props.row.nameLandingPage.length<=19" @click="copyText(props.row.urlLandingPage)">
                        {{ props.row.nameLandingPage }}
                    </span>
                    <span class="landing-page-name" v-if="props.row.nameLandingPage.length>=20" @click="copyText(props.row.urlLandingPage)">
                        {{ props.row.nameLandingPage.substring(0,20)+"..." }}
                    </span>
                </span>
                    <button
                            @click="copyText(props.row.urlLandingPage)"
                            class="btn btn-link"
                            v-b-tooltip.hover.right="'Copy URL'">
                        <i class="far fa-copy"></i>
                    </button>
                </div>

                <div slot="verticalName" slot-scope="props">
                    <span v-if="props.row.verticalName.length<=15">
                        {{props.row.verticalName}}
                    </span>
                    <span v-if="props.row.verticalName.length>=16" v-b-tooltip.hover.focus.bottom="props.row.verticalName">
                        {{ props.row.verticalName.substring(0,16)+"..." }}
                    </span>
                </div>

                <div slot="status" slot-scope="props">
                    <div v-if="props.row.status === 'inactive'">
                    <div class="status inactive">{{props.row.status}}</div>
                    </div>
                    <div v-else-if="props.row.status === 'public'">
                    <div class="status active">{{props.row.status}}</div>
                    </div>
                    <div v-else-if="props.row.status === 'private'">
                    <div class="status private">{{props.row.status}}</div>
                    </div>
                    <div v-else-if="props.row.status === 'apply_to_run'">
                    <div class="status applyToRun">Apply to Run</div>
                    </div>
                </div>

                <div slot="actions" slot-scope="props">
                    <button
                            class="btn btn-link"
                            v-b-tooltip.hover.bottom="'Edit Offer'"
                            @click="edit(props.row)"
                    >
                        <i class="far fa-pencil"></i>
                    </button>
                    <button
                            :disabled="props.row.countOfCampaigns !== 0"
                            class="btn btn-link"
                            v-b-tooltip.hover.bottom="'Delete Offer'"
                            @click="deleteOffer(props.row)"
                    >
                        <i class="far fa-trash"></i>
                    </button>
                </div>

                <!-- <div slot="child_row" slot-scope="props">
                    <div class="segment-child animated fadeIn">

                    </div>
                </div> -->

                </v-client-table>
            </div>
        </div>


    </div>
</template>

<script>
    import 'bootstrap/dist/css/bootstrap.css'
    import {mapActions, mapState, mapGetters, mapMutations} from 'vuex'
    import menunav from '../menunav.vue'
    import {formatData, timeSince} from '../../helpers'
    import {getCookie} from '../../helpers'

    let tableColumnsLog = [
        'id',
        'name',
        'advertiserName',
        'payIn',
        'payOut',
        'landingPage',
        'verticalName',
        'countOfCampaigns',
        'status',
        'actions',
    ]

    export default {
        components: {menunav},
        computed: {
            ...mapGetters('offers', ['getOffers'])
        },
        async mounted() {

            let token = getCookie('accessToken')
            if (token) {
                this.saveOffersStore()
            }

        },
        methods: {
            ...mapMutations('offers', ['delOffer']),
            ...mapActions("offers", ["saveOffersStore"]),
            async uOfferName(data) {

                let res = await this.$store.dispatch('offer/updOfferName', data)

                if (res.id) {
                    this.$swal.fire({
                        type: 'success',
                        position: 'top-end',
                        title: 'Offer name has been updated',
                        showConfirmButton: false,
                        timer: 1000
                    })
                }
            },
            async copyText(urlLandingPage) {
                try {
                    await navigator.clipboard.writeText(urlLandingPage);
                    this.$swal.fire({
                        type: 'success',
                        position: 'top-end',
                        title: `Copied URL to clipboard`,
                        text: `${urlLandingPage}`,
                        showConfirmButton: false,
                        timer: 2000
                    })
                } catch (err) {
                    console.error('Failed to copy: ', err);
                }
            },
            timeSince_(data) {
                return timeSince(new Date(Number(data)))
            },
            formatData_(data) {
                return formatData(data * 1000)
            },
            edit(data) {
                this.$router.push(`/offer/${data.id}`)
            },
            deleteOfferAction(id){
                this.delOffer(id)
            },
            deleteOffer(data) {
                this.$swal.fire({
                    type: 'warning',
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    showCancelButton: true,
                    confirmButtonColor: '#FE5D65',
                    cancelButtonColor: '#ACC3CF',
                    confirmButtonText: 'Yes, delete',
                    reverseButtons: true,
                }).then((result) => {
                    if (result.value) {

                        let obj = {}
                        obj.id = data.id
                        this.$store.dispatch('offer/delOffer', obj).then(res => {
                            if (res && res.id) {
                                this.$swal.fire({
                                    type: 'success',
                                    position: 'top-end',
                                    title: `Offer ID ${obj.id} deleted`,
                                    showConfirmButton: false,
                                    timer: 1000
                                })
                                // location.reload()
                                this.deleteOfferAction(data.id)
                            } else {
                                this.$swal.fire({
                                    title: `Offer ID ${obj.id} was not deleted`,
                                    type: 'error',
                                    text: 'Please check backend errors',
                                    confirmButtonColor: '#2ED47A',
                                })
                            }
                        })
                    }
                })

            },
            // async createOffer() {
                // this.$router.push(`/offer/new`)
                // let offerId = await this.$store.dispatch('offer/createOfferStore',this)
                // if (offerId) {
                //     this.$router.push(`/offer/${offerId}`)
                // }
            // },
            addOffer() {
                this.$swal.fire({
                    title: 'Create New Offer',
                    html:
                        `<label for="swal-input1"></label>
                        <input id="swal-input1" class="swal2-input" placeholder="Offer Name" maxlength="25"
                             onblur="
                                 if(this.value === ''){
                                    alert('Enter offer name ')
                                    document.querySelector('#swal-input1').style.background = '#f38282'
                                    document.querySelector('.swal2-confirm').style.display = 'none'
                                    return false
                                } else {
                                    document.querySelector('.swal2-confirm').style.display = 'inline-block'
                                    document.querySelector('#swal-input1').style.background = 'white'
                                }
                            "
                        >
                        <div class="row segment-popup">
                        <div class="col-md-6">
                    `,
                    confirmButtonColor: '#2ED47A',
                    cancelButtonColor: '#E3EEF4',
                    showCancelButton: true,
                    reverseButtons: true,
                    confirmButtonText: '<i class="fas fa-check"></i>',
                    cancelButtonText: '<i class="fas fa-times"></i>',
                    backdrop: `
                        rgba(0,0,123,0.2)
                    `,
                    preConfirm: () => {
                        if (document.getElementById('swal-input1').value
                        ) {
                            return [
                                document.getElementById('swal-input1').value
                            ]
                        } else {
                            this.$swal.fire({
                                title: 'Validation Error',
                                text: 'Please name your offer.',
                            })
                            return
                        }

                    }

                }).then((result) => {
                    if (result.dismiss === "cancel") {
                        return
                    }

                    if (result.value[0]
                    ) {
                        let offerData = {}
                        offerData.name = result.value[0]
                        let self = this
                        self.offerName = offerData.name
                        this.$store.dispatch('offer/createOffer', offerData).then((res) => {
                            let newOfferId = res.id
                            self.$router.push(`/offer/${newOfferId}`)
                        })

                    } else {
                        this.$swal.fire({
                            title: 'Missing information',
                            type: 'error',
                            text: 'Please name your offer and try again.',
                            confirmButtonColor: '#2ED47A',
                        })
                    }

                })
            },
        },
        data() {
            return {
                isModalVisible: false,
                offerName: '',
                eventData: [],
                tableData: [],
                editableColumns: ['offerName', 'status'],
                columns: tableColumnsLog,
                countOfRecords: 0,
                options: {
                    // columnsDropdown: true,
                    headings: {
                        id: 'ID',
                        name: 'Offer Name',
                        advertiserName: 'Advertiser',
                        verticalName: 'Vertical',
                        payIn: 'PayIn',
                        payOut: 'PayOut',
                        landingPage: 'Default LP',
                        countOfCampaigns: 'Campaigns',
                        status: 'Status',
                    },
                    editableColumns: ['offerName'],
                    // sortable: tableColumnsLog,
                    // sortable: [''],
                    sortable: ['id','name','advertiserName','verticalName','status'],
                    sortIcon: {
                        base: 'fa fad',
                        up: 'fa-sort-up',
                        down: 'fa-sort-down',
                        is: 'fa-sort'
                    },
                    filterable: tableColumnsLog,
                    highlightMatches: true,
                    resizableColumns: false,
                    showChildRowToggler: false,
                    perPage: 10,
                    perPageValues: [5, 10, 25, 100],
                    pagination: {
                        nav: 'fixed',
                        edge: true,
                    },
                    texts: {
                        count: "Showing {from} to {to} of {count} offers|Showing {count} offers|Showing 1 offer",
                        first: "First",
                        last: "Last",
                        filter: "Filter:",
                        filterPlaceholder: "Search...",
                        limit: "Show per page",
                        page: "Page:",
                        noResults: "No matching offers",
                        filterBy: "Filter by {column}",
                        loading: "Loading...",
                        defaultOption: "Select {column}"
                    },
                },
            }
        }
    }
</script>

<style lang="sass">
    .container
        margin-left: 290px
</style>