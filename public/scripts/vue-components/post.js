var post = (function () {
  "use strict";

  var template = function () {
    return `
    <article class="media">
      <figure class="media-left">
        <p class="image is-64x64">
          <img class="user-avatar lozad" v-bind:data-src="post.userAvatarUrl">
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
          <a v-bind:href="post.externalUrl">{{ post.title }}</a> <small>({{ post.domain }})</small>
          <br>by <strong>{{ post.userNick }}</strong> <small><a href="#">@{{ post.userNick }}</a> <span v-bind:title="post.created | formatDate">{{ post.created | formatDateAgo }}</span></small>
        </p>
        <p v-if="! compact">
          <img class="post-thumbnail is-pulled-left lozad" v-if="post.thumbnail && post.thumbnail != 'self' && post.thumbnail != 'default'" v-bind:data-src="post.thumbnail">
          <img data-src="http://findicons.com/files/icons/562/glaze/64/empty.png" class="post-thumbnail is-pulled-left lozad" v-else>
          <span class="">{{ post.body }}</span>
        </p>
        <div class="" v-if="false">
          <p>Blahblah</p>
          <img src="https://meta-s3-cdn.freetls.fastly.net/optimized/3X/1/1/11b0296fb74c088a7fc2c59fa4f0fba0096d8999_1_690x156.png">
          <blockquote>
            <pre>
            // register
            Vue.component('my-component', {
            template: '<div>A custom component!</div>'
            })
            // create a root instance
            new Vue({
            el: '#example'
            })
            </pre>
          </blockquote>
        </div>
        <div class="is-clearfix"></div>
        <div class="field is-grouped is-grouped-multiline">
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
          <button class="delete"></button>
      </div>
    </article>
    `;
  };

  var module = Vue.component('sumidero-post', {
    template: template(),
    data: function () {
      return ({
        loading: false,
        allowVotes: false
      });
    }, props: ['post', 'compact'],
    computed: {
      tags: function() {
        if (this.post.tags) {
          return(this.post.tags.split(","));
        } else {
          return([]);
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
    }
  });

  return (module);
})();