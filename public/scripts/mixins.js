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