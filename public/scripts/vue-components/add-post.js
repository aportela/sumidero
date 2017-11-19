const vueSumideroAddPostTemplate = function () {
    return `
        <div>

            <div class="field">
                <label class="label">Title/URL</label>
                <div class="control" v-bind:class="loading ? 'is-loading': ''">
                    <input :disabled="loading" class="input loading" v-model="titleUrl" type="text" placeholder="Text input" required>
                </div>
            </div>

            <div class="field">
                <label class="label">Body (optional)</label>
                <div class="control">
                    <textarea :disabled="loading" class="textarea" v-model="body" placeholder="Textarea"></textarea>
                </div>
            </div>
            <div class="field is-grouped">
                <div class="control">
                    <button :disabled="! titleUrl" class="button is-link" v-on:click.prevent="scrap();">Preview</button>
                </div>
            </div>

            <hr>

            <div v-if="! errors">
                <sumidero-post v-if="showPreview" v-bind:post="previewPost"></sumidero-post>
            </div>
            <sumidero-api-error-component v-else v-bind:apiError="apiError"></sumidero-api-error-component>
        </div>
      `;
};

const sumideroAddPost = Vue.component('sumidero-add-post', {
    template: vueSumideroAddPostTemplate(),
    data: function () {
        return ({
            errors: false,
            apiError: null,
            isScraped: false,
            titleUrl: null,
            body: null,
            showPreview: false,
            previewPost: {
                comments: 0,
                thumbnail: null,
                created: 1510492766,
                domain: "independent.co.uk",
                sub: "/r/todayilearned",
                tags: ["news", "music", "movies"],
                votes: 120,
                body: null,
                title: null,
                user: {
                    id: "1",
                    avatar: "https://randomuser.me/api/portraits/men/13.jpg",
                    fullname: "adam brar",
                    name: "adambrar"
                }
            },
            title: null,
            body: null,
            loading: false
        });
    },
    created: function () {
    },
    updated: function() {
        imageLazyLoadObserver.observe();
    },
    methods: {
        isUrl: function () {
            return (this.titleUrl.indexOf("http://") == 0 || this.titleUrl.indexOf("https://") == 0);
        },
        scrap: function () {
            if (this.isUrl(this.title)) {
                var self = this;
                self.loading = true;
                self.errors = false;
                var params = {
                    url: this.titleUrl,
                    externalUrl: this.titleUrl
                };
                Vue.http.post(siteUrl + "/api/post/add", params).then(
                    response => {
                        if (response.body.title) {
                            self.previewPost.title = response.body.title;
                        } else {
                            self.previewPost.title = "unknown title";
                        }
                        if (response.body.body) {
                            self.previewPost.body = response.body.body.length > 384 ? response.body.body.substring(0, 384).trim() + "..." : response.body.body;
                        } else {
                            self.previewPost.body = "unknown body";
                        }
                        if (response.body.image) {
                            self.previewPost.thumbnail = response.body.image;
                        } else {
                            self.previewPost.thumbnail = null;
                        }
                        self.previewPost.domain = this.titleUrl.split('/')[2]
                        self.loading = false;
                        self.showPreview = true;
                    },
                    response => {
                        self.errors = true;
                        self.apiError = response.getApiErrorData();
                        self.loading = false;
                    }
                );
            } else {
                this.previewPost.title = this.titleUrl;
                this.previewPost.body = this.body,
                this.previewPost.thumbnail = null;
                this.showPreview = true;
            }
        }
    }
});
