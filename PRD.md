# 危化品运输管理平台 - 产品需求文档 (PRD)

**版本**: V1.0  
**日期**: 2024-01-15  
**状态**: Final  
**目标**: 生产环境部署

---

## 1. 产品概述

### 1.1 产品定位
危化品运输管理平台是专为危险化学品运输行业设计的综合管理系统，覆盖从计划制定、执行监控到应急处理的全流程管理，确保危化品运输的安全、合规与高效。

### 1.2 目标用户
| 角色 | 数量 | 核心诉求 |
|------|------|----------|
| 托运商 | 20-30人 | 发布运输需求、管理批次计划、监控运输执行 |
| 承运商 | 30-50人 | 接收运输任务、执行运输计划、上报运输状态 |
| 平台管理员 | 5-10人 | 管理企业信息、维护应急专家库、监控系统运行 |

### 1.3 用户量级预估
- **日活跃用户**: 50-80人
- **峰值并发**: 20-30人（集中在上午8-9点计划创建时段）
- **日均请求量**: 约5000次
- **数据增长**: 每月约1000条计划明细记录

### 1.4 核心价值
- 实现危化品运输全流程数字化管理
- 提供实时监控与异常预警机制
- 建立完善的应急响应体系
- 确保运输过程合规可追溯

---

## 2. 技术架构

### 2.1 技术栈

#### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 框架 |
| TypeScript | 5.x | 类型安全 |
| Vite | 5.x | 构建工具 |
| Ant Design | 5.x | 组件库 |
| React Router | 6.x | 路由管理 |
| Axios | 1.x | HTTP 请求 |
| Zustand | 4.x | 状态管理 |
| Socket.io-client | 4.x | WebSocket 实时通信 |

#### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| NestJS | 10.x | Node.js 后端框架 |
| TypeScript | 5.x | 类型安全 |
| Prisma | 5.x | ORM 数据库访问 |
| MySQL | 8.0 | 主数据库 |
| Redis | 7.x | 缓存、会话、锁 |
| Socket.io | 4.x | WebSocket 服务 |
| JWT | 9.x | 身份认证 |
| bcrypt | 5.x | 密码加密 |

#### 部署运维
| 技术 | 用途 |
|------|------|
| Docker | 容器化 |
| Docker Compose | 本地/测试环境编排 |
| Nginx | 反向代理、静态文件服务 |
| GitHub Actions | CI/CD 自动化部署 |
| PM2 | 生产环境进程管理 |

### 2.2 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         客户端层                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   PC浏览器   │  │   移动端    │  │   管理后台   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Nginx 网关层                          │
│         (SSL终止、静态文件、负载均衡、反向代理)                │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   前端静态资源    │  │   NestJS API    │  │  WebSocket服务  │
│   (React SPA)   │  │    (业务逻辑)    │  │  (实时通知)     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│     MySQL       │  │     Redis       │  │    本地存储      │
│   (主数据库)     │  │ (缓存/会话/锁)   │  │  (文件/图片)    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 2.3 数据库架构

#### 2.3.1 ER 图

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Company   │       │   Expert    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────┤ id (PK)     │       │ id (PK)     │
│ company_id  │       │ name        │       │ name        │
│ username    │       │ contact     │       │ phone       │
│ password    │       │ phone       │       │ id_card     │
│ role        │       │ address     │       │ fields      │
│ status      │       │ status      │       │ status      │
└─────────────┘       └─────────────┘       └─────────────┘
         │
         │ 1:N
         ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  BatchPlan  │◄──────┤  PlanDetail │       │   Abnormal  │
├─────────────┤  1:N  ├─────────────┤  1:N  ├─────────────┤
│ id (PK)     │       │ id (PK)     │◄──────┤ id (PK)     │
│ plan_no     │       │ detail_no   │       │ detail_id   │
│ company_id  │       │ plan_id     │       │ type        │
│ expert_id   │       │ vehicle_id  │       │ description │
│ plan_date   │       │ driver_id   │       │ reporter    │
│ status      │       │ status      │       │ status      │
└─────────────┘       └─────────────┘       └─────────────┘
```

#### 2.3.2 数据表结构

```sql
-- 用户表
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `company_id` INT UNSIGNED NOT NULL COMMENT '所属企业ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '加密密码',
  `real_name` VARCHAR(50) COMMENT '真实姓名',
  `phone` VARCHAR(20) COMMENT '手机号',
  `role` ENUM('admin', 'shipper', 'carrier') NOT NULL DEFAULT 'shipper' COMMENT '角色',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
  `last_login_at` DATETIME COMMENT '最后登录时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_company_id` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 企业表
CREATE TABLE `companies` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT '企业名称',
  `type` ENUM('shipper', 'carrier') NOT NULL COMMENT '类型:托运商/承运商',
  `contact` VARCHAR(50) COMMENT '联系人',
  `phone` VARCHAR(20) COMMENT '联系电话',
  `address` VARCHAR(255) COMMENT '企业地址',
  `license_no` VARCHAR(50) COMMENT '营业执照号',
  `danger_license_no` VARCHAR(50) COMMENT '危化品经营许可证号',
  `transport_license_no` VARCHAR(50) COMMENT '道路运输经营许可证号',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_name` (`name`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业表';

-- 应急专家表
CREATE TABLE `experts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `id_card` VARCHAR(18) NOT NULL COMMENT '身份证号',
  `fields` JSON COMMENT '专业领域数组',
  `remark` TEXT COMMENT '备注',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_phone` (`phone`),
  UNIQUE KEY `uk_id_card` (`id_card`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应急专家表';

-- 批次计划表
CREATE TABLE `batch_plans` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `plan_no` VARCHAR(20) NOT NULL COMMENT '批次计划编号',
  `company_id` INT UNSIGNED NOT NULL COMMENT '托运企业ID',
  `expert_id` INT UNSIGNED COMMENT '指派专家ID',
  `plan_date` DATE NOT NULL COMMENT '计划日期',
  `time_slot` VARCHAR(50) COMMENT '时间段',
  `vehicle_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '车数',
  `cargo_name` VARCHAR(100) NOT NULL COMMENT '货物名称',
  `cargo_type` VARCHAR(50) COMMENT '货物类型编码',
  `status` ENUM('pending', 'approved', 'rejected', 'executed', 'cancelled') DEFAULT 'pending' COMMENT '状态',
  `remark` TEXT COMMENT '备注',
  `created_by` INT UNSIGNED NOT NULL COMMENT '创建人ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_plan_no` (`plan_no`),
  KEY `idx_company_id` (`company_id`),
  KEY `idx_expert_id` (`expert_id`),
  KEY `idx_plan_date` (`plan_date`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='批次计划表';

-- 计划明细表
CREATE TABLE `plan_details` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `detail_no` VARCHAR(20) NOT NULL COMMENT '明细编号',
  `plan_id` INT UNSIGNED NOT NULL COMMENT '批次计划ID',
  `carrier_company_id` INT UNSIGNED NOT NULL COMMENT '承运企业ID',
  `vehicle_id` INT UNSIGNED COMMENT '车辆ID',
  `plate_no` VARCHAR(20) NOT NULL COMMENT '车牌号',
  `driver_id` INT UNSIGNED COMMENT '驾驶员ID',
  `driver_name` VARCHAR(50) COMMENT '驾驶员姓名',
  `driver_phone` VARCHAR(20) COMMENT '驾驶员电话',
  `cargo_type` VARCHAR(50) COMMENT '货物类型',
  `cargo_amount` VARCHAR(50) COMMENT '货物量',
  `plan_time` DATETIME COMMENT '计划时间',
  `actual_gather_time` DATETIME COMMENT '实际集结时间',
  `actual_up_bridge_time` DATETIME COMMENT '实际上桥时间',
  `actual_down_bridge_time` DATETIME COMMENT '实际下桥时间',
  `actual_complete_time` DATETIME COMMENT '实际完成时间',
  `status` ENUM('waiting_gather', 'gathered', 'escorting', 'crossed_bridge', 'completed', 'abnormal') DEFAULT 'waiting_gather' COMMENT '状态',
  `is_abnormal` TINYINT DEFAULT 0 COMMENT '是否异常: 0-正常 1-异常',
  `self_check_result` JSON COMMENT '自检结果',
  `escort_team` JSON COMMENT '押运队信息',
  `timeline` JSON COMMENT '时间轴记录',
  `tracking_url` VARCHAR(255) COMMENT '轨迹链接',
  `monitor_url` VARCHAR(255) COMMENT '监控链接',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_detail_no` (`detail_no`),
  KEY `idx_plan_id` (`plan_id`),
  KEY `idx_carrier_company_id` (`carrier_company_id`),
  KEY `idx_plate_no` (`plate_no`),
  KEY `idx_status` (`status`),
  KEY `idx_is_abnormal` (`is_abnormal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='计划明细表';

-- 异常记录表
CREATE TABLE `abnormal_records` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `detail_id` INT UNSIGNED NOT NULL COMMENT '计划明细ID',
  `type` VARCHAR(50) NOT NULL COMMENT '异常类型',
  `description` TEXT NOT NULL COMMENT '异常描述',
  `reporter` VARCHAR(50) COMMENT '报告人',
  `reporter_phone` VARCHAR(20) COMMENT '报告人电话',
  `status` ENUM('pending', 'processing', 'resolved') DEFAULT 'pending' COMMENT '处理状态',
  `resolved_at` DATETIME COMMENT '解决时间',
  `resolved_by` INT UNSIGNED COMMENT '解决人ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_detail_id` (`detail_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='异常记录表';

-- 车辆表
CREATE TABLE `vehicles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `company_id` INT UNSIGNED NOT NULL COMMENT '所属企业ID',
  `plate_no` VARCHAR(20) NOT NULL COMMENT '车牌号',
  `vehicle_type` VARCHAR(50) COMMENT '车辆类型',
  `capacity` VARCHAR(50) COMMENT '载重/容量',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_plate_no` (`plate_no`),
  KEY `idx_company_id` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='车辆表';

-- 驾驶员表
CREATE TABLE `drivers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `company_id` INT UNSIGNED NOT NULL COMMENT '所属企业ID',
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `phone` VARCHAR(20) COMMENT '电话',
  `id_card` VARCHAR(18) COMMENT '身份证号',
  `license_no` VARCHAR(50) COMMENT '驾驶证号',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_company_id` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='驾驶员表';

-- 操作日志表
CREATE TABLE `operation_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED COMMENT '操作用户ID',
  `action` VARCHAR(100) NOT NULL COMMENT '操作类型',
  `module` VARCHAR(50) COMMENT '操作模块',
  `resource_id` VARCHAR(50) COMMENT '操作对象ID',
  `detail` JSON COMMENT '操作详情',
  `ip_address` VARCHAR(50) COMMENT 'IP地址',
  `user_agent` VARCHAR(255) COMMENT '浏览器信息',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_user_id` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_module` (`module`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';
```

### 2.4 API 设计规范

#### 2.4.1 接口路径规范
- 基础路径: `/api/v1`
- 资源名使用复数: `/batch-plans`, `/plan-details`
- 层级清晰: `/api/{模块}/{资源}/{操作}`

#### 2.4.2 响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1705312800000
}
```

#### 2.4.3 错误码定义
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如重复） |
| 422 | 业务逻辑错误 |
| 500 | 服务器内部错误 |
| 503 | 服务暂不可用 |

---

## 3. 功能模块详细设计

### 3.1 认证授权模块

#### 3.1.1 登录
**API**: POST `/api/v1/auth/login`

**请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```

**响应**:
```json
{
  "code": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 7200,
    "user": {
      "id": 1,
      "username": "admin",
      "realName": "管理员",
      "role": "admin",
      "companyId": 1
    }
  }
}
```

**业务规则**:
- 密码错误5次锁定账号30分钟
- Access Token 有效期2小时
- Refresh Token 有效期7天
- 登录成功后记录操作日志

#### 3.1.2 修改密码
**API**: PUT `/api/v1/auth/password`

**请求体**:
```json
{
  "oldPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**业务规则**:
- 原密码必须正确
- 新密码长度不少于6位
- 确认密码必须与新密码一致
- 修改成功后强制重新登录

---

### 3.2 承运商端模块

#### 3.2.1 任务列表
**API**: GET `/api/v1/carrier/tasks`

**查询参数**:
- `status`: 任务状态筛选
- `page`: 页码
- `pageSize`: 每页条数

**响应**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "detailNo": "MX20240115001",
        "batchPlanNo": "JH202401150001",
        "cargoType": "液氯",
        "cargoAmount": "20吨",
        "planTime": "2024-01-15 08:00",
        "status": "waiting_gather",
        "startPoint": "起点",
        "endPoint": "终点"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

#### 3.2.2 更新任务状态
**API**: PUT `/api/v1/carrier/tasks/:id/status`

**请求体**:
```json
{
  "status": "gathered",
  "remark": "车辆已集结完毕"
}
```

**状态流转** <span style="display:inline-block;background:rgb(250,173,20);color:white;font-size:10px;font-weight:bold;line-height:14px;padding:0 4px;border-radius:2px;">4</span>:
```
waiting_gather → gathered → escorting → crossed_bridge → completed
                      ↓
                   abnormal
```

**业务规则**:
- 状态只能按顺序流转，不能跳跃
- 状态变更时记录时间戳
- 异常状态需要填写异常原因
- 状态变更通过 WebSocket 实时通知托运商

---

### 3.3 批次计划管理模块

#### 3.3.1 计划列表
**API**: GET `/api/v1/batch-plans`

**查询参数**:
- `planDateStart`: 计划日期开始
- `planDateEnd`: 计划日期结束
- `status`: 状态筛选
- `cargoName`: 货物名称模糊查询
- `page`: 页码
- `pageSize`: 每页条数

**响应**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "planNo": "JH202401150001",
        "planDate": "2024-01-15",
        "timeSlot": "08:00-12:00",
        "vehicleCount": 5,
        "cargoName": "液氯",
        "expert": {
          "id": 1,
          "name": "张安全",
          "phone": "133****3333"
        },
        "status": "approved",
        "createdAt": "2024-01-10 09:30:00"
      }
    ],
    "total": 50
  }
}
```

#### 3.3.2 创建计划
**API**: POST `/api/v1/batch-plans`

**请求体**:
```json
{
  "planDate": "2024-01-15",
  "timeSlot": "08:00-12:00",
  "vehicleCount": 5,
  "cargoName": "液氯",
  "cargoType": "liquid_chlorine",
  "expertId": 1,
  "remark": "备注信息"
}
```

**业务规则**:
- 计划日期必须大于等于当前日期
- 车数必须为正整数
- 货物名称不能为空
- 系统自动生成计划编号: JH + 年月日 + 4位序号
- 创建后状态为 "pending"（待审批）

#### 3.3.3 审批计划
**API**: PUT `/api/v1/batch-plans/:id/approve`

**请求体**:
```json
{
  "action": "approve",
  "remark": "审批通过"
}
```

**业务规则**:
- 只有 "pending" 状态的计划可以审批
- action 可选值: approve（通过）、reject（驳回）
- 审批通过后状态变为 "approved"
- 审批通过后自动生成计划明细

#### 3.3.4 取消计划
**API**: PUT `/api/v1/batch-plans/:id/cancel`

**业务规则**:
- 只有 "pending" 或 "approved" 状态的计划可以取消
- 取消后状态变为 "cancelled"
- 已取消的计划不可恢复

---

### 3.4 计划明细管理模块

#### 3.4.1 明细列表 <span style="display:inline-block;background:rgb(250,173,20);color:white;font-size:10px;font-weight:bold;line-height:14px;padding:0 4px;border-radius:2px;">1</span>
**API**: GET `/api/v1/plan-details`

**查询参数**:
- `batchPlanNo`: 批次计划编号
- `planDateStart`: 计划日期开始
- `planDateEnd`: 计划日期结束
- `carrierCompanyId`: 承运企业ID
- `plateNo`: 车牌号
- `cargoType`: 货物类型
- `status`: 执行状态
- `page`: 页码
- `pageSize`: 每页条数

**响应**:
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "detailId": "MX20240115001",
        "batchPlanNo": "JH202401150001",
        "carrierCompany": "北京危化运输有限公司",
        "plateNo": "京A12345",
        "driver": "王师傅",
        "cargoAmount": "20吨",
        "planTime": "2024-01-15 08:00",
        "actualNodeTime": "08:15集结/09:30上桥",
        "status": "completed",
        "isAbnormal": false
      }
    ],
    "total": 200
  }
}
```

#### 3.4.2 明细详情 <span style="display:inline-block;background:rgb(250,173,20);color:white;font-size:10px;font-weight:bold;line-height:14px;padding:0 4px;border-radius:2px;">5</span>
**API**: GET `/api/v1/plan-details/:id`

**响应**:
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "detailId": "MX20240115001",
    "batchPlanNo": "JH202401150001",
    "carrierCompany": "北京危化运输有限公司",
    "plateNo": "京A12345",
    "driver": "王师傅",
    "driverPhone": "139****9001",
    "cargoType": "liquid_chlorine",
    "cargoTypeName": "液氯",
    "cargoAmount": "20吨",
    "planTime": "2024-01-15 08:00",
    "status": "completed",
    "isAbnormal": false,
    "selfCheckResult": {
      "vehicleStatus": "正常",
      "safetyEquipment": "齐全",
      "driverStatus": "良好",
      "checkTime": "2024-01-15 07:45"
    },
    "escortTeam": {
      "leader": "张押运",
      "members": ["李押运", "赵押运"],
      "contact": "138****8001"
    },
    "timeline": [
      { "node": "集结", "planTime": "08:00", "actualTime": "08:15", "status": "completed" },
      { "node": "上桥", "planTime": "09:00", "actualTime": "09:30", "status": "completed" },
      { "node": "下桥", "planTime": "10:30", "actualTime": "10:45", "status": "completed" },
      { "node": "完成", "planTime": "12:00", "actualTime": "11:50", "status": "completed" }
    ],
    "abnormalRecords": [],
    "trackingUrl": "https://tracking.example.com/PD001",
    "monitorUrl": "https://monitor.example.com/PD001"
  }
}
```

#### 3.4.3 导出明细 <span style="display:inline-block;background:rgb(250,173,20);color:white;font-size:10px;font-weight:bold;line-height:14px;padding:0 4px;border-radius:2px;">3</span>
**API**: POST `/api/v1/plan-details/export`

**请求体**:
```json
{
  "batchPlanNo": "JH202401150001",
  "planDateStart": "2024-01-01",
  "planDateEnd": "2024-01-31",
  "status": "completed"
}
```

**响应**:
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="plan-details-20240115.xlsx"`

**业务规则**:
- 单次导出上限1000条
- 超出限制返回错误，提示分批导出
- 导出为 Excel 格式
- 大文件采用异步导出，通过 WebSocket 通知下载链接

#### 3.4.4 定时轮询刷新 <span style="display:inline-block;background:rgb(250,173,20);color:white;font-size:10px;font-weight:bold;line-height:14px;padding:0 4px;border-radius:2px;">2</span>
**功能描述**: 自动定时刷新数据，确保信息实时性

**技术实现**:
- 定时轮询间隔：**60秒**
- 使用 setInterval 实现定时任务
- 组件卸载时自动清理定时器

**业务规则**:
- 每次刷新更新"上次刷新时间"显示
- 刷新成功显示提示消息
- 支持手动触发刷新

> 注：实际生产环境可通过 WebSocket 实现实时推送，减少轮询开销

---

### 3.5 应急专家库模块

#### 3.5.1 专家列表
**API**: GET `/api/v1/experts`

**查询参数**:
- `name`: 姓名模糊查询
- `phone`: 手机号
- `field`: 专业领域
- `page`: 页码
- `pageSize`: 每页条数

#### 3.5.2 创建专家
**API**: POST `/api/v1/experts`

**请求体**:
```json
{
  "name": "张安全",
  "phone": "13333333333",
  "idCard": "110101199001011234",
  "fields": ["chemical_transport", "fire"],
  "remark": "资深危化品运输专家"
}
```

**业务规则**:
- 姓名必填
- 手机号必填，11位有效号码
- 身份证号必填，18位有效号码
- 手机号和身份证号唯一

#### 3.5.3 更新专家
**API**: PUT `/api/v1/experts/:id`

**业务规则**:
- 手机号和身份证号不可修改（如需修改需删除重建）

#### 3.5.4 删除专家
**API**: DELETE `/api/v1/experts/:id`

**业务规则**:
- 已被批次计划引用的专家不可删除
- 删除前需确认无关联数据

---

### 3.6 企业信息管理模块

#### 3.6.1 企业详情
**API**: GET `/api/v1/companies/:id`

**响应**:
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "某某化工有限公司",
    "type": "shipper",
    "contact": "张三",
    "phone": "138****8888",
    "address": "北京市朝阳区xxx路xxx号",
    "licenseNo": "91110000XXXXXXXX",
    "dangerLicenseNo": "京危化经字[2023]XXX号",
    "transportLicenseNo": "京交运管许可危货字XXX号",
    "status": 1
  }
}
```

#### 3.6.2 更新企业信息
**API**: PUT `/api/v1/companies/:id`

---

### 3.7 托运企业管理模块

#### 3.7.1 企业列表
**API**: GET `/api/v1/admin/companies`

**查询参数**:
- `name`: 企业名称模糊查询
- `contact`: 联系人
- `status`: 状态
- `page`: 页码
- `pageSize`: 每页条数

#### 3.7.2 创建企业
**API**: POST `/api/v1/admin/companies`

#### 3.7.3 启用/禁用企业
**API**: PUT `/api/v1/admin/companies/:id/status`

**请求体**:
```json
{
  "status": 0
}
```

**业务规则**:
- 禁用企业后，该企业下所有用户无法登录
- 禁用前需确认无进行中的运输任务

---

## 4. 前端页面设计

### 4.1 路由结构

```
/                           # 重定向到 /shippers
/login                      # 登录页

# 承运商端
/carrier                    # 承运商工作台
/carrier/tasks              # 任务列表

# 托运商端
/batch-plans                # 批次计划管理
/plan-details               # 计划明细管理
/experts                    # 应急专家库
/company-info               # 企业信息管理

# 托运企业管理（管理员）
/shippers                   # 托运企业列表

# 个人中心
/change-password            # 修改密码
```

### 4.2 页面布局

#### 4.2.1 整体布局
- **左侧边栏**: 菜单导航（固定宽度 200px）
- **顶部**: 页面标题 + 操作按钮
- **内容区**: 搜索筛选 + 数据表格 + 分页
- **底部**: 版权信息

#### 4.2.2 响应式设计
- 桌面端: 左侧边栏始终显示
- 平板端: 左侧边栏可收起
- 移动端: 左侧边栏变为抽屉式

### 4.3 组件规范

#### 4.3.1 列表页标准结构
```
┌─────────────────────────────────────────┐
│ 页面标题                    [操作按钮]   │
├─────────────────────────────────────────┤
│ 搜索筛选区                               │
│ [输入框] [选择框] [日期范围] [搜索][重置] │
├─────────────────────────────────────────┤
│ 数据表格                                 │
│ ┌────┬────┬────┬────┬────┬────┐        │
│ │列1 │列2 │列3 │列4 │列5 │操作│        │
│ ├────┼────┼────┼────┼────┼────┤        │
│ │... │... │... │... │... │... │        │
│ └────┴────┴────┴────┴────┴────┘        │
├─────────────────────────────────────────┤
│ 共 100 条          [分页器]              │
└─────────────────────────────────────────┘
```

#### 4.3.2 弹窗规范
- **新增/编辑**: Modal 弹窗，宽度 600px
- **详情查看**: Drawer 侧滑抽屉，宽度 600px
- **删除确认**: Modal 确认弹窗
- **导出进度**: Modal 进度弹窗

#### 4.3.3 表单验证
- 必填项: 红色星号标记
- 错误提示: 字段下方红色文字
- 实时校验: 失焦时校验
- 提交校验: 提交时统一校验

### 4.4 状态管理

#### 4.4.1 Zustand Store 设计
```typescript
// 用户状态
interface UserState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  logout: () => void;
}

// 计划明细状态
interface PlanDetailState {
  list: PlanDetail[];
  total: number;
  loading: boolean;
  filters: PlanDetailFilter;
  setFilters: (filters: PlanDetailFilter) => void;
  fetchList: () => Promise<void>;
}
```

---

## 5. 实时通信设计

### 5.1 WebSocket 事件

#### 5.1.1 客户端订阅事件
```javascript
// 订阅计划明细状态更新
socket.emit('subscribe', { channel: 'plan-detail', id: 'PD001' });

// 订阅批次计划更新
socket.emit('subscribe', { channel: 'batch-plan', id: 'BP001' });
```

#### 5.1.2 服务端推送事件
```javascript
// 计划明细状态变更
socket.emit('plan-detail:status-changed', {
  detailId: 'PD001',
  status: 'escorting',
  timestamp: '2024-01-15T09:30:00Z'
});

// 异常通知
socket.emit('abnormal:reported', {
  detailId: 'PD001',
  type: '车辆故障',
  description: '发动机异响',
  reporter: '张师傅'
});

// 导出完成通知
socket.emit('export:completed', {
  taskId: 'export-001',
  downloadUrl: '/api/v1/exports/export-001.xlsx'
});
```

### 5.2 轮询备选方案
对于不支持 WebSocket 的环境，提供轮询备选：
- 计划明细列表: 60秒轮询
- 异常通知: 30秒轮询

---

## 6. 安全设计

### 6.1 认证安全
- JWT Token 使用 HS256 算法签名
- Access Token 有效期 2 小时
- Refresh Token 有效期 7 天，存储在 HttpOnly Cookie
- 密码使用 bcrypt 加密，cost factor 12

### 6.2 接口安全
- 所有接口（除登录外）需携带有效 JWT Token
- Token 在 Header 中传递: `Authorization: Bearer <token>`
- 敏感操作需二次确认（删除、禁用等）

### 6.3 数据安全
- 敏感字段（手机号、身份证号）脱敏显示
- 数据库连接使用 SSL
- 数据库密码不硬编码，使用环境变量

### 6.4 防护措施
- SQL 注入: 使用 Prisma ORM 参数化查询
- XSS 攻击: 前端转义输出，后端验证输入
- CSRF 攻击: 使用 SameSite Cookie
- 暴力破解: 登录错误5次锁定账号30分钟

---

## 7. 性能设计

### 7.1 数据库优化
- 所有外键字段建立索引
- 常用查询字段建立索引
- 分页查询使用游标分页（大数据量时）

### 7.2 缓存策略
- 用户信息: Redis 缓存 30 分钟
- 专家列表: Redis 缓存 10 分钟
- 货物类型字典: 本地内存缓存

### 7.3 前端优化
- 路由懒加载
- 组件按需加载
- 图片懒加载
- API 请求防抖/节流

### 7.4 并发处理
- 计划审批使用分布式锁（Redis），防止重复审批
- 导出任务使用队列，避免并发导出导致内存溢出

---

## 8. 部署方案

### 8.1 服务器配置
| 服务 | 配置 | 数量 |
|------|------|------|
| Web 服务器 | 2核4G | 2台 |
| 数据库 | 4核8G | 1台 |
| Redis | 2核4G | 1台 |

### 8.2 Docker Compose 配置
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./dist:/usr/share/nginx/html
    depends_on:
      - api

  api:
    image: danger-transport-api:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://user:pass@mysql:3306/danger_transport
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mysql
      - redis

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpass
      - MYSQL_DATABASE=danger_transport
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

### 8.3 CI/CD 流程
```
代码提交 → GitHub Actions → 构建 → 测试 → 打包镜像 → 部署到服务器
```

---

## 9. 测试策略

### 9.1 单元测试
- 后端: Jest，覆盖率 > 80%
- 前端: Vitest，覆盖率 > 70%

### 9.2 集成测试
- API 接口测试
- 数据库操作测试
- 权限控制测试

### 9.3 E2E 测试
- 登录流程
- 计划创建到完成全流程
- 异常处理流程

### 9.4 性能测试
- 并发登录测试
- 大数据量列表查询测试
- 导出功能压力测试

---

## 10. 监控与日志

### 10.1 日志规范
- 使用结构化日志（JSON 格式）
- 日志级别: ERROR、WARN、INFO、DEBUG
- 敏感信息脱敏
- 日志保留 30 天

### 10.2 监控指标
- API 响应时间
- 错误率
- 数据库连接数
- Redis 内存使用

### 10.3 告警规则
- API 错误率 > 5% 告警
- 数据库连接数 > 80% 告警
- 服务器 CPU > 80% 告警

---

## 11. 上线检查清单

### 11.1 上线前验证
- [ ] 所有 API 接口测试通过
- [ ] 数据库迁移脚本执行成功
- [ ] 环境变量配置正确
- [ ] SSL 证书配置正确
- [ ] 备份策略已配置

### 11.2 上线后验证
- [ ] 登录功能正常
- [ ] 核心业务流程正常
- [ ] 监控数据正常上报
- [ ] 日志正常记录

### 11.3 回滚方案
- 保留上一版本 Docker 镜像
- 数据库变更使用迁移脚本，支持回滚
- 回滚时间目标 (RTO): 30 分钟

---

## 12. 附录

### 12.1 术语表
| 术语 | 说明 |
|------|------|
| 托运商 | 委托运输危化品的企业 |
| 承运商 | 承接运输任务的运输企业 |
| 批次计划 | 一次运输任务的计划，可包含多辆车 |
| 计划明细 | 批次计划下的单车运输任务 |
| 集结 | 车辆在指定地点集合准备出发 |
| 押运 | 运输过程中的护送监管 |

### 12.2 货物类型字典
| 编码 | 名称 |
|------|------|
| liquid_chlorine | 液氯 |
| sulfuric_acid | 硫酸 |
| liquid_ammonia | 液氨 |
| nitric_acid | 硝酸 |
| hydrochloric_acid | 盐酸 |
| sodium_hydroxide | 氢氧化钠 |

### 12.3 专业领域字典
| 编码 | 名称 |
|------|------|
| chemical_transport | 化学品运输 |
| corrosive | 腐蚀品处理 |
| gas_leak | 气体泄漏处置 |
| fire | 火灾应急 |
| environment | 环境保护 |
| medical | 医疗急救 |

---

**文档版本**: V1.0  
**创建日期**: 2024-01-15  
**最后更新**: 2024-01-15  
**作者**: 产品团队