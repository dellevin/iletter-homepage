// ==================== 闲言碎语 API 加载与分页功能 ====================
(function () {
    // 确保使用 HTTPS
    const MEMOS_API_BASE = "https://memos.iletter.top/api/v1/memos";
    const PAGE_SIZE = 5; // 每页加载的 memo 数量

    let memoData = []; // 存储所有已加载的 memo
    let allLoaded = false; // 标记是否已加载所有数据
    let isLoading = false; // 标记是否正在加载，防止重复请求
    let nextPageToken = null; // 用于 API 分页的 token

    // 获取 DOM 元素
    const memosTab = document.querySelector('.nav-tab[data-tab="memos"]');
    const memosContainer = document.getElementById("memos-container");

    // 日期格式化函数 (简单实现)
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleString("sv-SE"); // 使用瑞典格式，结果接近 '2026-01-08 00:57:04'
    }

    // 渲染 Memo 列表 (追加模式)
    function renderMemos(memos) {
        if (!memos || memos.length === 0) {
            // 如果是首次加载且无数据
            if (memoData.length === 0) {
                memosContainer.innerHTML =
                    '<div class="memo-error" data-i18n="no_memos_data">暂无数据</div>';
            }
            return;
        }

        let html = "";
        memos.forEach((memo) => {
            const formattedDate = formatDate(memo.displayTime);
            const tagsHtml =
                memo.tags && memo.tags.length > 0
                    ? `<div class="memo-tags">${memo.tags
                        .map((tag) => `<span class="memo-tag">${tag}</span>`)
                        .join("")}</div>`
                    : "";

            // 去掉 \n# 及其后面的部分
            const contentWithoutHash = memo.content.split("\n#")[0];
            // --- 新增: 生成附件 HTML ---
            let attachmentsHtml = "";
            if (
                memo.attachments &&
                Array.isArray(memo.attachments) &&
                memo.attachments.length > 0
            ) {
                attachmentsHtml = '<div class="memo-attachments">';
                memo.attachments.forEach((attachment) => {
                    // 检查附件类型是否为图片
                    if (attachment.type && attachment.type.startsWith("image/")) {
                        // 构造缩略图链接
                        const thumbnailUrl = `https://memos.iletter.top/file/${attachment.name
                            }/${encodeURIComponent(attachment.filename)}?thumbnail=true`;

                        attachmentsHtml += `
                                    <div class="memo-attachment-item">
                                        <img src="${thumbnailUrl}" alt="${attachment.filename
                            }" class="memo-attachment-image" data-full-url="${"https://memos.iletter.top/file/" +
                            attachment.name +
                            "/" +
                            encodeURIComponent(attachment.filename)
                            }">
                                    </div>
                                `;
                    }
                    // 如果需要处理其他类型的附件，可以在这里添加 else if 分支
                    else {
                        attachmentsHtml += `<a href="https://memos.iletter.top/file/${attachment.name
                            }/${encodeURIComponent(attachment.filename)}" target="_blank">${attachment.filename
                            }</a>`;
                    }
                });
                attachmentsHtml += "</div>";
            }

            html += `
                        <div class="memo-item">
                            <div class="memo-date">${formattedDate}</div>
                            <div class="memo-content">${contentWithoutHash}</div>
                            ${attachmentsHtml}
                            ${tagsHtml}
                        </div>
                    `;
        });

        // 如果是首次加载，则替换容器内容
        if (memoData.length === memos.length) {
            memosContainer.innerHTML = html;
        } else {
            // 否则追加到现有内容之后
            memosContainer.insertAdjacentHTML("beforeend", html);
        }
    }

    // 加载 Memo 数据 (分页) - 修正后的函数
    async function loadMemos() {
        // 防止重复加载或已加载完毕时再次加载
        if (isLoading || allLoaded) {
            console.log("加载状态检查：", { isLoading, allLoaded });
            return;
        }
        isLoading = true;

        // 显示加载状态 (仅在首次加载时替换，后续加载追加)
        if (memoData.length === 0) {
            memosContainer.innerHTML =
                '<div class="memo-loading" data-i18n="loading_memos">正在加载...</div>';
        }

        try {
            // 构建 API 请求 URL，确保 pageToken 不为 null 时才添加
            const url = new URL(MEMOS_API_BASE);
            url.searchParams.set("pageSize", PAGE_SIZE.toString());
            url.searchParams.set("orderBy", "display_time desc");
            if (nextPageToken) {
                url.searchParams.set("pageToken", nextPageToken);
            }

            // console.log("请求 URL:", url.toString()); // 调试信息

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // console.log("API 响应:", data); // 调试信息

            const newMemos = data.memos || [];
            memoData = memoData.concat(newMemos);

            // --- 修复的关键逻辑 ---
            // 检查 API 返回的 next_page_token 是否为空字符串
            if (data.nextPageToken === "") {
                allLoaded = true; // 标记为已全部加载
                nextPageToken = null; // 清空 token
                console.log("检测到 nextPageToken 为空，已全部加载。");
            } else {
                // 如果不为空，更新 token 以供下次使用
                nextPageToken = data.nextPageToken;
            }

            // 渲染新加载的数据
            renderMemos(newMemos);

            // --- 修复的关键逻辑 ---
            // 只有在尚未全部加载完时，才渲染加载更多按钮
            if (!allLoaded) {
                renderLoadMoreButton();
            } else {
                const loadMoreContainer = document.getElementById("load-more-btn");
                if (loadMoreContainer) {
                    loadMoreContainer.remove();
                }
                // 数据全部加载完后，可以显示一个提示
                memosContainer.insertAdjacentHTML(
                    "beforeend",
                    '<div class="memo-error" data-i18n="all_memos_loaded">已加载全部数据</div>'
                );
            }
        } catch (error) {
            console.error("加载闲言碎语失败:", error);
            // 如果是首次加载失败，替换内容
            if (memoData.length === 0) {
                memosContainer.innerHTML = `<div class="memo-error" data-i18n="memos_load_error">加载失败: ${error.message}</div>`;
            } else {
                // 如果是追加加载失败，提示错误，但保留已有内容
                memosContainer.insertAdjacentHTML(
                    "beforeend",
                    `<div class="memo-error" data-i18n="memos_load_error_append">加载失败: ${error.message}</div>`
                );
            }
        } finally {
            isLoading = false;
        }
    }

    // 渲染“加载更多”按钮
    function renderLoadMoreButton() {
        const existingButton = document.getElementById("load-more-btn");
        if (existingButton) existingButton.remove();
        const loadMoreButton = document.createElement("div");
        loadMoreButton.id = "load-more-btn";
        loadMoreButton.className = "memo-pagination";
        loadMoreButton.innerHTML = `<button class="memo-page-btn" onclick="loadMemos()" data-i18n="load_more_button">加载更多</button>`;
        memosContainer.appendChild(loadMoreButton);
    }

    // 为加载更多按钮绑定事件 (使用全局函数)
    window.loadMemos = loadMemos;
    
    // 图片点击放大功能
    function initImageZoom() {
        // 使用事件委托，监听整个容器
        memosContainer.addEventListener('click', function (e) {
            // 检查是否点击到了图片
            if (e.target.classList.contains('memo-attachment-image')) {
                const fullUrl = e.target.getAttribute('data-full-url');
                if (fullUrl) {
                    showImageModal(fullUrl);
                }
            }
        });
    }
    
    // 显示图片放大模态框
    function showImageModal(imageUrl) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.id = 'image-zoom-modal';
        modal.style.cssText = `
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            justify-content: center;
            align-items: center;
            cursor: zoom-out;
        `;
    
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 5px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        `;
    
        modal.appendChild(img);
        document.body.appendChild(modal);
    
        // 点击关闭
        modal.addEventListener('click', function () {
            modal.remove();
        });
    
        // ESC 键关闭
        function handleEsc(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        }
        document.addEventListener('keydown', handleEsc);
    }
    
    // 初始化图片放大功能
    initImageZoom();
    
    // 当"闲言碎语"标签被点击时加载数据
    memosTab.addEventListener("click", function () {
        // 只有在内容是空的或者首次加载时才调用
        if (memoData.length === 0) {
            loadMemos();
        }
    });
})();