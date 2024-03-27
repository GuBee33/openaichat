import { useClipboard } from '@vueuse/core'
import { defineCustomElement } from 'vue'

const CopyButton = defineCustomElement({
    props: {
        for: String,
    },
    setup(props, _ctx) {
        const { copy: cp, copied } = useClipboard()

        function copy() {
            const targetName = props.for
            const target = targetName && document.getElementById(targetName)

            if (!target) {
                console.error(`Copy target '${targetName}' not found!`)
                return
            }
            cp(target.innerText)
        }

        return {
            copied,
            copy,
        }
    },
    template: `<div class="copy-div"><span @click="copy" class="copy-btn" :class="copied ? 'check' : 'copy'"></span></div>`,
    styles: [
        `
        .copy-div { text-align: right; }
        .copy-btn {
            font-family: "primeicons";
            speak: none;
            font-style: normal;
            font-weight: normal;
            font-variant: normal;
            text-transform: none;
            line-height: 1;
            display: inline-block;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-size: inherit;
            cursor: pointer;
        }
        .copy-btn:hover {
            color: #9eade6;
        }
        .copy-btn:before {
            --webkit-backface-visibility: hidden;
            backface-visibility: hidden;
        }
        .copy:before {
            content: "\\e957";
        }
        .check:before {
            content: "\\e909";
        }
        `,
    ],
})

customElements?.define('copy-button', CopyButton)
