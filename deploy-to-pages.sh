#!/bin/bash

echo "🚀 开始部署到GitHub Pages..."

# 确保在main分支
git checkout main

# 拉取最新更改
git pull origin main

# 切换到gh-pages分支
git checkout gh-pages

# 合并main分支的更改
git merge main

# 推送到GitHub
git push origin gh-pages

# 回到main分支
git checkout main

echo "✅ 部署完成！访问 https://wellyxy.github.io/side_by_side/" 