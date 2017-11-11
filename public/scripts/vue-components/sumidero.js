"use strict";

var vTemplateSumidero = function () {
    return `
    <section class="hero is-fullheight is-light is-bold" v-if="! loading">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column is-4 is-offset-4">
                        <h1 class="title has-text-centered">Sumidero</h1>
                        <h2 class="subtitle is-6 has-text-centered">success!</h2>
                        <p class="has-text-centered">
                            <a href="https://github.com/aportela/sumidero"><span class="icon is-small"><i class="fa fa-github"></i></span>Project page</a> | <a href="mailto:766f6964+github@gmail.com">by alex</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer" v-if="errors">
            <sumidero-api-error-component v-bind:apiError="apiError"></sumidero-api-error-component>
        </footer>
    </section>
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
        });
    },
    created: function () {
        var self = this;
        self.loading = true;
        this.poll(function (response) {
            if (response.ok) {
                self.loading = false;
            } else {
                self.errors = true;
                self.apiError = response.getApiErrorData();
                self.loading = false;
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