import { default as sumideroAPI } from './api.js';
import { mixinRoutes, mixinAvatar } from './mixins.js';

const template = `
    <article class="media">
        <figure class="media-left">
            <p class="image is-64x64">
                <img v-bind:src="avatarUrl">
                <!--
                <img class="user-avatar lozad" rel="noreferrer" v-bind:data-src="post.userAvatarUrl">
                -->
                <!--
                <i class="fa-3x fas fa-user-secret"></i>
                -->
            </p>
        </figure>
        <div class="media-content">
            <div class="post-header">
                <div v-if="post.title">
                <a v-bind:href="post.externalUrl">{{ post.title }}</a> <small>({{ post.domain }})</small>
                <br >
                </div>
                <small>by <a href="#">@{{ post.userName }}</a> <span>{{ post.created | formatDateAgo }} ({{ post.created | formatDate }})</span></small>
            </div>
            <div class="post-content">
                <p v-if="! compact">
                    <img class="post-thumbnail is-pulled-left lozad" rel="noreferrer" v-if="post.thumbnail && post.thumbnail != 'self' && post.thumbnail != 'default'" v-bind:src="'api/thumbnail?url=' + post.thumbnail">
                    <img src="http://findicons.com/files/icons/562/glaze/64/empty.png" rel="noreferrer" class="post-thumbnail is-pulled-left lozad" v-else>
                    <span v-html="formattedBody"></span>
                </p>
                <div class="is-clearfix"></div>
            </div>
            <div class="field is-grouped is-grouped-multiline">
                <div class="control">
                    <div class="tags has-addons">
                        <span class="tag is-dark"><i class="fa fa-comment"></i></span>
                        <a href="#" class="tag is-dark">comments</a>
                        <span class="tag is-warning">{{ post.totalComments }}</span>
                    </div>
                </div>
                <div class="control">
                    <div class="tags has-addons">
                        <span class="tag is-dark"><i class="fa fa-bookmark"></i></span>
                        <span class="tag is-dark">on</span>
                        <a v-on:click.prevent="navigateTo('timelineFilteredBySub', { sub: post.sub })" class="tag is-info">{{ post.sub }}</a>
                    </div>
                </div>
                <div class="control" v-for="tag in tags">
                    <div class="tags has-addons">
                        <span class="tag is-dark"><i class="fa fa-tag"></i></span>
                        <span class="tag is-dark">tag</span>
                        <a v-on:click.prevent="navigateTo('timelineFilteredBTag', { tag: tag })" class="tag is-light">{{ tag }}</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="media-right" v-if="hasPermissions">
            <small>
                <div v-if="deletedId == post.id">
                    <a href="#" v-on:click.prevent="onDelete(post.id)"><i class="fas fa-exclamation-triangle"></i> <span>confirm delete</span></a>
                    <a href="#" v-on:click.prevent="deletedId = null"><i class="fas fa-times-circle"></i> <span>cancel</span></a>
                </div>
                <div v-else>
                    <a v-on:click.prevent="navigateTo('updateLink', {id: post.id })"><span class="icon is-small"><i class="fa fa-edit"></i></span> <span>update</span></a>
                    <a v-on:click.prevent="deletedId = post.id"><span class="icon is-small"><i class="fa fa-trash"></i></span> <span>delete</span></a>
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
            deletedId: null
        });
    },
    props: [
        'post', 'compact', 'gallery'
    ],
    computed: {
        tags: function () {
            if (this.post.tags) {
                return (this.post.tags.split(","));
            } else {
                return ([]);
            }
        },
        formattedBody: function () {
            if (this.post.body) {
                return (this.post.body.replace(/(?:\r\n|\r|\n)/g, '<br />'));
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
        hasPermissions: function() {
            return(this.post.userId == initialState.session.id);
        }
    },
    filters: {
        formatDateAgo(timestamp) {
            return (moment.unix(timestamp).fromNow());
          },
          formatDate(timestamp) {
            return (moment.unix(timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a"));
          }

    },
    mixins: [
        mixinAvatar, mixinRoutes
    ],
    methods: {
        onDelete: function(id) {
            var self = this;
            self.loading = true;
            sumideroAPI.post.delete(id, function (response) {
                if (response.ok) {
                    self.loading = false;
                    self.deletedId = null;
                    self.$emit('onDelete', id);
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        }
    }
}
