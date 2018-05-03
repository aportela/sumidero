var post = (function () {
  "use strict";

  var template = function () {
    return `
    <article class="media">
      <figure class="media-left">
        <p class="image is-64x64">
          <img class="user-avatar lozad" rel="noreferrer" v-bind:data-src="post.userAvatarUrl">
        </p>
        <br>
        <div v-if="allowVotes">
          <p class="has-text-centered" v-if="! compact">
            <span class="icon" v-bind:class="post.votes | getThermoTempClass"><i class="fa fa-3x" v-bind:class="post.votes | getThermoFillClass" aria-hidden="true"></i></span>
          </p>
          <p class="has-text-centered" v-if="! compact">
            <span class="tag has-text-weight-bold" v-bind:class="post.votes | getVotesClass">{{ post.votes }} votes</span>
          </p>
          <p class="has-text-centered" v-if="! compact">
            <a title="upvote"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></a>
            <a title="downvote"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></a>
          </p>
        </div>
      </figure>
      <div class="media-content">
        <p class="post-header">
          <a v-bind:href="post.externalUrl" v-on:click.prevent="$router.push({ name: 'customPost', params: { permaLink: post.permalink } })">{{ post.title }}</a> <small>({{ post.domain }})</small>
          <br>by <strong>{{ post.userNick }}</strong> <small><a href="#">@{{ post.userNick }}</a> <span v-bind:title="post.created | formatDate">{{ post.created | formatDateAgo }}</span></small>
        </p>
        <p v-if="! compact">
          <img class="post-thumbnail is-pulled-left lozad" rel="noreferrer" v-if="post.thumbnail && post.thumbnail != 'self' && post.thumbnail != 'default'" v-bind:data-src="'api/thumbnail?url=' + post.thumbnail">
          <img data-src="http://findicons.com/files/icons/562/glaze/64/empty.png" rel="noreferrer" class="post-thumbnail is-pulled-left lozad" v-else>
          <span class="" v-html="formattedBody"></span>
        </p>
        <div class="is-clearfix"></div>
        <div class="field is-grouped is-grouped-multiline">
          <div class="control">
            <div class="tags has-addons">
              <span class="tag is-dark"><i class="fa fa-edit"></i></span>
              <a v-on:click.prevent="$router.push({ name: 'updatePost', params: { permalink: post.permalink } })" class="tag is-info">update</a>
            </div>
          </div>
          <div class="control">
            <div class="tags has-addons">
              <span class="tag is-dark"><i class="fa fa-bookmark"></i></span>
              <span class="tag is-dark">on</span>
              <a v-on:click.prevent="$router.push({ name: 'customSub', params: { sub: post.sub } })" class="tag is-info">{{ post.sub }}</a>
            </div>
          </div>
          <div class="control" v-for="tag in tags">
              <div class="tags has-addons">
                <span class="tag is-dark"><i class="fa fa-tag"></i></span>
                <span class="tag is-dark">tag</span>
                <a v-on:click.prevent="$router.push({ name: 'customTag', params: { tag: tag } })" class="tag is-light">{{ tag }}</a>
              </div>
          </div>
          <div class="control">
            <div class="tags has-addons">
              <span class="tag is-dark"><i class="fa fa-comment"></i></span>
              <a href="#" class="tag is-dark">comments</a>
              <span class="tag is-warning">{{ post.totalComments }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="media-right">
          <a v-on:click.prevent="$router.push({ name: 'updatePost', params: { permalink: post.permalink } })"><span class="icon is-small"><i class="fa fa-pencil"></i></span></a>
          <a v-on:click.prevent="deletePost(post.id)"><span class="icon is-small"><i class="fa fa-trash"></i></span></a>
      </div>
    </article>
    `;
  };

  var module = Vue.component('sumidero-post', {
    template: template(),
    data: function () {
      return ({
        loading: false,
        allowVotes: false,
        confirmDelete: false
      });
    }, props: ['post', 'compact'],
    computed: {
      tags: function () {
        if (this.post.tags) {
          return (this.post.tags.split(","));
        } else {
          return ([]);
        }
      },
      formattedBody: function () {
        if (this.post.body) {
          return (this.post.body.replace(/(?:\r\n|\r|\n)/g, '<br />'));
        } else {
          return (null);
        }
      }
    },
    created: function () {
      bus.$emit("incProgress");
    },
    filters: {
      getThermoFillClass(votes) {
        var v = Math.abs(votes);
        if (v == 0) {
          return ("fa-thermometer-empty");
        } else if (v > 0 && v <= 100) {
          return ("fa-thermometer-quarter");
        } else if (v > 100 && v <= 500) {
          return ("fa-thermometer-half");
        } else if (v > 500 && v <= 1000) {
          return ("fa-thermometer-three-quarters");
        } else if (v > 1000) {
          return ("fa-thermometer-full");
        } else {
          return ("fa-thermometer-empty");
        }
      },
      getThermoTempClass(votes) {
        var v = Math.abs(votes);
        if (v == 0) {
          return ("");
        } else {
          if (votes > 0) {
            return ("has-text-success");
          } else {
            return ("has-text-danger");
          }
        }
      },
      getVotesClass(votes) {
        var v = Math.abs(votes);
        if (v == 0) {
          return ("");
        } else {
          if (votes > 0) {
            return ("is-success");
          } else {
            return ("is-danger");
          }
        }
      },
      getSubPath(redditSub) {
        return (redditSub.replace("r/", "/#/s/"));
      },
      formatDateAgo(timestamp) {
        return (moment.unix(timestamp).fromNow());
      },
      formatDate(timestamp) {
        return (moment.unix(timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a"));
      }
    }, methods: {
      deletePost: function () {
        var self = this;
        this.loading = true;
        console.log(this.post);
        sumideroAPI.deletePost(this.post.id, function (response) {
          self.loading = false;
          if (response.ok) {
          } else {
            switch (response.status) {
              default:
                // TODO
                break;
            }
          }
        });
      }
    }
  });

  return (module);
})();