import { Converter } from 'showdown'
import showdownHighlight from 'showdown-highlight'
import uid from './uid'

export default new Converter({
    extensions: [
        showdownHighlight({ pre: true, auto_detection: true }),
        [
            {
                type: 'output',
                filter: t =>
                    t.replaceAll(/<pre[^>]*><code/g, tag => {
                        const id = uid.next().value
                        return `<copy-button for="copy-${id}"></copy-button>${tag} id="copy-${id}" `
                    }),
            },
        ],
    ],
})
