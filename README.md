# GalaX
To promote, in general, feelings.

This project aims to solve a problem that people are actually trapped in their own rountines these days. But the world has a whole lot more to explore, including real things as well as feelings. Essentially, they are different feelings.

Hope to meet someone interested in it!



# 环境配置
#### 依赖配置
Python==3.6(64bits)
Django==1.11.20(TLS)

#### MySQL配置
安装好mysql后，先安装包
> pip install pymysql

运行群文件galax.sql（自动获得账号）,不用此文件的话，名字需要和setting中统一。

然后导入时区
> mysql -u root -p mysql < timezone_posix.sql

# Update
3.17 
1. 规定了导航栏模板，在根目录templates中;
2. 增加了登陆页面链接，在login中;
3. 加入了jquery-3.3.1和bootstrap-3.3.7-dist的支持，在static中。  
3.20 
1. 占用了id=container
2. 更新了验证码模块，但并未完善。


3.24
1. 添加了session用于标志用户登陆状态。
2. 注册模块，密码用sha256加密。
3. 添加了用户注册，邮件确认模块，但 未完成定时删除未在有效期内进行邮件确认的用户。还有非常多BUG。

4.1
1.使用ajax进行了验证码刷新。
2.修改了登陆注册界面的样式，使其更好看。包括验证码样式，表格样式等。
