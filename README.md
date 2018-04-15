# 毕业设计

## socket.io API (based on SERVER)

- 添加好友

  ADD_FRIEND (listen): {fromUid, uid, msg}

  ADD_FRIENG (send)  : {fromUid, fromName, fromDescs, uid, msg}

- 接受添加

  ACCEPT_ADD (listen): {uid, fromUid}

  ACCEPT_ADD (send)  : {uid, name, descs, fromUid}

- 文本聊天消息

  CHAT_MSG (listen): {fromUid, uid, msg}

  CHAT_MSG (send)  : {fromUid, uid, msg}


## 踩坑历史

前端：

- 前端使用fetch发送不会自动携带cookie，需要加上：credentials: 'include'
- 前端使用redux作状态管理，为与socket.io结合，需要自定义redux中间件：发送数据时可以直接在中间件捕获action然后使用socket.emit()；但是接收到数据时应该如何把数据加载到redux的store树里呢？  
中间件只能拦截和处理action，即只能在store.dispatch()时触发，无法结合socket的监听器（它监听的消息是异步且随时随地的）。所以最终解决方案是，使用storeEnhancer，实际上中间件也是这东西的一种实现，此外还可以对整个store功能进行强化。
- Redux与React的目录结构划分方式有很多，本设计使用的是“按组件划分”，即每个组件自成一个目录，目录内包含对应的action、actionTypes、views等等，并且统一在index.js导出组件外部，这种方式可以比较清晰地为整个应用划分组件，使用每个不同的组件相互独立和解耦。  
但是目前发现，有些组件需要复用一个reducer，此时不好整合。也许需要更细致的组件划分，比如组件内包含更小的组件。
- 在前端代码目录（//src/）中，应该再新建一个pages/目录存放页面，与components/目录存放组件区分开来？