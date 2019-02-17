const template = `
    <div class="field is-grouped is-grouped-multiline">
        <div class="control" v-for="tag in tags">
            <div class="tags has-addons">
                <span class="tag is-medium is-dark">{{ tag }} </span>
                <a class="tag is-medium is-delete" v-on:click.prevent="onRemove(tag)"></a>
            </div>                                                
        </div>                        
        <div class="control">
            <input :disabled="loading" class="input" v-model.trim="newTag" v-on:keyup.enter="onAdd()" v-on:keyup.delete="onDelete()" type="text" placeholder="type tag names (separated by commas)">
        </div>
    </div>
`;

export default {
    name: 'sumidero-control-input-tags',
    template: template,
    data: function () {
        return ({
            newTag: null
        });
    },
    props: [
        'loading', 'tags'
    ],
    methods: {
        onAdd: function () {
            if (this.newTag && !this.tags.includes(this.newTag)) {
                this.$emit("onUpdate", this.tags.concat(Array(this.newTag)));
                this.newTag = null;
            }
        },
        onRemove: function (tagName) {
            this.$emit("onUpdate", this.tags.filter(tag => tag !== tagName));
        },
        onDelete: function () {
            if (!this.newTag && this.tags.length > 0) {
                this.$emit("onUpdate", this.tags.slice(0, this.tags.length - 1));
            }
        }
    }
}
