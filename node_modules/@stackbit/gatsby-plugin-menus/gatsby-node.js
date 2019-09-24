
const _ = require('lodash')

const { loadDynamicMenusFromNodes } = require('./dynamic-menu')


const createMenuNode = (menu, parentMenuId, index) => {
    const identifier = menu.identifier || `${parentMenuId}-${index}`
    return {
        ...(menu.data || {}),
        id: `menu-${identifier}`,
        identifier: identifier,
        title: menu.title,
        weight: menu.weight,
        url: menu.url
    }
}

const createParentMenuNode = (menuId) => {
    return {
        id: `menu-${menuId}`,
        identifier: menuId
    }
}

const menuComparator = (indexByMenuIdentifier, staticMenuIdentifiers) => {
    return (menu1, menu2) => {
        // compare weights
        if (menu1.weight != undefined && menu2.weight != undefined) {
            if (menu1.weight < menu2.weight) {
                return -1
            } else if (menu1.weight > menu2.weight) {
                return 1
            }
        } else if (menu1.weight == undefined && menu2.weight != undefined) {
            return 1
        } else if (menu1.weight != undefined && menu2.weight == undefined) {
            return -1
        }

        // static menus come first
        if (!staticMenuIdentifiers.has(menu1.identifier) && 
            staticMenuIdentifiers.has(menu2.identifier)) {

            return -1

        } else if (staticMenuIdentifiers.has(menu1.identifier) && 
                   !staticMenuIdentifiers.has(menu2.identifier)) {

            return 1
        } 

        // fallback on provided ordering of static and dynamic menus
        return indexByMenuIdentifier.get(menu1.identifier) - 
               indexByMenuIdentifier.get(menu2.identifier) 
    }
}

const connectNodes = (childrenByMenuIdentifier, menuNodeByMenuIdentifier, pluginActions) => {

    const { createNode, createNodeId, getNode, createContentDigest } = pluginActions

    // Parent all-encompassing menus node
    let menusNode = {
        id: createNodeId(`menus`),
        internal: {
            type: `Menus`,
            contentDigest: createContentDigest(childrenByMenuIdentifier),
        }
    }

    childrenByMenuIdentifier.forEach((children, menuId) => {

        let parentNode = menuNodeByMenuIdentifier.get(menuId)
        if (!parentNode) {
            parentNode = createParentMenuNode(menuId)
        }

        parentNode.items___NODE = children.map(childMenu => childMenu.id)

        children.forEach(childMenu => {
            const nodeContent = {
                ...childMenu,
                menu___NODE: parentNode.id
            }
            createNode({
                ...nodeContent,
                internal: {
                    type: `Menu`,
                    contentDigest: createContentDigest(nodeContent)
                }
            })
        })
        
        const parentNodeContent = {
            ...parentNode,
            menu___NODE: _.get(getNode(parentNode.id), `menu___NODE`),
        }

        createNode({
            ...parentNodeContent,
            internal: {
                type: `Menu`,
                contentDigest: createContentDigest(parentNodeContent),
            }
        })

        menusNode[`${menuId}___NODE`] = parentNode.items___NODE
    })
    
    createNode(menusNode)
}

const createMenusObject = (childrenByMenuIdentifier) => {
    const resolveChildren = (children) => {
        return children.map(child => Object.assign(
            _.omit(child, ['items___NODE']), 
            {
                'items': resolveChildren(childrenByMenuIdentifier.get(child.identifier) || [])
            }
        ));
    };
    const menus = {};
    childrenByMenuIdentifier.forEach((children, menuId) => {
        menus[menuId] = resolveChildren(children);
    });
    return menus;
}

const injectToPages = (pageContextProperty, menus, {getNodesByType, createPage, deletePage}) => {
    getNodesByType(`SitePage`).forEach(pageNode => {
        _.set(pageNode, `context.${pageContextProperty}`, menus);
    });
};

exports.onPreExtractQueries = ({ createContentDigest, createNodeId, getNodesByType, getNode, reporter, actions }, pluginOptions) => {
    
    const { createNode, createPage, deletePage } = actions
    const pluginActions = { createContentDigest, createNodeId, getNodesByType, getNode, createNode, createPage, deletePage }

    if (!_.get(pluginOptions, `sourceUrlPath`)) {
        reporter.panicOnBuild(
            `[gatsby-plugin-menus] The 'sourceUrlPath' plugin option is required.`
        )
        return
    }

    let childrenByMenuIdentifier = new Map()
    let menuNodeByMenuIdentifier = new Map()

    let indexByMenuIdentifier = new Map()
    let staticMenuIdentifiers = new Set()

    let allMenus = []

    if (_.get(pluginOptions, `menus`)) {
       allMenus.push(pluginOptions.menus)
    }

    const dynamicMenuLoader = pluginOptions.menusLoader || 
                              loadDynamicMenusFromNodes(_.get(pluginOptions, `sourceNodeType`) || `MarkdownRemark`, 
                                                        _.get(pluginOptions, `sourceDataPath`) || `frontmatter`, 
                                                        _.get(pluginOptions, `sourceUrlPath`))

    const dynamicMenus = dynamicMenuLoader({ getNodesByType, getNode })

    if (dynamicMenus) {
        allMenus.push(dynamicMenus)
    }

    allMenus.forEach(menus => {
        Object.keys(menus).forEach(menuId => {
            menus[menuId].forEach((menu, index) => {
                if (!childrenByMenuIdentifier.get(menuId)) {
                    childrenByMenuIdentifier.set(menuId, [])
                }

                const menuNode = createMenuNode(menu, menuId, index)

                if (menuNodeByMenuIdentifier.has(menuNode.identifier)) {
                    reporter.panicOnBuild(`[gatsby-plugin-menus] Duplicate menu identifier: ${menuNode.identifier}`)
                }

                childrenByMenuIdentifier.get(menuId).push(menuNode)
                menuNodeByMenuIdentifier.set(menuNode.identifier, menuNode)

                indexByMenuIdentifier.set(menuNode.identifier, index)
                staticMenuIdentifiers.add(menuNode.identifier)
            })
        })
    })

    // Sort all children
    childrenByMenuIdentifier.forEach((children, menuId) => {
        children.sort(menuComparator(indexByMenuIdentifier, staticMenuIdentifiers))
    })

    // Create all menu item nodes with proper relationships
    connectNodes(childrenByMenuIdentifier, menuNodeByMenuIdentifier, pluginActions)

    const pageContextProperty = _.get(pluginOptions, `pageContextProperty`);
    if (!_.isEmpty(pageContextProperty)) {
        const menus = createMenusObject(childrenByMenuIdentifier);
        injectToPages(pageContextProperty, menus, pluginActions);
    }
} 