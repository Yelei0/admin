# PM 零代码使用指南

## 1. 项目简介

本项目是一个配置驱动型后台原型框架，专为产品经理原型验证设计。通过修改 JSON 配置文件，即可动态生成完整的列表页，无需修改前端组件代码。

## 2. 技术栈

- React 18 + TypeScript + Vite + Ant Design 5 + React Router 6

## 3. 如何新增业务页

### 步骤 1：创建配置文件

在 `src/mock` 目录下创建新的配置文件，例如 `user.config.json`，按照以下结构编写配置：

```json
{
  "pageMeta": {
    "title": "用户管理",
    "description": "管理所有用户信息"
  },
  "searchConfig": [
    // 搜索配置项
  ],
  "tableConfig": {
    "rowKey": "id",
    "columns": [
      // 列配置
    ],
    "dicts": {
      // 字典配置
    }
  },
  "mockData": [
    // 模拟数据
  ],
  "actions": {
    "row": ["detail", "edit", "delete"],
    "batch": ["batchDelete", "export"]
  },
  "pagination": {
    "defaultPageSize": 10,
    "showSizeChanger": true,
    "showTotal": true
  }
}
```

### 步骤 2：配置路由

在 `src/router/index.tsx` 文件中添加新的路由配置：

```tsx
<Route 
  path="/users" 
  element={<GenericListPage configPath="/user.config.json" />} 
/>
```

### 步骤 3：更新组件中的配置路径映射

在 `src/components/GenericListPage.tsx` 文件中，更新 `loadConfig` 函数中的配置路径映射：

```tsx
switch (configPath) {
  case '/order.config.json':
    configModule = await import('../mock/order.config.json');
    break;
  case '/user.config.json':
    configModule = await import('../mock/user.config.json');
    break;
  default:
    throw new Error(`未知的配置路径: ${configPath}`);
}
```

### 步骤 4：访问新页面

启动开发服务器后，访问 `http://localhost:5173/users` 即可查看新创建的业务页。

## 4. 如何替换 JSON

### 步骤 1：修改配置文件

直接编辑 `src/mock` 目录下的 JSON 配置文件，例如修改 `order.config.json`：

- 修改 `pageMeta` 中的标题和描述
- 修改 `searchConfig` 中的搜索项
- 修改 `tableConfig` 中的列配置和字典
- 修改 `mockData` 中的模拟数据
- 修改 `actions` 中的操作按钮
- 修改 `pagination` 中的分页配置

### 步骤 2：保存文件

保存修改后的 JSON 文件，Vite 会自动热更新页面，无需手动刷新。

## 5. 热更新验证步骤

1. 启动开发服务器：`npm run dev`
2. 访问列表页，例如 `http://localhost:5173/orders`
3. 编辑 `src/mock/order.config.json` 文件，例如修改页面标题或添加新的列
4. 保存文件
5. 观察页面是否自动刷新，显示更新后的配置

## 6. 字段类型速查表

| 类型 | 描述 | 示例配置 | 渲染效果 |
|------|------|---------|----------|
| text | 文本类型 | `{"key": "name", "title": "名称", "type": "text"}` | 普通文本 |
| link | 链接类型 | `{"key": "url", "title": "链接", "type": "link"}` | 可点击的链接 |
| currency | 货币类型 | `{"key": "amount", "title": "金额", "type": "currency"}` | 自动添加千分位和两位小数 |
| datetime | 日期时间类型 | `{"key": "createTime", "title": "创建时间", "type": "datetime"}` | 格式化为 YYYY-MM-DD HH:mm:ss |
| tag | 标签类型 | `{"key": "status", "title": "状态", "type": "tag", "dictKey": "statusDict"}` | 根据字典配置显示不同颜色和样式的标签 |
| actions | 操作按钮类型 | `{"key": "actions", "title": "操作", "type": "actions"}` | 显示操作按钮列表 |

## 7. 搜索配置类型

| 类型 | 描述 | 示例配置 |
|------|------|---------|
| input | 输入框 | `{"key": "name", "label": "名称", "type": "input", "placeholder": "请输入名称"}` |
| select | 下拉选择 | `{"key": "status", "label": "状态", "type": "select", "options": [{"label": "选项1", "value": "1"}]}` |
| dateRange | 日期范围 | `{"key": "createTime", "label": "创建时间", "type": "dateRange", "placeholder": "开始时间,结束时间"}` |

## 8. 字典配置示例

```json
"dicts": {
  "statusDict": {
    "pending": { "label": "待支付", "color": "orange" },
    "paid": { "label": "已支付", "color": "green" },
    "shipped": { "label": "已发货", "color": "blue" },
    "completed": { "label": "已完成", "color": "purple" },
    "cancelled": { "label": "已取消", "color": "red" }
  }
}
```

## 9. 操作配置示例

```json
"actions": {
  "row": ["detail", "edit", "delete"], // 行级操作
  "batch": ["batchDelete", "export"] // 批量操作
}
```

## 10. 常见问题

### Q: 修改 JSON 后页面没有自动刷新？

A: 请检查 Vite 开发服务器是否正常运行，确保文件保存成功。

### Q: 新增的业务页访问时显示 404？

A: 请检查路由配置是否正确，确保路径和组件都已正确设置。

### Q: 标签类型没有显示正确的颜色？

A: 请检查字典配置是否正确，确保 `dictKey` 与 `dicts` 中的键名一致。

### Q: 货币类型没有正确格式化？

A: 请确保 `amount` 字段的值是数字类型，不是字符串类型。

## 11. 项目结构

```
├── src/
│   ├── components/
│   │   └── GenericListPage.tsx  // 通用列表组件
│   ├── utils/
│   │   └── columnMapper.tsx      // 列类型映射引擎
│   ├── types/
│   │   └── list-config.d.ts      // 类型定义
│   ├── router/
│   │   └── index.tsx             // 路由配置
│   ├── mock/
│   │   └── order.config.json     // 示例配置文件
│   ├── App.tsx                   // 主应用入口
│   └── main.tsx                  // 应用启动文件
├── package.json                  // 项目配置
├── tsconfig.json                 // TypeScript 配置
├── vite.config.ts                // Vite 配置
└── index.html                    // HTML 入口文件
```