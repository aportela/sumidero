import { default as sumideroAPI } from './api.js';
import { mixinRoutes, mixinAvatar, mixinThumbnail } from './mixins.js';

const template = `
    <article class="media">
        <figure class="media-left">
            <p class="image is-64x64">
                <img class="lozad" rel="noreferrer" v-bind:data-src="avatarUrl">
            </p>
        </figure>
        <div class="media-content">
            <div class="post-header">
                <div v-if="isLink">
                    <a v-bind:href="post.externalUrl" target="_new">{{ post.title }}</a> <a href="#" v-on:click.prevent="navigateTo('timelineFilteredByDomain', { domain: post.domain })"><small>({{ post.domain }})</small></a>
                </div>
                <div v-else>
                   {{ post.title }}
                </div>
                <small>by <a href="#" v-on:click.prevent="navigateTo('timelineFilteredByUserId', { userId: post.userId })">@{{ post.userName }}</a> <span>{{ post.created | formatDateAgo }} ({{ post.created | formatDate }})</span></small>
            </div>
            <div class="post-content">
                <p v-if="! compact">
                    <div v-if="isLink">
                        <img class="post-thumbnail is-pulled-left lozad" rel="noreferrer" v-if="post.thumbnail && ! thumbnailLoadError" v-bind:data-src="post.thumbnail | parseThumbnailUrl" v-on:error="thumbnailLoadError = true">
                        <img class="post-thumbnail is-pulled-left" rel="noreferer" src="/img/failed-icon-23.png" v-else-if="thumbnailLoadError">
                    </div>
                    <div v-else>
                        <img src="/img/empty.png" rel="noreferrer" class="post-thumbnail is-pulled-left">
                    </div>
                    <span v-html="formattedBody"></span>
                </p>
                <div class="is-clearfix"></div>
            </div>
            <div class="field is-grouped is-grouped-multiline">
                <div class="control">
                    <div class="tags has-addons">
                        <span class="tag is-dark"><i class="fa fa-comment"></i></span>
                        <a href="#" class="tag is-dark is-hidden-mobile">comments</a>
                        <span class="tag is-warning">{{ post.totalComments }}</span>
                    </div>
                </div>
                <div class="control">
                    <div class="tags has-addons">
                        <span class="tag is-dark"><i class="fa fa-bookmark"></i></span>
                        <span class="tag is-dark is-hidden-mobile">on</span>
                        <a v-on:click.prevent="onBrowseSub(post.sub)" class="tag is-info">{{ post.sub }}</a>
                    </div>
                </div>
                <div class="control" v-for="tag in tags">
                    <div class="tags has-addons">
                        <span class="tag is-dark"><i class="fa fa-tag"></i></span>
                        <span class="tag is-dark is-hidden-mobile">tag</span>
                        <a v-on:click.prevent="onBrowseTag(tag)" class="tag is-light">{{ tag }}</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="media-right" v-if="hasPermissions">
            <small>
                <div v-if="deletedId == post.id">
                    <a href="#" title="click here to confirm deletion of post" v-on:click.prevent="onDelete(post.id)"><i class="fas fa-exclamation-triangle"></i> <span class="is-hidden-mobile">confirm delete</span></a>
                    <a href="#" title="click here to cancel deletion of post" v-on:click.prevent="deletedId = null"><i class="fas fa-times-circle"></i> <span class="is-hidden-mobile">cancel</span></a>
                </div>
                <div v-else>
                    <a title="click here to update post" v-on:click.prevent="onUpdate(post.id)"><span class="icon is-small"><i class="fa fa-edit"></i></span> <span class="is-hidden-mobile">update</span></a>
                    <a title="click here to remove post" v-on:click.prevent="deletedId = post.id"><span class="icon is-small"><i class="fa fa-trash"></i></span> <span class="is-hidden-mobile">delete</span></a>
                </div>
            </small>
        </div>
    </article>
`;

export default {
    name: 'sumidero-timeline-post-item',
    template: template,
    data: function () {
        return ({
            loading: false,
            deletedId: null,
            thumbnailLoadError: false
        });
    },
    props: [
        'post', 'compact', 'gallery'
    ],
    computed: {
        isLink: function () {
            if (this.post.externalUrl) {
                return (true);
            } else {
                return (false);
            }
        },
        tags: function () {
            if (this.post.tags) {
                return (this.post.tags.split(","));
            } else {
                return ([]);
            }
        },
        formattedBody: function () {
            if (this.post.body) {
                if (this.post.body.length > 1024) {
                    return(this.post.body.substr(0, 1024).replace(/(?:\r\n|\r|\n)/g, '<br />') + "...");
                } else {
                    return (this.post.body.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                }
            } else {
                return (null);
            }
        },
        avatarUrl: function () {
            if (this.post.userAvatar) {
                return (this.getAvatarURL(this.post.userAvatar));
            } else {
                return ("https://bulma.io/images/placeholders/96x96.png");
            }
        },
        hasPermissions: function () {
            return (this.post.userId == initialState.session.id);
        }
    },
    filters: {
        formatDateAgo: function(timestamp) {
            return (moment.unix(timestamp).fromNow());
        },
        formatDate: function(timestamp) {
            return (moment.unix(timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a"));
        }
    },
    mixins: [
        mixinAvatar, mixinThumbnail, mixinRoutes
    ],
    methods: {
        onDelete: function (id) {
            var self = this;
            self.loading = true;
            sumideroAPI.post.delete(id, function (response) {
                if (response.ok) {
                    initialState = response.body.initialState;
                    self.loading = false;
                    self.deletedId = null;
                    self.$emit('onDelete', id);
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        },
        onUpdate: function (id) {
            if (this.isLink) {
                this.navigateTo('updateLink', { id: id })
            } else {
                this.navigateTo('updateShout', { id: id })
            }
        },
        onBrowseSub: function(sub) {
            if (this.$route.name != "timelineFilteredBySub" && this.$route.name != "timelineFilteredBySubPaged") {
                this.navigateTo('timelineFilteredBySub', { sub: sub, pageIndex: 1 });
            }
        },
        onBrowseTag: function(tag) {
            this.navigateTo('timelineFilteredBTag', { tag: tag, pageIndex: 1 })
        }
    }
}
