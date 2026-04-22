import React, { useState } from 'react';
import { Card, Button, message, Upload, List, Tag, Space, Modal, Checkbox, Row, Col } from 'antd';
import { UploadOutlined, DownloadOutlined, DeleteOutlined, EyeOutlined, FileZipOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload/interface';

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

const ShipperDocuments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  console.log('Shipper ID:', id);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  
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
    
    // 模拟打包下载
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
    <Card
      title="资料管理"
      extra={
        <Space>
          <Button 
            icon={<FileZipOutlined />} 
            onClick={handleBatchDownload}
            disabled={selectedDocs.length === 0}
          >
            批量下载{selectedDocs.length > 0 && ` (${selectedDocs.length})`}
          </Button>
          <Button 
            danger 
            onClick={handleBatchDelete}
            disabled={selectedDocs.length === 0}
          >
            批量删除{selectedDocs.length > 0 && ` (${selectedDocs.length})`}
          </Button>
          <Button onClick={() => navigate('/shippers')}>返回列表</Button>
        </Space>
      }
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
        </Col>
      </Row>

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
    </Card>
  );
};

export default ShipperDocuments;
