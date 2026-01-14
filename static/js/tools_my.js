// ========== 工具配置数据 ==========
// 将工具数据集中管理
const toolsData = [
  { name: "Rolan", desc: "应用启动器，从大学用到现在" },
  { name: "Chrome", desc: "确实好用,正在向着屎迈进" },
  { name: "VS Code", desc: "代码编辑器，轻量?高效!" },
  { name: "IntelliJ IDEA", desc: "JAVA代码编辑器" },
  { name: "PyCharm", desc: "python代码编辑器" },
  { name: "Android Studio", desc: "安卓软件开发，一直在学（新建文件夹）" },
  { name: "HbuilderX", desc: "写小程序真心不错，vue+js很棒！减少了学习压力" },
  { name: "Navicate", desc: "链接mysql的神器，sqlyog是谁？真不熟。" },
  { name: "Xshell", desc: "链接服务器简单易用配合xftp很好用" },
  { name: "Postman", desc: "API测试与调试工具" },
  { name: "VMware", desc: "虚拟机管理，工具有毒？先拿这个试试" },
  { name: "PhotoShop", desc: "ps图片专用蒙版套索十分好用" },
  { name: "Obsidian", desc: "知识管理，双链接笔记。本地笔记爱好者的福音。" },
  { name: "Typora", desc: "Markdown编辑器，简洁美观。" },
  { name: "Docker", desc: "容器化部署，一个docker-compose走天下" },
  { name: "Premiere Pro", desc: "剪辑视频调音做简单的效果，简单易用" },
  { name: "After Effects", desc: "特效制作神器，就是对显卡和cpu比较不友好" },
  { name: "CheatEngine", desc: "风灵月影没出来就用它，亦是内存hook的极佳选择" },
  { name: "x64dbg", desc: "孩子！你想掌握逆向之力嘛！先从x64dbg开始吧！" },
  { name: "WireGuard", desc: "组网神器，去你妹的向日葵，去你妹的todesk" },
  { name: "Syncthing", desc: "文件同步，超级好用，同步笔记的不错选择。" },
  { name: "NeatReader", desc: "看书软件，有点后悔花了188买了永久" },
  { name: "Corel VideoStudio", desc: "万恶的苏州思杰马克丁！还我会声会影" },
  {
    name: "网易云音乐",
    desc: "每天听，每天用，尊贵的年费vip+版权破解Unblock Netease",
  },
  {
    name: "喜马拉雅听书",
    desc: "每天听，每天用。三体，穷鬼的上下两千年等优秀书籍",
  },
  { name: "一本日记", desc: "正经人谁写日记啊！" },
  { name: "Ollama", desc: "本地部署对话AI，微调模型，32b是4070遭不住" },
  { name: "AnythingLLM", desc: "AI知识库的极佳选择，比我自己微调+向量化好" },
  { name: "UVR5", desc: "处理音频的神器，想当年苦逼的分离音频算什么!" },
  { name: "Remote Desktop Manager", desc: "超级强大的远控软件" },
  {
    name: "SyncClipboard",
    desc: "剪切板同步，好用，爱用。再也不用微信消息复制粘贴了",
  },
  { name: "QtScrcpy", desc: "局域网控制手机神器，远程adb牛逼" },
];

// ========== 渲染工具列表的函数 ==========
function renderTools(toolsArray) {
  const container = document.getElementById("tools-container");
  if (!container) {
    console.error("未找到工具容器 #tools-container");
    return;
  }

  if (!toolsArray || toolsArray.length === 0) {
    container.innerHTML =
      '<div class="memo-error" data-i18n="no_tools_data">暂无工具数据</div>'; // 可选：无数据提示
    return;
  }
  const currentLang = localStorage.getItem(LANG_KEY) || "zh";

  let html = "";
  toolsArray.forEach((tool, index) => {
    const nameKey = `tool_name_${index}`;
    const descKey = `tool_desc_${index}`;
    const nameTranslation = translations[currentLang][nameKey] || tool.name; // 如果没有翻译，则回退到原始数据
    const descTranslation = translations[currentLang][descKey] || tool.desc;

    html += `
                    <div class="tool-item">
                        <div class="tool-name">${nameTranslation}</div>
                        <div class="tool-desc">${descTranslation}</div>
                    </div>
                `;
  });

  container.innerHTML = html;
}
