const template = `
    <div class="field">
        <div class="control">
            <input class="input" type="text" placeholder="type sub name" required maxlength="32" v-bind:disabled="loading" v-model.trim="selectedSub" v-on:keyup.prevent="onKeyUp($event)">
            <div class="dropdown is-active" v-if="hasResults">
                <div class="dropdown-menu">
                    <div class="dropdown-content is-unselectable">
                        <a href="#" class="dropdown-item" v-bind:class="{ 'is-active': selectedMatchSubIndex == index }" v-for="sub, index in matchedSubs" v-bind:key="sub" v-on:click.prevent="onSelect(sub)">
                            <span>{{ sub }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

export default {
    name: 'sumidero-control-input-sub',
    template: template,
    data: function () {
        return ({
            selectedSub: null,
            matchedSubs: [],
            selectedMatchSubIndex: -1
        });
    },
    props: [
        'loading', 'sub'
    ],
    computed: {
        hasResults: function () {
            return (this.matchedSubs.length > 0);
        }
    },
    methods: {
        onKeyUp: function (event) {
            switch (event.code) {
                case "Escape":
                    this.cancelAutoComplete();
                    this.selectedSub = null;
                    this.onChange();
                break;
                case "Enter":
                    if (this.selectedMatchSubIndex != -1) {
                        this.selectedSub = this.matchedSubs[this.selectedMatchSubIndex];
                        this.cancelAutoComplete();
                        this.onChange();
                    }
                    break;
                case "Backspace":
                    if (!this.selectedSub) {
                        this.cancelAutoComplete();
                        /*
                            if (!this.selectedSub && this.subs.length > 0) {
                                this.$emit("onUpdate", this.subs.slice(0, this.subs.length - 1));
                            }
                        */
                    }
                    this.onChange();
                    break;
                case "ArrowUp":
                    if (this.selectedMatchSubIndex > 0) {
                        this.selectedMatchSubIndex--;
                    }
                    break;
                case "ArrowDown":
                    if (this.selectedMatchSubIndex < this.matchedSubs.length - 1) {
                        this.selectedMatchSubIndex++;
                    }
                    break;
                default:
                    if (this.selectedSub) {
                        this.matchedSubs = initialState.subs.filter(sub => sub.indexOf(this.selectedSub) !== -1);
                    } else {
                        this.cancelAutoComplete();
                    }
                    this.onChange();
                break;
            }
        },
        onChange: function () {
            this.$emit("onUpdate", this.selectedSub);
        },
        cancelAutoComplete: function() {
            this.matchedSubs = [];
            this.selectedMatchSubIndex = -1;
        },
        onSelect: function (subName) {
            this.selectedSub = subName;
            this.cancelAutoComplete();
            this.onChange();
        }
    }
}
