# 为什么浏览器标签图标要用ico图片
为了兼容老浏览器,也可以用png,做法如下
把 PNG 文件放到 public/ 目录下，然后在 index.html 里加一行：<link rel="icon" type="image/png" href="/your-icon.png">
# svg
图标规则直接参考原有图标即可,把原有图标代码发给AI让他模仿,主要是颜色设为currentColor跟随父元素的颜色