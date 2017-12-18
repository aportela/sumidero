var postDetails = (function () {
  "use strict";

  var template = function () {
    return `
      <div>
      <sumidero-post v-bind:post="post"></sumidero-post>
      </div>
    `;
  };

  var module = Vue.component('sumidero-post-details', {
    template: template(),
    data: function () {
      return ({
        post: null
      });
    },
    created: function () {
      this.getPost(this.$route.params.permaLink);
    },
    methods: {
      getPost: function (permaLink) {
        var self = this;
        self.loading = true;
        sumideroAPI.getPost(permaLink, function (response) {
          if (response.ok) {
            self.post = response.body.post;
            console.log(self.post);
            self.loading = false;
          } else {
            self.errors = true;
            self.apiError = response.getApiErrorData();
            self.loading = false;
          }
        });
      }
    }
  });

  return (module);
})();