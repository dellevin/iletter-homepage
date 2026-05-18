// ==================== 全局搜索功能 ====================
(function() {
    const searchEngines = {
        google: 'https://www.google.com/search?q=',
        baidu: 'https://www.baidu.com/s?wd=',
        duckduckgo: 'https://duckduckgo.com/?q=',
        yandex: 'https://yandex.com/search/?text='
    };

    let currentEngine = localStorage.getItem('search_engine') || 'google';
    let enterCount = 0;
    let enterTimer = null;
    
    const searchOverlay = document.getElementById('search-overlay');
    const searchLockBtn = document.getElementById('search-lock-btn');
    const lockIconOpen = document.getElementById('lock-icon-open');
    const lockIconClosed = document.getElementById('lock-icon-closed');
    const searchInput = document.getElementById('global-search-input');
    const searchBtn = document.getElementById('global-search-btn');
    const searchIcon = document.getElementById('search-engine-icon');
    const dropdown = document.getElementById('search-engine-dropdown');
    const engineSelector = document.getElementById('search-engine-selector');
    const engineOptions = document.querySelectorAll('.engine-option');
    
    // 检查是否开启常驻模式
    const isPersistentSearch = localStorage.getItem('persistent_search') === 'true';
    if (isPersistentSearch) {
        document.body.classList.add('persistent-search-mode');
        // 确保搜索框也显示出来
        if (searchOverlay) {
            searchOverlay.classList.add('active');
        }
    }

    // 初始化搜索引擎图标
    function updateSearchIcon() {
        const activeOption = document.querySelector(`.engine-option[data-engine="${currentEngine}"]`);
        if (activeOption) {
            const iconSrc = activeOption.getAttribute('data-icon');
            searchIcon.src = iconSrc;
            searchIcon.alt = currentEngine.charAt(0).toUpperCase() + currentEngine.slice(1);
        }
    }

    // 更新锁图标状态
    function updateLockIcon() {
        const isLocked = document.body.classList.contains('persistent-search-mode');
        if (isLocked) {
            lockIconOpen.style.display = 'none';
            lockIconClosed.style.display = 'block';
            searchLockBtn.classList.add('locked');
            searchLockBtn.title = '取消常驻';
        } else {
            lockIconOpen.style.display = 'block';
            lockIconClosed.style.display = 'none';
            searchLockBtn.classList.remove('locked');
            searchLockBtn.title = '搜索常驻';
        }
    }

    // 显示搜索框
    function showSearch() {
        searchOverlay.classList.add('active');
        setTimeout(() => {
            searchInput.focus();
        }, 100);
    }

    // 隐藏搜索框（仅非驻留模式下调用）
    function hideSearch() {
        if (document.body.classList.contains('persistent-search-mode')) {
            return; // 常驻模式下不允许通过此函数关闭
        }
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        dropdown.classList.remove('show');
    }

    // 切换常驻模式
    function togglePersistentMode() {
        const isLocked = document.body.classList.contains('persistent-search-mode');
        if (isLocked) {
            // 退出常驻模式（解锁）：只改变锁状态，不关闭搜索框
            document.body.classList.remove('persistent-search-mode');
            localStorage.setItem('persistent_search', 'false');
            // 注意：不移除 active 类，保持搜索框显示
        } else {
            // 开启常驻模式（锁定）
            document.body.classList.add('persistent-search-mode');
            localStorage.setItem('persistent_search', 'true');
            searchOverlay.classList.add('active');
        }
        updateLockIcon();
    }

    // 执行搜索
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            const url = searchEngines[currentEngine] + encodeURIComponent(query);
            window.open(url, '_blank');
        }
    }

    // 监听双击回车键
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const now = Date.now();
            
            if (enterTimer && (now - enterTimer < 500)) {
                // 双击回车：如果当前不是常驻模式，则打开/关闭搜索框；如果是常驻模式，则不处理
                if (!document.body.classList.contains('persistent-search-mode')) {
                    if (searchOverlay.classList.contains('active')) {
                        hideSearch();
                    } else {
                        showSearch();
                    }
                }
                enterCount = 0;
                enterTimer = null;
            } else {
                enterCount = 1;
                enterTimer = now;
                
                // 如果搜索框已经打开，按单下回车执行搜索
                if (searchOverlay.classList.contains('active') && document.activeElement === searchInput) {
                    performSearch();
                }
            }
        }
        
        // ESC 键关闭搜索框（仅在非驻留模式下生效）
        if (e.key === 'Escape' && searchOverlay.classList.contains('active') && !document.body.classList.contains('persistent-search-mode')) {
            hideSearch();
        }
    });

    // 点击搜索引擎图标切换下拉菜单
    engineSelector.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    // 选择搜索引擎
    engineOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentEngine = option.getAttribute('data-engine');
            localStorage.setItem('search_engine', currentEngine);
            
            // 更新激活状态
            engineOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            updateSearchIcon();
            dropdown.classList.remove('show');
            searchInput.focus();
        });
    });

    // 点击页面其他地方关闭下拉菜单
    document.addEventListener('click', (e) => {
        // 如果不在常驻模式下，且点击的是搜索框外部，则关闭搜索框
        if (!document.body.classList.contains('persistent-search-mode') && !searchOverlay.contains(e.target)) {
            hideSearch();
        }
        dropdown.classList.remove('show');
    });

    // 阻止下拉菜单内部点击事件冒泡
    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 点击搜索按钮
    searchBtn.addEventListener('click', performSearch);

    // 点击锁图标切换常驻模式
    searchLockBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡，防止触发 document 的点击关闭逻辑
        togglePersistentMode();
    });

    // 初始化
    updateSearchIcon();
    updateLockIcon();
    const initialActiveOption = document.querySelector(`.engine-option[data-engine="${currentEngine}"]`);
    if (initialActiveOption) {
        engineOptions.forEach(opt => opt.classList.remove('active'));
        initialActiveOption.classList.add('active');
    }
})();

// ==================== Umami Stats 请求 ====================
        (async () => {
            const webid = "ae6cd64c-5900-49c9-9c22-95cedc24a508";
            const statsEndpoint = "https://umami.iletter.top/api/websites/" + webid + "/stats";
            const startAt = 1768060800000;
            const endAt = Date.now(); // 当前时间的时间戳（毫秒）
            const headers = {
                Authorization:
                    "Bearer JMQBYQLIlwUsx1tnfYI35APN3bh75JrdpWkx1uk0LJTi6QEGPlno2W2D7j8ogCAS12pXTT36VAZaGw3Pqgiw3BEViZG7o3+93zcmR4Txm0wjmHsTnig7GAxWfQMs1eRY9ACFl9KAo2n0UNgC+CqZt64PFxsKwsaIE2UzuGq1ByrCW8TQwtf76ZHg/qYYjFKAGIUEoQeDvXyCjoew25f7nN3o9GTdimkqoUt0xK/2tWCW1ROOowf6r5KDJK17jRNJGV6jwUJ9AsAd53CNp+MBOHy+E8Scrk/0ATZL3HUGSAuaFKyeITkaQTCjjwunnkxq/VAaeGXZIwI1Vt1llz0Qhbjy2G7l28FhOXm4QZLTdWXtduKwHkfAoFB+HcAWGsIdanoX",
                "Content-Type": "application/json",
            };
            const params = new URLSearchParams({
                startAt: startAt.toString(),
                endAt: endAt.toString(),
            });
            const requestUrl = `${statsEndpoint}?${params}`;

            try {
                const response = await fetch(requestUrl, {
                    method: "GET",
                    headers: headers,
                });
                if (!response.ok) {
                    // 如果响应不是 2xx，抛出错误
                    const errorText = await response.text();
                    throw new Error(
                        `HTTP error! status: ${response.status}, details: ${errorText}`
                    );
                }
                const data = await response.json();
                // 浏览量    data.pageviews.value
                // 访问次数  data.visits.value
                // 访客      data.visitors.value
                document.getElementById("site_uv").textContent = JSON.stringify(data.visitors.value);
                document.getElementById("site_pv").textContent = JSON.stringify(data.pageviews.value);
            } catch (error) {
                console.error("获取 Umami Stats 数据时发生错误:", error); // 控制台输出错误信息
            }
        })();