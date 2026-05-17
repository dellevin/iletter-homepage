/**
 * 留言板功能 - 基于 Flask API
 */
(function () {
    'use strict';

    // Flask API 地址
    const API_BASE_URL = 'https://comments.iletter.top';
    const PAGE_SIZE = 10;

    let currentPage = 1;
    let hasMore = true;
    let isLoading = false;
    let allComments = []; // 存储所有已加载的留言

    // DOM 元素
    const guestbookBtn = document.getElementById('guestbook-btn');
    const guestbookPreview = document.getElementById('guestbook-preview');
    const guestbookFullModal = document.getElementById('guestbook-full-modal');
    const guestbookClose = document.getElementById('guestbook-close');
    const guestbookBody = document.querySelector('#guestbook-full-modal .guestbook-body');
    const previewBody = document.querySelector('.preview-body');
    
    // Toast 容器
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // 表单元素（需要动态获取，因为表单会被重新渲染）
    let nicknameInput, emailInput, linkInput, contentInput, submitBtn;

    // 显示 Toast 提示
    function showToast(message, type = 'success', duration = 2000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        // 触发动画
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // 自动消失
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }

    // 初始化
    function init() {
        if (!guestbookBtn || !guestbookFullModal) return;

        // 点击按钮打开完整弹窗
        guestbookBtn.addEventListener('click', openFullModal);
        
        // 关闭按钮
        guestbookClose.addEventListener('click', closeFullModal);
        
        // 预览面板触底加载
        if (previewBody) {
            previewBody.addEventListener('scroll', handlePreviewScroll);
        }
        
        // 表单提交事件使用事件委托
        guestbookBody.addEventListener('submit', function(e) {
            if (e.target && e.target.id === 'guestbook-form') {
                handleSubmit(e);
            }
        });

        // 页面加载时自动加载数据（用于 Hover 预览）
        loadGuestbook(true);
    }

    // 切换留言板显示/隐藏
    function toggleGuestbook() {
        if (guestbookFullModal.classList.contains('active')) {
            closeFullModal();
        } else {
            openFullModal();
        }
    }

    // 打开完整弹窗
    function openFullModal() {
        guestbookFullModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 首次打开时加载留言
        if (!document.querySelector('.guestbook-list')) {
            loadGuestbook(true);
        }
    }

    // 关闭完整弹窗
    function closeFullModal() {
        guestbookFullModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 点击模态框背景关闭
    function handleModalClick(e) {
        if (e.target === guestbookModal) {
            closeGuestbook();
        }
    }

    // 加载留言列表
    async function loadGuestbook(reset = false) {
        if (isLoading || (!hasMore && !reset)) return;

        isLoading = true;
        
        if (reset) {
            currentPage = 1;
            hasMore = true;
            guestbookBody.innerHTML = '<div class="guestbook-loading" data-i18n="guestbook_loading">正在加载留言...</div>';
        } else {
            // 添加加载更多按钮状态
            const loadMoreBtn = document.querySelector('.load-more-btn');
            if (loadMoreBtn) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.textContent = '加载中...';
            }
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/comment?path=www.iletter.top&pageSize=${PAGE_SIZE}&page=${currentPage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            const comments = result.data.data || [];
            const totalCount = result.data.count || 0;
            const totalPages = result.data.totalPages || 0;
            
            // 判断是否还有更多数据（根据总页数）
            hasMore = currentPage < totalPages;
            
            // 累积所有留言
            if (reset) {
                allComments = comments;
            } else {
                allComments = allComments.concat(comments);
            }
            
            if (reset) {
                renderGuestbook(comments, totalCount);
            } else {
                appendGuestbook(comments);
            }
            
        } catch (error) {
            console.error('加载留言失败:', error);
            if (reset) {
                guestbookBody.innerHTML = `<div class="guestbook-empty" data-i18n="guestbook_load_error">加载留言失败，请稍后重试</div>`;
            }
        } finally {
            isLoading = false;
        }
    }

    // 渲染留言列表
    function renderGuestbook(comments, totalCount) {
        let html = '';
        
        // 先渲染表单（放在顶部）
        html += renderForm();
        
        if (!comments || comments.length === 0) {
            html += `<div class="guestbook-empty" data-i18n="guestbook_no_data">暂无留言，快来抢沙发吧！</div>`;
            guestbookBody.innerHTML = html;
            return;
        }

        html += '<div class="guestbook-list">';
        comments.forEach(comment => {
            html += renderCommentItem(comment);
        });
        html += '</div>';

        // 判断是否还有更多数据
        if (hasMore) {
            html += `<button class="load-more-btn" onclick="window.loadMoreGuestbook()">点击加载更多</button>`;
        } else {
            html += `<div class="load-complete">已显示全部</div>`;
        }

        guestbookBody.innerHTML = html;
        
        // 同时更新 Hover 预览面板（使用累积的所有留言）
        renderPreview(allComments, totalCount);
    }

    // 渲染 Hover 预览面板
    function renderPreview(comments, totalCount = 0) {
        if (!previewBody) return;
        
        if (!comments || comments.length === 0) {
            previewBody.innerHTML = '<div class="guestbook-empty">暂无留言，快来抢沙发吧！</div>';
            return;
        }
        
        // 更新标题显示总数
        const previewHeader = document.querySelector('#guestbook-preview .preview-header h3');
        if (previewHeader && totalCount > 0) {
            const lang = localStorage.getItem('preferred_language') || 'zh';
            const translations = {
                'zh': typeof translationsZH !== 'undefined' ? translationsZH : {},
                'en': typeof translationsEN !== 'undefined' ? translationsEN : {}
            };
            const titleText = translations[lang]['guestbook_title'] || '留言板';
            previewHeader.textContent = `${titleText} (${totalCount})`;
        }
        
        let html = '';
        comments.forEach(comment => {
            const date = new Date(comment.time);
            const timeStr = formatDate(date);
            
            html += `<div class="preview-item">`;
            html += `<div class="preview-nickname">${escapeHtml(comment.nick)}</div>`;
            
            // 提取纯文本内容（去除 HTML 标签）
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = comment.comment || '';
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            
            html += `<div class="preview-content">${escapeHtml(textContent)}</div>`;
            html += `<div class="preview-time">${timeStr}</div>`;
            html += `</div>`;
        });
        
        // 如果已经加载完所有数据，显示提示
        if (!hasMore && allComments.length > 0) {
            html += `<div class="preview-complete">已全部加载</div>`;
        }
        
        previewBody.innerHTML = html;
    }

    // 处理预览面板滚动事件
    function handlePreviewScroll(e) {
        const target = e.target;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;
        
        // 距离底部 50px 时触发加载
        if (scrollHeight - scrollTop - clientHeight < 50) {
            if (!isLoading && hasMore) {
                currentPage++;
                loadGuestbook(false);
            }
        }
    }

    // 追加留言
    function appendGuestbook(comments) {
        const listContainer = document.querySelector('.guestbook-list');
        const loadMoreBtn = document.querySelector('.load-more-btn');
        const allDataTip = document.querySelector('.guestbook-body > div:last-child');

        if (!listContainer) return;

        comments.forEach(comment => {
            const div = document.createElement('div');
            div.innerHTML = renderCommentItem(comment);
            listContainer.appendChild(div.firstElementChild);
        });

        // 移除旧的加载更多按钮和提示
        if (loadMoreBtn) {
            loadMoreBtn.remove();
        }
        const oldTip = document.querySelector('.load-complete');
        if (oldTip) {
            oldTip.remove();
        }

        // 如果还有更多，添加新的加载更多按钮
        if (hasMore) {
            const btn = document.createElement('button');
            btn.className = 'load-more-btn';
            btn.textContent = '点击加载更多';
            btn.onclick = window.loadMoreGuestbook;
            listContainer.after(btn);
        } else {
            // 没有更多数据，显示提示
            const tip = document.createElement('div');
            tip.className = 'load-complete';
            tip.textContent = '已显示全部';
            listContainer.after(tip);
        }
        
        // 更新预览面板
        renderPreview(allComments, allComments.length);
    }

    // 渲染单个留言项
    function renderCommentItem(comment) {
        const date = new Date(comment.time);
        const timeStr = formatDate(date);
        
        let html = `<div class="guestbook-item">`;
        html += `<div class="guestbook-item-header">`;
        
        // 头像和昵称
        html += `<div style="display: flex; align-items: center; gap: 8px;">`;
        if (comment.avatar) {
            html += `<img src="${escapeHtml(comment.avatar)}" alt="">`;
        }
        
        // 昵称和链接
        if (comment.link) {
            html += `<span class="guestbook-nickname"><a href="${escapeHtml(comment.link)}" target="_blank">${escapeHtml(comment.nick)}</a></span>`;
        } else {
            html += `<span class="guestbook-nickname">${escapeHtml(comment.nick)}</span>`;
        }
        html += `</div>`;
        
        html += `<span class="guestbook-meta">${timeStr}</span>`;
        html += `</div>`;
        
        // 内容（comment 字段已经是 HTML）
        html += `<div class="guestbook-content">${comment.comment || ''}</div>`;
        
        // 底部信息（浏览器、系统、地址）
        html += renderCommentFooter(comment);
        
        // 回复列表
        if (comment.children && comment.children.length > 0) {
            html += `<div class="guestbook-reply">`;
            comment.children.forEach(reply => {
                html += renderReplyItem(reply);
            });
            html += `</div>`;
        }
        
        html += `</div>`;
        return html;
    }

    // 渲染留言底部信息
    function renderCommentFooter(comment) {
        const browser = comment.browser || '';
        const os = comment.os || '';
        const addr = comment.addr || '';
        
        if (!browser && !os && !addr) return '';
        
        let html = '<div class="guestbook-footer">';
        
        if (browser) {
            html += `<span class="guestbook-info-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> ${escapeHtml(browser)}</span>`;
        }
        
        if (os) {
            html += `<span class="guestbook-info-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> ${escapeHtml(os)}</span>`;
        }
        
        if (addr) {
            html += `<span class="guestbook-info-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${escapeHtml(addr)}</span>`;
        }
        
        html += '</div>';
        return html;
    }

    // 渲染回复项
    function renderReplyItem(reply) {
        const date = new Date(reply.time);
        const timeStr = formatDate(date);
        
        let html = `<div class="guestbook-item" style="margin-top: 10px;">`;
        html += `<div class="guestbook-item-header">`;
        
        html += `<div style="display: flex; align-items: center; gap: 8px;">`;
        if (reply.avatar) {
            html += `<img src="${escapeHtml(reply.avatar)}" alt="">`;
        }
        
        if (reply.link) {
            html += `<span class="guestbook-nickname"><a href="${escapeHtml(reply.link)}" target="_blank">${escapeHtml(reply.nick)}</a></span>`;
        } else {
            html += `<span class="guestbook-nickname">${escapeHtml(reply.nick)}</span>`;
        }
        html += `</div>`;
        
        html += `<span class="guestbook-meta">${timeStr}</span>`;
        html += `</div>`;
        html += `<div class="guestbook-content">${reply.comment || ''}</div>`;
        html += `</div>`;
        
        return html;
    }

    // 渲染表单
    function renderForm() {
        return `
            <form id="guestbook-form" class="guestbook-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="guestbook-nickname" data-i18n="guestbook_nickname">昵称（选填）</label>
                        <input type="text" id="guestbook-nickname" placeholder="匿名">
                    </div>
                    <div class="form-group">
                        <label for="guestbook-email" data-i18n="guestbook_email">邮箱（选填）</label>
                        <input type="email" id="guestbook-email" placeholder="用于接收回复通知">
                    </div>
                    <div class="form-group">
                        <label for="guestbook-link" data-i18n="guestbook_website">网站（选填）</label>
                        <input type="url" id="guestbook-link" placeholder="https://example.com">
                    </div>
                </div>
                <div class="form-group-full">
                    <label for="guestbook-content" data-i18n="guestbook_placeholder">说点什么吧...</label>
                    <textarea id="guestbook-content" placeholder="请输入留言内容..." required maxlength="500"></textarea>
                </div>
                <div class="form-submit">
                    <button type="submit" id="guestbook-submit" class="submit-btn" data-i18n="guestbook_submit">提交留言</button>
                </div>
            </form>
        `;
    }

    // 提交留言
    async function handleSubmit(e) {
        e.preventDefault();

        // 重新获取表单元素（因为表单可能被重新渲染）
        nicknameInput = document.getElementById('guestbook-nickname');
        emailInput = document.getElementById('guestbook-email');
        linkInput = document.getElementById('guestbook-link');
        contentInput = document.getElementById('guestbook-content');
        submitBtn = document.getElementById('guestbook-submit');

        const nick = nicknameInput.value.trim() || '匿名';
        const email = emailInput.value.trim();
        const link = linkInput.value.trim();
        const comment = contentInput.value.trim();

        // 验证
        if (!comment) {
            showToast('请输入留言内容', 'error');
            return;
        }

        // 禁用提交按钮
        submitBtn.disabled = true;
        submitBtn.textContent = '提交中...';

        try {
            const response = await fetch(`${API_BASE_URL}/api/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nick: nick,
                    mail: email || '',
                    link: link || '',
                    comment: comment,
                    path: 'www.iletter.top',
                    ua: navigator.userAgent,
                    url: window.location.href
                })
            });

            const data = await response.json();

            if (response.ok && data.errno === 0) {
                showToast(getTranslation('guestbook_submit_success') || '留言提交成功！', 'success');
                
                // 清空表单
                nicknameInput.value = '';
                emailInput.value = '';
                linkInput.value = '';
                contentInput.value = '';
                
                // 重新加载第一页
                loadGuestbook(true);
            } else {
                throw new Error(data.errmsg || '提交失败');
            }
        } catch (error) {
            console.error('提交留言失败:', error);
            showToast(getTranslation('guestbook_submit_error') || '留言提交失败，请重试', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = getTranslation('guestbook_submit') || '提交留言';
        }
    }

    // 格式化日期
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    // HTML 转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 获取翻译
    function getTranslation(key) {
        const lang = localStorage.getItem('preferred_language') || 'zh';
        const translations = {
            'zh': typeof translationsZH !== 'undefined' ? translationsZH : {},
            'en': typeof translationsEN !== 'undefined' ? translationsEN : {}
        };
        return translations[lang][key] || key;
    }

    // 加载更多
    window.loadMoreGuestbook = function() {
        if (!isLoading && hasMore) {
            currentPage++;
            loadGuestbook(false);
        }
    };

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
