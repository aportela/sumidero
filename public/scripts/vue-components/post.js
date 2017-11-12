const vueSumideroPostTemplate = function () {
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image is-64x64">
          <img class="user-avatar" v-bind:src="post.user.avatar">
        </p>
        <br>
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
      </figure>
      <div class="media-content">
        <p class="post-header">
          <a v-bind:href="post.url">{{ post.title }}</a> <small>({{ post.domain }})</small>
          <br>by <strong>{{ post.user.fullname }}</strong> <small><a href="#">@{{ post.user.name }}</a> {{ post.created | formatDateAgo }}</small>
        </p>
        <p v-if="! compact">
          <img class="post-thumbnail is-pulled-left" v-if="post.thumbnail && post.thumbnail != 'self'" v-bind:src="post.thumbnail">
          <img src="http://findicons.com/files/icons/562/glaze/64/empty.png" class="post-thumbnail is-pulled-left" v-else>
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
              <a v-bind:href="post.sub | getSubPath" class="tag is-info">{{ post.sub }}</a>
            </div>
          </div>
          <div class="control" v-for="tag in post.tags">
              <div class="tags has-addons">
                <span class="tag is-dark"><i class="fa fa-tag"></i></span>
                <span class="tag is-dark">tag</span>
                <a v-bind:href="'/#/t/' + tag" class="tag is-light">{{ tag }}</a>
              </div>
          </div>
          <div class="control">
            <div class="tags has-addons">
              <span class="tag is-dark"><i class="fa fa-comment"></i></span>
              <a href="#" class="tag is-dark">comments</a>
              <span class="tag is-warning">{{ post.comments }}</span>
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

const post = Vue.component('sumidero-post', {
  template: vueSumideroPostTemplate(),
  data: function () {
    return ({
      loading: false
    });
  }, props: ['post', 'compact'],
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
      return (moment.unix(timestamp).toNow());
    }
  }
});
