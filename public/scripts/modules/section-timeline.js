import { bus } from './bus.js';
import { default as sumideroAPI } from './api.js';
import { default as sumideroTimelinePagination } from "./timeline-pagination.js";
import { default as sumideroTimelinePostItem } from "./timeline-post-item.js";
import { mixinRoutes } from './mixins.js';

const template = `
    <div class="container">
        <sumidero-timeline-pagination v-bind:disabled="loading" v-bind:data="pager" v-on:change="refreshFromPager($event.currentPage, $event.resultsPage)"></sumidero-timeline-pagination>
        <div v-if="! loading" class="sumidero-post" v-for="post in posts">
            <sumidero-timeline-post-item v-bind:post="post" v-on:onDelete="removeItemFromList($event)"></sumidero-timeline-post-item>
            <hr>
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
            imageLazyLoadObserver: null
        });
    },
    props: ['sub', 'tag', 'compact'],
    watch: {
        '$route': function (to, from) {
            if (this.$route.params.pageIndex) {
                this.pager.currentPage = this.$route.params.pageIndex;
            }
            this.loadItems();
        }
    },
    created: function () {
        var self = this;
        bus.$on("refreshTimeline", function (searchFilter) {
            self.loadItems(searchFilter);
        });
        this.imageLazyLoadObserver = lozad();
        if (this.$route.params.pageIndex) {
            this.pager.currentPage = this.$route.params.pageIndex;
        } else {
            this.pager.currentPage = 1;
        }
        this.loadItems({});
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
    methods: {
        loadItems: function (searchFilter) {
            var self = this;
            self.posts = [];
            self.loading = true;
            const filter = {
                userId: this.$route.params.userId,
                sub: this.$route.params.sub,
                tag: this.$route.params.tag,
                nsfw: initialState.session.nsfw,
                domain: this.$route.params.domain,
            };
            if (searchFilter && searchFilter.globalTextSearch) {
                filter.globalTextSearch = searchFilter.globalTextSearch;
            }
            sumideroAPI.post.search(this.pager.currentPage, this.pager.resultsPage, "creationTimestamp", "DESC", filter, function (response) {
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
        },
        refreshFromPager: function (currentPage, resultsPage) {
            if (this.pager.currentPage != currentPage) {
                this.pager.currentPage = currentPage;
                this.pager.resultsPage = resultsPage;
                switch(this.$route.name) {
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
                this.loadItems(null);
            }
        }
    }
}
