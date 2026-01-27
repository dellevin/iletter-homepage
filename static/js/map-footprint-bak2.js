/**
 * ECharts 地图足迹模块 (支持钻取功能 - 点击省份查看下一级, 点击按钮返回)
 */
const MapFootprintModule = (() => {
    let myChart = null; // ECharts 实例
    let currentMapLevel = 'country'; // 当前地图层级 ('country', 'province')
    let currentProvinceCode = null; // 当前显示的省份编码 (如果有的话)

    // --- 配置 ---
    const COUNTRY_MAP_NAME = 'china_custom';
    const COUNTRY_GEOJSON_PATH = './static/js/echarts/china.geojson';
    const PROVINCE_GEOJSON_BASE_PATH = './static/js/echarts/province/'; // 假设省份 GeoJSON 存放在这个目录

    // --- 数据 ---
    // 注意：这里的坐标可能需要根据你实际访问的城市进行微调
    const visitedPlaces = [
        { name: "济南市", value: [117.024961, 36.682788], province: "山东省" },
        { name: "青岛市", value: [120.384423, 36.065918], province: "山东省" },
        { name: "淄博市", value: [118.055915, 36.813547], province: "山东省" },
        { name: "潍坊市", value: [119.162775, 36.705759], province: "山东省" },
        { name: "北京市", value: [116.407395, 39.904211], province: "北京" },
        { name: "杭州市", value: [120.153576, 30.287459], province: "浙江" },
        { name: "苏州市", value: [120.585316, 31.298886], province: "江苏" },
        { name: "扬州市", value: [119.421003, 32.393159], province: "江苏" },
        { name: "保定市", value: [115.482331, 38.867657], province: "河北" },
        { name: "石家庄市", value: [114.514891, 38.042309], province: "河北" },
        { name: "衡水市", value: [115.665996, 37.739574], province: "河北" },
        { name: "洛阳市", value: [112.454174, 34.618139], province: "河南" },
        { name: "南京市", value: [118.796877, 32.060255], province: "江苏" },
        { name: "无锡市", value: [120.311987, 31.490920], province: "江苏" },
        { name: "沧州市", value: [116.838581, 38.308094], province: "河北" },
        { name: "镇江市", value: [119.452753, 32.204402], province: "江苏" },
    ];

    // 省份名称到其 GeoJSON 文件名的映射 (需要根据你的文件名调整)
    const provinceNameToGeoFile = {
        "山东省": "shandong.json",
        // 你可以继续添加其他省份的映射，例如：
        // "江苏省": "jiangsu.json",
        // "河北省": "hebei.json",
        // ...
    };

    // --- 工具函数 ---

    /**
     * 根据省份中文名获取其对应的 GeoJSON 文件完整路径
     * @param {string} provinceName - 省份中文名
     * @returns {string|null} - 文件路径或 null
     */
    const getProvinceGeoPath = (provinceName) => {
        const fileName = provinceNameToGeoFile[provinceName];
        if (fileName) {
            return ` ${PROVINCE_GEOJSON_BASE_PATH}${fileName}`;
        }
        console.warn(`未找到省份 " ${provinceName}" 对应的 GeoJSON 文件。`);
        return null;
    };

    /**
     * 根据地图层级和可选的省份编码生成 ECharts 配置
     * @param {string} level - 地图层级 ('country' or 'province')
     * @param {string} [provinceCode] - 省份编码 (当 level='province' 时使用)
     * @returns {Object} - ECharts 配置对象
     */
    const getEChartsOption = (level, provinceCode = null) => {
        let geoMapName, roamSetting, zoomLevel, centerCoord, titleText;
        let filteredVisitedPlaces = []; // 用于过滤足迹点

        if (level === 'country') {
            geoMapName = COUNTRY_MAP_NAME;
            roamSetting = false; // 启用缩放和平移
            zoomLevel = 1.1;
            centerCoord = [104.06, 30]; // 中国中心
            titleText = '';
            filteredVisitedPlaces = visitedPlaces; // 显示所有足迹
        } else if (level === 'province' && provinceCode) {
            geoMapName = `province_ ${provinceCode}`; // 为省份地图创建唯一名称
            roamSetting = false; // 省份地图也启用缩放平移
            zoomLevel = 1.0; // 可以根据需要调整
            centerCoord = [118.5, 36.5]; // 示例：山东中心
            titleText = ` ${provinceCode} - 我的足迹`;
            // 过滤出属于当前省份的足迹点
            filteredVisitedPlaces = visitedPlaces.filter(place => place.province === provinceCode);
        } else {
            console.error("无效的地图层级或省份代码");
            return {}; // 返回空配置
        }

        return {
            title: {
                text: titleText,
                // subtext: level === 'country' ? '点击省份进入详情' : '点击下方返回按钮返回全国地图',
                subtext: '读万卷书，不如行万里路。见多才会识广~',
                left: 'center',
                textStyle: {
                    fontSize: 18
                },
                subtextStyle: {
                    fontSize: 12
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.componentType === 'series' && params.seriesType === 'scatter') {
                        // 足迹点的 tooltip
                        if (params.value && params.value.length >= 2) {
                            return params.name + '<br/>经度: ' + params.value[0].toFixed(4) + '<br/>纬度: ' + params.value[1].toFixed(4);
                        }
                        return params.name;
                    } else if (params.componentType === 'geo') {
                        // 地图区域的 tooltip
                        return params.name;
                    }
                    return params.name;
                }
            },
            geo: {
                map: geoMapName,
                roam: roamSetting,
                zoom: zoomLevel,
                center: centerCoord,
                emphasis: {
                    itemStyle: {
                        areaColor: '#f0f0f0',
                        borderColor: '#409EFF',
                        borderWidth: 1
                    }
                },
                itemStyle: {
                    areaColor: '#eef2ff',
                    borderColor: '#333'
                }
            },
            series: [
                {
                    name: '足迹',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: filteredVisitedPlaces,
                    symbol: 'pin',
                    symbolSize: 18,
                    itemStyle: {
                        color: '#FF6B6B',
                        borderColor: '#fff',
                        borderWidth: 1,
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#dd4444'
                        }
                    },
                    tooltip: {
                        formatter: function(params) {
                             return `  ${params.data.name}<br/>坐标: [  ${params.data.value[0].toFixed(4)},   ${params.data.value[1].toFixed(4)}]`;
                        }
                    }
                }
            ]
        };
    };


    /**
     * 加载并注册指定路径的 GeoJSON 地图数据
     * @param {string} path - GeoJSON 文件路径
     * @param {string} mapName - 注册到 ECharts 的地图名称
     * @returns {Promise<boolean>} - 成功或失败
     */
    const loadAndRegisterSingleMap = async (path, mapName) => {
        try {
            console.log(`正在加载 GeoJSON:  ${path}`);
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`加载 GeoJSON 失败:  ${response.status}  ${response.statusText}`);
            }
            const geoJsonData = await response.json();

            // 注册地图
            echarts.registerMap(mapName, geoJsonData);
            console.log(`GeoJSON 地图数据  ${mapName} 加载并注册成功。`);
            return true;
        } catch (error) {
            console.error('加载或注册 GeoJSON 地图时出错:', error);
            return false;
        }
    };

    /**
     * 切换到指定的地图层级和区域
     * @param {string} targetLevel - 目标层级 ('country' or 'province')
     * @param {string} [targetProvinceCode] - 目标省份编码 (当 targetLevel='province' 时使用)
     */
    const switchMap = async (targetLevel, targetProvinceCode = null) => {
        if (!myChart) {
            console.error("ECharts 实例不存在，无法切换地图。");
            return;
        }

        let mapNameToUse, geoPathToLoad;

        if (targetLevel === 'country') {
            mapNameToUse = COUNTRY_MAP_NAME;
            geoPathToLoad = COUNTRY_GEOJSON_PATH;
            currentMapLevel = 'country';
            currentProvinceCode = null;
        } else if (targetLevel === 'province' && targetProvinceCode) {
            mapNameToUse = `province_ ${targetProvinceCode}`;
            const path = getProvinceGeoPath(targetProvinceCode);
            if (!path) {
                console.error(`无法切换到省份  ${targetProvinceCode}: 找不到对应的 GeoJSON 文件。`);
                return;
            }
            geoPathToLoad = path;
            currentMapLevel = 'province';
            currentProvinceCode = targetProvinceCode;
        } else {
            console.error("无效的目标层级或省份代码。");
            return;
        }

        // 尝试加载并注册目标地图数据
        const loadSuccess = await loadAndRegisterSingleMap(geoPathToLoad, mapNameToUse);
        if (!loadSuccess) {
            console.error(`切换地图失败：无法加载  ${geoPathToLoad}`);
            return;
        }

        // 生成新配置并应用
        const newOption = getEChartsOption(targetLevel, targetProvinceCode);
        myChart.setOption(newOption, true); // 使用 notMerge=true 确保完全替换

        // 更新返回按钮的可见性
        updateBackButtonVisibility();
    };

    // --- 新增函数：管理返回按钮 ---

    /**
     * 获取返回按钮的DOM元素
     * @returns {HTMLElement|null}
     */
    const getBackButtonElement = () => {
         // 假设按钮ID是固定的，可以根据需要调整
         return document.getElementById('map-back-button');
    };

    /**
     * 创建返回按钮并将其添加到图表容器中
     * @param {HTMLElement} chartContainer - ECharts 图表容器
     */
    const createBackButton = (chartContainer) => {
        const button = document.createElement('button');
            button.id = 'map-back-button';
            button.textContent = '⬅返回全国地图';
            button.style.position = 'absolute';
            button.style.top = '10px';
            button.style.left = '10px';
            button.style.zIndex = 1000; // 确保按钮在图表之上
            button.style.padding = '2px 5px'; // 减少内边距以更接近纯文本
            button.style.fontSize = '14px'; // 根据需要调整字体大小
            button.style.cursor = 'pointer';
            button.style.border = 'none'; // 去掉边框
            button.style.backgroundColor = 'transparent'; // 设置背景透明
            button.style.display = 'none'; // 初始隐藏


        button.onclick = () => {
            console.log("点击了返回按钮。");
            switchMap('country');
        };

        chartContainer.appendChild(button);
    };

    /**
     * 根据当前地图层级更新返回按钮的可见性
     */
    const updateBackButtonVisibility = () => {
        const button = getBackButtonElement();
        if (!button) {
            console.warn("返回按钮 DOM 元素未找到，无法更新其可见性。");
            return;
        }
        // 当前在省份地图时显示按钮，否则隐藏
        button.style.display = (currentMapLevel === 'province') ? 'block' : 'none';
    };

    // --- /新增函数 ---
    /**
     * 初始化 ECharts 地图 (初始加载国家地图)
     * @param {HTMLElement} container - 图表容器DOM元素
     */
    const initEChartsMap = async (container) => {
        if (!container) {
            console.error('地图容器未找到');
            return;
        }

        // 初始化 ECharts 实例
        myChart = echarts.init(container);

        // 创建并添加返回按钮
        createBackButton(container);

        // 首先加载并注册国家地图
        const countryLoadSuccess = await loadAndRegisterSingleMap(COUNTRY_GEOJSON_PATH, COUNTRY_MAP_NAME);
        if (!countryLoadSuccess) {
             console.error("初始化失败：无法加载国家 GeoJSON。");
             return; // 或者显示错误信息给用户
        }

        // 应用初始配置 (国家地图)
        const initialOption = getEChartsOption('country');
        myChart.setOption(initialOption);

        // --- 添加事件监听 ---

        // 监听地图区域点击事件
        myChart.on('click', 'geo', function (params) {
            if (currentMapLevel === 'country') {
                // 当前是国家地图，点击省份则进入
                const clickedProvinceName = params.name;
                console.log(`点击了省份:  ${clickedProvinceName}`);

                // 尝试获取省份对应的 GeoJSON 文件名
                const fileName = Object.keys(provinceNameToGeoFile).find(key => key === clickedProvinceName);
                console.log(fileName)
                if (fileName) {
                     const provinceCode = fileName; // 这里假设文件名就是省份简称
                     console.log(`即将切换到省份:  ${provinceCode}`);
                     switchMap('province', provinceCode);
                } else {
                    console.log(`未配置省份 " ${clickedProvinceName}" 的详细地图。`);
                }
            }
            // 如果在省份地图上点击，可以有其他逻辑，比如不处理
        });

        // 监听窗口大小变化，自动适配
        window.addEventListener('resize', function () {
            if (myChart) {
                myChart.resize();
            }
        });
    };


    /**
     * 获取地图容器ID
     * @returns {string}
     */
    const getMapContainerId = () => {
        return 'echarts-map-container';
    };

    /**
     * 渲染 ECharts 地图内容到指定容器
     * @param {HTMLElement} contentDiv - 标签页的内容容器
     */
    const renderMap = (contentDiv) => {
        // 清空内容区域
        // contentDiv.innerHTML = '';
        // 创建地图容器
        const mapDiv = document.createElement('div');
        mapDiv.id = getMapContainerId();
        mapDiv.style.width = '100%';
        mapDiv.style.height = '600px';
        mapDiv.style.marginTop = '20px';
        mapDiv.style.position = 'relative'; // 为绝对定位的按钮提供参考
        contentDiv.appendChild(mapDiv);

        // 加载 GeoJSON 并初始化地图
        setTimeout(async () => {
            const container = document.getElementById(getMapContainerId());
            if (container) {
                await initEChartsMap(container); // 使用 await 确保初始化完成
            } else {
                 console.error('地图容器 DOM 元素未找到，无法初始化图表。');
            }
        }, 100);
    };

    /**
     * 销毁 ECharts 实例 (可选，用于性能优化或切换时清理)
     */
    const destroyMap = () => {
        if (myChart) {
            myChart.dispose();
            myChart = null;
            console.log('ECharts 地图已销毁');
            // 可以考虑移除返回按钮
            const button = getBackButtonElement();
            if (button && button.parentNode) {
                button.parentNode.removeChild(button);
            }
        }
    };

    // 返回公共方法
    return {
        renderMap,
        destroyMap
    };

})();