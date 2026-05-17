# 人生相册构建脚本

## 📖 功能说明

自动扫描 `/static/img/photos/` 目录下的所有图片文件，生成 `photos.json` 索引文件。

## 🚀 使用方法

### 方法一：双击运行（推荐）

直接双击 `build-photos.bat` 文件即可。

### 方法二：命令行运行

```bash
# 在项目根目录下执行
python scripts/generate-photos-json.py
```

## 📝 工作流程

1. 将新照片放入 `/static/img/photos/` 目录
2. 运行构建脚本（双击 `build-photos.bat`）
3. 脚本会自动：
   - 扫描目录下所有图片文件（支持 jpg, png, gif, webp, bmp, svg）
   - 按文件名排序
   - 生成/更新 `photos.json` 文件
4. 刷新网页，新照片自动显示

## 📂 生成的 JSON 格式

```json
{
  "photos": [
    "1 (1).jpg",
    "1 (2).jpg",
    "..."
  ],
  "total": 13,
  "lastUpdated": "2026-03-03 15:30:00"
}
```

## ⚙️ 配置说明

支持的图片格式：
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.bmp`
- `.svg`

如需添加其他格式，编辑 `generate-photos-json.py` 中的 `IMAGE_EXTENSIONS` 集合。

## 💡 提示

- 照片会按文件名**字母顺序**排序
- 建议使用数字前缀控制顺序，如：`001.jpg`, `002.jpg`
- 脚本会自动排除 `photos.json` 文件本身
- 每次运行都会重新扫描并覆盖旧的 JSON 文件
