import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, Select, message, Alert, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined, CopyOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

// 页面类型
const pageTypes = [
  { value: 'list', label: '列表页' },
];

// 搜索组件类型
const searchTypes = [
  { value: 'input', label: '输入框' },
  { value: 'select', label: '下拉选择' },
  { value: 'dateRange', label: '日期范围' },
];

// 列类型
const columnTypes = [
  { value: 'text', label: '文本' },
  { value: 'link', label: '链接' },
  { value: 'currency', label: '货币' },
  { value: 'datetime', label: '日期时间' },
  { value: 'tag', label: '标签' },
];

// 对齐方式
const alignOptions = [
  { value: 'left', label: '左对齐' },
  { value: 'center', label: '居中' },
  { value: 'right', label: '右对齐' },
];

// 固定方式
const fixedOptions = [
  { value: 'left', label: '左固定' },
  { value: 'right', label: '右固定' },
];

const { Option } = Select;

// 配置文件路径
const configFiles = [
  { value: '/order.config.json', label: '订单管理' },
  { value: '/user.config.json', label: '用户管理' },
  { value: '/product.config.json', label: '产品管理' },
];

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [jsonGenForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>('config');
  const [configData, setConfigData] = useState<string>('');
  const [selectedConfig, setSelectedConfig] = useState<string>('/order.config.json');
  const [loading, setLoading] = useState<boolean>(false);
  
  // JSON 生成器状态
  const [searchFields, setSearchFields] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [mockData, setMockData] = useState<any[]>([]);
  const [dicts, setDicts] = useState<any[]>([]);
  const [generatedJson, setGeneratedJson] = useState<string>('');

  // 加载配置文件
  const loadConfig = async () => {
    try {
      setLoading(true);
      let configModule;
      switch (selectedConfig) {
        case '/order.config.json':
          configModule = await import('../mock/order.config.json');
          break;
        case '/user.config.json':
          configModule = await import('../mock/user.config.json');
          break;
        case '/product.config.json':
          configModule = await import('../mock/product.config.json');
          break;
        default:
          throw new Error(`未知的配置路径: ${selectedConfig}`);
      }
      const config = configModule.default;
      setConfigData(JSON.stringify(config, null, 2));
      form.setFieldsValue({ config: JSON.stringify(config, null, 2) });
    } catch (error) {
      console.error('加载配置失败:', error);
      message.error('加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadConfig();
  }, [selectedConfig]);

  // 处理配置文件变更
  const handleConfigChange = (value: string) => {
    setSelectedConfig(value);
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      // 验证 JSON 格式
      JSON.parse(values.config);
      // 这里应该是保存配置的逻辑，但由于是前端环境，我们只能提示用户手动修改文件
      message.success('配置验证成功！请手动修改对应的 JSON 文件');
    } catch (error) {
      console.error('JSON 格式错误:', error);
      message.error('JSON 格式错误，请检查配置内容');
    } finally {
      setLoading(false);
    }
  };

  // JSON 生成器函数
  // 初始化默认值
  React.useEffect(() => {
    jsonGenForm.setFieldsValue({
      pageType: 'list',
      pageTitle: '新页面',
      pageDescription: '新页面描述',
      rowKey: 'id',
      defaultPageSize: 10,
      showSizeChanger: true,
      showTotal: true,
    });
  }, []);

  // 添加搜索字段
  const addSearchField = () => {
    setSearchFields([...searchFields, {
      key: `search_${Date.now()}`,
      label: `搜索字段${searchFields.length + 1}`,
      type: 'input',
      placeholder: '请输入',
      options: [],
    }]);
  };

  // 删除搜索字段
  const removeSearchField = (index: number) => {
    const newFields = [...searchFields];
    newFields.splice(index, 1);
    setSearchFields(newFields);
  };

  // 更新搜索字段
  const updateSearchField = (index: number, field: string, value: any) => {
    const newFields = [...searchFields];
    newFields[index][field] = value;
    setSearchFields(newFields);
  };

  // 添加下拉选项
  const addSelectOption = (index: number) => {
    const newFields = [...searchFields];
    if (!newFields[index].options) {
      newFields[index].options = [];
    }
    newFields[index].options.push({
      label: `选项${newFields[index].options.length + 1}`,
      value: `value${newFields[index].options.length + 1}`,
    });
    setSearchFields(newFields);
  };

  // 删除下拉选项
  const removeSelectOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...searchFields];
    newFields[fieldIndex].options.splice(optionIndex, 1);
    setSearchFields(newFields);
  };

  // 更新下拉选项
  const updateSelectOption = (fieldIndex: number, optionIndex: number, field: string, value: any) => {
    const newFields = [...searchFields];
    newFields[fieldIndex].options[optionIndex][field] = value;
    setSearchFields(newFields);
  };

  // 添加表格列
  const addTableColumn = () => {
    setTableColumns([...tableColumns, {
      key: `column_${Date.now()}`,
      title: `字段${tableColumns.length + 1}`,
      type: 'text',
      width: 120,
      align: 'left',
      fixed: undefined,
      ellipsis: false,
      dictKey: undefined,
    }]);
  };

  // 删除表格列
  const removeTableColumn = (index: number) => {
    const newColumns = [...tableColumns];
    newColumns.splice(index, 1);
    setTableColumns(newColumns);
  };

  // 更新表格列
  const updateTableColumn = (index: number, field: string, value: any) => {
    const newColumns = [...tableColumns];
    newColumns[index][field] = value;
    setTableColumns(newColumns);
  };

  // 添加字典
  const addDict = () => {
    setDicts([...dicts, {
      key: `dict_${Date.now()}`,
      name: `字典${dicts.length + 1}`,
      items: [],
    }]);
  };

  // 删除字典
  const removeDict = (index: number) => {
    const newDicts = [...dicts];
    newDicts.splice(index, 1);
    setDicts(newDicts);
  };

  // 添加字典项
  const addDictItem = (dictIndex: number) => {
    const newDicts = [...dicts];
    if (!newDicts[dictIndex].items) {
      newDicts[dictIndex].items = [];
    }
    newDicts[dictIndex].items.push({
      value: `value${newDicts[dictIndex].items.length + 1}`,
      label: `标签${newDicts[dictIndex].items.length + 1}`,
      color: 'blue',
    });
    setDicts(newDicts);
  };

  // 删除字典项
  const removeDictItem = (dictIndex: number, itemIndex: number) => {
    const newDicts = [...dicts];
    newDicts[dictIndex].items.splice(itemIndex, 1);
    setDicts(newDicts);
  };

  // 更新字典
  const updateDict = (index: number, field: string, value: any) => {
    const newDicts = [...dicts];
    newDicts[index][field] = value;
    setDicts(newDicts);
  };

  // 更新字典项
  const updateDictItem = (dictIndex: number, itemIndex: number, field: string, value: any) => {
    const newDicts = [...dicts];
    newDicts[dictIndex].items[itemIndex][field] = value;
    setDicts(newDicts);
  };

  // 添加模拟数据
  const addMockData = () => {
    const newData: any = {
      id: mockData.length + 1,
    };
    // 为每个表格列添加默认值
    tableColumns.forEach(column => {
      switch (column.type) {
        case 'text':
          newData[column.key] = `${column.title}${mockData.length + 1}`;
          break;
        case 'link':
          newData[column.key] = `https://example.com/${column.key}/${mockData.length + 1}`;
          break;
        case 'currency':
          newData[column.key] = (Math.random() * 1000).toFixed(2);
          break;
        case 'datetime':
          newData[column.key] = new Date().toISOString();
          break;
        case 'tag':
          if (column.dictKey) {
            const dict = dicts.find(d => d.name === column.dictKey);
            if (dict && dict.items && dict.items.length > 0) {
              newData[column.key] = dict.items[0].value;
            } else {
              newData[column.key] = 'default';
            }
          } else {
            newData[column.key] = 'default';
          }
          break;
        default:
          newData[column.key] = '';
      }
    });
    setMockData([...mockData, newData]);
  };

  // 删除模拟数据
  const removeMockData = (index: number) => {
    const newData = [...mockData];
    newData.splice(index, 1);
    setMockData(newData);
  };

  // 更新模拟数据
  const updateMockData = (index: number, field: string, value: any) => {
    const newData = [...mockData];
    newData[index][field] = value;
    setMockData(newData);
  };

  // 生成 JSON
  const generateJson = () => {
    jsonGenForm.validateFields().then(values => {
      try {
        // 构建搜索配置
        const searchConfig = searchFields.map(field => {
          const config: any = {
            key: field.key,
            label: field.label,
            type: field.type,
          };
          if (field.placeholder) {
            config.placeholder = field.placeholder;
          }
          if (field.type === 'select' && field.options && field.options.length > 0) {
            config.options = field.options;
          }
          return config;
        });

        // 构建表格列配置
        const columns = tableColumns.map(column => {
          const config: any = {
            key: column.key,
            title: column.title,
            type: column.type,
          };
          if (column.width) {
            config.width = column.width;
          }
          if (column.fixed) {
            config.fixed = column.fixed;
          }
          if (column.align) {
            config.align = column.align;
          }
          if (column.ellipsis) {
            config.ellipsis = column.ellipsis;
          }
          if (column.dictKey) {
            config.dictKey = column.dictKey;
          }
          return config;
        });

        // 构建字典配置
        const dictConfig: any = {};
        dicts.forEach(dict => {
          dictConfig[dict.name] = {};
          dict.items?.forEach((item: any) => {
            dictConfig[dict.name][item.value] = {
              label: item.label,
              color: item.color,
            };
          });
        });

        // 构建完整配置
        const config = {
          pageMeta: {
            title: values.pageTitle,
            description: values.pageDescription,
          },
          searchConfig,
          tableConfig: {
            rowKey: values.rowKey,
            columns,
            dicts: dictConfig,
          },
          mockData,
          actions: {
            row: ['detail', 'edit', 'delete'],
            batch: ['batchDelete', 'export'],
          },
          pagination: {
            defaultPageSize: values.defaultPageSize,
            showSizeChanger: values.showSizeChanger,
            showTotal: values.showTotal,
          },
        };

        // 生成 JSON 字符串
        const jsonString = JSON.stringify(config, null, 2);
        setGeneratedJson(jsonString);
        message.success('JSON 生成成功！');
      } catch (error) {
        console.error('生成 JSON 失败:', error);
        message.error('生成 JSON 失败');
      }
    });
  };

  // 复制 JSON
  const copyJson = () => {
    if (generatedJson) {
      navigator.clipboard.writeText(generatedJson).then(() => {
        message.success('JSON 已复制到剪贴板！');
      });
    } else {
      message.warning('请先生成 JSON');
    }
  };

  // 加载现有配置
  const loadExistingConfig = async () => {
    try {
      const values = await jsonGenForm.getFieldsValue();
      const configPath = values.existingConfig;
      if (!configPath) {
        message.warning('请选择一个现有配置');
        return;
      }

      setLoading(true);
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
        default:
          throw new Error(`未知的配置路径: ${configPath}`);
      }

      const config = configModule.default;

      // 更新基本信息
      jsonGenForm.setFieldsValue({
        pageTitle: config.pageMeta?.title || '新页面',
        pageDescription: config.pageMeta?.description || '新页面描述',
        rowKey: config.tableConfig?.rowKey || 'id',
        defaultPageSize: config.pagination?.defaultPageSize || 10,
        showSizeChanger: config.pagination?.showSizeChanger !== false,
        showTotal: config.pagination?.showTotal !== false,
      });

      // 更新搜索字段
      if (config.searchConfig && Array.isArray(config.searchConfig)) {
        setSearchFields(config.searchConfig.map((field: any) => ({
          key: field.key,
          label: field.label,
          type: field.type,
          placeholder: field.placeholder,
          options: field.options || [],
        })));
      } else {
        setSearchFields([]);
      }

      // 更新表格列
      if (config.tableConfig?.columns && Array.isArray(config.tableConfig.columns)) {
        setTableColumns(config.tableConfig.columns.map((column: any) => ({
          key: column.key,
          title: column.title,
          type: column.type,
          width: column.width,
          align: column.align,
          fixed: column.fixed,
          ellipsis: column.ellipsis,
          dictKey: column.dictKey,
        })));
      } else {
        setTableColumns([]);
      }

      // 更新字典
      if (config.tableConfig?.dicts) {
        const dictArray = Object.entries(config.tableConfig.dicts).map(([name, items]: any) => ({
          key: `dict_${Date.now()}_${name}`,
          name,
          items: Object.entries(items).map(([value, item]: any) => ({
            value,
            label: item.label,
            color: item.color,
          })),
        }));
        setDicts(dictArray);
      } else {
        setDicts([]);
      }

      // 更新模拟数据
      if (config.mockData && Array.isArray(config.mockData)) {
        setMockData(config.mockData);
      } else {
        setMockData([]);
      }

      message.success('配置加载成功！');
    } catch (error) {
      console.error('加载现有配置失败:', error);
      message.error('加载现有配置失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="配置管理" style={{ marginTop: 16 }}>
      <Alert
        message="提示"
        description="由于是前端环境，修改配置后需要手动更新对应的 JSON 文件。此页面仅用于预览和验证配置格式。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="配置编辑" key="config">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="选择配置文件"
              name="configFile"
              initialValue={selectedConfig}
            >
              <Select onChange={handleConfigChange}>
                {configFiles.map(file => (
                  <Option key={file.value} value={file.value}>
                    {file.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="配置内容"
              name="config"
              rules={[{ required: true, message: '请输入配置内容' }]}
            >
              <Input.TextArea
                rows={20}
                value={configData}
                onChange={(e) => setConfigData(e.target.value)}
                placeholder="请输入 JSON 配置内容"
                style={{ fontFamily: 'monospace' }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                验证配置
              </Button>
              <Button 
                style={{ marginLeft: 8 }}
                onClick={loadConfig}
                loading={loading}
              >
                重置
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="JSON 生成器" key="json-generator">
          <Form form={jsonGenForm} layout="vertical">
            {/* 基本信息 */}
            <Card title="基本信息" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="页面类型" name="pageType" rules={[{ required: true }]}>
                    <Select disabled>
                      {pageTypes.map(type => (
                        <Option key={type.value} value={type.value}>{type.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="加载现有配置" name="existingConfig">
                    <Select placeholder="选择一个现有配置作为基础">
                      <Option value="/order.config.json">订单管理</Option>
                      <Option value="/user.config.json">用户管理</Option>
                      <Option value="/product.config.json">产品管理</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="操作">
                    <Button type="primary" onClick={loadExistingConfig}>加载配置</Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="页面标题" name="pageTitle" rules={[{ required: true }]}>
                    <Input placeholder="请输入页面标题" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="页面描述" name="pageDescription">
                    <Input placeholder="请输入页面描述" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="行键" name="rowKey" rules={[{ required: true }]}>
                    <Input placeholder="请输入行键字段名" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="默认每页条数" name="defaultPageSize" rules={[{ required: true }]}>
                    <Input type="number" min={1} max={100} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="显示分页" name="showSizeChanger" valuePropName="checked">
                    <Select style={{ width: '100%' }}>
                      <Option value={true}>是</Option>
                      <Option value={false}>否</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="显示总数" name="showTotal" valuePropName="checked">
                    <Select style={{ width: '100%' }}>
                      <Option value={true}>是</Option>
                      <Option value={false}>否</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 搜索配置 */}
            <Card title="搜索配置" style={{ marginBottom: 16 }}>
              <Button type="dashed" onClick={addSearchField} icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
                添加搜索字段
              </Button>
              {searchFields.map((field, index) => (
                <Card key={field.key} type="inner" title={`搜索字段 ${index + 1}`} style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item label="字段名" required>
                        <Input value={field.key} onChange={(e) => updateSearchField(index, 'key', e.target.value)} placeholder="请输入字段名" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="标签" required>
                        <Input value={field.label} onChange={(e) => updateSearchField(index, 'label', e.target.value)} placeholder="请输入标签" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="类型" required>
                        <Select value={field.type} onChange={(value) => updateSearchField(index, 'type', value)}>
                          {searchTypes.map(type => (
                            <Option key={type.value} value={type.value}>{type.label}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="占位符">
                        <Input value={field.placeholder} onChange={(e) => updateSearchField(index, 'placeholder', e.target.value)} placeholder="请输入占位符" />
                      </Form.Item>
                    </Col>
                  </Row>
                  {field.type === 'select' && (
                    <div style={{ marginTop: 16 }}>
                      <Form.Item label="选项">
                        <Button type="dashed" onClick={() => addSelectOption(index)} icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
                          添加选项
                        </Button>
                        {field.options && field.options.map((option: any, optionIndex: number) => (
                          <Row key={optionIndex} gutter={16} style={{ marginBottom: 8 }}>
                            <Col span={10}>
                              <Input value={option.label} onChange={(e) => updateSelectOption(index, optionIndex, 'label', e.target.value)} placeholder="选项标签" />
                            </Col>
                            <Col span={10}>
                              <Input value={option.value} onChange={(e) => updateSelectOption(index, optionIndex, 'value', e.target.value)} placeholder="选项值" />
                            </Col>
                            <Col span={4}>
                              <Button danger icon={<MinusOutlined />} onClick={() => removeSelectOption(index, optionIndex)} />
                            </Col>
                          </Row>
                        ))}
                      </Form.Item>
                    </div>
                  )}
                  <Button danger icon={<MinusOutlined />} onClick={() => removeSearchField(index)}>
                    删除搜索字段
                  </Button>
                </Card>
              ))}
            </Card>

            {/* 字典配置 */}
            <Card title="字典配置" style={{ marginBottom: 16 }}>
              <Button type="dashed" onClick={addDict} icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
                添加字典
              </Button>
              {dicts.map((dict, index) => (
                <Card key={dict.key} type="inner" title={`字典 ${index + 1}`} style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="字典名称" required>
                        <Input value={dict.name} onChange={(e) => updateDict(index, 'name', e.target.value)} placeholder="请输入字典名称" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="字典项">
                    <Button type="dashed" onClick={() => addDictItem(index)} icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
                      添加字典项
                    </Button>
                    {dict.items && dict.items.map((item: any, itemIndex: number) => (
                      <Row key={itemIndex} gutter={16} style={{ marginBottom: 8 }}>
                        <Col span={6}>
                          <Input value={item.value} onChange={(e) => updateDictItem(index, itemIndex, 'value', e.target.value)} placeholder="值" />
                        </Col>
                        <Col span={6}>
                          <Input value={item.label} onChange={(e) => updateDictItem(index, itemIndex, 'label', e.target.value)} placeholder="标签" />
                        </Col>
                        <Col span={6}>
                          <Input value={item.color} onChange={(e) => updateDictItem(index, itemIndex, 'color', e.target.value)} placeholder="颜色" />
                        </Col>
                        <Col span={6}>
                          <Button danger icon={<MinusOutlined />} onClick={() => removeDictItem(index, itemIndex)} />
                        </Col>
                      </Row>
                    ))}
                  </Form.Item>
                  <Button danger icon={<MinusOutlined />} onClick={() => removeDict(index)}>
                    删除字典
                  </Button>
                </Card>
              ))}
            </Card>

            {/* 表格列配置 */}
            <Card title="表格列配置" style={{ marginBottom: 16 }}>
              <Button type="dashed" onClick={addTableColumn} icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
                添加表格列
              </Button>
              {tableColumns.map((column, index) => (
                <Card key={column.key} type="inner" title={`表格列 ${index + 1}`} style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item label="字段名" required>
                        <Input value={column.key} onChange={(e) => updateTableColumn(index, 'key', e.target.value)} placeholder="请输入字段名" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="标题" required>
                        <Input value={column.title} onChange={(e) => updateTableColumn(index, 'title', e.target.value)} placeholder="请输入标题" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="类型" required>
                        <Select value={column.type} onChange={(value) => updateTableColumn(index, 'type', value)}>
                          {columnTypes.map(type => (
                            <Option key={type.value} value={type.value}>{type.label}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="宽度">
                        <Input type="number" value={column.width} onChange={(e) => updateTableColumn(index, 'width', parseInt(e.target.value) || undefined)} placeholder="请输入宽度" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item label="对齐">
                        <Select value={column.align} onChange={(value) => updateTableColumn(index, 'align', value)}>
                          {alignOptions.map(option => (
                            <Option key={option.value} value={option.value}>{option.label}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="固定">
                        <Select value={column.fixed} onChange={(value) => updateTableColumn(index, 'fixed', value)} allowClear>
                          {fixedOptions.map(option => (
                            <Option key={option.value} value={option.value}>{option.label}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="省略">
                        <Select value={column.ellipsis} onChange={(value) => updateTableColumn(index, 'ellipsis', value)}>
                          <Option value={true}>是</Option>
                          <Option value={false}>否</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="字典">
                        <Select value={column.dictKey} onChange={(value) => updateTableColumn(index, 'dictKey', value)} allowClear>
                          {dicts.map(dict => (
                            <Option key={dict.name} value={dict.name}>{dict.name}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button danger icon={<MinusOutlined />} onClick={() => removeTableColumn(index)}>
                    删除表格列
                  </Button>
                </Card>
              ))}
            </Card>

            {/* 模拟数据 */}
            <Card title="模拟数据" style={{ marginBottom: 16 }}>
              <Button type="dashed" onClick={addMockData} icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
                添加模拟数据
              </Button>
              {mockData.length > 0 && (
                <table className="ant-table ant-table-default" style={{ width: '100%', marginBottom: 16 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>ID</th>
                      {tableColumns.map(column => (
                        <th key={column.key} style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
                          {column.title}
                        </th>
                      ))}
                      <th style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockData.map((data, index) => (
                      <tr key={data.id}>
                        <td style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>{data.id}</td>
                        {tableColumns.map(column => (
                          <td key={column.key} style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
                            <Input
                              value={data[column.key] || ''}
                              onChange={(e) => updateMockData(index, column.key, e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </td>
                        ))}
                        <td style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
                          <Button danger icon={<MinusOutlined />} onClick={() => removeMockData(index)}>
                            删除
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>

            {/* 生成 JSON */}
            <Form.Item>
              <Button type="primary" onClick={generateJson} style={{ marginRight: 8 }}>
                生成 JSON
              </Button>
              <Button icon={<CopyOutlined />} onClick={copyJson} disabled={!generatedJson}>
                复制 JSON
              </Button>
            </Form.Item>

            {/* JSON 输出 */}
            {generatedJson && (
              <Card title="生成的 JSON" style={{ marginTop: 16 }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
                  {generatedJson}
                </pre>
              </Card>
            )}
          </Form>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default SettingsPage;