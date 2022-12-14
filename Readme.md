# uCode4 硬件扩展TCP/UDP示例

> 本示例演示了 uCode4 硬件扩展以UDP搜索、TCP连接设备方案。（[有关接口说明见文档](https://aiedu.ubtrobot.com/open/docs/03-development/sdk/protocol.html#udp-tcp-%E5%8D%8F%E8%AE%AE)）

## 快速预览

通过git克隆源代码后，分别执行以下命令，可构建出uCode4扩展文件。

> 这里默认使用`yarn`命令，你也可以使用`npm`等命令。

- 安装依赖

```bash
yarn
```

- 构建

```bash
yarn compile
```

构建完成后，在`dist/`目录下，`ext.ucdext`文件即是uCode4扩展文件。

在uCode4中使用：
1. [打开uCode4](https://code.ubtrobot.com/)。
2. 点击创建作品--积木编程。
3. 切换到硬件标签，点击`添加硬件`。
4. 在空白处，单击鼠标右键，选择`添加开发者插件`。
5. 在文件选择弹窗中，选择刚编译好的`ext.ucdext`文件。
6. 添加后，点击新增的卡片，即可预览。
7. 插件也可以删除，删除后，请刷新页面。
8. 在代码库中，找到`tests/udp-tcp-robot.js`，使用`node tests/udp-tcp-robot.js`运行UDP/TCP程序模拟硬件设备。

![](udp.gif)

## uCode硬件扩展开发文档

有关如何开发uCode硬件插件，或uCode开放平台的信息，可以跳转到[开放平台文档](https://aiedu.ubtrobot.com/open/docs/01-started/usv.html)进行查阅。
