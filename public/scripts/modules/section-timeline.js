import { bus } from './bus.js';
import { default as sumideroAPI } from './api.js';
import { default as sumideroTimelinePagination } from "./timeline-pagination.js";
import { default as sumideroTimelinePostItem } from "./timeline-post-item.js";
import { mixinRoutes } from './mixins.js';

const template = `
    <div class="container">
        <div v-if="hasResults">
            <sumidero-timeline-pagination v-bind:disabled="loading" v-bind:data="pager" v-on:change="refreshFromPager($event.currentPage, $event.resultsPage)"></sumidero-timeline-pagination>
            <div v-if="! loading" class="sumidero-post" v-for="post in posts">
                <sumidero-timeline-post-item v-bind:post="post" v-on:onDelete="removeItemFromList($event)"></sumidero-timeline-post-item>
                <hr>
            </div>
            <sumidero-timeline-pagination v-bind:disabled="loading" v-bind:data="pager" v-on:change="refreshFromPager($event.currentPage, $event.resultsPage)"></sumidero-timeline-pagination>
        </div>
        <div v-else v-show="! loading">
            <hr>
            <h1 class="title has-text-centered"><span class="icon is-medium"><i class="fas fa-comments"></i></span> SUMIDERO <span class="icon is-medium"><i class="far fa-comments"></i></span></h1>
            <h2 class="subtitle is-6 has-text-centered">I ASSURE YOU; WE'RE OPEN</h2>
            <div class="notification">
                <span v-if="filter.globalTextSearch">No results matching “<strong>{{ filter.globalTextSearch }}</strong>”</span>
                <span v-else>No results</span>
            </div>
        </div>
    </div>
`;

export default {
    name: 'sumidero-section-timeline',
    template: template,
    data: function () {
        return ({
            loading: false,
            pager: {
                currentPage: 1,
                previousPage: 1,
                nextPage: 1,
                totalPages: 0,
                resultsPage: initialState.defaultResultsPage,
            },
            posts: [],
            gallery: false,
            searchText: null,
            imageLazyLoadObserver: null
        });
    },
    props: ['sub', 'tag', 'compact'],
    watch: {
        '$route': function (to, from) {
            this.refreshFromUrlParams();
        }
    },
    created: function () {
        var self = this;
        bus.$on("refreshTimeline", function () {
            self.search();
        });
        this.imageLazyLoadObserver = lozad();
        this.refreshFromUrlParams();
    },
    updated: function () {
        this.imageLazyLoadObserver.observe();
    },
    mixins: [
        mixinRoutes
    ],
    components: {
        'sumidero-timeline-pagination': sumideroTimelinePagination,
        'sumidero-timeline-post-item': sumideroTimelinePostItem
    },
    computed: {
        hasResults: function () {
            return (this.posts && this.posts.length > 0);
        }
    },
    methods: {
        refreshFromUrlParams: function () {
            if (this.$route.params.pageIndex) {
                this.pager.currentPage = this.$route.params.pageIndex;
            } else {
                this.pager.currentPage = 1;
            }
            if (this.$route.params.text) {
                if (this.searchText && this.searchText != this.$route.params.text) {
                    this.pager.currentPage = 1;
                }
                this.searchText = this.$route.params.text;
            } else {
                this.searchText = null;
            }
            this.search();
        },
        refreshFromPager: function (currentPage, resultsPage) {
            if (this.pager.currentPage != currentPage) {
                this.pager.currentPage = currentPage;
                this.pager.resultsPage = resultsPage;
                switch (this.$route.name) {
                    case "timelineFilteredByGlobalSearch":
                    case "timelineFilteredByGlobalSearchPaged":
                        this.navigateTo('timelineFilteredByGlobalSearchPaged', { pageIndex: this.pager.currentPage, text: this.searchText });
                        break;
                    case "timelineFilteredByUserId":
                    case "timelineFilteredByUserIdPaged":
                        this.navigateTo('timelineFilteredByUserIdPaged', { pageIndex: this.pager.currentPage });
                        break;
                    case "timelineFilteredByDomain":
                    case "timelineFilteredByDomainPaged":
                        this.navigateTo('timelineFilteredByDomainPaged', { pageIndex: this.pager.currentPage });
                        break;
                    case "timelineFilteredBySub":
                    case "timelineFilteredBySubPaged":
                        this.navigateTo('timelineFilteredBySubPaged', { pageIndex: this.pager.currentPage });
                        break;
                    case "timelineFilteredBTag":
                    case "timelineFilteredBTagPaged":
                        this.navigateTo('timelineFilteredBTagPaged', { pageIndex: this.pager.currentPage });
                        break;
                    default:
                        this.navigateTo('timelinePaged', { pageIndex: this.pager.currentPage });
                        break;
                }
            } else {
                this.pager.resultsPage = resultsPage;
                this.search();
            }
        },
        search: function () {
            var self = this;
            self.posts = [];
            self.loading = true;
            this.filter = {
                userId: this.$route.params.userId,
                sub: this.$route.params.sub,
                tag: this.$route.params.tag,
                nsfw: initialState.session.nsfw,
                domain: this.$route.params.domain,
                globalTextSearch: this.$route.params.text
            };
            if (this.filter.globalTextSearch) {
                bus.$emit('globalSearchingStarted');
            }
            sumideroAPI.post.search(this.pager.currentPage, this.pager.resultsPage, "creationTimestamp", "DESC", this.filter, function (response) {
                if (self.filter.globalTextSearch) {
                    bus.$emit('globalSearchingFinished');
                }
                if (response.ok) {
                    self.posts = response.body.data.results;
                    self.pager.currentPage = response.body.data.pagination.currentPage;
                    self.pager.totalPages = response.body.data.pagination.totalPages;
                    self.pager.totalResults = response.body.data.pagination.totalResults;
                    self.loading = false;
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        },
        removeItemFromList: function (id) {
            this.posts = this.posts.filter((post) => post.id !== id);
        }
    }
}
