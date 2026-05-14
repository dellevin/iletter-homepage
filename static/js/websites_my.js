// ========== 网站链接数据 (包含中英双语) ==========
const websitesData = [
    {
        // 分类标题
        category_zh: '个人博客',
        category_en: 'Personal Blogs',
        items: [
            {
                url: 'https://www.ittoolman.top/',
                linkText_zh: 'ittoolman.top - Github托管',
                linkText_en: 'ittoolman.top - Github Page'
            },
            {
                url: 'https://blog.iletter.top/',
                linkText_zh: 'blog.iletter.top - typecho用户的最后坚守',
                linkText_en: 'blog.iletter.top - Last Stand for Typecho Users'
            }
        ]
    },
    {
        category_zh: '私人在线应用',
        category_en: 'Personal Online Apps',
        items: [
            {
                url: 'https://img.iletter.top/',
                linkText_zh: '简单图床 - 私人图床工具',
                linkText_en: 'EsayImage2 - Image Uploader Tool'
            },
            {
                url: 'https://gitea.iletter.top/',
                linkText_zh: 'Gitea - 私人git托管仓库',
                linkText_en: 'Gitea - Private Git Repository'
            },
            // {
            //     url: 'http://openlist.iletter.top/',
            //     linkText_zh: 'OpenList - 在线云盘合集',
            //     linkText_en: 'OpenList - Online Cloud Disk Collection'
            // },
            {
                url: 'http://umami.iletter.top/',
                linkText_zh: 'Umami - 网站访问分析',
                linkText_en: 'Umami - Website visit analysis'
            },
            {
                url: 'http://beszel.iletter.top/',
                linkText_zh: 'Beszel - 服务器监控',
                linkText_en: 'Beszel - Server Monitoring'
            },
            {
                url: 'http://py.iletter.top/en-de-code',
                linkText_zh: 'Base64在线加密解密 - 自写demo',
                linkText_en: 'Base64 Online Encryption and Decryption - My Demo'
            },
        ]
    }
    // 如果你想添加新分类，可以仿照上面的格式：
    /*
    {
        category_zh: '新的分类名',
        category_en: 'New Category Name',
        items: [
            {
                url: 'https://example.com/',
                linkText_zh: '示例网站',
                linkText_en: 'Example Site'
            }
        ]
    }
    */
];

// ========== 渲染网站链接的函数 ==========
function renderWebsites(websitesArray) {
    const container = document.getElementById('dynamic-website-links');
    if (!container) {
        console.error("未找到网站链接容器 #dynamic-website-links");
        return;
    }

    // 检查数组是否为空或未定义/未初始化
    const arrayToRender = websitesArray || websitesData;
    if (!arrayToRender || !Array.isArray(arrayToRender) || arrayToRender.length === 0) {
        const currentLang = localStorage.getItem("preferred_language") || "zh";
        let noDataMessage = currentLang === 'en' ? 'No website data available.' : '暂无网站数据';
        container.innerHTML = `<div class="memo-error">${noDataMessage}</div>`;
        return; // 提前结束函数
    }

    const currentLang = localStorage.getItem("preferred_language") || "zh";

    // 清空容器
    container.innerHTML = '';

    arrayToRender.forEach(categoryObj => {
        // 根据当前语言选择分类标题
        const categoryName = currentLang === 'en' ? categoryObj.category_en : categoryObj.category_zh;

        // 创建分类标题
        const heading = document.createElement('h3');
        heading.textContent = categoryName;
        container.appendChild(heading);

        // 创建一个 div 来包裹该分类下的所有链接
        const linksDiv = document.createElement('div');
        linksDiv.className = 'category-links'; // 可选，方便 CSS 样式化

        categoryObj.items.forEach(item => {
            const linkElement = document.createElement('a');
            linkElement.href = item.url;
            linkElement.target = '_blank';

            // 根据当前语言选择链接文本
            const linkText = currentLang === 'en' ? item.linkText_en : item.linkText_zh;
            linkElement.textContent = linkText;

            linksDiv.appendChild(linkElement);

            // 添加一个间隔（例如空格或换行符，取决于你的 CSS 布局）
            const space = document.createTextNode(' ');
            linksDiv.appendChild(space);
        });

        container.appendChild(linksDiv);
    });
}

// ========== 初始化 (可选) ==========
// 如果你想在 DOM 加载完成后自动渲染，可以取消下面的注释
/*
document.addEventListener("DOMContentLoaded", function () {
  renderWebsites(); // 不传参数，默认使用 websitesData
});
*/