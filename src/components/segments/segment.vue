<template>

    <transition name="fade">

        <section :class="getClassSegment(segment.status)" :id="defineId(`segmentSectionId`,segment.id)"
                 @change="updateGroup($event, group)">


                <!-- Work in progress -->
               <!-- <b-button class="mr-2" @click="openAll">Open all</b-button> -->
               <!-- <b-button @click="closeAll">Close all</b-button> -->
                <!-- <span v-b-tooltip.hover.top="'Expand'" @click="openAll">
                    <i class="fas fa-chevron-down primaryblue" data-fa-transform="shrink-2"></i>
                </span>
                <span v-b-tooltip.hover.top="'Collapse'" @click="closeAll">
                    <i class="fas fa-chevron-up" data-fa-transform="shrink-2"></i>
                </span>

         <div class="row mb-4" v-for="(collapse, index) in collapses" :key="index">
               <b-button @click="collapse.show = !collapse.show" variant="primary">Toggle Collapse {{ index + 1 }}</b-button>
               <b-collapse v-model="collapse.show" id="collapse-1" class="mt-2">
                  <b-card>
                     <p class="card-text">Collapse {{ index + 1 }} contents Here</p>
                  </b-card>
               </b-collapse>
         </div> -->

            <b-row class="text-center" align-v="center">
                <b-col col lg="8">
                    <h1
                        class="segment__name"
                        :title="getTitleWithSegmentId(segment)" 
                        :class="visible ? null : 'collapsed'"
                        :aria-expanded="visible ? 'true' : 'false'"
                        aria-controls="collapse-4"
                        @click="visible = !visible"
                    >
                        <span :title="getTitle(segment)" class="segment__active">

                            <span v-show="this.visible === false" v-b-tooltip.hover.top="'Expand'">
                                <i class="fas fa-chevron-down primaryblue" data-fa-transform="shrink-2"></i>
                            </span>
                            <span v-show="this.visible === true" v-b-tooltip.hover.top="'Collapse'">
                                <i class="fas fa-chevron-up" data-fa-transform="shrink-2"></i>
                            </span>

                            {{segment.name}} <span class="segment-name-id">(ID: {{segment.id}})</span>

                        </span>
                    </h1>
                </b-col>
                <b-col col lg="4">
                    <b-button variant="light" @click="edit(segment.id)" v-b-tooltip.hover.top="'Edit Segment'"
                              style="z-index:2">
                        <i class="far fa-edit" data-fa-transform="shrink-1"></i>
                    </b-button>

                    <b-button variant="light" @click="delSegment(segment.id)" v-b-tooltip.hover.top="'Delete Segment'"
                              style="z-index:2">
                        <i class="far fa-trash-alt" data-fa-transform="shrink-1"></i>
                    </b-button>

                    <b-button variant="light" @click="editNew(segment.id)" v-b-tooltip.hover.top="'Edit Segment New'"
                              style="z-index:2">
                        <i class="far fa-pencil" data-fa-transform="shrink-1"></i>
                    </b-button>


                    <b-form-checkbox
                            class="active"
                            name="check-button"
                            :checked="segment.status==='active'"
                            @change="activeInactiveSwitch($event, segment)"
                            switch>
                    </b-form-checkbox>

                </b-col>
            </b-row>

            <b-collapse id="collapse-4" v-model="visible" class="mt-2">
                    <b-row class="text-center lp-container" align-v="center">
                        <b-col col lg="6">
                            <span class="lp-label">Landing Pages</span>
                        </b-col>
                        <b-col col lg="6">
                            <b-button variant="primary btn-sm" v-b-modal.modal-scrollable
                                    @click="showLPModal(segment.id)"
                            >
                                <i class="far fa-layer-plus" data-fa-transform="shrink-1"></i> New LP
                            </b-button>

                            <LandingPagesComp :id="'modal_' + segment.id" :ref="'modal_' + segment.id"
                                            :segment="segment">
                            </LandingPagesComp>
                        </b-col>
                    </b-row>

                    <b-badge variant="light"
                            v-for="lp in segment.lp"
                            :key = "lp.id"
                            v-b-modal.modal-edit-lp
                    >

                        <span class="landing-page">
                            <span class="landing-page-name" v-if="lp.name.length<=29"
                                v-b-popover.hover.focus.bottom.html="lp.name" :title="'ID:' +lp.id + ' Weight:' + lp.weight">
                                {{ lp.lpId }} {{ lp.name }}
                            </span>
                            <span class="landing-page-name" v-if="lp.name.length>=30"
                                v-b-popover.hover.focus.bottom.html="lp.name" :title="'ID:' + lp.id + ' Weight:' + lp.weight">
                                {{ lp.name.substring(0,30)+"..." }}
                            </span>
                            <b-button variant="light" @click="editSegmentLp(segment.id, lp.id, lp.lpId, lp.weight)"
                                    v-b-tooltip.hover.top="'Edit LP'"
                                    style="z-index:2">
                                <i class="far fa-pencil" data-fa-transform="shrink-2"></i>
                            </b-button>
                            <b-button variant="light" @click="delSegmentLp(lp.id)" v-b-tooltip.hover.top="'Delete LP'"
                                    style="z-index:2">
                                <i class="far fa-trash" data-fa-transform="shrink-2"></i>
                            </b-button>

                        </span>

                        (<i class="far fa-weight-hanging" data-fa-transform="shrink-4"></i> {{lp.weight}})
                    </b-badge>

                    <br>
                    <span class="text-small"><i class="far fa-weight-hanging" data-fa-transform="shrink-4"></i> Weight Total: {{getSumWeight(segment.lp)}} / 100</span>

            </b-collapse>

            <div v-if="errors" class="validate_error">
                <span v-for="error in errors">{{ error }}</span>
            </div>

        </section>

    </transition>
</template>

<script>
    import {mapActions, mapMutations, mapGetters} from "vuex";
    import {ModelSelect} from 'vue-search-select'

    import LandingPagesComp from './landingPages'

    export default {
        name: "segment",
        components: {ModelSelect, LandingPagesComp},
        props: {
            segment: Object
        },
        data() {
            return {
                errors: [],
                showMenu: false,
                showLandingPages: false,
                checked: false,
                detailsAreVisible: false,
                id: Number(this.$route.params.id),
                visible: false,
                collapses: [ 
                    { show: false },
                    // { show: false },
                    // { show: false }
                ],
            };
        },
        methods: {
            openAll() {
                this.collapses.forEach(collapse => {
                    collapse.show = true
                })
                //     if (id) {
                //         this.collapses.forEach(collapse => {
                //     collapse.show = true
                // })
                //     } else {
                //         this.collapses.forEach(collapse => {
                //             collapse.show = false
                //         })
                //     }
            },
            closeAll() {
                this.collapses.forEach(collapse => {
                    collapse.show = false
                })
            },
            defineId(name, id) {
                return `${name}-${id}`
            },
            toggleDetails() {
                this.detailsAreVisible = !this.detailsAreVisible;
            },
            getSumWeight(lp) {
                let sum = 0
                lp.map(item => {
                    sum = sum + item.weight
                })
                return sum
            },
            getClassSegment(status) {
                let classStatus = status === 'active' ? 'segment' : 'segmentInActive'
                return `${classStatus} segment__draggable`
            },
            activeInactiveSwitch(status, segment) {
                let self = this
                self.status = status && 'active' || 'inactive'
                self.segmentId = segment.id
                self.segmentName = segment.name
                this.$nextTick(async () => {
                    let obj = {}
                    obj.status = self.status
                    obj.segmentId = self.segmentId
                    obj.name = self.segmentName

                    let res = await this.$store.dispatch('segment/updateSegmentStatus', obj)

                    if (res && res.segmentId) {
                        self.$swal.fire({
                            type: 'success',
                            position: 'top-end',
                            title: `Segment status  updated`,
                            showConfirmButton: false,
                            timer: 1000
                        })
                        location.reload()
                    } else {
                        self.$swal.fire({
                            title: `Segment status was not updated`,
                            type: 'error',
                            text: 'Please check backend errors',
                            confirmButtonColor: '#2ED47A',
                        })
                    }

                    // location.reload()
                })
            },
            showLPModal(segmentId, id, lpId, weight) {
                let modal_id = 'modal_' + segmentId
                if (id) {
                    // edit
                    this.$refs[modal_id].show(segmentId, id, lpId, weight)
                } else {
                    this.$refs[modal_id].show(segmentId)
                }

                console.log('this.$refs[modal_id]-', this.$refs[modal_id])
            },
            handleChangeLp(lpId, item) {
                item.landingPageId = lpId
            },
            getStatusList() {
                return [
                    {id: 0, name: 'Active'},
                    {id: 1, name: 'Inactive'},
                ]
            },
            getFieldName(field) {
                return this.getBucket.length > 0 && this.getBucket[0][field]
            },
            updateGroup(e, group) {
                console.log(e, group)
            },
            edit(id) {
                let segmentType = this.$route.params.type
                this.$router.push(`/segment/${segmentType}/${id}`)
            },
            editNew(id) {
                let segmentType = this.$route.params.type
                this.$router.push(`/segmentView/${segmentType}/${id}/0`)
            },
            async saveLp(segment) {
                let res = await this.$store.dispatch('segment/updateLandingPage', segment)
                if (res) {
                    this.$swal.fire({
                        type: 'success',
                        position: 'top-end',
                        title: `Segment ID ${segment.id} ${segment.name} updated`,
                        showConfirmButton: false,
                        timer: 1000
                    })
                }
            },
            async editSegmentLp(segmentId, id, lpId, weight) {
                console.log(lpId)
                this.showLPModal(segmentId, id, lpId, weight)
            },
            async delSegmentLp(lpId) {
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
                        obj.id = lpId
                        this.$store.dispatch('lp/deleteSegmentLp', obj).then(res => {
                            if (res.id) {
                                this.$swal.fire({
                                    type: 'success',
                                    position: 'top-end',
                                    title: `Landing page ID ${obj.lpId} deleted`,
                                    showConfirmButton: false,
                                    timer: 1000
                                })
                                location.reload()
                            } else {
                                this.$swal.fire({
                                    title: `Landing page ID ${obj.lpId} was not deleted`,
                                    type: 'error',
                                    text: 'Please check backend errors',
                                    confirmButtonColor: '#2ED47A',
                                })
                            }
                        })
                    }
                })
            },
            async saveLp(segment) {
                let res = await this.$store.dispatch('segment/updateLandingPage', segment)
                if (res) {
                    this.$swal.fire({
                        type: 'success',
                        position: 'top-end',
                        title: `Segment ID ${segment.id} ${segment.name} updated`,
                        showConfirmButton: false,
                        timer: 1000
                    })
                }
            },
            async delSegment(id) {
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
                        obj.id = id
                        obj.segmentType = this.$route.params.type
                        this.$store.dispatch('segments/deleteSegmentAction', obj).then(res => {
                            if (res.id) {
                                this.$swal.fire({
                                    type: 'success',
                                    position: 'top-end',
                                    title: `Segment ID ${id} deleted`,
                                    showConfirmButton: false,
                                    timer: 1000
                                })
                                location.reload()
                            } else {
                                this.$swal.fire({
                                    title: `Segment ID ${id} was not deleted`,
                                    type: 'error',
                                    text: 'Please check backend errors',
                                    confirmButtonColor: '#2ED47A',
                                })
                            }
                        })
                    }
                })
            },
            getTitle(segment) {
                return 'Expand or Collapse'
            },
            getTitleWithSegmentId(segment) {
                return `${segment.name}, ID:${segment.id}`
            },
            getClass(segment) {
                return 'segment__empty'
            },
            ...mapActions("segments", ["update", "removeAndUpdateOrder"]),
            ...mapMutations("segments", ["toggleActive"]),
            ...mapMutations(["toggleMask", "toggleConfirm"]),
            ...mapMutations("landingPages", ["processLandingPagesEdit"])
        },
        computed: {
            ...mapGetters('segments', ['getSegments']),
            ...mapGetters('countries', ['getCountries']),
            ...mapGetters('lp', ['getLandingPages'])
        },
    };
</script>

<style lang="scss">
    span.segment-name-id {
        color: #7F98A5;
    }

    span.text-small {
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        float: right;
        margin-top: 5px;
    }

    .badge-light {
        color: #7F98A5;
        background-color: #E3EEF4;
        margin: 5px 0px 5px 0px;
        width: 100%
    }

    .custom-switch {
        margin-left: 4.4rem;
        z-index: 1;
    }

    .segment {
        opacity: 1;
        margin: 3px 13px 0px 0px;
        min-height: auto;
        max-width: 350px;
        min-width: 350px;
        padding: 0.5rem;
        position: relative;
        border-radius: 7px;
        border: 1px solid #2ED47A;
        background: #fff;
        user-select: none;
    }

    .segmentInActive {
        opacity: 1;
        margin: 3px 13px 0px 0px;
        min-height: auto;
        min-width: 350px;
        max-width: 350px;
        padding: 0.5rem;
        position: relative;
        border-radius: 7px;
        // border: solid rgba(75, 133, 225, 0.15) 2px;
        border: 1px solid #E3EEF4;
        background: #fff;
        user-select: none;
    }

    .segment.segment__draggable, .segmentInActive.segment__draggable {
        cursor: grab;
        height: auto;
        -webkit-transition: all 0.3s ease;
        -o-transition: all 0.3s ease;
        -moz-transition: all 0.3s ease;
        -ms-transition: all 0.3s ease; 
        transition: all 0.3s ease;
    }

    .segment.segment__collapsed {
        height: 55px !important;
        -webkit-transition: all 0.3s ease;
        -o-transition: all 0.3s ease;
        -moz-transition: all 0.3s ease;
        -ms-transition: all 0.3s ease; 
        transition: all 0.3s ease;
    }

    // .segment.segment__draggable:hover, .segmentInActive.segment__draggable:hover {
    // }

    .segment.segment__draggable:hover {
        box-shadow: 1px 1px 15px rgba(46,212,122,0.3);
    }

    .segmentInActive.segment__draggable:hover {
        box-shadow: 1px 1px 15px rgba(227,238,244,0.3);
    }

    .sortable-ghost {
        border: 2px dashed #E3EEF4;
    }

    .segment__empty {
        color: red;
    }

    .segment__name {
        color: #3A3852;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.3px;
        margin: 0 0 0.1rem 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 300px;
    }

    .segment__default {
        font-style: italic;
        height: 80px;
    }
</style>
