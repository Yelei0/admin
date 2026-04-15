import React, { useState } from 'react';
import { Card, Descriptions, Tabs, Button, message, Upload, List, Tag, Space, Modal } from 'antd';
import { UploadOutlined, DownloadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
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

const ShipperDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  
  // 模拟企业基本信息数据
  const shipperData = {
    id: id || 'SHP20240101001',
    companyName: '山东危化品运输有限公司',
    creditCode: '91370100MA3C5L8X3C',
    address: '山东省济南市高新区经十路123号',
    contactName: '张经理',
    contactPhone: '13800138001',
    accountStatus: 'enabled',
    createTime: '2024-01-01 10:00:00',
    creator: 'admin',
  };

  // 模拟资料附件数据
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
    return false; // 阻止默认上传行为
  };

  const handleDelete = (docId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该资料吗？删除后无法恢复。',
      onOk: () => {
        setDocuments(prev => prev.filter(doc => doc.id !== docId));
        message.success('删除成功');
      },
    });
  };

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
    <Card
      title="托运企业详情"
      extra={
        <Space>
          <Button onClick={() => navigate(`/shippers/edit/${id}`)}>编辑</Button>
          <Button onClick={() => navigate('/shippers')}>返回列表</Button>
        </Space>
      }
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="基本信息" key="basic">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="企业名称">{shipperData.companyName}</Descriptions.Item>
            <Descriptions.Item label="统一社会信用代码">{shipperData.creditCode}</Descriptions.Item>
            <Descriptions.Item label="企业地址">{shipperData.address}</Descriptions.Item>
            <Descriptions.Item label="联系人姓名">{shipperData.contactName}</Descriptions.Item>
            <Descriptions.Item label="联系人手机号">{shipperData.contactPhone}</Descriptions.Item>
            <Descriptions.Item label="账号状态">
              <Tag color={shipperData.accountStatus === 'enabled' ? 'green' : 'red'}>
                {shipperData.accountStatus === 'enabled' ? '启用' : '禁用'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{shipperData.createTime}</Descriptions.Item>
            <Descriptions.Item label="创建人">{shipperData.creator}</Descriptions.Item>
          </Descriptions>
        </TabPane>

        <TabPane tab="资料附件" key="documents">
          {groupedDocuments.map(group => (
            <Card
              key={group.key}
              type="inner"
              title={group.label}
              style={{ marginBottom: 16 }}
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
    </Card>
  );
};

export default ShipperDetail;
