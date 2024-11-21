/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com
 @idle games : http://www.gityx.com
 @QQ Group : 627141737
 @editor : hankypoo7

*/

var ENITEM_DEBUG = 0;

function enItemByTag(text, itemGroup, node, textOri) {
    for (let i in itemGroup) {
        if (i[0] === '.') { // Match node and its parent's class
            let currentNode = node;
            while (currentNode) {
                if (currentNode.classList && currentNode.classList.contains(i.substr(1))) {
                    return itemGroup[i];
                } else if (currentNode.parentElement && currentNode.parentElement !== document.documentElement) {
                    currentNode = currentNode.parentElement;
                } else {
                    break;
                }
            }
        } else if (i[0] === '#') { // Match node and its parent's ID
            let currentNode = node;
            while (currentNode) {
                if (currentNode.id === i.substr(1)) {
                    return itemGroup[i];
                } else if (currentNode.parentElement && currentNode.parentElement !== document.documentElement) {
                    currentNode = currentNode.parentElement;
                } else {
                    break;
                }
            }
        } else if (i[0] === '$') { // Execute document.querySelector
            if (document.querySelector(i.substr(1)) != null) {
                return itemGroup[i];
            }
        } else if (i[0] === '*') { // Search original text
            if (textOri.includes(i.substr(1))) {
                return itemGroup[i];
            }
        } else {
            ENITEM_DEBUG && console.log({ text, itemGroup, desc: "Unrecognized tag: " + i });
        }
    }
    return null;
}

// Collect new words for translation
var enItem = function (text, node) {
    if (typeof text !== "string") return text;

    let textOri = text;
    let textPrefix = "", textPostfix = "", textRegExcludePostfix = "";

    // Handle prefix
    for (let prefix in enPrefix) {
        if (text.startsWith(prefix)) {
            textPrefix += enPrefix[prefix];
            text = text.slice(prefix.length);
        }
    }

    // Handle postfix
    for (let postfix in enPostfix) {
        if (text.endsWith(postfix)) {
            textPostfix = enPostfix[postfix] + textPostfix;
            text = text.slice(0, -postfix.length);
        }
    }

    // Check exclusion patterns
    for (let reg of enExcludeWhole) {
        if (reg.test(text)) {
            return textPrefix + text + textRegExcludePostfix + textPostfix;
        }
    }

    // Attempt regex replacements
    for (let [key, value] of enRegReplace.entries()) {
        if (key.test(text)) {
            return textPrefix + text.replace(key, value) + textRegExcludePostfix + textPostfix;
        }
    }

    // Check dictionary for matches
    for (let i in enItems) {
        if (typeof enItems[i] === "string" && (text === i || text === enItems[i])) {
            return textPrefix + enItems[i] + textRegExcludePostfix + textPostfix;
        } else if (typeof enItems[i] === "object" && text === i) {
            let result = enItemByTag(i, enItems[i], node, textOri);
            if (result !== null) {
                return textPrefix + result + textRegExcludePostfix + textPostfix;
            } else {
                ENITEM_DEBUG && console.log({ text: i, enItem: enItems[i], node });
            }
        }
    }

    return textPrefix + text + textRegExcludePostfix + textPostfix;
};

transTaskMgr = {
    tasks: [],
    addTask: function (node, attr, text) {
        this.tasks.push({ node, attr, text });
    },
    doTask: function () {
        let task = null;
        while ((task = this.tasks.pop())) {
            task.node[task.attr] = task.text;
        }
    },
};

function TransSubTextNode(node) {
    if (node.childNodes.length > 0) {
        for (let subNode of node.childNodes) {
            if (subNode.nodeName === "#text") {
                let text = subNode.textContent;
                let enText = enItem(text, subNode);
                enText !== text && transTaskMgr.addTask(subNode, 'textContent', enText);
            } else if (subNode.nodeName !== "SCRIPT" && subNode.nodeName !== "STYLE" && subNode.nodeName !== "TEXTAREA") {
                if (!subNode.childNodes || subNode.childNodes.length === 0) {
                    let text = subNode.innerText;
                    let enText = enItem(text, subNode);
                    enText !== text && transTaskMgr.addTask(subNode, 'innerText', enText);
                } else {
                    TransSubTextNode(subNode);
                }
            }
        }
    }
}

!function () {
    console.log("English translation module loaded.");

    let observerConfig = {
        attributes: false,
        characterData: true,
        childList: true,
        subtree: true,
    };

    let targetNode = document.body;

    // Translate static content
    TransSubTextNode(targetNode);
    transTaskMgr.doTask();

    // Translate dynamic content
    let observer = new MutationObserver(function (mutations) {
        observer.disconnect();
        for (let mutation of mutations) {
            if (mutation.target.nodeName === "SCRIPT" || mutation.target.nodeName === "STYLE" || mutation.target.nodeName === "TEXTAREA") continue;

            if (mutation.target.nodeName === "#text") {
                mutation.target.textContent = enItem(mutation.target.textContent, mutation.target);
            } else if (!mutation.target.childNodes || mutation.target.childNodes.length === 0) {
                mutation.target.innerText = enItem(mutation.target.innerText, mutation.target);
            } else if (mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeName === "#text") {
                        node.textContent = enItem(node.textContent, node);
                    } else if (node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE" && node.nodeName !== "TEXTAREA") {
                        if (!node.childNodes || node.childNodes.length === 0) {
                            if (node.innerText) node.innerText = enItem(node.innerText, node);
                        } else {
                            TransSubTextNode(node);
                            transTaskMgr.doTask();
                        }
                    }
                }
            }
        }
        observer.observe(targetNode, observerConfig);
    });

    observer.observe(targetNode, observerConfig);
}();
