import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Radio, message, Tabs, Card, Descriptions, Tag, Upload, List, Checkbox, Row, Col, Space } from 'antd';
import { UploadOutlined, DownloadOutlined, DeleteOutlined, EyeOutlined, FileZipOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { TabPane } = Tabs;

interface DocumentItem {
  id: string;
  type: string;
  typeName: string;
  fileName: string;
  fileSize: string;
  uploadTime: string;
  uploader: string;
  version: number;
}

// 创建托运企业弹窗
interface CreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ShipperCreateModal: React.FC<CreateModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdAccount, setCreatedAccount] = useState({ account: '', password: '' });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 模拟唯一性校验
      const mockExistingData = [
        { creditCode: '91370100MA3C5L8X3C', contactPhone: '13800138001' },
        { creditCode: '91320000MA1M9Y2B5E', contactPhone: '13800138002' },
      ];

      const existingCreditCode = mockExistingData.find(item => item.creditCode === values.creditCode);
      const existingPhone = mockExistingData.find(item => item.contactPhone === values.contactPhone);

      if (existingCreditCode) {
        message.error('该统一社会信用代码已存在');
        setLoading(false);
        return;
      }

      if (existingPhone) {
        message.error('该联系人手机号已存在');
        setLoading(false);
        return;
      }

      // 模拟提交延迟
      setTimeout(() => {
        const account = values.contactPhone;
        const password = '888888';
        
        setCreatedAccount({ account, password });
        setShowSuccessModal(true);
        setLoading(false);
        message.success('托运企业创建成功');
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleSuccessModalOk = () => {
    setShowSuccessModal(false);
    form.resetFields();
    onSuccess();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <>
      <Modal
        title="创建托运企业"
        open={visible && !showSuccessModal}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={600}
        okText="提交"
        cancelText="取消"
        styles={{ body: { maxHeight: 'calc(90vh - 110px)', overflow: 'auto', paddingRight: '8px' } }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ accountStatus: 'enabled' }}
        >
          <Form.Item
            label="企业名称"
            name="companyName"
            rules={[
              { required: true, message: '请输入企业名称' },
              { min: 2, message: '企业名称至少2个字符' },
              { max: 100, message: '企业名称最多100个字符' },
            ]}
          >
            <Input placeholder="请输入企业名称" />
          </Form.Item>

          <Form.Item
            label="统一社会信用代码"
            name="creditCode"
            rules={[
              { required: true, message: '请输入统一社会信用代码' },
              { pattern: /^[A-Z0-9]{18}$/, message: '请输入18位统一社会信用代码' },
            ]}
          >
            <Input placeholder="请输入18位统一社会信用代码" maxLength={18} />
          </Form.Item>

          <Form.Item
            label="联系人姓名"
            name="contactName"
            rules={[
              { required: true, message: '请输入联系人姓名' },
              { min: 2, message: '联系人姓名至少2个字符' },
              { max: 20, message: '联系人姓名最多20个字符' },
            ]}
          >
            <Input placeholder="请输入联系人姓名" />
          </Form.Item>

          <Form.Item
            label="联系人手机号"
            name="contactPhone"
            rules={[
              { required: true, message: '请输入联系人手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入11位手机号' },
            ]}
          >
            <Input placeholder="请输入11位手机号" maxLength={11} />
          </Form.Item>

          <Form.Item
            label="企业地址"
            name="address"
            rules={[{ max: 200, message: '企业地址最多200个字符' }]}
          >
            <Input.TextArea placeholder="请输入企业地址（选填）" rows={2} />
          </Form.Item>

          <Form.Item
            label="账号状态"
            name="accountStatus"
            rules={[{ required: true, message: '请选择账号状态' }]}
          >
            <Radio.Group>
              <Radio value="enabled">启用</Radio>
              <Radio value="disabled">禁用</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="初始密码">
            <Input value="888888" disabled />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="创建成功"
        open={showSuccessModal}
        onOk={handleSuccessModalOk}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>托运企业创建成功！</p>
        <p><strong>登录账号：</strong>{createdAccount.account}</p>
        <p><strong>初始密码：</strong>{createdAccount.password}</p>
        <p style={{ color: '#999', fontSize: '12px' }}>请运营人员线下告知企业登录信息</p>
      </Modal>
    </>
  );
};

// 编辑托运企业弹窗
interface EditModalProps {
  visible: boolean;
  record: any;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ShipperEditModal: React.FC<EditModalProps> = ({ visible, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        companyName: record.companyName,
        creditCode: record.creditCode,
        address: record.address,
        contactName: record.contactName,
        contactPhone: record.contactPhone,
      });
    }
  }, [visible, record, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 模拟手机号唯一性校验（排除当前企业）
      const mockExistingData = [
        { id: 'SHP20240101002', contactPhone: '13800138002' },
        { id: 'SHP20240101003', contactPhone: '13800138003' },
      ];

      const existingPhone = mockExistingData.find(
        item => item.contactPhone === values.contactPhone && item.id !== record?.id
      );

      if (existingPhone) {
        message.error('该联系人手机号已被其他企业使用');
        setLoading(false);
        return;
      }

      // 模拟提交延迟
      setTimeout(() => {
        setLoading(false);
        message.success('托运企业信息更新成功');
        onSuccess();
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="编辑托运企业"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="保存"
      cancelText="取消"
      styles={{ body: { maxHeight: 'calc(90vh - 110px)', overflow: 'auto', paddingRight: '8px' } }}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="企业名称" name="companyName">
          <Input disabled />
        </Form.Item>

        <Form.Item label="统一社会信用代码" name="creditCode">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="企业地址"
          name="address"
          rules={[{ max: 200, message: '企业地址最多200个字符' }]}
        >
          <Input.TextArea placeholder="请输入企业地址" rows={2} />
        </Form.Item>

        <Form.Item
          label="联系人姓名"
          name="contactName"
          rules={[
            { required: true, message: '请输入联系人姓名' },
            { min: 2, message: '联系人姓名至少2个字符' },
            { max: 20, message: '联系人姓名最多20个字符' },
          ]}
        >
          <Input placeholder="请输入联系人姓名" />
        </Form.Item>

        <Form.Item
          label="联系人手机号"
          name="contactPhone"
          rules={[
            { required: true, message: '请输入联系人手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入11位手机号' },
          ]}
        >
          <Input placeholder="请输入11位手机号" maxLength={11} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// 托运企业详情弹窗
interface DetailModalProps {
  visible: boolean;
  record: any;
  onCancel: () => void;
  onEdit: () => void;
}

export const ShipperDetailModal: React.FC<DetailModalProps> = ({ visible, record, onCancel, onEdit }) => {
  const [activeTab, setActiveTab] = useState('basic');

  // 模拟资料附件数据
  const documents: DocumentItem[] = [
    {
      id: 'DOC001',
      type: 'business_license',
      typeName: '营业执照',
      fileName: '营业执照_20240101.pdf',
      fileSize: '2.5MB',
      uploadTime: '2024-01-01 10:30:00',
      uploader: 'admin',
      version: 1,
    },
    {
      id: 'DOC002',
      type: 'hazardous_license',
      typeName: '危化品经营许可证',
      fileName: '危化品经营许可证_20240101.pdf',
      fileSize: '1.8MB',
      uploadTime: '2024-01-01 10:35:00',
      uploader: 'admin',
      version: 1,
    },
    {
      id: 'DOC003',
      type: 'emergency_plan',
      typeName: '应急处置方案',
      fileName: '应急处置方案_v2.pdf',
      fileSize: '3.2MB',
      uploadTime: '2024-01-15 14:20:00',
      uploader: 'admin',
      version: 2,
    },
  ];

  const documentTypes = [
    { key: 'special_approval', label: '一事一议审批表' },
    { key: 'traffic_assessment', label: '通行评估报告' },
    { key: 'emergency_plan', label: '应急处置方案' },
    { key: 'business_license', label: '营业执照' },
    { key: 'hazardous_license', label: '危化品经营许可证' },
    { key: 'other', label: '其他资料' },
  ];

  const handleDownload = (doc: DocumentItem) => {
    message.info(`正在下载 ${doc.fileName}...`);
  };

  const handleView = (doc: DocumentItem) => {
    message.info(`查看 ${doc.fileName}`);
  };

  // 按类型分组显示文档
  const groupedDocuments = documentTypes.map(type => ({
    ...type,
    docs: documents.filter(doc => doc.type === type.key),
  }));

  return (
    <Modal
      title="托运企业详情"
      open={visible}
      onCancel={onCancel}
      width={800}
      styles={{ body: { maxHeight: 'calc(90vh - 110px)', overflow: 'auto', paddingRight: '8px' } }}
      footer={[
        <Button key="edit" type="primary" onClick={onEdit}>
          编辑
        </Button>,
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
      ]}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="基本信息" key="basic">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="企业名称">{record?.companyName}</Descriptions.Item>
            <Descriptions.Item label="统一社会信用代码">{record?.creditCode}</Descriptions.Item>
            <Descriptions.Item label="企业地址">{record?.address}</Descriptions.Item>
            <Descriptions.Item label="联系人姓名">{record?.contactName}</Descriptions.Item>
            <Descriptions.Item label="联系人手机号">{record?.contactPhone}</Descriptions.Item>
            <Descriptions.Item label="账号状态">
              <Tag color={record?.accountStatus === 'enabled' ? 'green' : 'red'}>
                {record?.accountStatus === 'enabled' ? '启用' : '禁用'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{record?.createTime}</Descriptions.Item>
            <Descriptions.Item label="创建人">{record?.creator}</Descriptions.Item>
          </Descriptions>
        </TabPane>

        <TabPane tab="资料附件" key="documents">
          {groupedDocuments.map(group => (
            <Card
              key={group.key}
              type="inner"
              title={group.label}
              style={{ marginBottom: 16 }}
              size="small"
            >
              {group.docs.length > 0 ? (
                <List
                  dataSource={group.docs}
                  renderItem={doc => (
                    <List.Item
                      actions={[
                        <Button
                          key="view"
                          type="text"
                          icon={<EyeOutlined />}
                          onClick={() => handleView(doc)}
                        >
                          查看
                        </Button>,
                        <Button
                          key="download"
                          type="text"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownload(doc)}
                        >
                          下载
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <Space>
                            {doc.fileName}
                            <Tag color="blue">v{doc.version}</Tag>
                          </Space>
                        }
                        description={`大小: ${doc.fileSize} | 上传人: ${doc.uploader} | 上传时间: ${doc.uploadTime}`}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  暂无{group.label}
                </div>
              )}
            </Card>
          ))}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

// 资料管理弹窗
interface DocumentsModalProps {
  visible: boolean;
  record: any;
  onCancel: () => void;
}

export const ShipperDocumentsModal: React.FC<DocumentsModalProps> = ({ visible, record, onCancel }) => {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'DOC001',
      type: 'business_license',
      typeName: '营业执照',
      fileName: '营业执照_20240101.pdf',
      fileSize: '2.5MB',
      uploadTime: '2024-01-01 10:30:00',
      uploader: 'admin',
      version: 1,
    },
    {
      id: 'DOC002',
      type: 'hazardous_license',
      typeName: '危化品经营许可证',
      fileName: '危化品经营许可证_20240101.pdf',
      fileSize: '1.8MB',
      uploadTime: '2024-01-01 10:35:00',
      uploader: 'admin',
      version: 1,
    },
    {
      id: 'DOC003',
      type: 'emergency_plan',
      typeName: '应急处置方案',
      fileName: '应急处置方案_v2.pdf',
      fileSize: '3.2MB',
      uploadTime: '2024-01-15 14:20:00',
      uploader: 'admin',
      version: 2,
    },
    {
      id: 'DOC004',
      type: 'special_approval',
      typeName: '一事一议审批表',
      fileName: '一事一议审批表_20240201.pdf',
      fileSize: '1.5MB',
      uploadTime: '2024-02-01 09:00:00',
      uploader: 'admin',
      version: 1,
    },
  ]);

  const documentTypes = [
    { key: 'special_approval', label: '一事一议审批表' },
    { key: 'traffic_assessment', label: '通行评估报告' },
    { key: 'emergency_plan', label: '应急处置方案' },
    { key: 'business_license', label: '营业执照' },
    { key: 'hazardous_license', label: '危化品经营许可证' },
    { key: 'other', label: '其他资料' },
  ];

  const handleUpload = (file: UploadFile, type: string) => {
    const typeName = documentTypes.find(t => t.key === type)?.label || '其他资料';
    const newDoc: DocumentItem = {
      id: `DOC${Date.now()}`,
      type,
      typeName,
      fileName: file.name,
      fileSize: `${(file.size! / 1024 / 1024).toFixed(1)}MB`,
      uploadTime: new Date().toLocaleString(),
      uploader: 'admin',
      version: 1,
    };
    
    setDocuments(prev => [...prev, newDoc]);
    message.success(`${file.name} 上传成功`);
    return false;
  };

  const handleDelete = (docId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该资料吗？删除后无法恢复。',
      onOk: () => {
        setDocuments(prev => prev.filter(doc => doc.id !== docId));
        setSelectedDocs(prev => prev.filter(id => id !== docId));
        message.success('删除成功');
      },
    });
  };

  const handleBatchDelete = () => {
    if (selectedDocs.length === 0) {
      message.warning('请先选择要删除的资料');
      return;
    }
    
    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedDocs.length} 个资料吗？删除后无法恢复。`,
      onOk: () => {
        setDocuments(prev => prev.filter(doc => !selectedDocs.includes(doc.id)));
        setSelectedDocs([]);
        message.success('批量删除成功');
      },
    });
  };

  const handleDownload = (doc: DocumentItem) => {
    message.info(`正在下载 ${doc.fileName}...`);
  };

  const handleBatchDownload = () => {
    if (selectedDocs.length === 0) {
      message.warning('请先选择要下载的资料');
      return;
    }
    
    const selectedFiles = documents.filter(doc => selectedDocs.includes(doc.id));
    message.info(`正在打包下载 ${selectedFiles.length} 个文件...`);
    
    setTimeout(() => {
      message.success('打包下载完成');
    }, 1500);
  };

  const handleView = (doc: DocumentItem) => {
    message.info(`查看 ${doc.fileName}`);
  };

  const handleSelectChange = (docId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocs(prev => [...prev, docId]);
    } else {
      setSelectedDocs(prev => prev.filter(id => id !== docId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocs(documents.map(doc => doc.id));
    } else {
      setSelectedDocs([]);
    }
  };

  // 按类型分组显示文档
  const groupedDocuments = documentTypes.map(type => ({
    ...type,
    docs: documents.filter(doc => doc.type === type.key),
  }));

  return (
    <Modal
      title={`${record?.companyName || '企业'} - 资料管理`}
      open={visible}
      onCancel={onCancel}
      width={900}
      styles={{ body: { maxHeight: 'calc(90vh - 110px)', overflow: 'auto', paddingRight: '8px' } }}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
      ]}
    >
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Checkbox 
            checked={selectedDocs.length === documents.length && documents.length > 0}
            indeterminate={selectedDocs.length > 0 && selectedDocs.length < documents.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            全选 ({selectedDocs.length}/{documents.length})
          </Checkbox>
          <Space style={{ marginLeft: 16 }}>
            <Button 
              icon={<FileZipOutlined />} 
              onClick={handleBatchDownload}
              disabled={selectedDocs.length === 0}
              size="small"
            >
              批量下载{selectedDocs.length > 0 && ` (${selectedDocs.length})`}
            </Button>
            <Button 
              danger 
              onClick={handleBatchDelete}
              disabled={selectedDocs.length === 0}
              size="small"
            >
              批量删除{selectedDocs.length > 0 && ` (${selectedDocs.length})`}
            </Button>
          </Space>
        </Col>
      </Row>

      {groupedDocuments.map(group => (
        <Card
          key={group.key}
          type="inner"
          title={group.label}
          style={{ marginBottom: 16 }}
          size="small"
          extra={
            <Upload
              beforeUpload={(file) => handleUpload(file, group.key)}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} size="small">
                上传
              </Button>
            </Upload>
          }
        >
          {group.docs.length > 0 ? (
            <List
              dataSource={group.docs}
              renderItem={doc => (
                <List.Item
                  actions={[
                    <Button
                      key="view"
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handleView(doc)}
                    >
                      查看
                    </Button>,
                    <Button
                      key="download"
                      type="text"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(doc)}
                    >
                      下载
                    </Button>,
                    <Button
                      key="delete"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(doc.id)}
                    >
                      删除
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Checkbox
                        checked={selectedDocs.includes(doc.id)}
                        onChange={(e) => handleSelectChange(doc.id, e.target.checked)}
                      />
                    }
                    title={
                      <Space>
                        {doc.fileName}
                        <Tag color="blue">v{doc.version}</Tag>
                      </Space>
                    }
                    description={`大小: ${doc.fileSize} | 上传人: ${doc.uploader} | 上传时间: ${doc.uploadTime}`}
                  />
                </List.Item>
              )}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              暂无{group.label}
            </div>
          )}
        </Card>
      ))}
    </Modal>
  );
};
