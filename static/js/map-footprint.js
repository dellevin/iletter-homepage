/**
 * ECharts 地图足迹模块 (支持钻取功能 - 点击省份查看下一级, 点击按钮返回)
 */
const MapFootprintModule = (() => {
  let myChart = null; // ECharts 实例
  let currentMapLevel = "country"; // 当前地图层级 ('country', 'province')
  let currentProvinceCode = null; // 当前显示的省份编码 (如果有的话)

  // --- 配置 ---
  const COUNTRY_MAP_NAME = "china_custom";
  const COUNTRY_GEOJSON_PATH = "./static/js/echarts/china.geojson";
  const PROVINCE_GEOJSON_BASE_PATH = "./static/js/echarts/province/"; // 假设省份 GeoJSON 存放在这个目录

  // --- 数据 ---
  // 注意：这里的坐标可能需要根据你实际访问的城市进行微调
  const visitedPlaces = [
    { name: "济南市", value: [117.024961, 36.682788], province: "山东省" },
    { name: "青岛市", value: [120.384423, 36.065918], province: "山东省" },
    { name: "淄博市", value: [118.055915, 36.813547], province: "山东省" },
    { name: "潍坊市", value: [119.162775, 36.705759], province: "山东省" },

    { name: "保定市", value: [115.482331, 38.867657], province: "河北省" },
    { name: "衡水市", value: [115.665996, 37.739574], province: "河北省" },
    { name: "沧州市", value: [116.838581, 38.308094], province: "河北省" },
    { name: "石家庄市", value: [114.514891, 38.042309], province: "河北省" },
    { name: "张家口市", value: [114.886714, 40.811943], province: "河北省" },

    { name: "洛阳市", value: [112.454174, 34.618139], province: "河南省" },

    { name: "昌平区", value: [116.235904, 40.218086], province: "北京市" },

    { name: "杭州市", value: [120.153576, 30.287459], province: "浙江省" },

    { name: "苏州市", value: [120.585316, 31.298886], province: "江苏省" },
    { name: "扬州市", value: [119.421003, 32.393159], province: "江苏省" },
    { name: "镇江市", value: [119.452753, 32.204402], province: "江苏省" },
    { name: "南京市", value: [118.796877, 32.060255], province: "江苏省" },
    { name: "无锡市", value: [120.311987, 31.49092], province: "江苏省" },
  ];

  // 省份名称到其 GeoJSON 文件名的映射 (需要根据你的文件名调整)
  const provinceNameToGeoFile = {
    北京市: "北京市.geojson",

    山东省: "山东省.geojson",
    河北省: "河北省.geojson",
    河南省: "河南省.geojson",

    浙江省: "浙江省.geojson",
    江苏省: "江苏省.geojson",
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
    let seriesConfig = []; // 存储所有 series
    let visualMapConfig = null; // 存储 visualMap 配置 (仅省份需要)

    if (level === "country") {
      geoMapName = COUNTRY_MAP_NAME;
      roamSetting = false; // 启用缩放和平移
      zoomLevel = 1.1;
      centerCoord = [104.06, 32]; // 中国中心
      titleText = "";
      filteredVisitedPlaces = visitedPlaces; // 显示所有足迹

      // 国家地图：保持原有的 geo 和 scatter 配置
      seriesConfig = [
        {
          name: "足迹",
          type: "scatter",
          coordinateSystem: "geo",
          data: filteredVisitedPlaces,
          symbol: "pin",
          symbolSize: 18,
          itemStyle: {
            color: "#FF6B6B",
            borderColor: "#fff",
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              color: "#dd4444",
            },
          },
          tooltip: {
            formatter: function (params) {
              return ` ${params.data.name}<br/>坐标: [ ${params.data.value[0].toFixed(4)},  ${params.data.value[1].toFixed(4)}]`;
            },
          },
        },
      ];
    } else if (level === "province" && provinceCode) {
      geoMapName = `province_ ${provinceCode}`; // 为省份地图创建唯一名称
      roamSetting = false; // 省份地图也启用缩放平移
      zoomLevel = 1.0; // 可以根据需要调整
      // 可以根据省份动态设置中心点，这里暂时固定
      // centerCoord = [118.5, 36.5]; // 示例：山东中心
      // 从 visitedPlaces 中找一个城市作为中心点，如果没有，则使用默认
      const firstPlaceInProvince = visitedPlaces.find(
        (place) => place.province === provinceCode,
      );
      centerCoord = firstPlaceInProvince
        ? firstPlaceInProvince.value
        : [118.5, 36.5];

      if (provinceCode == "山东省") {
        centerCoord = [118.5, 36.5];
      } else if (provinceCode == "河北省") {
        centerCoord = [115.482331, 40];
      } else if (provinceCode == "浙江省") {
        centerCoord = [120.153576, 29.4];
      } else if (provinceCode == "江苏省") {
        centerCoord = [119, 32.9];
      } else if (provinceCode == "河南省") {
        centerCoord = [114, 34];
      } else if (provinceCode == "北京市") {
        centerCoord = [116.407395, 40.3];
      }

      console.log(firstPlaceInProvince.value);

      titleText = ` ${provinceCode} - “印迹”`;

      // 过滤出属于当前省份的足迹点
      filteredVisitedPlaces = visitedPlaces.filter(
        (place) => place.province === provinceCode,
      );

      // --- 为省份地图准备高亮数据 ---
      // 提取当前省份内访问过的城市名称
      const visitedCitiesInProvince = filteredVisitedPlaces.map(
        (place) => place.name,
      );
      // 构造 map 系列的数据，访问过的城市 value 设为 1，未访问的可以设为 0
      // 为了实现高亮，我们只需要列出访问过的城市即可，未访问的城市会使用默认颜色
      const provinceMapData = visitedCitiesInProvince.map((cityName) => ({
        name: cityName, // GeoJSON 中区域的名称必须与此 name 匹配
        value: 1, // 值为 1 表示访问过，用于 visualMap 区分
      }));

      // --- 配置 visualMap ---
      visualMapConfig = {
        show: false, // 通常不显示 visualMap 组件条
        min: 0, // 最小值
        max: 1, // 最大值
        inRange: {
          // 当 data 中 item.value 为 1 时，使用的颜色
          color: ["#FF6B6B"], // 高亮颜色 (访问过的城市)
        },
        // outOfRange: {
        //     // 当 value 超出范围或未定义时，使用的颜色
        //     // 此颜色由 series.itemStyle.areaColor 控制
        // },
        calculable: true,
      };

      // --- 创建省份地图系列 (用于高亮城市) ---
      // 关键修改：将 map 系列的 clickHandler 禁用，让 geo 组件处理点击
      const provinceMapSeries = {
        // name: "访问过的城市",
        type: "map",
        map: geoMapName, // 指向当前省份的 GeoJSON
        roam: roamSetting,
        zoom: zoomLevel,
        center: centerCoord,
        silent: true, // 设置为 true，使 map 系列不响应鼠标事件，避免干扰 geo 的点击返回
        label: {
          show: true, // 可以选择是否显示城市名称标签
          color: "#000", // 标签颜色
          fontSize: 10,
        },
        emphasis: {
          label: {
            // 悬停时标签效果
            show: true,
            fontWeight: "bold",
          },
          itemStyle: {
            // 悬停时区域效果
            opacity: 0.8, // 降低透明度
            // areaColor: '#ffcccc', // 也可以设置悬停颜色，但会受 visualMap 影响
          },
        },
        // 数据驱动颜色
        data: provinceMapData,
        // 默认样式（未在 data 中定义的区域将使用此样式）
        itemStyle: {
          areaColor: "#eef2ff", // 未访问区域的默认颜色
          borderColor: "#333",
          borderWidth: 0.5,
        },
      };

      // 将省份地图系列和 geo 组件添加到配置中
      seriesConfig = [provinceMapSeries];
      // geo 配置也需要包含省份 geo
      // 注意：在返回全国地图时，需要重新设置 geo 为国家地图
      // 这个 geo 组件会覆盖全局的 geo 配置
      // 我们需要将 geo 配置移动到外面处理
    } else {
      console.error("无效的地图层级或省份代码");
      return {}; // 返回空配置
    }

    // 构建最终的 option
    const option = {
      title: {
        text: titleText,
        subtext: "读万卷书，不如行万里路。见多才会识广～",
        left: "center",
        textStyle: {
          fontSize: 18,
        },
        subtextStyle: {
          fontSize: 12,
        },
      },
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          if (params.seriesType === "scatter" && level === "country") {
            // 国家地图的足迹点 tooltip
            if (params.value && params.value.length >= 2) {
              return (
                params.name +
                "<br/>经度: " +
                params.value[0].toFixed(4) +
                "<br/>纬度: " +
                params.value[1].toFixed(4)
              );
            }
            return params.name;
          } else if (params.seriesType === "map" && level === "province") {
            // 省份地图的区域 tooltip
            // params.value 是 data 中对应的 value
            const status = params.value === 1 ? "访问过" : "未访问";
            return `区域:  ${params.name}<br/>状态:  ${status}`;
          } else if (
            params.componentType === "geo" &&
            level === "province" &&
            params.componentSubType === "map"
          ) {
            // 省份地图的 geo 区域 tooltip (如果需要)
            return `点击返回全国:  ${params.name}`;
          }
          return params.name;
        },
      },
      // geo 组件配置
      geo:
        level === "country"
          ? {
              map: geoMapName,
              roam: roamSetting,
              zoom: zoomLevel,
              center: centerCoord,
              emphasis: {
                itemStyle: {
                  areaColor: "#f0f0f0", // geo 强调样式，当没有 series 时生效
                  borderColor: "#409EFF",
                  borderWidth: 1,
                },
              },
              itemStyle: {
                areaColor: "#eef2ff", // geo 默认样式，当没有 series 时生效
                borderColor: "#333",
              },
            }
          : {
              // 省份地图的 geo 配置
              id: "province_geo_for_clicks", // 给 geo 组件一个 ID 便于识别
              map: geoMapName,
              roam: roamSetting,
              zoom: zoomLevel,
              center: centerCoord,
              silent: false, // 设置为 false，允许 geo 组件响应点击
              // 隐藏 geo 组件的视觉表现，因为高亮由 series 控制
              itemStyle: {
                areaColor: "transparent", // 透明填充
                borderColor: "transparent", // 透明边框
              },
              emphasis: {
                itemStyle: {
                  areaColor: "rgba(64, 158, 255, 0.2)", // 可选：点击时的视觉反馈
                  borderColor: "transparent",
                },
              },
            },
      series: seriesConfig, // 使用构建好的 series 配置
    };

    // 如果当前是省份地图，添加 visualMap 配置
    if (visualMapConfig) {
      option.visualMap = visualMapConfig;
    }

    return option;
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
        throw new Error(
          `加载 GeoJSON 失败:  ${response.status}  ${response.statusText}`,
        );
      }
      const geoJsonData = await response.json();

      // 注册地图
      echarts.registerMap(mapName, geoJsonData);
      console.log(`GeoJSON 地图数据  ${mapName} 加载并注册成功。`);
      return true;
    } catch (error) {
      console.error("加载或注册 GeoJSON 地图时出错:", error);
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

    if (targetLevel === "country") {
      mapNameToUse = COUNTRY_MAP_NAME;
      geoPathToLoad = COUNTRY_GEOJSON_PATH;
      currentMapLevel = "country";
      currentProvinceCode = null;
    } else if (targetLevel === "province" && targetProvinceCode) {
      mapNameToUse = `province_ ${targetProvinceCode}`;
      const path = getProvinceGeoPath(targetProvinceCode);
      if (!path) {
        console.error(
          `无法切换到省份  ${targetProvinceCode}: 找不到对应的 GeoJSON 文件。`,
        );
        return;
      }
      geoPathToLoad = path;
      currentMapLevel = "province";
      currentProvinceCode = targetProvinceCode;
    } else {
      console.error("无效的目标层级或省份代码。");
      return;
    }

    // 尝试加载并注册目标地图数据
    const loadSuccess = await loadAndRegisterSingleMap(
      geoPathToLoad,
      mapNameToUse,
    );
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
    return document.getElementById("map-back-button");
  };

  /**
   * 创建返回按钮并将其添加到图表容器中
   * @param {HTMLElement} chartContainer - ECharts 图表容器
   */
  const createBackButton = (chartContainer) => {
    const button = document.createElement("button");
    button.id = "map-back-button";
    button.textContent = "⬅返回全国地图";
    button.style.position = "absolute";
    button.style.top = "10px";
    button.style.left = "10px";
    button.style.zIndex = 1000; // 确保按钮在图表之上
    button.style.padding = "2px 5px"; // 减少内边距以更接近纯文本
    button.style.fontSize = "14px"; // 根据需要调整字体大小
    button.style.cursor = "pointer";
    button.style.border = "none"; // 去掉边框
    button.style.backgroundColor = "transparent"; // 设置背景透明
    button.style.display = "none"; // 初始隐藏

    button.onclick = () => {
      console.log("点击了返回按钮。");
      switchMap("country");
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
    button.style.display = currentMapLevel === "province" ? "block" : "none";
  };

  // --- /新增函数 ---
  /**
   * 初始化 ECharts 地图 (初始加载国家地图)
   * @param {HTMLElement} container - 图表容器DOM元素
   */
  const initEChartsMap = async (container) => {
    if (!container) {
      console.error("地图容器未找到");
      return;
    }

    // 初始化 ECharts 实例
    myChart = echarts.init(container);

    // 创建并添加返回按钮
    createBackButton(container);

    // 首先加载并注册国家地图
    const countryLoadSuccess = await loadAndRegisterSingleMap(
      COUNTRY_GEOJSON_PATH,
      COUNTRY_MAP_NAME,
    );
    if (!countryLoadSuccess) {
      console.error("初始化失败：无法加载国家 GeoJSON。");
      return; // 或者显示错误信息给用户
    }

    // 应用初始配置 (国家地图)
    const initialOption = getEChartsOption("country");
    myChart.setOption(initialOption);

    // --- 添加事件监听 ---

    // 监听 geo 组件的点击事件
    // 关键修改：现在 geo 组件在省份地图时也存在，并且不静默
    myChart.on("click", "geo", function (params) {
      console.log("Geo component clicked:", params.componentId, params.name); // Debug log
      if (currentMapLevel === "country") {
        // 当前是国家地图，点击省份则进入
        const clickedProvinceName = params.name;
        console.log(`点击了省份:  ${clickedProvinceName}`);

        // 尝试获取省份对应的 GeoJSON 文件名
        const fileName = Object.keys(provinceNameToGeoFile).find(
          (key) => key === clickedProvinceName,
        );
        console.log(fileName);
        if (fileName) {
          const provinceCode = fileName; // 这里假设文件名就是省份简称
          //   console.log(`即将切换到省份:  ${provinceCode}`);
          switchMap("province", provinceCode);
        } else {
          showModal();
          console.log(`未配置省份 " ${clickedProvinceName}" 的详细地图。`);
        }
      } else if (
        currentMapLevel === "province" &&
        params.componentId === "province_geo_for_clicks"
      ) {
        // 当前是省份地图，且点击的是省份 geo 组件，则返回全国地图
        console.log("点击省份 geo 组件，返回全国地图");
        switchMap("country");
      }
      // 如果在省份地图上点击，但不是省份 geo 组件（理论上不会发生，因为 series 是 silent 的），可以有其他逻辑，比如不处理
    });

    // 监听窗口大小变化，自动适配
    window.addEventListener("resize", function () {
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
    return "echarts-map-container";
  };

  /**
   * 渲染 ECharts 地图内容到指定容器
   * @param {HTMLElement} contentDiv - 标签页的内容容器
   */
  const renderMap = (contentDiv) => {
    // 清空内容区域
    // contentDiv.innerHTML = '';
    // 创建地图容器
    const mapDiv = document.createElement("div");
    mapDiv.id = getMapContainerId();
    mapDiv.style.width = "100%";
    mapDiv.style.height = "600px";
    mapDiv.style.marginTop = "20px";
    mapDiv.style.position = "relative"; // 为绝对定位的按钮提供参考
    contentDiv.appendChild(mapDiv);

    // 加载 GeoJSON 并初始化地图
    setTimeout(async () => {
      const container = document.getElementById(getMapContainerId());
      if (container) {
        await initEChartsMap(container); // 使用 await 确保初始化完成
      } else {
        console.error("地图容器 DOM 元素未找到，无法初始化图表。");
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
      console.log("ECharts 地图已销毁");
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
    destroyMap,
  };
})();

function showModal() {
  document.getElementById("modalOverlay").style.display = "block";
}


const closeModal = () => {
    document.getElementById('modalOverlay').style.display = 'none';
};
// --- 页面加载完成后执行 ---
document.addEventListener('DOMContentLoaded', function() {
    // 获取遮罩层和内容区域元素
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');

    // 定义点击遮罩层的处理函数
    function handleOverlayClick(event) {
        // 检查点击的目标是否是遮罩层本身（而不是它的子元素，比如里面的 p 或 button）
        if (event.target === modalOverlay) {
            closeModal(); // 如果是，就关闭弹窗
        }
    }

    // 为遮罩层添加点击事件监听器
    modalOverlay.addEventListener('click', handleOverlayClick);

    // --- 示例：如何显示弹窗 (供参考) ---
    // window.showModal = function() {
    //     modalOverlay.style.display = 'block';
    //     // 注意：如果每次都显示，事件监听器只需要添加一次，或者在这里检查是否已存在
    // }
});