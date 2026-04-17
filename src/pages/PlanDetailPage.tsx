import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Table, Form, Input, Select, DatePicker, Button, Space, message, Spin, Drawer, Timeline, Tag, Badge, Modal, Progress } from 'antd';
import { ReloadOutlined, ExportOutlined, EyeOutlined, LinkOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ListConfig } from '../types/list-config';
import dayjs from 'dayjs';
import PRDAnnotation from '../components/PRDAnnotation';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

// 计划明细管理页面
const PlanDetailPage: React.FC = () => {
  const [config, setConfig] = useState<ListConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchValues, setSearchValues] = useState<Record<string, any>>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [,] = useState<React.Key[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  
  // 定时轮询引用
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 加载配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const configModule = await import('../mock/plan-detail.config.json');
        const loadedConfig = configModule.default as ListConfig;
        setConfig(loadedConfig);
        setData(loadedConfig.mockData);
        setFilteredData(loadedConfig.mockData);
        setPagination({
          ...pagination,
          pageSize: loadedConfig.pagination.defaultPageSize,
          total: loadedConfig.mockData.length,
        });
      } catch (err) {
        console.error('Failed to load config:', err);
        message.error('加载配置文件失败');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // 搜索筛选
  useEffect(() => {
    if (!data || data.length === 0) {
      setFilteredData([]);
      return;
    }

    const filtered = data.filter(item => {
      return Object.entries(searchValues).every(([key, value]) => {
        if (!value) return true;
        const itemValue = item[key];
        if (Array.isArray(value)) {
          // 处理日期范围
          if (value[0] && value[1]) {
            const itemDate = dayjs(itemValue);
            return itemDate.isAfter(value[0]) && itemDate.isBefore(value[1]);
          }
          return true;
        }
        return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
      });
    });

    setFilteredData(filtered);
    setPagination({ ...pagination, current: 1, total: filtered.length });
  }, [data, searchValues]);

  // 定时轮询（60秒）
  useEffect(() => {
    pollingRef.current = setInterval(() => {
      handleRefresh();
    }, 60000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // 刷新数据
  const handleRefresh = useCallback(() => {
    setLoading(true);
    // 模拟数据刷新
    setTimeout(() => {
      setLastRefreshTime(new Date());
      setLoading(false);
      message.success('数据已刷新');
    }, 500);
  }, []);

  // 处理搜索
  const handleSearch = (values: Record<string, any>) => {
    setSearchValues(values);
  };

  // 处理重置
  const handleReset = () => {
    setSearchValues({});
  };

  // 处理分页变化
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  // 打开详情抽屉
  const handleViewDetail = (record: any) => {
    setCurrentRecord(record);
    setDrawerVisible(true);
  };

  // 查看异常原因
  const handleViewAbnormalReason = (record: any) => {
    if (record.abnormalRecords && record.abnormalRecords.length > 0) {
      const abnormal = record.abnormalRecords[0];
      Modal.info({
        title: '异常原因',
        content: (
          <div>
            <p><strong>类型：</strong>{abnormal.type}</p>
            <p><strong>时间：</strong>{abnormal.time}</p>
            <p><strong>描述：</strong>{abnormal.description}</p>
            <p><strong>报告人：</strong>{abnormal.reporter}</p>
          </div>
        ),
        onOk() {},
      });
    }
  };

  // 导出Excel
  const handleExport = () => {
    if (filteredData.length > 1000) {
      confirm({
        title: '数据量超过限制',
        icon: <ExclamationCircleOutlined />,
        content: `当前筛选结果共 ${filteredData.length} 条，超过单次导出限制（1000条），建议分批导出或使用更精确的筛选条件。`,
        onOk() {
          // 导出前1000条
          startExport(1000);
        },
      });
    } else {
      startExport(filteredData.length);
    }
  };

  // 开始导出
  const startExport = (count: number) => {
    setExportModalVisible(true);
    setExportLoading(true);
    setExportProgress(0);

    // 模拟导出进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setExportProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setExportLoading(false);
        message.success(`成功导出 ${count} 条数据`);
        setTimeout(() => {
          setExportModalVisible(false);
        }, 1000);
      }
    }, 200);
  };

  // 渲染搜索表单
  const renderSearchForm = () => {
    if (!config || !config.searchConfig || !config.searchConfig.items) return null;

    return (
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        <Form
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          {config.searchConfig.items.map(item => {
            switch (item.type) {
              case 'input':
                return (
                  <Form.Item key={item.key} name={item.key} label={item.label}>
                    <Input placeholder={item.placeholder} style={{ width: 150 }} />
                  </Form.Item>
                );
              case 'select':
                return (
                  <Form.Item key={item.key} name={item.key} label={item.label}>
                    <Select placeholder={item.placeholder} style={{ width: 150 }} allowClear>
                      {item.options?.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              case 'dateRange':
                return (
                  <Form.Item key={item.key} name={item.key} label={item.label}>
                    <RangePicker placeholder={['开始日期', '结束日期']} />
                  </Form.Item>
                );
              default:
                return null;
            }
          })}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
        <PRDAnnotation
          id={1}
          title="明细列表查询"
          content={
            <div>
              <p><strong>API:</strong> GET /api/v1/plan-details</p>
              <p><strong>查询参数:</strong></p>
              <ul>
                <li>batchPlanNo: 批次计划编号</li>
                <li>planDateStart/planDateEnd: 计划日期范围</li>
                <li>carrierCompanyId: 承运企业ID</li>
                <li>plateNo: 车牌号</li>
                <li>cargoType: 货物类型</li>
                <li>status: 执行状态</li>
              </ul>
              <p><strong>业务规则:</strong></p>
              <ul>
                <li>支持多条件组合筛选</li>
                <li>日期范围筛选支持跨月查询</li>
                <li>车牌号支持模糊匹配</li>
              </ul>
            </div>
          }
        />
      </div>
    );
  };

  // 渲染操作栏
  const renderActionBar = () => {
    return (
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <div>
          <h1 style={{ margin: 0 }}>{config?.pageMeta.title}</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>{config?.pageMeta.description}</p>
        </div>
        <Space>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              刷新
            </Button>
            <PRDAnnotation
              id={2}
              title="定时轮询刷新"
              content={
                <div>
                  <p><strong>功能描述:</strong> 自动定时刷新数据，确保信息实时性</p>
                  <p><strong>技术实现:</strong></p>
                  <ul>
                    <li>定时轮询间隔：<strong>60秒</strong></li>
                    <li>使用 setInterval 实现定时任务</li>
                    <li>组件卸载时自动清理定时器</li>
                  </ul>
                  <p><strong>业务规则:</strong></p>
                  <ul>
                    <li>每次刷新更新"上次刷新时间"显示</li>
                    <li>刷新成功显示提示消息</li>
                    <li>支持手动触发刷新</li>
                  </ul>
                  <blockquote>
                    注：实际生产环境可通过 WebSocket 实现实时推送，减少轮询开销
                  </blockquote>
                </div>
              }
            />
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button 
              type="primary" 
              icon={<ExportOutlined />} 
              onClick={handleExport}
              disabled={filteredData.length === 0}
            >
              导出明细报表
            </Button>
            <PRDAnnotation
              id={3}
              title="导出明细报表"
              content={
                <div>
                  <p><strong>API:</strong> POST /api/v1/plan-details/export</p>
                  <p><strong>业务规则:</strong></p>
                  <ul>
                    <li><span className="status-dot status-dot-red"></span>单次导出上限：<strong>1000条</strong></li>
                    <li>超出限制需分批导出或使用更精确筛选条件</li>
                    <li>导出格式：Excel (.xlsx)</li>
                    <li>大文件采用异步导出，通过 WebSocket 通知下载链接</li>
                  </ul>
                  <p><strong>导出字段:</strong></p>
                  <ul>
                    <li>明细ID、关联批次号、承运方</li>
                    <li>车牌、驾驶员、货物类型/数量</li>
                    <li>计划时间、实际节点时间、当前状态</li>
                  </ul>
                  <p><strong>交互流程:</strong></p>
                  <ol>
                    <li>点击导出按钮检查数据量</li>
                    <li>超过1000条显示确认弹窗</li>
                    <li>显示导出进度条</li>
                    <li>完成后自动下载文件</li>
                  </ol>
                </div>
              }
            />
          </div>
        </Space>
      </div>
    );
  };

  // 表格列定义
  const columns = [
    {
      title: '明细ID',
      dataIndex: 'detailId',
      key: 'detailId',
      width: 120,
    },
    {
      title: '关联批次号',
      dataIndex: 'batchPlanNo',
      key: 'batchPlanNo',
      width: 150,
    },
    {
      title: '承运方',
      dataIndex: 'carrierCompany',
      key: 'carrierCompany',
      width: 180,
      ellipsis: true,
    },
    {
      title: '车牌',
      dataIndex: 'plateNo',
      key: 'plateNo',
      width: 100,
    },
    {
      title: '驾驶员',
      dataIndex: 'driver',
      key: 'driver',
      width: 100,
    },
    {
      title: '货物量',
      dataIndex: 'cargoAmount',
      key: 'cargoAmount',
      width: 80,
      align: 'center' as const,
    },
    {
      title: '计划时间',
      dataIndex: 'planTime',
      key: 'planTime',
      width: 150,
    },
    {
      title: '实际节点时间',
      dataIndex: 'actualNodeTime',
      key: 'actualNodeTime',
      width: 140,
      render: (text: string, record: any) => {
        if (record.isAbnormal && record.status === 'abnormal') {
          return (
            <Button 
              type="link" 
              danger 
              size="small"
              onClick={() => handleViewAbnormalReason(record)}
            >
              {text}
            </Button>
          );
        }
        return <span style={{ color: record.isAbnormal ? '#ff4d4f' : 'inherit' }}>{text}</span>;
      },
    },
    {
      title: (
        <span style={{ position: 'relative', display: 'inline-block' }}>
          当前状态
          <PRDAnnotation
            id={4}
            title="执行状态管理"
            content={
              <div>
                <p><strong>状态流转规则:</strong></p>
                <div style={{ padding: '8px', background: '#f6ffed', borderRadius: '4px', marginBottom: '12px' }}>
                  <p style={{ margin: 0 }}>待集结 → 已集结 → 押运中 → 已过桥 → 已完成</p>
                  <p style={{ margin: '4px 0 0 0', color: '#ff4d4f' }}>异常状态可任意节点触发</p>
                </div>
                <p><strong>状态定义:</strong></p>
                <ul>
                  <li><span className="status-dot status-dot-gray"></span><strong>待集结</strong> - 车辆尚未到达集结点</li>
                  <li><span className="status-dot status-dot-blue"></span><strong>已集结</strong> - 车辆已到达集结点</li>
                  <li><span className="status-dot status-dot-orange"></span><strong>押运中</strong> - 正在执行运输任务</li>
                  <li><span className="status-dot status-dot-blue"></span><strong>已过桥</strong> - 已通过关键节点</li>
                  <li><span className="status-dot status-dot-green"></span><strong>已完成</strong> - 运输任务完成</li>
                  <li><span className="status-dot status-dot-red"></span><strong>异常</strong> - 运输过程出现异常</li>
                </ul>
                <p><strong>状态变更规则:</strong></p>
                <ul>
                  <li>状态只能按顺序流转，不能跳跃</li>
                  <li>状态变更时记录时间戳</li>
                  <li>异常状态需要填写异常原因</li>
                  <li>状态变更通过 WebSocket 实时通知托运商</li>
                </ul>
              </div>
            }
          />
        </span>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          waiting_gather: { color: 'default', text: '待集结' },
          gathered: { color: 'blue', text: '已集结' },
          escorting: { color: 'orange', text: '押运中' },
          crossed_bridge: { color: 'cyan', text: '已过桥' },
          completed: { color: 'green', text: '已完成' },
          abnormal: { color: 'red', text: '异常' },
        };
        const { color, text } = statusMap[status] || { color: 'default', text: status };
        return (
          <Badge 
            status={color as any} 
            text={text}
          />
        );
      },
    },
    {
      title: (
        <span style={{ position: 'relative', display: 'inline-block' }}>
          操作
          <PRDAnnotation
            id={5}
            title="明细详情查看"
            content={
              <div>
                <p><strong>API:</strong> GET /api/v1/plan-details/:id</p>
                <p><strong>详情内容包含:</strong></p>
                <ul>
                  <li><strong>基本信息</strong> - 明细ID、批次号、承运企业、车牌、驾驶员、货物信息</li>
                  <li><strong>自检结果</strong> - 车辆状态、安全设备、驾驶员状态、检查时间</li>
                  <li><strong>押运队信息</strong> - 队长、队员、联系电话</li>
                  <li><strong>关键时间轴</strong> - 计划时间 vs 实际时间对比</li>
                  <li><strong>异常报备记录</strong> - 异常类型、时间、描述、报告人</li>
                  <li><strong>轨迹与监控</strong> - 实时轨迹链接、监控链接</li>
                </ul>
                <p><strong>异常行高亮:</strong></p>
                <ul>
                  <li><span className="status-dot status-dot-red"></span>异常状态行显示红色背景</li>
                  <li>hover时背景色加深</li>
                  <li>实际节点时间列显示红色异常按钮，点击查看原因</li>
                </ul>
              </div>
            }
          />
        </span>
      ),
      key: 'actions',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Button 
          type="text" 
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  // 分页数据
  const paginatedData = filteredData.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  // 渲染详情抽屉
  const renderDetailDrawer = () => {
    if (!currentRecord) return null;

    return (
      <Drawer
        title={`明细详情 - ${currentRecord.detailId}`}
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {/* 基本信息 */}
        <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
          <p><strong>明细ID：</strong>{currentRecord.detailId}</p>
          <p><strong>关联批次号：</strong>{currentRecord.batchPlanNo}</p>
          <p><strong>承运企业：</strong>{currentRecord.carrierCompany}</p>
          <p><strong>车牌号：</strong>{currentRecord.plateNo}</p>
          <p><strong>驾驶员：</strong>{currentRecord.driver} ({currentRecord.driverPhone})</p>
          <p><strong>货物类型：</strong>{currentRecord.cargoTypeName}</p>
          <p><strong>货物量：</strong>{currentRecord.cargoAmount}</p>
        </Card>

        {/* 自检结果 */}
        {currentRecord.selfCheckResult && (
          <Card title="自检结果" size="small" style={{ marginBottom: 16 }}>
            <p><strong>车辆状态：</strong>
              <Tag color={currentRecord.selfCheckResult.vehicleStatus === '正常' ? 'green' : 'red'}>
                {currentRecord.selfCheckResult.vehicleStatus}
              </Tag>
            </p>
            <p><strong>安全设备：</strong>{currentRecord.selfCheckResult.safetyEquipment}</p>
            <p><strong>驾驶员状态：</strong>{currentRecord.selfCheckResult.driverStatus}</p>
            <p><strong>检查时间：</strong>{currentRecord.selfCheckResult.checkTime}</p>
          </Card>
        )}

        {/* 押运队信息 */}
        {currentRecord.escortTeam && (
          <Card title="押运队信息" size="small" style={{ marginBottom: 16 }}>
            <p><strong>队长：</strong>{currentRecord.escortTeam.leader}</p>
            <p><strong>队员：</strong>{currentRecord.escortTeam.members.join('、')}</p>
            <p><strong>联系电话：</strong>{currentRecord.escortTeam.contact}</p>
          </Card>
        )}

        {/* 关键时间轴 */}
        {currentRecord.timeline && currentRecord.timeline.length > 0 && (
          <Card title="关键时间轴" size="small" style={{ marginBottom: 16 }}>
            <Timeline
              mode="left"
              items={currentRecord.timeline.map((item: any) => ({
                color: item.status === 'completed' ? 'green' : item.status === 'abnormal' ? 'red' : 'gray',
                label: item.planTime,
                children: (
                  <>
                    <p><strong>{item.node}</strong></p>
                    <p style={{ color: '#999', fontSize: '12px' }}>
                      {item.actualTime ? `实际：${item.actualTime}` : '待完成'}
                    </p>
                  </>
                ),
              }))}
            />
          </Card>
        )}

        {/* 异常报备记录 */}
        {currentRecord.abnormalRecords && currentRecord.abnormalRecords.length > 0 && (
          <Card title="异常报备记录" size="small" style={{ marginBottom: 16 }}>
            {currentRecord.abnormalRecords.map((record: any, index: number) => (
              <div key={index} style={{ marginBottom: 8, padding: 8, background: '#fff2f0', borderRadius: 4 }}>
                <p><strong>{record.type}</strong> <span style={{ color: '#999' }}>{record.time}</span></p>
                <p>{record.description}</p>
                <p style={{ color: '#999', fontSize: '12px' }}>报告人：{record.reporter}</p>
              </div>
            ))}
          </Card>
        )}

        {/* 轨迹与监控 */}
        <Card title="轨迹与监控" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            {currentRecord.trackingUrl && (
              <Button 
                type="primary" 
                icon={<LinkOutlined />}
                href={currentRecord.trackingUrl}
                target="_blank"
                block
              >
                查看实时轨迹
              </Button>
            )}
            {currentRecord.monitorUrl && (
              <Button 
                icon={<LinkOutlined />}
                href={currentRecord.monitorUrl}
                target="_blank"
                block
              >
                查看实时监控
              </Button>
            )}
            {!currentRecord.trackingUrl && !currentRecord.monitorUrl && (
              <p style={{ color: '#999', textAlign: 'center' }}>暂无轨迹与监控数据</p>
            )}
          </Space>
        </Card>
      </Drawer>
    );
  };

  if (loading && !config) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Card>
        {renderActionBar()}
        <div style={{ marginBottom: 8, color: '#999', fontSize: '12px' }}>
          上次刷新：{lastRefreshTime.toLocaleString()} | 共 {filteredData.length} 条记录
          {filteredData.length > 1000 && <Tag color="orange" style={{ marginLeft: 8 }}>数据量大，建议筛选</Tag>}
        </div>
        {renderSearchForm()}
        <Table
          columns={columns}
          dataSource={paginatedData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: handlePaginationChange,
          }}
          rowClassName={(record) => record.isAbnormal ? 'abnormal-row' : ''}
        />
      </Card>

      {/* 详情抽屉 */}
      {renderDetailDrawer()}

      {/* 导出进度弹窗 */}
      <Modal
        title="正在导出"
        open={exportModalVisible}
        closable={!exportLoading}
        maskClosable={!exportLoading}
        footer={null}
      >
        <div style={{ padding: '20px 0' }}>
          <Progress percent={exportProgress} status={exportLoading ? 'active' : 'success'} />
          <p style={{ textAlign: 'center', marginTop: 16 }}>
            {exportLoading ? '正在生成Excel文件...' : '导出完成'}
          </p>
        </div>
      </Modal>

      <style>{`
        .abnormal-row {
          background-color: #fff2f0 !important;
        }
        .abnormal-row:hover > td {
          background-color: #ffccc7 !important;
        }
      `}</style>
    </>
  );
};

export default PlanDetailPage;
