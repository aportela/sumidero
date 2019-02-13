import { bus } from './bus.js';

const template = `
    <div class="modal" v-bind:class="{ 'is-active': visible }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head has-background-warning">
                <p class="modal-card-title"><i class="fas fa-bomb" aria-hidden="true"></i> <span>Error</span></p>
                <button class="delete" aria-label="close" v-on:click.prevent="onClose()"></button>
            </header>
            <section class="modal-card-body">
                <h1>“I'm sorry Dave. I'm afraid I can't do that”</h1>
            </section>
            <footer class="modal-card-foot has-text-right">
                <button class="button is-link is-fullwidth" v-on:click.prevent="onClose()"><span class="icon"><i class="fas fa-times-circle"></i></span> <span>Close</span></button>
            </footer>
        </div>
    </div>
`;

export default {
    name: 'sumidero-modal-error',
    template: template,
    data: function () {
        return ({
            visible: false
        });
    },
    computed: {
        serverReturnError: function () {
            return (this.error && this.error.response && this.error.response.status != 0);
        }
    },
    created: function () {
        let self = this;
        bus.$on("showModalError", function (error) {
            self.visible = true;
        });
    },
    methods: {
        onClose: function () {
            this.visible = false;
        }
    }
}
