import { bus } from './bus.js';
import { default as sumideroAPI } from './api.js';

const template = `
    <section class="hero is-fullheight is-light is-bold">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column is-10 is-offset-1">
                        <p class="title has-text-centered" v-if="isShout">Add shout</p>
                        <p class="title has-text-centered" v-if="isLink">Add link</p>
                        <div class="card">
                            <div class="card-content">
                                <form v-on:submit.prevent="onSubmit" v-if="! success">
                                    <div class="field is-horizontal" v-if="isLink">
                                        <div class="field-label">
                                            <label class="label">Remote URL</label>
                                        </div>
                                        <div class="field-body">
                                            <div class="field is-expanded">
                                                <div class="field has-addons">
                                                    <div class="control is-expanded" v-bind:class="urlExists ? 'has-icons-right': ''">
                                                        <input :disabled="loading" class="input" v-bind:class="urlExists ? 'is-danger': ''" v-model.trim="externalUrl" type="text" placeholder="https://...">
                                                        <span class="icon is-small is-right" v-if="urlExists">
                                                            <i class="fa fa-warning"></i>
                                                        </span>
                                                    </div>

                                                    <div class="control">
                                                        <a class="button is-info" :disabled="loading" v-bind:class="loading ? 'is-loading' : ''" v-on:click.prevent="scrap();">
                                                            <span class="icon"><i class="fa fa-globe"></i></span>
                                                            <span>Scrap</span>
                                                        </a>
                                                    </div>

                                                </div>
                                                <p v-if="urlExists" class="help is-danger">Link already exists</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field is-horizontal">
                                        <div class="field-label">
                                            <label class="label">Title</label>
                                        </div>
                                        <div class="field-body">
                                            <div class="field">
                                                <div class="control">
                                                    <input :disabled="loading" class="input loading" v-model.trim="title" type="text" placeholder="type your new post title" required>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field is-horizontal">
                                        <div class="field-label">
                                            <label class="label">Body</label>
                                        </div>
                                        <div class="field-body">
                                            <div class="field">
                                                <div class="control">
                                                    <textarea :disabled="loading" class="textarea" v-model.trim="body" placeholder="type a small resume/body of your post"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field is-horizontal" v-if="isLink">
                                        <div class="field-label">
                                            <label class="label">Thumbnail</label>
                                        </div>
                                        <div class="field-body">
                                            <div class="field">
                                                <div class="control">
                                                    <input :disabled="loading" v-model.trim="thumbnail" class="input loading" type="text" placeholder="type thumbnail url">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field is-horizontal">
                                        <div class="field-label">
                                            <label class="label">Sub</label>
                                        </div>
                                        <div class="field-body">
                                            <div class="field">
                                                <div class="control">
                                                    <input :disabled="loading" class="input loading" v-model.trim="sub" type="text" placeholder="type sub name" required>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field is-horizontal">
                                        <div class="field-label">
                                            <label class="label">Tags</label>
                                        </div>
                                        <div class="field-body">
                                            <div class="field">
                                                <div class="control">
                                                    <input :disabled="loading" class="input loading" v-model.trim="tagNames" type="text" placeholder="type tag names (separated by commas)">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field is-horizontal" v-if="thumbnail">
                                        <div class="field-label">
                                            <label class="label">Thumbnail preview</label>
                                        </div>
                                        <div class="field-body">
                                            <div class="columns">
                                                <div class="column">
                                                    <img rel="noreferrer" class="s-thumbnail-preview" v-bind:src="thumbnail" alt="Post thumbnail">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

export default {
    name: 'sumidero-section-add',
    template: template,
    data: function () {
        return ({
            success: false,
            loading: false,
            apiError: null,
            title: null,
            externalUrl: null,
            title: null,
            body: null,
            sub: null,
            thumbnail: null,
            tagNames: null
        });
    },
    computed: {
        isLink: function () {
            return (this.$route.name == "addLink");
        },
        isShout: function () {
            return (this.$route.name == "addShout");
        },
        isValidUrl: function () {
            return (this.externalUrl && (this.externalUrl.indexOf("http://") == 0 || this.externalUrl.indexOf("https://")) == 0);
        }, tags: function () {
            if (this.tagNames) {
                return (this.tagNames.split(",").map(function (item) {
                    return (item.trim());
                }));
            } else {
                return ([]);
            }
        },
        urlExists: function () {
            return (false);
            return (this.apiError && this.apiError.status == 409 && this.apiError.body.keyAlreadyExists == 'externalUrl');
        }
    },
    methods: {
        scrap: function () {
            var self = this;
            self.loading = true;
            self.apiError = null;
            sumideroAPI.scrap(this.externalUrl, function(response) {
                if (response.ok) {
                    self.title = response.body.title ? response.body.title: null;
                    self.body = response.body.body ? response.body.body: null;
                    self.thumbnail = response.body.image? response.body.image : null;
                    //self.tagNames = response.body.suggestedTags && response.body.suggestedTags.length > 0 ? response.body.suggestedTags.join(","): null;
                    self.images = response.body.images;
                } else {
                    self.apiError = response;
                }
                self.loading = false;
            });
        },
        onSubmit: function () {
        }
    }
}
