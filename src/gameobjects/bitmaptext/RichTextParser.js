/**
 * Parses `[style]...[/style]` markup into rich-text segments.
 * `[[` and `]]` are escapes for literal brackets.
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

        var chunk = text.substring(from, to);
        var last = segments[segments.length - 1];

        //  Merge with the previous segment when the style is unchanged -
        //  escapes and dropped characters must not split runs
        if (last !== undefined && last.style === style)
        {
            last.text += chunk;

            return;
        }

        var segment = { text: chunk };

        if (style !== undefined) { segment.style = style; }

        segments.push(segment);
    };

    //  Next index of either bracket at or after `from` (-1 when none)
    var nextSpecial = function ()
    {
        var open = text.indexOf('[', from);
        var close = text.indexOf(']', from);

        if (open === -1) { return close; }
        if (close === -1) { return open; }

        return Math.min(open, close);
    };

    while ((i = nextSpecial()) !== -1)
    {
        if (text[i] === ']')
        {
            if (text[i + 1] === ']')
            {
                //  Escaped bracket: emit text including one literal ']'
                push(i + 1);

                from = i + 2;

                continue;
            }

            console.warn('BitmapText rich text: unmatched "]" at index ' + i + ' in "' + text + '"');

            push(i);

            from = i + 1;

            continue;
        }

        if (text[i + 1] === '[')
        {
            //  Escaped bracket: emit text including one literal '['
            push(i + 1);

            from = i + 2;

            continue;
        }

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
