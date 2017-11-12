const vueSumideroPostTemplate = function () {
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image is-64x64">
          <img class="user-avatar" v-bind:src="post.user.avatar">
        </p>
        <p class="has-text-centered">
          <br>
          <span class="icon" v-bind:class="post.votes | getThermoTempClass">
            <i class="fa fa-2x" v-bind:class="post.votes | getThermoFillClass" aria-hidden="true"></i>
          </span>
          <br>
          <span class="tag has-text-weight-bold" v-bind:class="post.votes | getVotesClass">{{ post.votes }} votes</span>
          <br>
          <a title="upvote"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></a>
          <a title="downvote"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></a>
        </p>
      </figure>
      <div class="media-content">
        <p class="post-header">
          <a v-bind:href="post.url">{{ post.title }}</a> <small>({{ post.domain }})</small>
          <br>by <strong>{{ post.user.fullname }}</strong> <small><a href="#">@{{ post.user.name }}</a> {{ post.created | formatDateAgo }}</small>
        </p>
        <p>
          <img class="post-thumbnail is-pulled-left" v-if="post.thumbnail != 'self'" v-bind:src="post.thumbnail">
          <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="post-thumbnail is-pulled-left" v-else>
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
        <nav class="level is-mobile">
          <div class="level-left">
            <div class="level-item">
              <div class="tags has-addons">
                <span class="tag is-dark">on</span>
                <span class="tag is-info">{{ post.sub }}</span>
              </div>
            </div>
            <div class="level-item">
              <div class="field is-grouped is-grouped-multiline">
                <div class="control" v-for="tag in post.tags">
                  <div class="tags has-addons">
                    <span class="tag is-dark">tag</span>
                    <span class="tag is-light">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="level-item">
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">votes</span>
                  <span class="tag is-warning">{{ post.votes }}</span>
                  <span class="icon" v-bind:class="post.votes | getThermoTempClass"></span>
                </div>
              </div>
            </div>
            <a class="level-item" title="upvote"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></a>
            <a class="level-item" title="downvote"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></a>
            <a class="level-item" title="comment"><span class="icon is-small has-text-dark"><i class="fa fa-comment"></i></span></a>
            <a class="level-item" title="love"><span class="icon is-small has-text-danger"><i class="fa fa-heart"></i></span></a>
          </div>
        </nav>
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
  }, props: ['post'],
  create: function() {
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
    formatDateAgo(timestamp) {
      return (moment.unix(timestamp).toNow());
    }
  }
});
