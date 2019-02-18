import { bus } from './bus.js';
import { default as sumideroAPI } from './api.js';
import { default as validator } from './validator.js';
import { mixinRoutes, mixinSession } from './mixins.js';
import { default as sumideroControlInputSub } from './control-input-sub.js';
import { default as sumideroControlInputTags } from './control-input-tags.js';

const template = `
    <section class="hero is-fullheight is-light is-bold">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column is-10 is-offset-1">
                        <p class="title has-text-centered" v-if="isShout">Update shout</p>
                        <p class="title has-text-centered" v-if="isLink">Update link</p>
                        <div class="card">
                            <div class="card-content">
                                <form v-on:submit.prevent="">
                                    <div class="field is-horizontal" v-if="isLink">
                                        <div class="field-label">
                                            <label class="label">Remote URL</label>
                                        </div>
                                        <div class="field-body">
                                            <div class="field is-expanded">
                                                <div class="field has-addons">
                                                    <div class="control is-expanded" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('externalUrl') }">
                                                        <input :disabled="loading" class="input" v-bind:class="{ 'is-danger': validator.hasInvalidField('externalUrl') }" v-model.trim="externalUrl" type="text" maxlength="2048" placeholder="https://...">
                                                        <span class="icon is-small is-right" v-show="validator.hasInvalidField('externalUrl')"><i class="fa fa-warning"></i></span>
                                                    </div>
                                                    <div class="control">
                                                        <a class="button is-info" :disabled="loading || ! isValidUrl" v-bind:class="loading ? 'is-loading' : ''" v-on:click.prevent="scrap();">
                                                            <span class="icon"><i class="fa fa-globe"></i></span>
                                                            <span>Scrap</span>
                                                        </a>
                                                    </div>

                                                </div>
                                                <p class="help is-danger" v-show="validator.hasInvalidField('externalUrl')">{{ validator.getInvalidFieldMessage('externalUrl') }}</p>
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
                                                    <input :disabled="loading" class="input loading" v-model.trim="title" type="text" placeholder="type your new post title" maxlength="128">
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
                                                    <textarea :disabled="loading" class="textarea" v-model.trim="body" placeholder="type a small resume/body of your post" maxlength="16384"></textarea>
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
                                                    <input :disabled="loading" v-model.trim="thumbnail" class="input loading" type="text" placeholder="type thumbnail url" maxlength="2048">
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
                                                <div class="column is-half is-offset-3">
                                                    <img rel="noreferrer" v-bind:src="thumbnail" alt="Post thumbnail">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field is-horizontal">
                                        <div class="field-label">
                                            <label class="label">Sub</label>
                                        </div>
                                        <div class="field-body">
                                            <sumidero-control-input-sub v-bind:loading="loading" v-bind:sub="sub" v-on:onUpdate="sub = $event"></sumidero-control-input-sub>
                                        </div>
                                    </div>
                                    <div class="field is-horizontal">
                                        <div class="field-label">
                                            <label class="label">Tags</label>
                                        </div>
                                        <div class="field-body">
                                            <sumidero-control-input-tags v-bind:loading="loading" v-bind:tags="tags" v-on:onUpdate="tags = $event"></sumidero-control-input-tags>
                                        </div>
                                    </div>
                                    <div class="field is-horizontal">
                                        <div class="field-label">
                                            <label class="label">Content type</label>
                                        </div>
                                        <div class="field-body">
                                            <div class="control">
                                                <label class="radio">
                                                    <input type="radio" name="nsfw" v-bind:value="false" v-model="nsfw">
                                                    Safe for work
                                                </label>
                                                <label class="radio">
                                                    <input type="radio" name="nsfw" v-bind:value="true" v-model="nsfw">
                                                    Not safe for work
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field is-horizontal">
                                        <div class="field-label">
                                            <label class="label"></label>
                                        </div>
                                        <div class="field-body">
                                            <button type="button" class="button is-link is-fullwidth" v-bind:class="{ 'is-loading': loading }" v-bind:disabled="loading" v-on:click.prevent="onSubmit">
                                                <span class="icon"><i class="fas fa-save"></i></span>
                                                <span>Save</span>
                                            </button>
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
            validator: validator,
            loading: false,
            id: null,
            title: null,
            externalUrl: null,
            title: null,
            body: null,
            sub: null,
            thumbnail: null,
            tags: [],
            nsfw: false
        });
    },
    computed: {
        isLink: function () {
            return (this.$route.name == "updateLink");
        },
        isShout: function () {
            return (this.$route.name == "updateShout");
        },
        isValidUrl: function () {
            return (this.externalUrl && (this.externalUrl.indexOf("http://") == 0 || this.externalUrl.indexOf("https://")) == 0);
        }
    },
    mixins: [
        mixinRoutes, mixinSession
    ],
    components: {
        'sumidero-control-input-sub': sumideroControlInputSub,
        'sumidero-control-input-tags': sumideroControlInputTags
    },
    created: function() {
        this.id = this.$route.params.id;
        this.get();
    },
    methods: {
        scrap: function () {
            var self = this;
            self.validator.clear();
            self.loading = true;
            sumideroAPI.scrap(this.externalUrl, function (response) {
                if (response.ok) {
                    self.title = response.body.title ? response.body.title : null;
                    self.body = response.body.body ? response.body.body : null;
                    self.thumbnail = response.body.image ? response.body.image : null;
                    self.tags = response.body.suggestedTags;
                    self.loading = false;

                } else {
                    self.validator.setInvalid("externalUrl", "Remote URL scraping failed");
                }
                self.loading = false;
            });
        },
        get: function() {
            var self = this;
            self.validator.clear();
            self.loading = true;
            sumideroAPI.post.get(self.id, function (response) {
                if (response.ok) {
                    self.title = response.body.post.title;
                    self.body = response.body.post.body;
                    self.externalUrl = response.body.post.externalUrl;
                    self.thumbnail = response.body.post.thumbnail;
                    self.sub = response.body.post.sub;
                    self.tags = response.body.post.tags;
                    self.nsfw = response.body.post.nsfw;
                    self.loading = false;
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        },
        onSubmit: function () {
            var self = this;
            self.validator.clear();
            self.loading = true;
            sumideroAPI.post.update(this.id, this.externalUrl, this.title, this.body, this.sub, this.tags, this.thumbnail, this.nsfw, function (response) {
                if (response.ok) {
                    self.$router.back();
                } else {
                    switch (response.status) {
                        case 409:
                            if (response.body.invalidParams.find(function (e) { return (e === "externalUrl"); })) {
                                self.validator.setInvalid("externalUrl", "URL already exists");
                            } else {
                                self.showApiError(response.getApiErrorData());
                            }
                            break;
                        default:
                            self.showApiError(response.getApiErrorData());
                            break;
                    }
                }
                self.loading = false;
            });
        }
    }
}
