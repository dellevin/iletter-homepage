/**
 * 博客文章功能 - 获取并展示博客最新文章
 */
(function () {
    'use strict';

    const BLOG_API_URL = 'https://blog.iletter.top/api/posts';
    const BLOG_TOKEN = '67192cda-156a-415a-9f3c-97e90a6b818a';
    const PAGE_SIZE = 10;

    let currentPage = 1;
    let hasMore = true;
    let isLoading = false;

    // DOM 元素
    const blogPostsBtn = document.getElementById('blog-posts-btn');
    const blogPostsPreview = document.getElementById('blog-posts-preview');
    const blogPostsFullModal = document.getElementById('blog-posts-full-modal');
    const blogPostsClose = document.getElementById('blog-posts-close');
    const blogPostsList = document.querySelector('.blog-posts-list');
    const blogPostsFullBody = document.querySelector('#blog-posts-full-modal .guestbook-body');
    const previewBody = blogPostsPreview ? blogPostsPreview.querySelector('.preview-body') : null;

    // 初始化
    function init() {
        if (!blogPostsBtn || !blogPostsFullModal) return;

        // 点击按钮打开完整弹窗
        blogPostsBtn.addEventListener('click', openFullModal);
        
        // 关闭按钮
        blogPostsClose.addEventListener('click', closeFullModal);

        // 页面加载时自动加载数据（用于 Hover 预览）
        loadBlogPosts(true);

        // 监听预览面板滚动事件实现触底加载
        if (previewBody) {
            previewBody.addEventListener('scroll', handleScroll);
        }
    }

    // 处理滚动事件（仅针对预览面板）
    function handleScroll(e) {
        // 如果滚动的是全屏弹窗，则不触发自动加载
        if (e.target.closest('#blog-posts-full-modal')) return;

        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // 距离底部 50px 时触发加载
        if (scrollHeight - scrollTop - clientHeight < 50) {
            loadMoreBlogPosts();
        }
    }

    // 打开完整弹窗
    function openFullModal() {
        blogPostsFullModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 首次打开时加载文章
        if (!document.querySelector('.blog-post-item')) {
            loadBlogPosts(true);
        }
    }

    // 关闭完整弹窗
    function closeFullModal() {
        blogPostsFullModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 加载文章列表
    async function loadBlogPosts(reset = false) {
        if (isLoading || (!hasMore && !reset)) return;

        isLoading = true;
        
        if (reset) {
            currentPage = 1;
            hasMore = true;
            if (blogPostsList) blogPostsList.innerHTML = '<div class="guestbook-loading">正在加载文章...</div>';
            if (blogPostsFullBody) blogPostsFullBody.innerHTML = '<div class="guestbook-loading">正在加载文章...</div>';
        }

        try {
            const response = await fetch(`${BLOG_API_URL}?page=${currentPage}&pageSize=${PAGE_SIZE}&showContent=false&showDigest=excerpt&limit=60`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': BLOG_TOKEN
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            const posts = result.data.dataSet || [];
            const totalPages = result.data.pages || 0;
            const totalCount = result.data.count || 0; // 获取总数
            
            // 判断是否还有更多数据
            hasMore = currentPage < totalPages;
            
            if (reset) {
                renderPosts(posts, true, totalCount);
            } else {
                appendPosts(posts);
            }
            
        } catch (error) {
            console.error('加载文章失败:', error);
            if (reset) {
                const errorMsg = '<div class="guestbook-empty">加载文章失败，请稍后重试</div>';
                if (blogPostsList) blogPostsList.innerHTML = errorMsg;
                if (blogPostsFullBody) blogPostsFullBody.innerHTML = errorMsg;
            }
        } finally {
            isLoading = false;
        }
    }

    // 渲染文章列表
    function renderPosts(posts, isReset = false, totalCount = 0) {
        // 预览面板 HTML（无底部分页按钮，使用无限滚动）
        let previewHtml = '';
        // 全屏弹窗 HTML（保留底部分页按钮）
        let fullHtml = '';
        
        if (!posts || posts.length === 0) {
            const emptyHtml = '<div class="guestbook-empty">暂无文章</div>';
            previewHtml = emptyHtml;
            fullHtml = emptyHtml;
        } else {
            const containerHtml = '<div class="blog-posts-container">' +
                posts.map(post => renderPostItem(post)).join('') +
                '</div>';
            
            previewHtml = containerHtml;
            if (!hasMore) {
                previewHtml += `<div class="load-complete">已显示全部</div>`;
            }
            
            fullHtml = containerHtml;
            // 弹窗界面保留“点击加载更多”按钮
            if (hasMore) {
                fullHtml += `<button class="load-more-btn" onclick="window.loadMoreBlogPosts()">点击加载更多</button>`;
            } else {
                fullHtml += `<div class="load-complete">已显示全部</div>`;
            }
        }

        if (blogPostsList) blogPostsList.innerHTML = previewHtml;
        if (blogPostsFullBody) blogPostsFullBody.innerHTML = fullHtml;
        
        // 更新预览面板标题显示总数
        const previewHeader = document.querySelector('#blog-posts-preview .preview-header h3');
        if (previewHeader && totalCount > 0) {
            const lang = localStorage.getItem('preferred_language') || 'zh';
            const translations = {
                'zh': typeof translationsZH !== 'undefined' ? translationsZH : {},
                'en': typeof translationsEN !== 'undefined' ? translationsEN : {}
            };
            const titleText = translations[lang]['blog_latest_posts'] || '最新文章';
            previewHeader.textContent = `${titleText} (${totalCount})`;
        }
    }

    // 追加文章
    function appendPosts(posts) {
        const containers = document.querySelectorAll('.blog-posts-container');

        if (containers.length === 0) {
            console.error('未找到 .blog-posts-container 容器');
            return;
        }

        // 向所有容器追加新文章
        containers.forEach(container => {
            posts.forEach(post => {
                const div = document.createElement('div');
                div.innerHTML = renderPostItem(post);
                container.appendChild(div.firstElementChild);
            });

            // 移除当前容器后的旧按钮和提示（只操作当前容器的兄弟元素）
            let nextSibling = container.nextElementSibling;
            while (nextSibling && (nextSibling.classList.contains('load-more-btn') || nextSibling.classList.contains('load-complete'))) {
                const toRemove = nextSibling;
                nextSibling = nextSibling.nextElementSibling;
                toRemove.remove();
            }

            // 区分预览面板和全屏弹窗：预览面板不显示按钮，全屏弹窗显示按钮
            const isPreview = container.closest('#blog-posts-preview');
            if (!isPreview) {
                if (hasMore) {
                    const btn = document.createElement('button');
                    btn.className = 'load-more-btn';
                    btn.textContent = '点击加载更多';
                    btn.onclick = window.loadMoreBlogPosts;
                    container.after(btn);
                } else {
                    const tip = document.createElement('div');
                    tip.className = 'load-complete';
                    tip.textContent = '已显示全部';
                    container.after(tip);
                }
            } else {
                // 预览面板仅显示完成提示
                if (!hasMore) {
                    const tip = document.createElement('div');
                    tip.className = 'load-complete';
                    tip.textContent = '已显示全部';
                    container.after(tip);
                }
            }
        });
        
        console.log(`成功追加 ${posts.length} 篇文章到 ${containers.length} 个容器，当前页码: ${currentPage}`);
    }

    // 渲染单个文章项
    function renderPostItem(post) {
        const date = new Date(post.created * 1000);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const category = post.categories && post.categories.length > 0 ? post.categories[0].name : '未分类';
        const digest = post.digest || '';
        
        let html = `<div class="blog-post-item" onclick="showCustomConfirm('确定要打开网站吗？\\n${post.permalink}', () => window.open('${post.permalink}', '_blank'))">`;
        html += `<div class="blog-post-title">${escapeHtml(post.title)}</div>`;
        if (digest) {
            html += `<div class="blog-post-digest">${escapeHtml(digest)}</div>`;
        }
        html += `<div class="blog-post-meta">`;
        html += `<span>${dateStr}</span>`;
        html += `<span class="blog-post-category">${escapeHtml(category)}</span>`;
        html += `</div>`;
        html += `</div>`;
        
        return html;
    }

    // HTML 转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 加载更多
    window.loadMoreBlogPosts = function() {
        if (!isLoading && hasMore) {
            currentPage++;
            loadBlogPosts(false);
        }
    };

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
