// ========== 游戏配置数据 ==========
        const gamesData = [
            { name: '《永劫无间》', desc: '我身无拘，武道无穷' },
            { name: '《我的世界》', desc: '这个小盒才是我的永远的家' },
            { name: '《鬼谷八荒》', desc: '当互动版的修仙小说看了，很好玩.' },
            { name: '《江城创业记》', desc: '缝合怪，但是全缝了。很喜欢的一款游戏' },
            { name: '《中国式家长》', desc: '我承认我做不好一个孩子，也做不好一个家长' },
            { name: '《王者荣耀》', desc: '买了好多皮肤，和朋友玩才是真快乐（已退坑）' },
            { name: '《QQ飞车手游》', desc: '氪了好多，有些后悔了（已退坑）' },
            { name: '《龙族幻想》', desc: '因为龙族入坑的，小氪（已退坑）' },
            { name: '《洛克王国》', desc: '还记得小时候拿压岁钱偷偷买点卡（已退坑）' },
            { name: '《造梦西游》', desc: '造梦3从小学玩到大学，现在还时不时的回味一下（已退坑）' },
        ];

        // ========== 渲染游戏列表的函数 ==========
        function renderGames(gamesArray) {
            const container = document.getElementById('games-container');
            if (!container) {
                console.error("未找到游戏容器 #games-container");
                return;
            }

            if (!gamesArray || gamesArray.length === 0) {
                container.innerHTML = '<div class="memo-error" data-i18n="no_games_data">暂无游戏数据</div>';
                return;
            }

            const currentLang = localStorage.getItem(LANG_KEY) || 'zh';

            let html = '';
            gamesArray.forEach((game,index) => {
                const nameKey = `game_name_${index}`;
                const descKey = `game_desc_${index}`;
                const nameTranslation = translations[currentLang][nameKey] || game.name;
                const descTranslation = translations[currentLang][descKey] || game.desc;

                html += `
                    <div class="game-item">
                        <div class="game-name">${nameTranslation}</div>
                        <div class="game-desc">${descTranslation}</div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }