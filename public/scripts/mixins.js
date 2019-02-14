export const mixinRoutes = {
    methods: {
        navigateTo: function(routeName, params) {
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
        isLogged: function() {
            return(initialState.session.logged || false);
        },
        sessionUserEmail: function() {
            return(initialState.session.email || null);
        },
        sessionUserName: function() {
            return(initialState.session.name || null);
        }
    }
}