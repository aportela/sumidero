var profile = (function () {
    "use strict";

    var template = function () {
        return `
            <form v-on:submit.prevent="add();">
                <div class="field is-horizontal">
                    <div class="field-label">
                        <label class="label">Email</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control is-expanded">
                                <input :disabled="loading" class="input" v-model.trim="email" type="email" placeholder="type your email address">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal">
                    <div class="field-label">
                        <label class="label">Nick</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input :disabled="loading" class="input loading" v-model.trim="nick" type="text" placeholder="type your nick/alias" required>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal">
                    <div class="field-label">
                        <label class="label">New password</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <div class="control">
                                <input :disabled="loading" class="input loading" v-model.trim="password" type="password" placeholder="type new value for change your actual password">
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
                                <button type="submit" :disabled="! email && ! nick" class="button is-primary" v-bind:class="loading ? 'loading' : ''">Update profile</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        `;
    };

    /* signIn component */
    var module = Vue.component('sumidero-profile-component', {
        template: template(),
        data: function () {
            return ({
                loading: false,
                email: initialState.session.email,
                nick: initialState.session.nick
            });
        }
    });

    return (module);
})();