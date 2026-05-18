// ==================== 旅途剪影功能 ====================
(function() {
    // DOM 元素
    const photoAlbumBtn = document.getElementById('photo-album-btn');
    const photoAlbumPreview = document.getElementById('photo-album-preview');
    const photoAlbumFullModal = document.getElementById('photo-album-full-modal');
    const photoAlbumClose = document.getElementById('photo-album-close');
    const photoAlbumList = document.querySelector('.photo-album-list');
    const photoAlbumBody = document.querySelector('#photo-album-full-modal .photo-album-body');

    // 照片数据
    let allPhotos = [];
    let currentPhotoIndex = 0; // 当前查看的照片索引
    const PHOTO_BASE_PATH = './static/img/photos/';
    
    // 分页加载配置
    const PAGE_SIZE = 20; // 每页加载数量
    let currentPage = 1; // 当前页码
    let hasMore = true; // 是否还有更多数据
    let isLoading = false; // 是否正在加载中

    // 初始化
    function init() {
        if (!photoAlbumBtn || !photoAlbumFullModal) return;

        // 点击按钮打开完整弹窗
        photoAlbumBtn.addEventListener('click', openFullModal);
        
        // 关闭按钮
        photoAlbumClose.addEventListener('click', closeFullModal);

        // 页面加载时自动加载照片（用于 Hover 预览）
        loadPhotos(true);
    }

    // 加载照片
    async function loadPhotos(reset = false) {
        if (reset) {
            if (photoAlbumList) photoAlbumList.innerHTML = '<div class="guestbook-loading">正在加载照片...</div>';
            if (photoAlbumBody) photoAlbumBody.innerHTML = '<div class="guestbook-loading">正在加载照片...</div>';
        }

        try {
            // 从 JSON 文件获取照片列表
            const response = await fetch(`${PHOTO_BASE_PATH}photos.json`);
            if (!response.ok) {
                throw new Error('Failed to load photos.json');
            }
            
            const data = await response.json();
            const photoFiles = data.photos || [];

            allPhotos = photoFiles.map((filename, index) => ({
                id: index + 1,
                src: `${PHOTO_BASE_PATH}${encodeURIComponent(filename)}`,
                filename: filename
            }));

            renderPhotos(allPhotos, reset);
            
        } catch (error) {
            console.error('加载照片失败:', error);
            if (reset) {
                const errorMsg = '<div class="guestbook-empty">加载照片失败，请稍后重试</div>';
                if (photoAlbumList) photoAlbumList.innerHTML = errorMsg;
                if (photoAlbumBody) photoAlbumBody.innerHTML = errorMsg;
            }
        }
    }

    // 渲染照片列表
    function renderPhotos(photos, isReset = false) {
        let html = '';
        
        if (!photos || photos.length === 0) {
            html = '<div class="guestbook-empty">暂无照片</div>';
        } else {
            // 预览面板：显示最新的几张照片
            if (isReset && photoAlbumList) {
                const previewPhotos = photos.slice(0, 5); // 只显示前5张
                let previewHtml = '<div class="photo-album-container">';
                previewPhotos.forEach((photo, index) => {
                    previewHtml += `
                        <div class="photo-preview-item" onclick="window.openPhotoLightbox(${index})">
                            <img src="${photo.src}" alt="照片 ${photo.id}" loading="lazy">
                        </div>
                    `;
                });
                previewHtml += '</div>';
                photoAlbumList.innerHTML = previewHtml;
            }

            // 完整弹窗：瀑布流布局显示当前页的照片
            const startIndex = (currentPage - 1) * PAGE_SIZE;
            const endIndex = Math.min(currentPage * PAGE_SIZE, photos.length);
            const currentPhotos = photos.slice(startIndex, endIndex);
            
            // 首次渲染：创建完整的 HTML
            html = '<div class="photo-album-grid">';
            currentPhotos.forEach((photo, index) => {
                const globalIndex = startIndex + index;
                html += `
                    <div class="photo-album-item" onclick="window.openPhotoLightbox(${globalIndex})">
                        <img src="${photo.src}" alt="照片 ${photo.id}" loading="lazy" onload="this.style.opacity=1">
                    </div>
                `;
            });
            html += '</div>';
            
            // 分页导航
            const totalPages = Math.ceil(photos.length / PAGE_SIZE);
            if (totalPages > 1) {
                html += '<div class="pagination-container">';
                
                // 上一页
                if (currentPage > 1) {
                    html += `<button class="page-btn" onclick="window.goToPhotoPage(${currentPage - 1})">&lt;</button>`;
                }
                
                // 页码
                for (let i = 1; i <= totalPages; i++) {
                    if (i === currentPage) {
                        html += `<span class="page-num active">${i}</span>`;
                    } else {
                        // 只显示当前页附近的页码，避免太多
                        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                            html += `<span class="page-num" onclick="window.goToPhotoPage(${i})">${i}</span>`;
                        } else if (i === currentPage - 3 || i === currentPage + 3) {
                            html += `<span class="page-dots">...</span>`;
                        }
                    }
                }
                
                // 下一页
                if (currentPage < totalPages) {
                    html += `<button class="page-btn" onclick="window.goToPhotoPage(${currentPage + 1})">&gt;</button>`;
                }
                
                html += '</div>';
            }
        }

        if (photoAlbumBody) photoAlbumBody.innerHTML = html;
    }

    // 打开完整弹窗
    function openFullModal() {
        photoAlbumFullModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 重置分页状态
        currentPage = 1;
        hasMore = allPhotos.length > PAGE_SIZE;
        
        // 清空弹窗内容，避免重复渲染
        if (photoAlbumBody) photoAlbumBody.innerHTML = '';
        
        renderPhotos(allPhotos, false);
    }

    // 关闭完整弹窗
    function closeFullModal() {
        photoAlbumFullModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 打开照片放大查看器
    window.openPhotoLightbox = function(photoIndex) {
        currentPhotoIndex = photoIndex;
        
        // 检查是否已经存在 lightbox
        let lightbox = document.querySelector('.photo-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.className = 'photo-lightbox';
            lightbox.innerHTML = `
                <span class="photo-lightbox-close">&times;</span>
                <span class="photo-lightbox-nav photo-lightbox-prev">&#10094;</span>
                <img src="" alt="放大照片">
                <span class="photo-lightbox-nav photo-lightbox-next">&#10095;</span>
                <div class="photo-lightbox-counter"></div>
            `;
            document.body.appendChild(lightbox);

            // 点击关闭按钮
            lightbox.querySelector('.photo-lightbox-close').addEventListener('click', closePhotoLightbox);
            
            // 上一张按钮
            lightbox.querySelector('.photo-lightbox-prev').addEventListener('click', function(e) {
                e.stopPropagation();
                showPreviousPhoto();
            });

            // 下一张按钮
            lightbox.querySelector('.photo-lightbox-next').addEventListener('click', function(e) {
                e.stopPropagation();
                showNextPhoto();
            });

            // 键盘事件
            document.addEventListener('keydown', handleLightboxKeydown);
        }

        // 更新图片显示
        updateLightboxImage();
        lightbox.classList.add('active');
    };

    // 更新 Lightbox 图片
    function updateLightboxImage() {
        const lightbox = document.querySelector('.photo-lightbox');
        if (!lightbox || !allPhotos[currentPhotoIndex]) return;

        const img = lightbox.querySelector('img');
        const counter = lightbox.querySelector('.photo-lightbox-counter');
        
        // 淡出效果
        img.style.opacity = '0';
        
        setTimeout(() => {
            img.src = allPhotos[currentPhotoIndex].src;
            img.alt = `照片 ${currentPhotoIndex + 1}`;
            
            // 更新计数器
            if (counter) {
                counter.textContent = `${currentPhotoIndex + 1} / ${allPhotos.length}`;
            }
            
            // 淡入效果
            img.onload = () => {
                img.style.opacity = '1';
            };
        }, 150);
    }

    // 显示上一张照片
    function showPreviousPhoto() {
        if (currentPhotoIndex > 0) {
            currentPhotoIndex--;
        } else {
            currentPhotoIndex = allPhotos.length - 1; // 循环到最后一张
        }
        updateLightboxImage();
    }

    // 显示下一张照片
    function showNextPhoto() {
        if (currentPhotoIndex < allPhotos.length - 1) {
            currentPhotoIndex++;
        } else {
            currentPhotoIndex = 0; // 循环到第一张
        }
        updateLightboxImage();
    }

    // 处理键盘事件
    function handleLightboxKeydown(e) {
        if (e.key === 'ArrowLeft') {
            showPreviousPhoto();
        } else if (e.key === 'ArrowRight') {
            showNextPhoto();
        } else if (e.key === 'Escape') {
            closePhotoLightbox();
        }
    }

    // 关闭照片放大查看器
    function closePhotoLightbox() {
        const lightbox = document.querySelector('.photo-lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            
            // 移除键盘事件监听器
            document.removeEventListener('keydown', handleLightboxKeydown);
            
            setTimeout(() => {
                lightbox.remove();
            }, 300);
        }
    }

    // 加载更多照片
    window.loadMorePhotos = function() {
        if (isLoading || !hasMore) return;
        
        isLoading = true;
        currentPage++;
        
        // 判断是否还有更多数据
        hasMore = currentPage * PAGE_SIZE < allPhotos.length;
        
        renderPhotos(allPhotos, false);
        isLoading = false;
    };



    // 跳转到指定页码
    window.goToPhotoPage = function(page) {
        if (page < 1 || page > Math.ceil(allPhotos.length / PAGE_SIZE)) return;
        currentPage = page;
        renderPhotos(allPhotos, false);
        // 滚动到顶部
        if (photoAlbumBody) photoAlbumBody.scrollTop = 0;
    };

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
