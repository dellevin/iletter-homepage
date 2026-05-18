// ========== 网站链接数据 (包含中英双语) ==========
const websitesData = [
    { category_zh: '我的作品', category_en: 'My Works', items: [
        { url: 'https://mooknote.iletter.top/#/', 
            linkText_zh: 'MookNote - 观影阅读笔记管理', 
            linkText_en: 'MookNote - Movie & Reading Note Manager', 
            desc_zh: '用于记录观影、阅读及笔记的个人知识管理应用。', 
            desc_en: 'Personal knowledge management app for movies, reading, and notes.', 
            img: './static/img/my_work/mooknote/banner.jpg' 
        }
    ]},
    { category_zh: '个人博客', category_en: 'Personal Blogs', items: [
        { url: 'https://www.ittoolman.top/', 
            linkText_zh: 'ittoolman - Github托管', 
            linkText_en: 'ittoolman - Github Page', 
            desc_zh: '基于 GitHub Pages 搭建的个人技术站点。', 
            desc_en: 'Personal tech site based on GitHub Pages.',
            img: './static/img/my_work/ittoolman/banner.png'
        },
        { url: 'https://blog.iletter.top/', 
            linkText_zh: 'iletter - typecho极简与高效并存', 
            linkText_en: 'iletter - typecho Minimalism and Efficiency', 
            desc_zh: '记录日常开发与生活点滴的 Typecho 博客。', 
            desc_en: 'A Typecho blog recording daily development and life.',
            img: './static/img/my_work/blog_iletter/banner.png'
        }
    ]},
    { category_zh: '私人在线应用', category_en: 'Personal Online Apps', items: [
        { img: './static/img/my_work/easyimage2/banner.png',
            url: 'https://img.iletter.top/', linkText_zh: 'EsayImage2 - 私人图床工具', linkText_en: 'EsayImage2 - Image Uploader Tool', desc_zh: '稳定高效的图片上传与托管服务。', desc_en: 'Stable and efficient image hosting service.' },
        { url: 'https://gitea.iletter.top/', linkText_zh: 'Gitea - 私人git托管仓库', linkText_en: 'Gitea - Private Git Repository', desc_zh: '轻量级自托管 Git 代码管理平台。', desc_en: 'Lightweight self-hosted Git code management platform.' },
        { url: 'http://umami.iletter.top/', linkText_zh: 'Umami - 网站访问分析', linkText_en: 'Umami - Website visit analysis', desc_zh: '简洁、隐私友好的网站流量统计工具。', desc_en: 'Simple, privacy-friendly website analytics tool.' },
        { url: 'http://beszel.iletter.top/', linkText_zh: 'Beszel - 服务器监控', linkText_en: 'Beszel - Server Monitoring', desc_zh: '实时监控服务器资源占用情况。', desc_en: 'Real-time monitoring of server resource usage.' },
        { url: 'https://memos.iletter.top/', linkText_zh: 'Memos - 个人随想', linkText_en: 'Memos - Personal Thoughts', desc_zh: '碎片化知识管理与灵感记录空间。', desc_en: 'Fragmented knowledge management and inspiration space.' },
        { url: 'http://frp.iletter.top/', linkText_zh: 'FRP - 个人反向代理', 
            linkText_en: 'FRP - Personal Reverse Proxy', desc_zh: '用于内网穿透的高性能反向代理。', 
            desc_en: 'High-performance reverse proxy for intranet penetration.',
            img: './static/img/my_work/frp_panel/banner.png'
        },
        { img: './static/img/my_work/bitwarden/banner.png',
            url: 'https://bitwarden.iletter.top/', linkText_zh: 'Bitwarden - 我的密码库', linkText_en: 'Bitwarden - My Password Library', desc_zh: '安全可靠的开源密码管理方案。', desc_en: 'Secure and reliable open-source password management solution.' },
        { url: 'http://docmost.iletter.top/', linkText_zh: 'Docmost - 在线笔记', linkText_en: 'Docmost - Online Notes', desc_zh: '支持协作的实时在线文档编辑平台。', desc_en: 'Real-time online document editing platform supporting collaboration.' },
        { img: './static/img/my_work/openlist/banner.png',
            url: 'http://openlist.iletter.top/', linkText_zh: 'OpenList - 在线云盘合集', linkText_en: 'OpenList - Online Cloud Disk Collection', desc_zh: '聚合多种网盘服务的文件列表管理。', desc_en: 'File list management aggregating various cloud storage services.' }
    ]}
];

// ========== 渲染网站链接的函数 ==========
let currentViewMode = localStorage.getItem('website_view_mode') || 'card'; // 'list' or 'card'

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

    // 清空容器并添加切换按钮
    const toggleText = currentViewMode === 'list' ? '切换为卡片视图' : '切换为列表视图';
    container.innerHTML = `
        <div style="text-align:right;margin-bottom:10px;">
            <span class="website-view-toggle" onclick="switchWebsiteView('${currentViewMode === 'list' ? 'card' : 'list'}')">${toggleText}</span>
        </div>
        <div id="website-content-area"></div>
    `;
    
    const contentArea = container.querySelector('#website-content-area');

    if (currentViewMode === 'list') {
        arrayToRender.forEach(categoryObj => {
            const categoryName = currentLang === 'en' ? categoryObj.category_en : categoryObj.category_zh;
            const heading = document.createElement('h3');
            heading.textContent = categoryName;
            contentArea.appendChild(heading);

            const linksDiv = document.createElement('div');
            linksDiv.className = 'category-links';

            categoryObj.items.forEach(item => {
                const linkElement = document.createElement('a');
                linkElement.href = '#';
                linkElement.textContent = currentLang === 'en' ? item.linkText_en : item.linkText_zh;
                
                if (item.url === 'https://mooknote.iletter.top/#/') {
                    linkElement.onclick = (e) => {
                        e.preventDefault();
                        openMookNoteModal();
                    };
                } else {
                    linkElement.onclick = (e) => {
                        e.preventDefault();
                        showCustomConfirm(`确定要打开网站吗？\n${item.url}`, () => {
                            window.open(item.url, '_blank');
                        });
                    };
                }
                
                linksDiv.appendChild(linkElement);
                const space = document.createTextNode(' ');
                linksDiv.appendChild(space);
            });
            contentArea.appendChild(linksDiv);
        });
    } else {
        arrayToRender.forEach(categoryObj => {
            const categoryName = currentLang === 'en' ? categoryObj.category_en : categoryObj.category_zh;
            const heading = document.createElement('h3');
            heading.textContent = categoryName;
            contentArea.appendChild(heading);
            
            const gridDiv = document.createElement('div');
            gridDiv.className = 'website-card-grid';
            
            categoryObj.items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'website-card';
                if (item.url === 'https://mooknote.iletter.top/#/') {
                    card.onclick = () => openMookNoteModal();
                } else {
                    card.onclick = () => {
                        showCustomConfirm(`确定要打开网站吗？\n${item.url}`, () => {
                            window.open(item.url, '_blank');
                        });
                    };
                }
                
                const title = currentLang === 'en' ? item.linkText_en : item.linkText_zh;
                const desc = currentLang === 'en' ? (item.desc_en || '') : (item.desc_zh || '');
                
                const imgSrc = item.img;
                const placeholderText = item.linkText_zh.split(' - ')[0];
                const imgHtml = imgSrc 
                    ? `<div class="website-card-icon"><img src="${imgSrc}" alt="${placeholderText}" onerror="this.style.display='none';this.parentNode.classList.add('website-card-placeholder');this.parentNode.textContent='${placeholderText}'"></div>`
                    : `<div class="website-card-icon website-card-placeholder">${placeholderText}</div>`;
                
                card.innerHTML = `
                    ${imgHtml}
                    <div class="website-card-info">
                        <div class="website-card-title">${title}</div>
                        <div class="website-card-desc">${desc}</div>
                    </div>
                `;
                gridDiv.appendChild(card);
            });
            
            contentArea.appendChild(gridDiv);
        });
    }
}

window.switchWebsiteView = function(mode) {
    currentViewMode = mode;
    localStorage.setItem('website_view_mode', mode);
    renderWebsites();
};

// MookNote 弹窗逻辑
let currentImageIndex = 0;
const mooknoteImages = document.querySelectorAll('.carousel-image');
const totalImages = mooknoteImages.length;

// 全屏预览相关变量
let lightboxImageIndex = 0;
const lightboxImgUrls = [
    './static/img/my_work/mooknote/banner.jpg',
    './static/img/my_work/mooknote/1.jpg',
    './static/img/my_work/mooknote/2.jpg',
    './static/img/my_work/mooknote/3.jpg',
    './static/img/my_work/mooknote/4.jpg',
    './static/img/my_work/mooknote/5.jpg',
    './static/img/my_work/mooknote/6.jpg'
];

// 初始化指示器
function initCarouselIndicators() {
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < totalImages; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'carousel-indicator' + (i === 0 ? ' active' : '');
        indicator.onclick = () => goToMooknoteImage(i);
        indicatorsContainer.appendChild(indicator);
    }
}

// 切换到指定图片
function goToMooknoteImage(index) {
    if (index < 0) index = totalImages - 1;
    if (index >= totalImages) index = 0;
    
    mooknoteImages.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
    
    const indicators = document.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
    
    currentImageIndex = index;
}

// 上一张图片
window.prevMooknoteImage = function() {
    goToMooknoteImage(currentImageIndex - 1);
};

// 下一张图片
window.nextMooknoteImage = function() {
    goToMooknoteImage(currentImageIndex + 1);
};

// 全屏预览功能
window.openMooknoteLightbox = function(index) {
    lightboxImageIndex = index;
    const lightbox = document.querySelector('.mooknote-lightbox');
    const img = lightbox.querySelector('.lightbox-img');
    const counter = lightbox.querySelector('.lightbox-counter');
    
    img.src = lightboxImgUrls[index];
    counter.textContent = `${index + 1} / ${lightboxImgUrls.length}`;
    lightbox.classList.add('active');
};

window.closeMooknoteLightbox = function() {
    const lightbox = document.querySelector('.mooknote-lightbox');
    lightbox.classList.remove('active');
};

window.prevLightboxImage = function() {
    lightboxImageIndex = (lightboxImageIndex - 1 + lightboxImgUrls.length) % lightboxImgUrls.length;
    updateLightboxImage();
};

window.nextLightboxImage = function() {
    lightboxImageIndex = (lightboxImageIndex + 1) % lightboxImgUrls.length;
    updateLightboxImage();
};

function updateLightboxImage() {
    const lightbox = document.querySelector('.mooknote-lightbox');
    const img = lightbox.querySelector('.lightbox-img');
    const counter = lightbox.querySelector('.lightbox-counter');
    
    img.src = lightboxImgUrls[lightboxImageIndex];
    counter.textContent = `${lightboxImageIndex + 1} / ${lightboxImgUrls.length}`;
}

// 键盘事件支持
document.addEventListener('keydown', (e) => {
    const lightbox = document.querySelector('.mooknote-lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeMooknoteLightbox();
    } else if (e.key === 'ArrowLeft') {
        prevLightboxImage();
    } else if (e.key === 'ArrowRight') {
        nextLightboxImage();
    }
});

function openMookNoteModal() {
    const modal = document.getElementById('mooknote-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // 重置轮播到第一张
        currentImageIndex = 0;
        initCarouselIndicators();
        goToMooknoteImage(0);
    }
}

const mooknoteClose = document.getElementById('mooknote-close');
if (mooknoteClose) {
    mooknoteClose.addEventListener('click', () => {
        const modal = document.getElementById('mooknote-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========== 初始化 (可选) ==========
// 如果你想在 DOM 加载完成后自动渲染，可以取消下面的注释
/*
document.addEventListener("DOMContentLoaded", function () {
  renderWebsites(); // 不传参数，默认使用 websitesData
});
*/