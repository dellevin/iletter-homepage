// ========== 工具配置数据 (包含中英双语) ==========
// 将工具数据集中管理，每个工具项包含中英文描述
const toolsData = [
  {
    name_zh: "Rolan",
    desc_zh: "应用启动器，从大学用到现在",
    name_en: "Rolan",
    desc_en: "Application launcher, used since college.",
  },
  {
    name_zh: "Chrome",
    desc_zh: "确实好用,正在向着屎迈进",
    name_en: "Chrome",
    desc_en: "Truly useful, but seems to be heading towards bloat.",
  },
  {
    name_zh: "VS Code",
    desc_zh: "代码编辑器，轻量?高效!",
    name_en: "VS Code",
    desc_en: "Code editor, Lightweight? Efficient!",
  },
  {
    name_zh: "IntelliJ IDEA",
    desc_zh: "JAVA代码编辑器，我拿来吃饭的东西！",
    name_en: "IntelliJ IDEA",
    desc_en: "JAVA Code Editor",
  },
  {
    name_zh: "PyCharm",
    desc_zh: "python代码编辑器，偷懒专用",
    name_en: "PyCharm",
    desc_en: "Python Code Editor",
  },
  {
    name_zh: "Android Studio",
    desc_zh: "安卓软件开发，一直在学（新建文件夹）",
    name_en: "Android Studio",
    desc_en: "Android app development, always learning (Creating new folders).",
  },
  {
    name_zh: "HbuilderX",
    desc_zh: "写小程序真心不错，vue+js很棒！减少了学习压力",
    name_en: "HbuilderX",
    desc_en:
      "Great for writing mini-programs, Vue+JS is awesome! Reduces learning pressure.",
  },
  {
    name_zh: "Navicate",
    desc_zh: "链接mysql的神器，sqlyog是谁？真不熟。",
    name_en: "Navicat",
    desc_en:
      "A powerful tool for connecting to MySQL. Who is SQLyog? Never heard of it.",
  },
  {
    name_zh: "Xshell",
    desc_zh: "链接服务器简单易用配合xftp很好用",
    name_en: "Xshell",
    desc_en:
      "Simple and easy-to-use for connecting to servers, works well with Xftp.",
  },
  {
    name_zh: "Postman",
    desc_zh: "API测试与调试工具",
    name_en: "Postman",
    desc_en: "API Testing and Debugging Tool",
  },
  {
    name_zh: "VMware",
    desc_zh: "虚拟机管理，工具有毒？先拿这个试试",
    name_en: "VMware",
    desc_en: "Virtual Machine Management. Is the tool toxic? Try this first.",
  },
  {
    name_zh: "PhotoShop",
    desc_zh: "ps图片专用蒙版套索十分好用",
    name_en: "Photoshop",
    desc_en: "PS, dedicated to image editing. Masks and Lasso are super handy.",
  },
  {
    name_zh: "Obsidian",
    desc_zh: "知识管理，双链接笔记。本地笔记爱好者的福音。",
    name_en: "Obsidian",
    desc_en:
      "Knowledge management, bidirectional linking notes. A blessing for local note enthusiasts.",
  },
  {
    name_zh: "Typora",
    desc_zh: "Markdown编辑器，简洁美观。",
    name_en: "Typora",
    desc_en: "Markdown editor, simple and beautiful.",
  },
  {
    name_zh: "Docker",
    desc_zh: "容器化部署，一个docker-compose走天下",
    name_en: "Docker",
    desc_en: "Containerized deployment, docker-compose handles everything.",
  },
  {
    name_zh: "Premiere Pro",
    desc_zh: "剪辑视频调音做简单的效果，简单易用",
    name_en: "Premiere Pro",
    desc_en: "Video editing, audio adjustment, simple effects, easy to use.",
  },
  {
    name_zh: "After Effects",
    desc_zh: "特效制作神器，就是对显卡和cpu比较不友好",
    name_en: "After Effects",
    desc_en:
      "Special effects creation powerhouse, just not very GPU/CPU friendly.",
  },
  {
    name_zh: "CheatEngine",
    desc_zh: "风灵月影没出来就用它，亦是内存hook的极佳选择",
    name_en: "Cheat Engine",
    desc_en:
      "Used it before Fenglingyueying came out, also an excellent choice for memory hooking.",
  },
  {
    name_zh: "x64dbg",
    desc_zh: "孩子！你想掌握逆向之力嘛！先从x64dbg开始吧！",
    name_en: "x64dbg",
    desc_en: "Kid! Want to master reverse engineering? Start with x64dbg!",
  },
  {
    name_zh: "WireGuard",
    desc_zh: "组网神器，去你妹的向日葵，去你妹的todesk",
    name_en: "WireGuard",
    desc_en: "The best networking tool, forget Sunlogin and Todesk.",
  },
  {
    name_zh: "Syncthing",
    desc_zh: "文件同步，超级好用，同步笔记的不错选择。",
    name_en: "Syncthing",
    desc_en:
      "File synchronization, super useful, a great choice for syncing notes.",
  },
  {
    name_zh: "NeatReader",
    desc_zh: "看书软件，有点后悔花了188买了永久",
    name_en: "NeatReader",
    desc_en:
      "E-book reading software, kind of regret spending 188 for lifetime access.",
  },
  {
    name_zh: "Corel VideoStudio",
    desc_zh: "万恶的苏州思杰马克丁！还我会声会影",
    name_en: "Corel VideoStudio",
    desc_en: "Curse you, Suzhou CorelMarkding! Give me back Pinnacle Studio.",
  },
  {
    name_zh: "网易云音乐",
    desc_zh: "每天听，每天用，尊贵的年费vip+版权破解Unblock Netease",
    name_en: "Netease Cloud Music",
    desc_en:
      "Listen and use daily. Premium annual VIP + copyright unlock (Unblock Netease).",
  },
  {
    name_zh: "喜马拉雅听书",
    desc_zh: "每天听，每天用。三体，穷鬼的上下两千年等优秀书籍",
    name_en: "Ximalaya Audiobooks",
    desc_en:
      "Listen and use daily. Great books like 'The Three-Body Problem', 'Poor Man's Two Millennia', etc.",
  },
  {
    name_zh: "一本日记",
    desc_zh: "正经人谁写日记啊！",
    name_en: "A Diary",
    desc_en: "Who writes a diary, seriously?!",
  },
  {
    name_zh: "Ollama",
    desc_zh: "本地部署对话AI，微调模型，32b是4070遭不住",
    name_en: "Ollama",
    desc_en:
      "Locally deployed conversational AI, fine-tuning models. 32b is too much for a 4070.",
  },
  {
    name_zh: "AnythingLLM",
    desc_zh: "AI知识库的极佳选择，比我自己微调+向量化好",
    name_en: "AnythingLLM",
    desc_en:
      "An excellent choice for an AI knowledge base, better than my own fine-tuning + vectorization.",
  },
  {
    name_zh: "UVR5",
    desc_zh: "处理音频的神器，想当年苦逼的分离音频算什么!",
    name_en: "UVR5",
    desc_en:
      "A good tool for processing audio. What were those tough days of manually separating audio!",
  },
  {
    name_zh: "Remote Desktop Manager",
    desc_zh: "超级强大的远控软件",
    name_en: "Remote Desktop Manager",
    desc_en: "Super powerful remote control software.",
  },
  {
    name_zh: "SyncClipboard",
    desc_zh: "剪切板同步，好用，爱用。再也不用微信消息复制粘贴了",
    name_en: "SyncClipboard",
    desc_en:
      "Clipboard sync, good and loved. No more copying/pasting via WeChat messages.",
  },
  {
    name_zh: "QtScrcpy",
    desc_zh: "局域网控制手机神器，远程adb牛逼",
    name_en: "QtScrcpy",
    desc_en: "LAN phone control tool, remote adb is awesome.",
  },
];

// ========== 渲染工具列表的函数 ==========
function renderTools(toolsArray) {
  const container = document.getElementById("tools-container");
  if (!container) {
    console.error("未找到工具容器 #tools-container");
    return;
  }

  const arrayToRender = toolsArray || toolsData;
  if (!arrayToRender || !Array.isArray(arrayToRender) || arrayToRender.length === 0) {
    const currentLang = localStorage.getItem(LANG_KEY) || "zh";
    let noDataMessage = currentLang === 'en' ? 'No tools data available.' : '暂无工具数据';
    container.innerHTML = `<div class="memo-error">${noDataMessage}</div>`;
    return;
  }

  const currentLang = localStorage.getItem(LANG_KEY) || "zh";

  let html = "";
  toolsArray.forEach((tool) => {
    const name = currentLang === "en" ? tool.name_en : tool.name_zh;
    const desc = currentLang === "en" ? tool.desc_en : tool.desc_zh;

    html += `
      <div class="tool-item">
          <div class="tool-name">${name}</div>
          <div class="tool-desc">${desc}</div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// 如果需要在页面加载后自动渲染，可以取消下面的注释
// document.addEventListener('DOMContentLoaded', function() {
//     renderTools();
// });
