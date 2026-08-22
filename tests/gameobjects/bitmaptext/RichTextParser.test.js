var ParseRichText = require('../../../src/gameobjects/bitmaptext/RichTextParser');

describe('RichTextParser', function ()
{
    test('plain text without tags is a single unstyled segment', function ()
    {
        expect(ParseRichText('Hello world')).toEqual([
            { text: 'Hello world' }
        ]);
    });

    test('a styled run between plain runs', function ()
    {
        expect(ParseRichText('a[x]b[/x]c')).toEqual([
            { text: 'a' },
            { text: 'b', style: 'x' },
            { text: 'c' }
        ]);
    });
});
