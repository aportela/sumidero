"use strict";

var vTemplateSumidero = function () {
    return `
    <div class="box" id="sumidero-section">
        <div v-if="! errors">
            <div class="sumidero-post" v-for="post in posts">
                <sumidero-post v-bind:post="post"></sumidero-post>
                <hr>
            </div>
        </div>
        <sumidero-api-error-component v-else v-bind:apiError="apiError"></sumidero-api-error-component>
    </div>
    `;
}

var sumidero = Vue.component('sumidero-component', {
    template: vTemplateSumidero(),
    created: function () {
    },
    data: function () {
        return ({
            loading: false,
            errors: false,
            apiError: null,
            posts: []
        });
    },
    created: function () {
        var self = this;
        self.loading = true;
        bus.$emit("incProgress");
        sumideroAPI.getPosts(function (response) {
            if (response.ok) {
                self.posts = response.body.posts;
                self.loading = false;
                bus.$emit("endProgress");
            } else {
                self.errors = true;
                self.apiError = response.getApiErrorData();
                self.loading = false;
                bus.$emit("endProgress");
            }
        });
    },
    methods: {
        poll: function (callback) {
            var self = this;
            self.loading = true;
            sumideroAPI.poll(function (response) {
                self.loading = false;
                callback(response);
            });
        }
    }
});