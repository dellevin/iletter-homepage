
/**
 * ECharts 地图足迹模块 (使用本地 GeoJSON)
 */
const MapFootprintModule = (() => {
    let myChart = null; // ECharts 实例
    const MAP_NAME = 'china_custom'; // 为自定义地图起一个名字

    const visitedPlaces = [
        { name: "济南市", value: [117.024961, 36.682788] },
        { name: "青岛市", value: [120.384423, 36.065918] },
        { name: "淄博市", value: [118.055915, 36.813547] },
        { name: "潍坊市", value: [119.162775, 36.705759] },
        { name: "北京市", value: [116.407395, 39.904211] }, 
        { name: "杭州市", value: [120.153576, 30.287459] },
        { name: "苏州市", value: [120.585316, 31.298886] },
        { name: "扬州市", value: [119.421003, 32.393159] },
        { name: "保定市", value: [115.482331, 38.867657] },
        { name: "石家庄市", value: [114.514891, 38.042309] },
        { name: "衡水市", value: [115.665996, 37.739574] },
        { name: "洛阳市", value: [112.454174, 34.618139] },
        { name: "南京市", value: [118.796877, 32.060255] },
        { name: "无锡市", value: [120.311987, 31.490920] },
        { name: "沧州市", value: [116.838581, 38.308094] },
        { name: "镇江市", value: [119.452753, 32.204402] },
    ];

    /**
     * 加载 GeoJSON 地图数据并注册
     */
    const loadAndRegisterMap = async () => {
        try {
            // console.log('开始加载 GeoJSON 地图数据...');
            const response = await fetch('./static/js/echarts/china.geojson'); // 确保路径正确
            if (!response.ok) {
                throw new Error(`加载 GeoJSON 失败:  ${response.status}  ${response.statusText}`);
            }
            const geoJsonData = await response.json();

            // 注册自定义地图
            echarts.registerMap(MAP_NAME, geoJsonData);
            // console.log('GeoJSON 地图数据加载并注册成功。');

            // 地图注册成功后，初始化图表
            const container = document.getElementById(getMapContainerId());
            if (container) {
                 initEChartsMap(container);
            } else {
                 console.error('地图容器 DOM 元素未找到，无法初始化图表。');
            }

        } catch (error) {
            console.error('加载或注册 GeoJSON 地图时出错:', error);
            // 可以选择在内容区域显示错误信息
            const contentDiv = document.getElementById('footprint-content'); // 假设足迹内容区域ID是这个
            if (contentDiv) {
                contentDiv.innerHTML = '<p>加载地图数据失败，请检查网络连接或稍后重试。</p>';
            }
        }
    };

    /**
     * 初始化 ECharts 地图
     * @param {HTMLElement} container - 图表容器DOM元素
     */
    const initEChartsMap = (container) => {
        if (!container) {
            console.error('地图容器未找到');
            return;
        }

        // 初始化 ECharts 实例
        myChart = echarts.init(container);

        // ECharts 配置项 (使用注册的地图名称)
        const option = {
            title: {
                text: '',
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
                    if (params.value && params.value.length >= 2) {
                        return params.name + '<br/>经度: ' + params.value[0].toFixed(4) + '<br/>纬度: ' + params.value[1].toFixed(4);
                    }
                    return params.name; // 如果没有坐标信息，只显示地名
                }
            },
            toolbox: {
                show: false,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    dataView: { readOnly: false },
                    restore: {},
                    saveAsImage: {}
                }
            },
            visualMap: {
                show: false, // 是否显示 visualMap 组件，这里设为 false，因为我们用 symbolSize 控制点大小
                min: 0,
                max: 100,
                left: 'left',
                top: 'bottom',
                text: ['High', 'Low'],           // 文本，默认为数值文本
                calculable: true
            },
            geo: {
                map: MAP_NAME, // 使用注册的自定义地图名称
                roam: false, // 是否开启鼠标缩放和平移漫游
                zoom: 1.1, // 当前视角的缩放比例
                center: [104.06, 30],
                emphasis: { // 高亮状态下的样式
                    itemStyle: {
                        areaColor: '#f0f0f0', // 高亮时省份的颜色
                        borderColor: '#409EFF', // 高亮时省份的边框颜色
                        borderWidth: 1
                    }
                },
                itemStyle: { // 普通状态下的样式
                    areaColor: '#eef2ff', // 未选中时省份的颜色
                    borderColor: '#333' // 未选中时省份的边框颜色
                }
            },
            series: [
                {
                    name: '足迹',
                    type: 'scatter', // 使用散点图表示标记点
                    coordinateSystem: 'geo', // 指定坐标系为地理坐标系
                    data: visitedPlaces, // 使用我们的数据
                    symbol: 'pin', // 使用内置符号 'pin'
                    symbolSize: 18, // 标记点的大小
                    itemStyle: { // 普通状态下的样式
                        color: '#FF6B6B', // 设置图标颜色
                        borderColor: '#fff', // 设置图标边框颜色
                        borderWidth: 1,    // 设置图标边框宽度
                    },
                    emphasis: { // 高亮状态
                        itemStyle: {
                            color: '#dd4444' // 高亮时点的颜色
                        }
                    },
                    tooltip: {
                         formatter: function(params) {
                             // 这里可以更精细地控制 tooltip 内容
                             return ` ${params.data.name}<br/>坐标: [ ${params.data.value[0].toFixed(4)},  ${params.data.value[1].toFixed(4)}]`;
                         }
                    }
                }
            ]
        };

        // 设置配置项并渲染图表
        myChart.setOption(option);

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
        return 'echarts-map-container'; // 定义一个唯一的ID
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
        contentDiv.appendChild(mapDiv);

        // 加载 GeoJSON 并初始化地图
        // 使用 setTimeout 确保 DOM 元素已渲染后再加载地图数据
        setTimeout(() => {
             loadAndRegisterMap();
        }, 100); // 延迟一点确保渲染完成
    };

    /**
     * 销毁 ECharts 实例 (可选，用于性能优化或切换时清理)
     */
    const destroyMap = () => {
        if (myChart) {
            myChart.dispose(); // 销毁实例，释放资源
            myChart = null;
            console.log('ECharts 地图已销毁');
        }
    };

    // 返回公共方法
    return {
        renderMap,
        destroyMap // 导出销毁方法，如果需要的话
    };

})();