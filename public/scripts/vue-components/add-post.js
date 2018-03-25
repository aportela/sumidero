var sumideroAddPost = (function () {
    "use strict";

    var template = function () {
        return `
            <form v-on:submit.prevent="add();">
                <div class="field is-horizontal">
                    <div class="field-label">
                        <label class="label">Url (for external links)</label>
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
                        <label class="label">Body (optional)</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <textarea :disabled="loading" class="textarea" v-model.trim="body" placeholder="type a small resume/body of your post"></textarea>
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
                        <label class="label">Tags (optional)</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input :disabled="loading" class="input loading" v-model.trim="tagNames" type="text" placeholder="type tag names (separated by commas)">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal">
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
                <div class="field is-horizontal" v-if="thumbnail">
                    <div class="field-label">
                    </div>
                    <div class="field-body">
                        <div class="columns">
                            <div class="column">
                                <img rel="noreferrer" v-bind:src="thumbnail" alt="Post thumbnail">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal">
                    <div class="field-label">
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <button type="submit" :disabled="! title" class="button is-primary" v-bind:class="loading ? 'loading' : ''">Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        `;
    };

    var module = Vue.component('sumidero-add-post', {
        template: template(),
        data: function () {
            return ({
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
            isValidUrl: function () {
                return (this.externalUrl && (this.externalUrl.indexOf("http://") == 0 || this.externalUrl.indexOf("https://")) == 0);
            }, tags: function() {
                if (this.tagNames) {
                    return(this.tagNames.split(",").map(function(item) {
                        return(item.trim());
                    }));
                } else {
                    return([]);
                }
            },
            urlExists: function() {
                return(this.apiError && this.apiError.status == 409 && this.apiError.body.keyAlreadyExists == 'externalUrl');
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
                        self.tagNames = response.body.suggestedTags && response.body.suggestedTags.length > 0 ? response.body.suggestedTags.join(","): null;
                        self.images = response.body.images;
                    } else {
                        self.apiError = response;
                    }
                    self.loading = false;
                });
            },
            add: function() {
                var self = this;
                self.loading = true;
                self.apiError = null;
                sumideroAPI.addPost(this.externalUrl, this.title, this.body, this.sub, this.tags, this.thumbnail, function(response) {
                    if (response.ok) {
                    } else {
                        self.apiError = response;
                    }
                    self.loading = false;
                });
            }
        }
    });

    return (module);
})();
