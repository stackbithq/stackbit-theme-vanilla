# gatsby-plugin-menus

A simple-to-use menu plugin for [Gatsby](http://gatsbyjs.org) that allows for infinitely nested menus.

Comes with built-in support for extracting menus defined in Markdown, but can also be extended to load menus from any source.

## Install

`npm install --save @stackbit/gatsby-plugin-menus`

## How to use

### In your gatsby-config.js

```javascript
// gatsby-config.js
plugins: [
  {
    resolve: '@stackbit/gatsby-plugin-menus',
    options: {
      // static definition of menu items (optional)
      menus: {
        main: // identifier of menu container
          [ // array of contained children menu items
            {
              identifier: 'myId', // identifier for this item (optional)
              title: 'Title for page',
              url: '/page-1/',
              weight: 1
            }
          ]
        ]
      },
      // Gatsby node types from which we extract menus (optional, see "Advanced usage")
      sourceNodeType: 'MarkdownRemark', 
      // the relative node path where we can find the 'menus' container (optional)
      sourceDataPath: 'frontmatter',
      // the relative node path where we can find the page's URL (required)
      sourceUrlPath: 'fields.url',
      // custom menu loading function (optional)
      menuLoader: customLoaderFunction,
      // the property to use for injecting to the page context (optional, see "Advanced usage")
      pageContextProperty: 'menus',
    },
  },
],
```

### In your Markdown pages

By default, all Markdown pages can define which menus contain them. 

See [Advanced usage](#advanced-usage) to learn how to extract menus from other sources.

There are several supported ways to add a page to a menu:

- Single menu container:

```yaml
---
title: Lorem Ipsum
menus: main # identifier of menu container
---
```

- Multiple menu containers:

```yaml
---
title: Lorem Ipsum
menus: 
  - main
  - footer
---
```

- Overriding menu item values:

```yaml
---
title: Lorem Ipsum
menus:
  main: 
    identifier: myId # identifier for this item (optional)
    title: Go to Lorem Ipsum # override title for this item
    weight: 1
---
```

## How to query

A sample GraphQL query to get menus:

```graphql
{
  menus {
    main {
      identifier
      title
      url
      items {
        identifier
        title
        url
      }
    }
    footer {
      identifier
      title
      url
    }
  }
}
```

The field `items` contains the sub-menu items if available. The query should nest to accommodate the maximum hierarchy needed.


### Menu order

Items within a menu are first ordered by their defined `weight` (both from static and page menu items). If weights are equal, then menu items defined in the plugin options (static) are placed first by their appearance order, followed by page menu items ordered by their page's creation time (birthTime).


## Advanced usage

### Source options

The plugin defines the following options to customize where menu information is extracted from:

* `sourceNodeType` - The Gatsby node type we want to extract menus from (default: MarkdownRemark)

* `sourceDataPath` - The relative path in the node where we expect to find the `menus` item which contains menu information. In case there is no explicit title defined for the menu item, we attempt to find the default title under `${sourceDataPath}.title`. (default: frontmatter)

* `sourceUrlPath` - The relative path in the node where we expect to find the page's URL. This option is always required.

If more flexibility is needed for deciding how menus are loaded, a [custom function](#custom-loader) should be defined.

### Custom loader

It is possible to override the default behavior of extracting menu items from Markdown pages by providing your own custom loader function.

1. Provide custom function in the plugin options:

```javascript
// gatsby-config.js
plugins: [
  {
    resolve: '@stackbit/gatsby-plugin-menus',
    options: {
      ...
      // custom menu loading function (optional)
      menuLoader: customLoaderFunction,
    },
  },
],
```

2. Implement custom loader function:

```javascript

customLoaderFunction = (loaderActions) => {
    const { getNodesByType, getNode } = loaderActions
    ...
    return {
      main: [
        {
          identifier: 'myId', 
          title: 'Title for page',
          url: '/page-1/',
          weight: 1,
          data: {
            ... // custom data that will be made available via graphql
          }
        }
      ]
    }
}

```

### Accessing frontmatter

Menu items created from Markdown pages expose additional information about the page they were generated from. We can use that information to include other information that was defined in the Markdown page's frontmatter.

- Markdown page:

```yaml
---
title: Lorem Ipsum
moreInfo: Additional pieces of information 
menus: main
---
```

- GraphQL query:

```graphql
{
  menus {
    main {
      identifier
      title
      url
      page {
        frontmatter {
          moreInfo
        }
      }
    }
  }
}
```

### Page context

The plugin can be used to inject the menus structure directly into the context of your Gatsby pages. 

To enable this, set the `pageContextProperty` option:
```javascript
// gatsby-config.js
pageContextProperty: 'menus'
```

And the menus will be available in the page's context: 
```javascript
this.props.pageContext.menus
```
