import { default as sumideroAPI } from './api.js';

export const mixinRoutes = {
    methods: {
        navigateTo: function (routeName, params) {
            this.$router.push({ name: routeName, params: params });
        },
        showApiError: function (error) {
            this.$router.push({ name: "APIError", params: { error: error } });
        }
    }
}

export const mixinSession = {
    computed: {
        allowSignUp: function () {
            return (initialState.allowSignUp || false);
        },
        isLogged: function () {
            return (initialState.session.logged || false);
        },
        sessionUserId: function () {
            return (initialState.session.id || null);
        },
        sessionUserEmail: function () {
            return (initialState.session.email || null);
        },
        sessionUserName: function () {
            return (initialState.session.name || null);
        }
    }
}

export const mixinAvatar = {
    filters: {
        parseAvatarURL: function (avatar) {
            return ("avatar/" + encodeURIComponent(avatar));
        }
    },
    methods: {
        getAvatarURL: function (avatar) {
            return ("avatar/" + encodeURIComponent(avatar));
        }
    }
}

export const mixinThumbnail = {
    filters: {
        parseThumbnailUrl: function(url) {
            return("api/thumbnail?url=" + encodeURIComponent(url));
        }
    },
    methods: {
        getThumbnailUrl: function(url) {
            return("api/thumbnail?url=" + encodeURIComponent(url));
        }
    }
}

export const mixinInitialState = {
    methods: {
        setInitialState: function(state) {
            initialState = state;
        }
    }
}