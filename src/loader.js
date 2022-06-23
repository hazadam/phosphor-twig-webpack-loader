const startBlock = '{% block javascript %}';
const endBlock = '{% endblock %}';

module.exports = function (source) {
    const startPosition = source.indexOf(startBlock);
    if (startPosition !== -1) {
        const subSource = source.slice(startPosition);
        const stopPosition = subSource.indexOf(endBlock);
        if (stopPosition === -1) {
            throw new Error('Missing closing tag (' + endBlock + ')');
        }
        return subSource.slice(startBlock.length, stopPosition);
    }
    throw new Error('Missing openning tag (' + startBlock + ')');
}
