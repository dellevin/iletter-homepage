// static/js/game_my.js

// ========== 游戏配置数据 ==========
const gamesData = [
  { id:0, name: "《永劫无间》", desc: "我身无拘，武道无穷" },
  { id:1, name: "《我的世界》", desc: "这个小盒才是我的永远的家" },
  { id:2, name: "《鬼谷八荒》", desc: "当互动版的修仙小说看了，很好玩." },
  { id:3, name: "《江城创业记》", desc: "缝合怪，但是全缝了。很喜欢的一款游戏" },
  { id:4, name: "《中国式家长》", desc: "我承认我做不好一个孩子，也做不好一个家长" },
  { id:5, name: "《王者荣耀》", desc: "买了好多皮肤，和朋友玩才是真快乐（已退坑）" },
  { id:6, name: "《QQ飞车手游》", desc: "氪了好多，有些后悔了，太耗注意力了（已退坑）" },
  { id:7, name: "《龙族幻想》", desc: "因为龙族入坑的，江南老贼！（已退坑）" },
  { id:8, name: "《洛克王国》", desc: "还记得小时候拿压岁钱偷偷买点卡（已退坑）" },
  { id:9, name: "《造梦西游》", desc: "造梦3从小学玩到大学，现在还时不时的回味一下（已退坑）" },
];

// ========== 游戏详情数据 ==========
const gameDetailData = {
    0: {
        id: '游戏ID: 42956400140163',
        rank: '<strong>历史最高段位：</strong>无相龙王',
        detailDesc: '我希望能玩一辈子永劫无间！',
        images: [
            './static/img/game/yjwj/yjwj_chuanyun.png',
            './static/img/game/yjwj/yjwj_xiafeng.png',
            './static/img/game/yjwj/yjwj_liebian.png',
        ]
    },
    6: {
        id: '',
        rank: '<strong>历史最高段位：</strong>传奇车神',
        detailDesc: '巅峰竞速！可惜我的天行者被割韭菜了。。。',
        images: [
            './static/img/game/qqspead/qqspead1.jpg',
            './static/img/game/qqspead/qqspead2.jpg',
        ]
    },
};

let currentlyOpenTooltip = null; // 用于跟踪当前打开的tooltip

// ========== 显示/隐藏游戏详情的函数 (Tooltip 版本) ==========
function toggleGameDetailTooltip(gameElement, gameIndex) {
    // 如果点击的是同一个游戏，且tooltip是打开的，则关闭它
    if (currentlyOpenTooltip && currentlyOpenTooltip.index === gameIndex && currentlyOpenTooltip.element && currentlyOpenTooltip.element.style.display === 'block') {
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
        const currentLang = localStorage.getItem('preferred_language') || 'zh';

        const nameKey = `game_name_${gameIndex}`;
        const descKey = `game_desc_${gameIndex}`;
        const gameName = typeof translations !== 'undefined' && translations[currentLang] ? translations[currentLang][nameKey] || gamesData[gameIndex].name : gamesData[gameIndex].name;
        // const gameDesc = typeof translations !== 'undefined' && translations[currentLang] ? translations[currentLang][descKey] || gamesData[gameIndex].desc : gamesData[gameIndex].desc;
        // console.log("游戏名称：", gameDesc);
        let tooltipContentHtml = '';
        if (detail) {
            tooltipContentHtml = `
                <div class="tooltip-content">
                    <div class="tooltip-header">
                        <h4>${gameName}</h4>
                        <span class="tooltip-close">&times;</span>
                    </div>
                    <div class="tooltip-body">
                        <p><strong>${detail.id}</strong></p>
                        <p> ${detail.rank}</p>
                        <p><em>${detail.detailDesc}</em></p>
                        ${detail.images && detail.images.length > 0 ?
                            `<div class="tooltip-images">
                                 ${detail.images.map(imgSrc => `<img src="${imgSrc}" alt="游戏详情图片" class="tooltip-image-item">`).join('')}
                             </div>`
                            : ''}
                    </div>
                </div>
            `;
        } else {
            tooltipContentHtml = `
                <div class="tooltip-content">
                    <div class="tooltip-header">
                        <h4>${gameName}</h4>
                        <span class="tooltip-close">&times;</span>
                    </div>
                    <div class="tooltip-body">
                        <p style="color: #999; font-style: italic;">博主暂未书写信息～请耐心等待哦！</p>
                    </div>
                </div>
            `;
        }

        tooltipDiv = document.createElement('div');
        tooltipDiv.id = detailId;
        tooltipDiv.className = 'game-detail-tooltip';
        tooltipDiv.innerHTML = tooltipContentHtml;

        // 添加关闭按钮事件
        const closeBtn = tooltipDiv.querySelector('.tooltip-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止触发外层的点击关闭
            hideTooltip(tooltipDiv);
            currentlyOpenTooltip = null;
        });

        // 添加点击tooltip外部区域关闭的功能
        tooltipDiv.addEventListener('click', (e) => {
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

    // 计算tooltip的位置 (例如，出现在游戏项下方)
    const top = rect.bottom + scrollTop + 10; // 10px 间隙
    const left = rect.left + scrollLeft; // 与游戏项左侧对齐

    tooltipDiv.style.top = `${top}px`;
    tooltipDiv.style.left = `${left}px`;
    tooltipDiv.style.display = 'block';

    // 记录当前打开的tooltip
    currentlyOpenTooltip = { element: tooltipDiv, index: gameIndex };

    // 阻止事件冒泡到document，避免立即被关闭
    tooltipDiv.onclick = function(e) {
        e.stopPropagation();
    };
}

// ========== 隐藏Tooltip的辅助函数 ==========
function hideTooltip(tooltipElement) {
    if (tooltipElement) {
        tooltipElement.style.display = 'none';
        // 如果想完全移除DOM，可以取消下面两行注释，但通常隐藏即可
        // if (tooltipElement.parentNode) {
        //     tooltipElement.parentNode.removeChild(tooltipElement);
        // }
    }
}

// ========== 点击文档其他地方关闭Tooltip ==========
document.addEventListener('click', function(event) {
    if (currentlyOpenTooltip && !currentlyOpenTooltip.element.contains(event.target)) {
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

  if (!gamesArray || gamesArray.length === 0) {
    container.innerHTML =
      '<div class="memo-error" data-i18n="no_games_data">暂无游戏数据</div>';
    return;
  }

  const currentLang = localStorage.getItem('preferred_language') || 'zh';

  let html = "";
  gamesArray.forEach((game, index) => {
    const nameKey = `game_name_${index}`;
    const descKey = `game_desc_${index}`;
    const nameTranslation = typeof translations !== 'undefined' && translations[currentLang] ? translations[currentLang][nameKey] || game.name : game.name;
    const descTranslation = typeof translations !== 'undefined' && translations[currentLang] ? translations[currentLang][descKey] || game.desc : game.desc;

    // 为每个游戏项添加点击事件，并传递其索引
    html += `
        <div class="game-item" data-game-index="${index}">
            <div class="game-name">${nameTranslation}</div>
            <div class="game-desc">${descTranslation}</div>
        </div>
    `;
  });

  container.innerHTML = html;

  // 为每个生成的游戏项添加点击事件监听器
  const gameItems = container.querySelectorAll('.game-item');
  gameItems.forEach(item => {
      item.addEventListener('click', function(event) {
          event.stopPropagation(); // 阻止点击事件冒泡到document，避免立即关闭
          const gameIndex = parseInt(this.getAttribute('data-game-index'));
          toggleGameDetailTooltip(this, gameIndex);
      });
  });
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    renderGames(gamesData);
});