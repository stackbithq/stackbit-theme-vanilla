# mdast-util-to-nlcst [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Transform [MDAST][] to [NLCST][].

> **Note**: You probably want to use [`remark-retext`][remark-retext].

## Installation

[npm][]:

```bash
npm install mdast-util-to-nlcst
```

## Usage

```javascript
var toNLCST = require('mdast-util-to-nlcst')
var inspect = require('unist-util-inspect')
var English = require('parse-english')
var remark = require('remark')
var vfile = require('vfile')

var file = vfile('Some *foo*sball.')
var tree = remark().parse(file)

var nlcst = toNLCST(tree, file, English)

console.log(inspect(nlcst))
```

Yields:

```txt
RootNode[1] (1:1-1:17, 0-16)
└─ ParagraphNode[1] (1:1-1:17, 0-16)
   └─ SentenceNode[4] (1:1-1:17, 0-16)
      ├─ WordNode[1] (1:1-1:5, 0-4)
      │  └─ TextNode: "Some" (1:1-1:5, 0-4)
      ├─ WhiteSpaceNode: " " (1:5-1:6, 4-5)
      ├─ WordNode[2] (1:7-1:16, 6-15)
      │  ├─ TextNode: "foo" (1:7-1:10, 6-9)
      │  └─ TextNode: "sball" (1:11-1:16, 10-15)
      └─ PunctuationNode: "." (1:16-1:17, 15-16)
```

## API

### `toNLCST(node, file, Parser[, options])`

Transform an [MDAST][] syntax tree and corresponding [virtual file][vfile]
into an [NLCST][] tree.

##### Parameters

###### `node`

Syntax tree, with positional information ([`MDASTNode`][mdast]).

###### `file`

Virtual file ([`VFile`][vfile]).

###### `parser`

Constructor of an NLCST parser (`Function`).  For example,
[`parse-english`][english], [`parse-dutch`][dutch], or
[`parse-latin`][latin].

###### `options.ignore`

List of node [types][type] to ignore (`Array.<string>`).

`'table'`, `'tableRow'`, and `'tableCell'` are always ignored.

###### `options.source`

List of node [types][type] to mark as [source][] (`Array.<string>`).

`'inlineCode'` is always marked as source.

##### Returns

[`NLCSTNode`][nlcst].

##### Examples

###### `ignore`

Say we have the following file `example.md`:

```markdown
A paragraph.

> A paragraph in a block quote.
```

…and if we now transform with `ignore: ['blockquote']`, we get:

```txt
RootNode[2] (1:1-3:1, 0-14)
├─ ParagraphNode[1] (1:1-1:13, 0-12)
│  └─ SentenceNode[4] (1:1-1:13, 0-12)
│     ├─ WordNode[1] (1:1-1:2, 0-1)
│     │  └─ TextNode: "A" (1:1-1:2, 0-1)
│     ├─ WhiteSpaceNode: " " (1:2-1:3, 1-2)
│     ├─ WordNode[1] (1:3-1:12, 2-11)
│     │  └─ TextNode: "paragraph" (1:3-1:12, 2-11)
│     └─ PunctuationNode: "." (1:12-1:13, 11-12)
└─ WhiteSpaceNode: "\n\n" (1:13-3:1, 12-14)
```

###### `source`

Say we have the following file `example.md`:

```markdown
A paragraph.

> A paragraph in a block quote.
```

…and if we now transform with `source: ['blockquote']`, we get:

```txt
RootNode[3] (1:1-3:32, 0-45)
├─ ParagraphNode[1] (1:1-1:13, 0-12)
│  └─ SentenceNode[4] (1:1-1:13, 0-12)
│     ├─ WordNode[1] (1:1-1:2, 0-1)
│     │  └─ TextNode: "A" (1:1-1:2, 0-1)
│     ├─ WhiteSpaceNode: " " (1:2-1:3, 1-2)
│     ├─ WordNode[1] (1:3-1:12, 2-11)
│     │  └─ TextNode: "paragraph" (1:3-1:12, 2-11)
│     └─ PunctuationNode: "." (1:12-1:13, 11-12)
├─ WhiteSpaceNode: "\n\n" (1:13-3:1, 12-14)
└─ ParagraphNode[1] (3:1-3:32, 14-45)
   └─ SentenceNode[1] (3:1-3:32, 14-45)
      └─ SourceNode: "> A paragraph in a block quote." (3:1-3:32, 14-45)
```

## Related

*   [`remark-retext`][remark-retext]
    — **retext** support for **remark**
*   [`hast-util-to-nlcst`](https://github.com/syntax-tree/hast-util-to-nlcst)
    — Transform HAST to NLCST
*   [`hast-util-to-mdast`](https://github.com/syntax-tree/hast-util-to-mdast)
    — Transform HAST to MDAST
*   [`mdast-util-to-hast`](https://github.com/syntax-tree/mdast-util-to-hast)
    — Transform MDAST to HAST

## Contribute

See [`contributing.md` in `syntax-tree/mdast`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/syntax-tree/mdast-util-to-nlcst.svg

[travis]: https://travis-ci.org/syntax-tree/mdast-util-to-nlcst

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-util-to-nlcst.svg

[codecov]: https://codecov.io/github/syntax-tree/mdast-util-to-nlcst

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[mdast]: https://github.com/syntax-tree/mdast

[nlcst]: https://github.com/syntax-tree/nlcst

[remark-retext]: https://github.com/remarkjs/remark-retext

[vfile]: https://github.com/vfile/vfile

[english]: https://github.com/wooorm/parse-english

[latin]: https://github.com/wooorm/parse-latin

[dutch]: https://github.com/wooorm/parse-dutch

[type]: https://github.com/syntax-tree/mdast#ast

[source]: https://github.com/syntax-tree/nlcst#source

[contributing]: https://github.com/syntax-tree/mdast/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/mdast/blob/master/code-of-conduct.md
