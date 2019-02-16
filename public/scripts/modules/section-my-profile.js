import { default as sumideroAPI } from './api.js';
import { default as validator } from './validator.js';
import { mixinRoutes, mixinSession, mixinAvatar, mixinInitialState } from './mixins.js';

const template = `
    <section class="hero is-fullheight is-light is-bold">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column is-8 is-offset-2">
                        <div class="card">
                            <div class="card-content">
                                <div class="media">
                                    <div class="media-left">
                                        <figure class="image is-96x96">
                                            <img class="s-cursor-pointer" title="user avatar, click to change" alt="user avatar, click to change" v-bind:src="avatarUrl" v-on:error="avatar = null" v-on:click.prevent="selectAvatarFromDisk()">
                                            <input type="file" id="avatarFile" accept="image/*" class="is-invisible" v-on:change="selectAvatar">
                                        </figure>
                                    </div>
                                    <div class="media-content">
                                        <p class="title is-4">{{ sessionUserName }}</p>
                                        <p class="subtitle is-6">{{ sessionUserEmail }}</p>

                                        <div class="tabs is-centered">
                                            <ul>
                                                <li class="is-active">
                                                    <a>
                                                        <span class="icon is-small"><i class="fas fa-user-circle"></i></span>
                                                        <span>Profile</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a>
                                                        <span class="icon is-small"><i class="fas fa-comments"></i></span></span>
                                                        <span>My posts</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a>
                                                        <span class="icon is-small"><i class="fas fa-chart-line"></i></span>
                                                        <span>Stats</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>

                                        <form v-on:submit.prevent="onUpdate()">
                                            <div class="box">
                                                <div class="field">
                                                    <label class="label">Email</label>
                                                    <p class="control has-icons-left" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('email') }">
                                                        <input class="input" type="email" name="email" maxlength="255" ref="email" required autofocus v-bind:class="{ 'is-danger': validator.hasInvalidField('email') }" v-bind:disabled="loading" v-model.trim="email">
                                                        <span class="icon is-small is-left"><i class="fa fa-envelope"></i></span>
                                                        <span class="icon is-small is-right" v-show="validator.hasInvalidField('email')"><i class="fa fa-warning"></i></span>
                                                        <p class="help is-danger" v-show="validator.hasInvalidField('email')">{{ validator.getInvalidFieldMessage('email') }}</p>
                                                    </p>
                                                </div>
                                                <div class="field">
                                                    <label class="label">Name</label>
                                                    <p class="control has-icons-left" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('name') }">
                                                        <input class="input" type="test" name="name" maxlength="255" required v-bind:class="{ 'is-danger': validator.hasInvalidField('name') }" v-bind:disabled="loading" v-model.trim="name">
                                                        <span class="icon is-small is-left"><i class="fa fa-user"></i></span>
                                                        <span class="icon is-small is-right" v-show="validator.hasInvalidField('name')"><i class="fa fa-warning"></i></span>
                                                        <p class="help is-danger" v-show="validator.hasInvalidField('name')">{{ validator.getInvalidFieldMessage('name') }}</p>
                                                    </p>
                                                </div>
                                                <div class="field">
                                                    <label class="label">Password</label>
                                                    <p class="control has-icons-left" v-bind:class="{ 'has-icons-right' : validator.hasInvalidField('password') }">
                                                        <input class="input" type="password" name="password" v-bind:class="{ 'is-danger': validator.hasInvalidField('password') }" v-bind:disabled="loading" v-model="password">
                                                        <span class="icon is-small is-left"><i class="fa fa-key"></i></span>
                                                        <span class="icon is-small is-right" v-show="validator.hasInvalidField('password')"><i class="fa fa-warning"></i></span>
                                                        <p class="help is-danger" v-show="validator.hasInvalidField('password')">{{ validator.getInvalidFieldMessage('password') }}</p>
                                                    </p>
                                                </div>
                                                <p class="control">
                                                    <button type="submit" class="button is-link is-fullwidth" v-bind:class="{ 'is-loading': loading }" v-bind:disabled="loading">
                                                        <span class="icon"><i class="fas fa-save"></i></span>
                                                        <span>Save changes</span>
                                                    </button>
                                                </p>
                                            </div>
                                        </form>

                                    </div>
                                </div>

                                <div class="content has-text-centered">
                                    Account registered on <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time> (6 months ago)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

export default {
    name: 'section-my-profile',
    template: template,
    data: function () {
        return ({
            loading: false,
            validator: validator,
            email: null,
            name: null,
            avatar: null,
            password: null
        });
    },
    mixins: [
        mixinSession, mixinRoutes, mixinAvatar, mixinInitialState
    ],
    created: function () {
        this.loadProfile();
    },
    computed: {
        avatarUrl: function () {
            if (this.avatar) {
                return (this.getAvatarURL(this.avatar));
            } else {
                return ("https://bulma.io/images/placeholders/96x96.png");
            }
        }
    },
    methods: {
        loadProfile: function () {
            let self = this;
            self.loading = true;
            sumideroAPI.user.get(this.sessionUserId, function (response) {
                if (response.ok && response.body.success) {
                    self.loading = false;
                    self.email = response.body.user.email;
                    self.name = response.body.user.name;
                    self.avatar = response.body.user.avatar;
                } else {
                    self.showApiError(response.getApiErrorData());
                }
            });
        },
        onUpdate: function () {
            var self = this;
            self.validator.clear();
            self.loading = true;
            sumideroAPI.user.update(this.sessionUserId, this.email, this.name, this.avatar, this.password, function (response) {
                if (response.ok && response.body.success) {
                    self.loading = false;
                    self.setInitialState(response.body.initialState);
                } else {
                    switch (response.status) {
                        case 400:
                            if (response.body.invalidOrMissingParams.find(function (e) { return (e === "email"); })) {
                                self.validator.setInvalid("email", "Invalid email");
                            } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "name"); })) {
                                self.validator.setInvalid("name", "Invalid name");
                            } else if (response.body.invalidOrMissingParams.find(function (e) { return (e === "password"); })) {
                                self.validator.setInvalid("email", "Invalid password");
                            } else {
                                self.showApiError(response.getApiErrorData());
                            }
                            break;
                        case 409:
                            if (response.body.invalidParams.find(function (e) { return (e === "email"); })) {
                                self.validator.setInvalid("email", "Email already used");
                            } else if (response.body.invalidParams.find(function (e) { return (e === "name"); })) {
                                self.validator.setInvalid("name", "Name already used");
                            } else {
                                self.showApiError(response.getApiErrorData());
                            }
                            break;
                        default:
                            self.showApiError(response.getApiErrorData());
                            break;
                    }
                    self.loading = false;
                }
            });
        },
        selectAvatarFromDisk: function () {
            document.getElementById('avatarFile').click();
        },
        removeAvatar: function () {
            this.avatar = null;
        },
        selectAvatar: function (event) {
            var self = this;

            // https://jsfiddle.net/mani04/5zyozvx8/

            // Reference to the DOM input element
            var input = event.target;
            // Ensure that you have a file before attempting to read it
            if (input.files && input.files[0]) {
                // create a new FileReader to read this image and convert to base64 format
                var reader = new FileReader();
                // Define a callback function to run, when FileReader finishes its job
                var filename = input.files[0].name;
                var filesize = input.files[0].size;
                reader.onload = (e) => {
                    sumideroAPI.user.uploadAvatar(self.sessionUserId, input.files[0], function (response) {
                        if (response.body.success) {
                            self.avatar = null;
                            self.avatar = response.body.avatar;
                        } else {
                            self.showApiError(response.getApiErrorData());
                        }
                    });
                }
                // Start the reader job - read file as a data url (base64 format)
                reader.readAsDataURL(input.files[0]);
            }
        }
    }
}
