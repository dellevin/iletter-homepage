# 白荼个人主页 (BaiTu Homepage)

这是一个简约风格的个人主页项目，采用纯 HTML/CSS/JavaScript 构建，旨在展示个人信息、开发作品、常用工具以及生活随笔。

## 项目特点

- **信纸风格**：独特的信纸视觉设计，营造“见字如面”的沉浸式阅读体验。
- **极简主义**：采用纯 HTML/CSS/JavaScript 构建，无繁重框架，加载迅速。
- **多语言支持**：内置中英文切换功能，满足不同访问者的需求。
- **动态内容**：
  - **闲言碎语**：通过 Memos API 实时同步生活点滴。
  - **历史足迹**：基于 ECharts 的交互式地图，记录走过的城市。
  - **我的网站/工具/游戏**：动态加载并展示个人作品集和常用资源。
- **交互体验**：
  - 全局搜索功能（支持 Google, Baidu, DuckDuckGo, Yandex）。
  - 留言板与博客文章预览弹窗。
  - “旅途剪影”相册模块，支持瀑布流展示与图片轮播。
- **性能优化**：使用 Nginx 缓存静态资源，集成 Umami 进行轻量级数据统计。

## 快速开始

1. **克隆仓库**
   ```bash
   git clone https://github.com/dellevin/iletter-homepage.git
   cd iletter-homepage
   ```

2. **本地运行**
   由于项目包含一些动态数据加载（如 Memos 接口），建议在本地服务器环境下运行。你可以使用 Python 快速启动一个简易服务器：
   ```bash
   python -m http.server 8080
   ```
   然后在浏览器中访问 `http://localhost:8080`。

## 目录结构

```text
.
├── static/
│   ├── css/          # 样式文件
│   ├── js/           # JavaScript 逻辑（含多语言配置）
│   ├── img/          # 图片资源（含相册、图标等）
│   └── font/         # 字体文件
├── scripts/          # 自动化脚本（如照片索引生成）
├── index.html        # 主页面入口
└── README.md         # 项目说明
```

## 技术栈

- **前端核心**：HTML5, CSS3, Vanilla JavaScript
- **图表库**：ECharts (用于地图足迹可视化)
- **网络请求**：Axios
- **后端接口**：Memos API (闲言碎语), 自建评论系统
- **统计与防护**：Umami, 堡塔云 WAF

## 人生相册自动化

项目包含 `scripts/generate-photos-json.py` 脚本，用于自动扫描 `static/img/photos/` 目录并生成 `photos.json` 索引文件，方便前端快速加载最新照片。

## 贡献与反馈

如果你对项目有任何建议或发现了 Bug，欢迎在 [GitHub Issues](https://github.com/dellevin/iletter-homepage/issues) 中提出。

## 许可证

本项目仅供学习交流使用。
