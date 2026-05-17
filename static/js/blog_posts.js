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

    // 初始化
    function init() {
        if (!blogPostsBtn || !blogPostsFullModal) return;

        // 点击按钮打开完整弹窗
        blogPostsBtn.addEventListener('click', openFullModal);
        
        // 关闭按钮
        blogPostsClose.addEventListener('click', closeFullModal);
        
        // 点击背景关闭
        blogPostsFullModal.addEventListener('click', function(e) {
            if (e.target === blogPostsFullModal) {
                closeFullModal();
            }
        });
        
        // ESC 键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && blogPostsFullModal.classList.contains('active')) {
                closeFullModal();
            }
        });

        // 页面加载时自动加载数据（用于 Hover 预览）
        loadBlogPosts(true);
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
            const response = await fetch(`${BLOG_API_URL}?page=${currentPage}&pageSize=${PAGE_SIZE}&showContent=false&showDigest=excerpt&limit=30`, {
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
            
            // 判断是否还有更多数据
            hasMore = currentPage < totalPages;
            
            if (reset) {
                renderPosts(posts, true);
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
    function renderPosts(posts, isReset = false) {
        let html = '';
        
        if (!posts || posts.length === 0) {
            html = '<div class="guestbook-empty">暂无文章</div>';
        } else {
            html = '<div class="blog-posts-container">';
            posts.forEach(post => {
                html += renderPostItem(post);
            });
            html += '</div>';

            if (hasMore) {
                html += `<button class="load-more-btn" onclick="window.loadMoreBlogPosts()">点击加载更多</button>`;
            } else {
                html += `<div class="load-complete">已显示全部</div>`;
            }
        }

        if (blogPostsList) blogPostsList.innerHTML = html;
        if (blogPostsFullBody) blogPostsFullBody.innerHTML = html;
    }

    // 追加文章
    function appendPosts(posts) {
        const containers = document.querySelectorAll('.blog-posts-container');
        const loadMoreBtns = document.querySelectorAll('.load-more-btn');
        const oldTips = document.querySelectorAll('.load-complete');

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
        });

        // 移除所有旧的加载更多按钮和提示
        loadMoreBtns.forEach(btn => btn.remove());
        oldTips.forEach(tip => tip.remove());

        // 向所有容器后添加新的加载更多按钮或提示
        if (hasMore) {
            containers.forEach(container => {
                const btn = document.createElement('button');
                btn.className = 'load-more-btn';
                btn.textContent = '点击加载更多';
                btn.onclick = window.loadMoreBlogPosts;
                container.after(btn);
            });
        } else {
            containers.forEach(container => {
                const tip = document.createElement('div');
                tip.className = 'load-complete';
                tip.textContent = '已显示全部';
                container.after(tip);
            });
        }
        
        console.log(`成功追加 ${posts.length} 篇文章到 ${containers.length} 个容器，当前页码: ${currentPage}`);
    }

    // 渲染单个文章项
    function renderPostItem(post) {
        const date = new Date(post.created * 1000);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const category = post.categories && post.categories.length > 0 ? post.categories[0].name : '未分类';
        
        let html = `<div class="blog-post-item" onclick="window.open('${post.permalink}', '_blank')">`;
        html += `<div class="blog-post-title">${escapeHtml(post.title)}</div>`;
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
