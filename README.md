# GalaX
To promote, in general, feelings.

This project aims to solve a problem that people are actually trapped in their own rountines these days. But the world has a whole lot more to explore, including real things as well as feelings. Essentially, they are different feelings.

Hope to meet someone interested in it!



# 环境配置

安装好mysql后，先安装包
> pip install pymysql

运行群文件galax.sql（自动获得账号）,不用此文件的话，名字需要和setting中统一。

然后导入时区
> mysql -u root -p mysql < timezone_posix.sql

# 更改
3.17 规定了导航栏模板，在根目录templates中;增加了登陆页面链接，在login中;加入了jquery-3.3.1和bootstrap-3.3.7-dist的支持，在static中。以上需要的话自取即可。