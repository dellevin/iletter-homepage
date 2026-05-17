#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import re
from pathlib import Path
from datetime import datetime

# ==================== 配置区域 ====================
# 请在此处指定你的照片目录和输出文件路径
# DEFAULT_PHOTOS_DIR = Path("/www/wwwroot/www.iletter.top/static/img/photos")
# DEFAULT_OUTPUT_FILE = Path("/www/wwwroot/www.iletter.top/static/img/photos/photos.json")
DEFAULT_PHOTOS_DIR = Path("D:\\UserData\\Desktop\\my_proj\\www.iletter.top\\static\\img\\photos")
DEFAULT_OUTPUT_FILE = Path("D:\\UserData\\Desktop\\my_proj\\www.iletter.top\\static\\img\\photos\\photos.json")
# ================================================

# 支持的图片格式
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'}



def natural_sort_key(filename):
    """自然排序键函数，支持数字正确排序"""
    return [int(text) if text.isdigit() else text.lower()
            for text in re.split(r'(\d+)', filename)]


def scan_photos(photos_dir):
    """扫描照片目录，返回按修改时间排序的文件名列表（最新的在最前面）"""
    if not photos_dir.exists():
        print(f"❌ 目录不存在: {photos_dir}")
        return []

    photos = []
    for file in photos_dir.iterdir():
        if file.is_file() and file.suffix.lower() in IMAGE_EXTENSIONS:
            # 排除 JSON 文件本身
            if file.name == "photos.json":
                continue
            # 存储文件名和修改时间戳
            photos.append((file.name, file.stat().st_mtime))

    # 按修改时间降序排序（最新的在最前面）
    photos.sort(key=lambda x: x[1], reverse=True)
    
    # 只返回文件名列表
    return [p[0] for p in photos]


def generate_json(photos, output_file):
    """生成 photos.json 文件"""
    data = {
        "photos": photos,
        "total": len(photos),
        "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    # 写入文件
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return len(photos)


def main():
    # 确定照片目录和输出文件路径
    photos_dir = DEFAULT_PHOTOS_DIR.resolve()
    output_file = DEFAULT_OUTPUT_FILE.resolve()

    print("🚀 开始扫描照片目录...")
    print(f"📁 照片目录: {photos_dir}")
    print(f"📝 输出文件: {output_file}")

    photos = scan_photos(photos_dir)

    if not photos:
        print("⚠️ 未找到任何照片文件")
        # 仍然生成空的 JSON
        generate_json([], output_file)
        print(f"✅ 已生成空的 {output_file}")
        return

    count = generate_json(photos, output_file)

    print(f"✅ 成功生成 {output_file}")
    print(f"📊 共扫描到 {count} 张照片:")
    for i, photo in enumerate(photos, 1):
        print(f"   {i}. {photo}")


if __name__ == "__main__":
    main()
