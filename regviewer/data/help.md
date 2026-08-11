[TOC]

# Regviewer

![init_state](D:\code\regviewer_v2\images\init_state.png)

![max_state](D:\code\regviewer_v2\images\max_state.png)



## Feature list

* 任意连续bit的置1，清0，取反
* 2、8、10、16进制显示
* 8、16、32、64位宽模式
* 三种移位模式：逻辑、算术、循环
* 表达式计算，变量存储
* Armv8寄存器分域显示（测试中）
* Byte数到地址Size的转换

## User Guide

### 表达式计算和变量存储

支持的运算符：

- 算术：+, -, /, *, %, <<, >>,
- 位运算：^,&,|
- 逻辑：<, >, <=, >=, ==, !=, &&, ||

变量使用：

* 'x'代表当前显示变量
* 使用“$变量名=表达式$”的形式进行赋值
* 支持与c语言兼容的优先级








## Bug List

* 非当前寄存器全视为零，导致一些寄存的域显示与正常实现不符:

  SPSR_ELn.M

* bit范围设置没有对输入的有效性进行检测

* 非64bit模式下，计算出现问题

  * -1<<2*(2-3)

* 【DONE】同时显示寄存器和表达式变量后，calc失去焦点时，窗口不能自动调整大小

  

## To Do List

* 寄存器名自动补全
* 地址范围格式美化