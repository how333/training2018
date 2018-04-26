# data_service.js
数据同步服务。

## API
* ### registVariables(name, variables)
注册数据同步列表。能过滤重复变量名。
    - name: [**String**] 同步变量列表名。
    - variables: [**Array, String**] 同步变量数组或变量。

* ### registSync(name, sync)
注册数据同步任务，通过名称关联一个数据同步列表。
    - name: [**String**] 同步任务关联数据同步列表。
    - sync: [**Object**] 同步任务对象。
        - type: 同步方式。可选值`MQTT`。
        - pack: 数据打包方式。可选值'JSON`。
        - scope: 数据同步范围。可选值`ALL`（全部数据），`MODIFY`（变化数据）。
        - schedule: 数据同步机制。可选值`ONTIME`（实时），`PERIOD`（周期），`MANUAL`（人工触发）。
        - param: 同步任务参数。`PERIOD`, param.period 同步周期，缺省50毫秒.
    - 返回值: 同步任务ID.

* ### set(name, value, callback)
设置变量数据值。
    - name: [**String**] 变量名。
    - value: [**Any**] 变量值。
    - callback: [**Function**] 设置完后回调函数。callback(name, oldvalue, newvalue)
    
* ### get(name)
获取变量值。
    - name: [**String**] 变量名。
    
* ### timestamp(name)
获取变量值时间戳。
    - name: [**String**] 变量名。
    
* ### unregistSync(id)
撤消同步任务。
    - id: [**String**] 任务ID。由registSync生成。
    
* ### manualSync(id)
手工同步任务。
    - id: [**String**] 任务ID。由registSync生成。