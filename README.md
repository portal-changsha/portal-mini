# 路由
# 使用的是uniapp的一个类似vue-router的插件 
# uni插件地址：[uni插件地址](https://ext.dcloud.net.cn/plugin?id=578)
# 文档地址： [文档地址](http://hhyang.cn/)
# 用法基本跟vue-router相同，在写法上有区别： this.$Router.push({})  需要大写


# 智能导诊
# uniapp 不支持svg,所以这里采用的是canvas画的。目前的问题是 画的路径在不同机型不能进行适配。点击事件未完善


# 电子健康卡
# 因域名白名单问题，未进行完整的测试

# 每新建一个页面需要在router文件里做下配置。
# pages.json也需要配置页面标题等。（路径在新建的时候会自动创建，如未自动创建需要手动创建）