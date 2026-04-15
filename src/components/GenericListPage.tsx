import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Form, Input, Select, DatePicker, Button, Space, message, Spin, Empty } from 'antd';
import { DeleteOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ListConfig, GenericListPageProps } from '../types/list-config';
import { mapColumn } from '../utils/columnMapper';
import { ShipperCreateModal, ShipperEditModal, ShipperDetailModal, ShipperDocumentsModal } from './ShipperModals';
import { BatchPlanCreateModal, BatchPlanEditModal, BatchPlanDetailModal, BatchPlanCancelModal } from './BatchPlanModals';
import { ExpertCreateModal, ExpertEditModal, ExpertDeleteModal } from './ExpertModals';

const { Option } = Select;
const { RangePicker } = DatePicker;

const GenericListPage: React.FC<GenericListPageProps> = ({ configPath }) => {
  // 状态管理
  const [config, setConfig] = useState<ListConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchValues, setSearchValues] = useState<Record<string, any>>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 弹窗状态
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [documentsModalVisible, setDocumentsModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);

  // 加载配置文件
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        // 动态导入 JSON 配置文件
        // 由于 Vite 的动态导入限制，我们需要使用静态导入
        // 这里根据 configPath 手动映射到对应的配置文件
        let configModule;
        switch (configPath) {
          case '/order.config.json':
            configModule = await import('../mock/order.config.json');
            break;
          case '/user.config.json':
            configModule = await import('../mock/user.config.json');
            break;
          case '/product.config.json':
            configModule = await import('../mock/product.config.json');
            break;
          case '/shipper-list.config.json':
            configModule = await import('../mock/shipper-list.config.json');
            break;
          case '/batch-plan.config.json':
            configModule = await import('../mock/batch-plan.config.json');
            break;
          case '/expert.config.json':
            configModule = await import('../mock/expert.config.json');
            break;
          default:
            throw new Error(`未知的配置路径: ${configPath}`);
        }
        const loadedConfig = configModule.default as ListConfig;
        setConfig(loadedConfig);
        setData(loadedConfig.mockData);
        setPagination({
          ...pagination,
          pageSize: loadedConfig.pagination.defaultPageSize,
          current: 1,
        });
      } catch (err) {
        console.error('Failed to load config:', err);
        setError('加载配置文件失败');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [configPath]);

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
            const itemDate = new Date(itemValue);
            return itemDate >= value[0] && itemDate <= value[1];
          }
          return true;
        }
        return String(itemValue).includes(String(value));
      });
    });

    setFilteredData(filtered);
    setPagination({ ...pagination, current: 1 });
  }, [data, searchValues]);

  // 分页数据
  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

  // 处理搜索表单提交
  const handleSearch = (values: Record<string, any>) => {
    setSearchValues(values);
  };

  // 处理重置搜索
  const handleReset = () => {
    setSearchValues({});
  };

  // 处理分页变化
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize });
  };

  // 处理操作
  const handleAction = (action: string, record: any) => {
    setCurrentRecord(record);
    switch (action) {
      case 'delete':
        handleDelete(record);
        break;
      case 'detail':
        setDetailModalVisible(true);
        break;
      case 'edit':
        setEditModalVisible(true);
        break;
      case 'toggleStatus':
        handleToggleStatus(record);
        break;
      case 'documents':
        setDocumentsModalVisible(true);
        break;
      case 'cancel':
        setCancelModalVisible(true);
        break;
      default:
        message.info(`执行 ${action} 操作`);
    }
  };

  // 处理账号状态切换
  const handleToggleStatus = (record: any) => {
    const isEnabled = record.accountStatus === 'enabled';
    const actionText = isEnabled ? '禁用' : '启用';
    const confirmText = isEnabled 
      ? '确定要禁用该企业账号吗？禁用后将无法登录和提报计划。' 
      : '确定要启用该企业账号吗？';
    
    // 模拟权限检查（仅管理员可见）
    const isAdmin = true; // 假设当前用户是管理员
    
    if (!isAdmin) {
      message.error('您没有权限执行此操作');
      return;
    }
    
    // 这里应该显示确认弹窗
    if (window.confirm(confirmText)) {
      setData(prevData => 
        prevData.map(item => 
          item.id === record.id 
            ? { ...item, accountStatus: isEnabled ? 'disabled' : 'enabled' }
            : item
        )
      );
      message.success(`${actionText}成功`);
    }
  };

  // 处理删除
  const handleDelete = (record: any) => {
    setLoading(true);
    // 模拟网络延迟
    setTimeout(() => {
      setData(prevData => prevData.filter(item => item.id !== record.id));
      message.success('删除成功');
      setLoading(false);
    }, 150);
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }

    setLoading(true);
    // 模拟网络延迟
    setTimeout(() => {
      setData(prevData => prevData.filter(item => !selectedRowKeys.includes(item.id)));
      setSelectedRowKeys([]);
      message.success('批量删除成功');
      setLoading(false);
    }, 150);
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出功能开发中');
  };

  // 渲染搜索表单
  const renderSearchForm = () => {
    if (!config || !config.searchConfig || config.searchConfig.length === 0) {
      return null;
    }

    return (
      <Form
        layout="inline"
        initialValues={searchValues}
        onFinish={handleSearch}
        style={{ marginBottom: 16 }}
      >
        {config.searchConfig.map(item => {
          switch (item.type) {
            case 'input':
              return (
                <Form.Item key={item.key} name={item.key} label={item.label}>
                  <Input placeholder={item.placeholder} />
                </Form.Item>
              );
            case 'select':
              return (
                <Form.Item key={item.key} name={item.key} label={item.label}>
                  <Select placeholder={item.placeholder}>
                    {item.options?.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              );
            case 'dateRange':
              return (
                <Form.Item key={item.key} name={item.key} label={item.label}>
                  <RangePicker placeholder={item.placeholder?.split(',') as [string, string]} />
                </Form.Item>
              );
            default:
              return null;
          }
        })}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

  // 渲染全局操作栏
  const renderActionBar = () => {
    if (!config || !config.actions) {
      return null;
    }

    const hasBatchActions = config.actions.batch && config.actions.batch.length > 0;
    const hasGlobalActions = config.actions.global && config.actions.global.length > 0;

    if (!hasBatchActions && !hasGlobalActions) {
      return (
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ margin: 0 }}>{config.pageMeta.title}</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>{config.pageMeta.description}</p>
        </div>
      );
    }

    return (
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>{config.pageMeta.title}</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>{config.pageMeta.description}</p>
        </div>
        <Space>
          {hasGlobalActions && config.actions.global.includes('create') && (
            <Button 
              type="primary"
              icon={<PlusOutlined />} 
              onClick={() => setCreateModalVisible(true)}
            >
              新增托运企业
            </Button>
          )}
          {hasBatchActions && config.actions.batch.includes('batchDelete') && (
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={handleBatchDelete}
              disabled={selectedRowKeys.length === 0}
            >
              批量删除
            </Button>
          )}
          {hasBatchActions && config.actions.batch.includes('export') && (
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出
            </Button>
          )}
        </Space>
      </div>
    );
  };

  // 渲染表格列
  const columns = useMemo(() => {
    if (!config) return [];

    return config.tableConfig.columns.map(column => {
      return mapColumn(
        column,
        config.tableConfig.dicts,
        config.actions.row,
        handleAction
      );
    });
  }, [config]);

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  // 渲染加载状态
  if (loading && !config) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>错误</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // 渲染空状态
  if (!config) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Empty description="配置文件未加载" />
      </div>
    );
  }

  return (
    <>
      <Card>
        {renderActionBar()}
        {renderSearchForm()}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={paginatedData}
          rowKey={config.tableConfig.rowKey}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            onChange: handlePaginationChange,
            total: filteredData.length,
            showSizeChanger: config.pagination.showSizeChanger,
            showTotal: config.pagination.showTotal ? (total: number) => `共 ${total} 条记录` : undefined,
          }}
          locale={{
            emptyText: <Empty description="暂无数据" />,
          }}
        />
      </Card>

      {/* 创建托运企业弹窗 */}
      {configPath === '/shipper-list.config.json' && (
        <>
          <ShipperCreateModal
            visible={createModalVisible}
            onCancel={() => setCreateModalVisible(false)}
            onSuccess={() => {
              setCreateModalVisible(false);
              message.success('创建成功，列表已刷新');
            }}
          />

          <ShipperEditModal
            visible={editModalVisible}
            record={currentRecord}
            onCancel={() => setEditModalVisible(false)}
            onSuccess={() => {
              setEditModalVisible(false);
              message.success('编辑成功，列表已刷新');
            }}
          />

          <ShipperDetailModal
            visible={detailModalVisible}
            record={currentRecord}
            onCancel={() => setDetailModalVisible(false)}
            onEdit={() => {
              setDetailModalVisible(false);
              setEditModalVisible(true);
            }}
          />

          <ShipperDocumentsModal
            visible={documentsModalVisible}
            record={currentRecord}
            onCancel={() => setDocumentsModalVisible(false)}
          />
        </>
      )}

      {/* 批次计划管理弹窗 */}
      {configPath === '/batch-plan.config.json' && (
        <>
          <BatchPlanCreateModal
            visible={createModalVisible}
            onCancel={() => setCreateModalVisible(false)}
            onSuccess={() => {
              setCreateModalVisible(false);
              message.success('批次计划创建成功');
            }}
          />

          <BatchPlanEditModal
            visible={editModalVisible}
            record={currentRecord}
            onCancel={() => setEditModalVisible(false)}
            onSuccess={() => {
              setEditModalVisible(false);
              message.success('批次计划更新成功');
            }}
          />

          <BatchPlanDetailModal
            visible={detailModalVisible}
            record={currentRecord}
            onCancel={() => setDetailModalVisible(false)}
            onEdit={() => {
              setDetailModalVisible(false);
              setEditModalVisible(true);
            }}
          />

          <BatchPlanCancelModal
            visible={cancelModalVisible}
            record={currentRecord}
            onCancel={() => setCancelModalVisible(false)}
            onConfirm={() => {
              setCancelModalVisible(false);
              message.success('计划已取消');
            }}
          />
        </>
      )}

      {/* 应急专家库弹窗 */}
      {configPath === '/expert.config.json' && (
        <>
          <ExpertCreateModal
            visible={createModalVisible}
            onCancel={() => setCreateModalVisible(false)}
            onSuccess={() => {
              setCreateModalVisible(false);
              message.success('专家创建成功');
            }}
          />

          <ExpertEditModal
            visible={editModalVisible}
            record={currentRecord}
            onCancel={() => setEditModalVisible(false)}
            onSuccess={() => {
              setEditModalVisible(false);
              message.success('专家信息更新成功');
            }}
          />

          <ExpertDeleteModal
            visible={deleteModalVisible}
            record={currentRecord}
            onCancel={() => setDeleteModalVisible(false)}
            onConfirm={() => {
              setDeleteModalVisible(false);
              message.success('专家已删除');
            }}
          />
        </>
      )}
    </>
  );
};

export default GenericListPage;