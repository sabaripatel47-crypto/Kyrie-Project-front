# 为什么浏览器标签图标要用ico图片
为了兼容老浏览器,也可以用png,做法如下
把 PNG 文件放到 public/ 目录下，然后在 index.html 里加一行：<link rel="icon" type="image/png" href="/your-icon.png">
