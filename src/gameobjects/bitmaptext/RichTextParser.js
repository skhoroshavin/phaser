/**
 * Parses `[style]...[/style]` markup into rich-text segments.
 *
 * @function Phaser.GameObjects.BitmapText.ParseRichText
 * @since 4.3.0
 *
 * @param {string} text - The markup string to parse.
 *
 * @return {Phaser.Types.GameObjects.BitmapText.Segment[]} The parsed segments.
 */
var ParseRichText = function (text)
{
    var segments = [];
    var style;
    var from = 0;
    var i;

    var push = function (to)
    {
        if (to <= from) { return; }

        var segment = { text: text.substring(from, to) };

        if (style !== undefined) { segment.style = style; }

        segments.push(segment);
    };

    while ((i = text.indexOf('[', from)) !== -1)
    {
        var close = text.indexOf(']', i);

        if (close === -1)
        {
            console.warn('BitmapText rich text: unclosed bracket at index ' + i + ' in "' + text + '"');

            push(i);

            return segments;
        }

        push(i);

        var tag = text.substring(i + 1, close);

        if (tag[0] === '/')
        {
            if (style === undefined)
            {
                console.warn('BitmapText rich text: unmatched closing tag [/' + tag.substring(1) + '] in "' + text + '"');
            }

            style = undefined;
        }
        else
        {
            style = tag;
        }

        from = close + 1;
    }

    push(text.length);

    return segments;
};

module.exports = ParseRichText;
