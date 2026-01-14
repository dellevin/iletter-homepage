// 定义网站数据
const websitesData = [
    {
        category: 'personal_blog_h3', // 分类标识符，对应国际化 key
        items: [
            {
                url: 'https://www.ittoolman.top/',
                linkTextKey: 'personal_blog_link1'
            },
            {
                url: 'https://blog.iletter.top/',
                linkTextKey: 'personal_blog_link2'
            }
        ]
    },
    {
        category: 'online_apps',
        items: [
            {
                url: 'https://img.iletter.top/',
                linkTextKey: 'online_app_link1'
            },
            {
                url: 'https://gitea.iletter.top/',
                linkTextKey: 'online_app_link2'
            },
            {
                url: 'http://openlist.iletter.top/',
                linkTextKey: 'online_app_link3'
            },
            {
                url: 'http://umami.iletter.top/',
                linkTextKey: 'online_app_link4'
            },
            {
                url: 'http://beszel.iletter.top/',
                linkTextKey: 'online_app_link5'
            }
        ]
    }
];


function renderWebsites(data, translations, lang = 'zh') {
    const container = document.getElementById('dynamic-website-links');
    if (!container) {
        console.error("Container '#dynamic-website-links' not found.");
        return;
    }

    // 清空容器
    container.innerHTML = '';

    data.forEach(categoryObj => {
        const catKey = categoryObj.category;
        const items = categoryObj.items;

        // 创建分类标题
        const heading = document.createElement('h3');
        // 使用传入的语言获取翻译文本
        const translatedHeadingText = translations[lang][catKey];
        if (translatedHeadingText !== undefined) {
             heading.textContent = translatedHeadingText;
        } else {
             // 如果找不到翻译，则显示 key 或一个默认值
             console.warn(`Translation key '${catKey}' not found for language '${lang}'`);
             heading.textContent = catKey; // 或者设置为 "Unknown Category"
        }
        container.appendChild(heading);

        // 创建一个 div 来包裹该分类下的所有链接
        const linksDiv = document.createElement('div');
        linksDiv.className = 'category-links'; // 可选，方便 CSS 样式化

        items.forEach(item => {
            const linkElement = document.createElement('a');
            linkElement.href = item.url;
            linkElement.target = '_blank';

            // 获取链接的显示文本
            const linkTextKey = item.linkTextKey;
            const translatedLinkText = translations[lang][linkTextKey];
            if (translatedLinkText !== undefined) {
                 linkElement.textContent = translatedLinkText;
            } else {
                 // 如果找不到翻译，则显示 key 或一个默认值
                 console.warn(`Translation key '${linkTextKey}' not found for language '${lang}'`);
                 linkElement.textContent = item.url; // 或者设置为 "Link"
            }
            linksDiv.appendChild(linkElement);

            // 添加一个间隔（例如空格或换行符，取决于你的 CSS 布局）
            const space = document.createTextNode(' ');
            linksDiv.appendChild(space);
        });

        container.appendChild(linksDiv);
    });
}