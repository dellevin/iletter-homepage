// ========== 游戏配置数据 (包含中英双语) ==========
const gamesData = [
  { 
    id: 0, 
    name_zh: "《永劫无间》", 
    desc_zh: "我身无拘，武道无穷", 
    name_en: "Naraka", 
    desc_en: "My body knows no bounds, martial arts are endless." 
  },
  { 
    id: 1, 
    name_zh: "《我的世界》", 
    desc_zh: "这个小盒才是我的永远的家", 
    name_en: "Minecraft", 
    desc_en: "This little box is my forever home." 
  },
  { 
    id: 2, 
    name_zh: "《鬼谷八荒》", 
    desc_zh: "当互动版的修仙小说看了，很好玩.", 
    name_en: "Gorogoa Bahuang", 
    desc_en: "Treat it as an interactive cultivation novel. Very fun." 
  },
  {
    id: 3,
    name_zh: "《江城创业记》",
    desc_zh: "缝合怪，但是全缝了。很喜欢的一款游戏",
    name_en: "Jiangcheng Entrepreneurship Story",
    desc_en: "A mashup, but it's fully integrated. A game I really like."
  },
  {
    id: 4,
    name_zh: "《中国式家长》",
    desc_zh: "我承认我做不好一个孩子，也做不好一个家长",
    name_en: "Chinese Parents",
    desc_en: "I admit I can't be a good child or a good parent."
  },
  {
    id: 5,
    name_zh: "《王者荣耀》",
    desc_zh: "买了好多皮肤，和朋友玩才是真快乐（已退坑）",
    name_en: "Honor of Kings",
    desc_en: "Bought lots of skins. Real joy is playing with friends. (Quitted)"
  },
  {
    id: 6,
    name_zh: "《QQ飞车手游》",
    desc_zh: "氪了好多，有些后悔了，太耗注意力了（已退坑）",
    name_en: "QQ Speed Mobile",
    desc_en: "Spent a lot, somewhat regretful. Too attention-consuming. (Quitted)"
  },
  { 
    id: 7, 
    name_zh: "《龙族幻想》", 
    desc_zh: "因为龙族入坑的！（已退坑）", 
    name_en: "Dragon Raja Mobile", 
    desc_en: "Got into it because of Dragon Raja novels! (Quitted)" 
  },
  {
    id: 8,
    name_zh: "《洛克王国》",
    desc_zh: "还记得小时候拿压岁钱偷偷买点卡（已退坑）",
    name_en: "Roco Kingdom",
    desc_en: "Still remember secretly buying cards with New Year money as a kid. (Quitted)"
  },
  {
    id: 9,
    name_zh: "《造梦西游》",
    desc_zh: "造梦3从小学玩到大学，现在还时不时的回味一下（已退坑）",
    name_en: "Zao Meng Xi You",
    desc_en: "Zao Meng 3 from elementary to university. Still reminisce sometimes. (Quitted)"
  },
  {
    id: 10,
    name_zh: '《街头霸王6》',
    desc_zh: "街霸6，超级炎炎舞！outfit3是真好看。",
    name_en: 'Street Fighter 6',
    desc_en: "SF6, Super En'en Bu! Outfit 3 is truly nice-looking."
  },
  {
    id: 11,
    name_zh: '《世界盒子》',
    desc_zh: "世界盒子，无意间发现的一款游戏，可惜价格太贵了。",
    name_en: 'WorldBox',
    desc_en: "WorldBox, a game discovered by accident. Unfortunately, the price is too high."
  },
  {
    id: 12,
    name_zh: '《无人深空》',
    desc_zh: "难以想象的开放遨游！这次，我的目标是星辰大海！",
    name_en: 'No Man\'s Sky',
    desc_en: "Inconceivably open exploration! This time, my goal is the starry sea!"
  },
  {
    id: 13,
    name_zh: '《戴森球计划》',
    desc_zh: "没有蓝图玩的，把自己恶心坏了。主打一个自动化",
    name_en: 'Dyson Sphere Program',
    desc_en: "Played without blueprints, made myself sick. All about automation."
  },
];

// ========== 游戏详情数据 (包含中英双语) ==========
const gameDetailData = {
  0: {
    id: "游戏ID: 42956400140163",
    rank: "<strong>历史最高段位：</strong>无相龙王",
    detailDesc_zh: "我希望能玩一辈子永劫无间！",
    detailDesc_en: "I hope to play Naraka forever!",
    images: [
      "./static/img/game/yjwj/yjwj_chuanyun.png",
      "./static/img/game/yjwj/yjwj_xiafeng.png",
      "./static/img/game/yjwj/yjwj_liebian.png",
    ],
  },
  1: {
    id: "游戏id：levin9992@qq.com",
    rank: "",
    detailDesc_zh: "我自己精神的自留地！我幻想中的乌托邦",
    detailDesc_en: "My spiritual private land! My imagined utopia",
    images: [
      "./static/img/game/wodeshijie/1.jpg",
      "./static/img/game/wodeshijie/2.jpg",
      "./static/img/game/wodeshijie/3.jpg",
    ],
  },
  2: {
    id: "",
    rank: "<strong>历史最高段位：</strong>登仙",
    detailDesc_zh: "好玩！爱玩！立绘非常好看！",
    detailDesc_en: "Fun! Love playing! The illustrations are very nice!",
    images: [
      "./static/img/game/guigubahuang/1.jpg",
      "./static/img/game/guigubahuang/2.jpg",
      "./static/img/game/guigubahuang/3.jpg",
    ],
  },
  6: {
    id: "",
    rank: "<strong>历史最高段位：</strong>传奇车神",
    detailDesc_zh: "巅峰竞速！可惜我的天行者被割韭菜了。。。",
    detailDesc_en: "Peak racing! Pity my Sky Walker was scalped...",
    images: [
      "./static/img/game/qqspead/qqspead1.jpg",
      "./static/img/game/qqspead/qqspead2.jpg",
    ],
  },
};

let currentlyOpenTooltip = null;
// ========== 显示/隐藏游戏详情的函数 (Tooltip 版本) ==========
function toggleGameDetailTooltip(gameElement, gameIndex) {
  // 如果点击的是同一个游戏，且tooltip是打开的，则关闭它
  if (
    currentlyOpenTooltip &&
    currentlyOpenTooltip.index === gameIndex &&
    currentlyOpenTooltip.element &&
    currentlyOpenTooltip.element.style.display === "block"
  ) {
    hideTooltip(currentlyOpenTooltip.element);
    currentlyOpenTooltip = null;
    return;
  }

  // 如果点击的是另一个游戏，先关闭之前打开的tooltip
  if (currentlyOpenTooltip) {
    hideTooltip(currentlyOpenTooltip.element);
  }

  const detailId = `game-tooltip-${gameIndex}`;
  let tooltipDiv = document.getElementById(detailId);

  // 如果tooltip不存在，则创建它
  if (!tooltipDiv) {
    const detail = gameDetailData[gameIndex];
    const currentLang = localStorage.getItem("preferred_language") || "zh";

    // 根据当前语言选择游戏名称和描述
    const gameEntry = gamesData.find(game => game.id === gameIndex);
    const gameName = currentLang === 'en' ? gameEntry?.name_en : gameEntry?.name_zh;
    const gameDesc = currentLang === 'en' ? gameEntry?.desc_en : gameEntry?.desc_zh;

    let tooltipContentHtml = "";
    if (detail) {
      // 根据当前语言选择详情描述
      const detailDesc = currentLang === 'en' ? detail.detailDesc_en : detail.detailDesc_zh;
      tooltipContentHtml = `
                <div class="tooltip-content">
                    <div class="tooltip-header">
                        <h4>${gameName}</h4>
                        <span class="tooltip-close">&times;</span>
                    </div>
                    <div class="tooltip-body">
                        <p><strong>${detail.id}</strong></p>
                        <p> ${detail.rank}</p>
                        <p><em>${detailDesc}</em></p>
                        ${
                          detail.images && detail.images.length > 0
                            ? `<div class="tooltip-images">
                                 ${detail.images.map((imgSrc) => `<img src="${imgSrc}" alt="游戏详情图片" class="tooltip-image-item">`).join("")}
                             </div>`
                            : ""
                        }
                    </div>
                </div>
            `;
    } else {
      // 使用根据语言变量生成的消息
      const noDetailMsg = currentLang === 'en' ? 'The author has not written information yet~ Please wait patiently!' : '博主暂未书写信息～请耐心等待哦！';
      tooltipContentHtml = `
                <div class="tooltip-content">
                    <div class="tooltip-header">
                        <h4>${gameName}</h4>
                        <span class="tooltip-close">&times;</span>
                    </div>
                    <div class="tooltip-body">
                        <p style="color: #999; font-style: italic;">${noDetailMsg}</p>
                    </div>
                </div>
            `;
    }

    tooltipDiv = document.createElement("div");
    tooltipDiv.id = detailId;
    tooltipDiv.className = "game-detail-tooltip";
    tooltipDiv.innerHTML = tooltipContentHtml;

    // 添加关闭按钮事件
    const closeBtn = tooltipDiv.querySelector(".tooltip-close");
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // 防止触发外层的点击关闭
      hideTooltip(tooltipDiv);
      currentlyOpenTooltip = null;
    });

    // 添加点击tooltip外部区域关闭的功能
    tooltipDiv.addEventListener("click", (e) => {
      // 只有点击tooltip自身（而非内部内容）才关闭
      if (e.target === tooltipDiv) {
        hideTooltip(tooltipDiv);
        currentlyOpenTooltip = null;
      }
    });

    document.body.appendChild(tooltipDiv); // 将tooltip添加到body，实现悬浮效果
  }

  // 定位tooltip，让它出现在游戏项附近
  const rect = gameElement.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  // 计算tooltip的位置
  const top = rect.bottom + scrollTop + 10;
  const left = rect.left + scrollLeft;

  tooltipDiv.style.top = `${top}px`;
  tooltipDiv.style.left = `${left}px`;
  tooltipDiv.style.display = "block";

  // 记录当前打开的tooltip
  currentlyOpenTooltip = { element: tooltipDiv, index: gameIndex };

  // 阻止事件冒泡到document，避免立即被关闭
  tooltipDiv.onclick = function (e) {
    e.stopPropagation();
  };
}

// ========== 隐藏Tooltip的辅助函数 ==========
function hideTooltip(tooltipElement) {
  if (tooltipElement) {
    tooltipElement.style.display = "none";
    // 如果想完全移除DOM，可以取消下面两行注释，但通常隐藏即可
    // if (tooltipElement.parentNode) {
    //     tooltipElement.parentNode.removeChild(tooltipElement);
    // }
  }
}

// ========== 点击文档其他地方关闭Tooltip ==========
document.addEventListener("click", function (event) {
  if (
    currentlyOpenTooltip &&
    !currentlyOpenTooltip.element.contains(event.target)
  ) {
    hideTooltip(currentlyOpenTooltip.element);
    currentlyOpenTooltip = null;
  }
});

// ========== 渲染游戏列表的函数 ==========
function renderGames(gamesArray) {
  const container = document.getElementById("games-container");
  if (!container) {
    console.error("未找到游戏容器 #games-container");
    return;
  }

  // 检查数组是否为空或未定义/未初始化
  const arrayToRender = gamesArray || gamesData;
  if (!arrayToRender || !Array.isArray(arrayToRender) || arrayToRender.length === 0) {
    const currentLang = localStorage.getItem("preferred_language") || "zh";
    let noDataMessage = currentLang === 'en' ? 'No games data available.' : '暂无游戏数据';
    container.innerHTML = `<div class="memo-error">${noDataMessage}</div>`;
    return; 
  }

  const currentLang = localStorage.getItem("preferred_language") || "zh";

  let html = "";
  arrayToRender.forEach((game, index) => {
    // 根据当前语言选择对应的名称和描述
    const name = currentLang === 'en' ? game.name_en : game.name_zh;
    const desc = currentLang === 'en' ? game.desc_en : game.desc_zh;

    // 为每个游戏项添加点击事件，并传递其索引
    html += `
        <div class="game-item" data-game-index="${game.id}"> <!-- 使用 game.id 而不是 index -->
            <div class="game-name">${name}</div>
            <div class="game-desc">${desc}</div>
        </div>
    `;
  });

  container.innerHTML = html;

  // 为每个生成的游戏项添加点击事件监听器
  const gameItems = container.querySelectorAll(".game-item");
  gameItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.stopPropagation(); // 阻止点击事件冒泡到document，避免立即关闭
      const gameIndex = parseInt(this.getAttribute("data-game-index")); // 获取 game.id
      toggleGameDetailTooltip(this, gameIndex);
    });
  });
}

// ========== 初始化 ==========
// document.addEventListener("DOMContentLoaded", function () {
//   renderGames();
// });