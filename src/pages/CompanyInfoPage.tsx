import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Tabs, Upload, List, Tag, Modal } from 'antd';
import { UploadOutlined, EyeOutlined, DownloadOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { TabPane } = Tabs;
const { confirm } = Modal;

// 资料类型配置
const documentTypes = [
  { key: 'approval_form', name: '一事一议审批表', required: true },
  { key: 'assessment_report', name: '通行评估报告', required: true },
  { key: 'emergency_plan', name: '应急处置方案', required: true },
  { key: 'business_license', name: '营业执照', required: true },
  { key: 'hazard_license', name: '危化品经营许可证', required: true },
  { key: 'other', name: '其他资料', required: false },
];

// 模拟企业数据
const mockCompanyData = {
  companyName: '北京危化品运输有限公司',
  creditCode: '91110000123456789X',
  address: '北京市朝阳区化工路123号',
  contactName: '张三',
  contactPhone: '13800138000',
};

// 模拟资质资料数据
const mockDocuments: Record<string, UploadFile[]> = {
  approval_form: [
    { uid: '1', name: '一事一议审批表_20240101.pdf', status: 'done', size: 2048000, response: { url: '#' } },
  ],
  assessment_report: [
    { uid: '2', name: '通行评估报告_20240101.pdf', status: 'done', size: 3072000, response: { url: '#' } },
  ],
  emergency_plan: [
    { uid: '3', name: '应急处置方案_20240101.pdf', status: 'done', size: 1536000, response: { url: '#' } },
  ],
  business_license: [
    { uid: '4', name: '营业执照_20240101.pdf', status: 'done', size: 1024000, response: { url: '#' } },
  ],
  hazard_license: [
    { uid: '5', name: '危化品经营许可证_20240101.pdf', status: 'done', size: 2560000, response: { url: '#' } },
  ],
  other: [],
};

const CompanyInfoPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Record<string, UploadFile[]>>(mockDocuments);
  const [activeTab, setActiveTab] = useState('basic');

  // 初始化表单数据
  React.useEffect(() => {
    form.setFieldsValue(mockCompanyData);
  }, [form]);

  // 保存基本信息
  const handleSaveBasic = async () => {
    try {
      const values = await form.validateFields();
      
      // 检查手机号是否变更
      if (values.contactPhone !== mockCompanyData.contactPhone) {
        confirm({
          title: '确认修改手机号？',
          icon: <ExclamationCircleOutlined />,
          content: '手机号将作为登录账号，请确保唯一性',
          onOk() {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              message.success('基本信息保存成功');
            }, 1000);
          },
        });
      } else {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          message.success('基本信息保存成功');
        }, 1000);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 上传前校验
  const beforeUpload = (file: File) => {
    const isValidType = file.type === 'application/pdf' || 
                       file.type === 'image/jpeg' || 
                       file.type === 'image/png';
    const isValidSize = file.size / 1024 / 1024 <= 10;

    if (!isValidType) {
      message.error('只支持 PDF、JPG、PNG 格式文件');
      return false;
    }
    if (!isValidSize) {
      message.error('文件大小不能超过 10MB');
      return false;
    }
    return true;
  };

  // 上传状态变更
  const handleUploadChange = (docType: string, info: any) => {
    let fileList = [...info.fileList];
    
    // 限制每个类型只保留最新版本
    if (fileList.length > 1) {
      fileList = fileList.slice(-1);
    }
    
    setDocuments(prev => ({
      ...prev,
      [docType]: fileList,
    }));

    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  // 删除资料
  const handleDeleteDoc = (docType: string, file: UploadFile) => {
    confirm({
      title: '确认移除资料？',
      icon: <ExclamationCircleOutlined />,
      content: '已移除，不影响历史计划追溯',
      onOk() {
        setDocuments(prev => ({
          ...prev,
          [docType]: prev[docType].filter(item => item.uid !== file.uid),
        }));
        message.success('资料已移除');
      },
    });
  };

  // 渲染资料上传区域
  const renderDocumentUpload = (docType: string, docName: string, required: boolean) => {
    const fileList = documents[docType] || [];
    
    return (
      <Card 
        key={docType} 
        title={
          <span>
            {docName}
            {required && <Tag color="red" style={{ marginLeft: 8 }}>必填</Tag>}
          </span>
        } 
        style={{ marginBottom: 16 }}
      >
        <Upload
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={(info) => handleUploadChange(docType, info)}
          customRequest={({ onSuccess }) => {
            // 模拟上传
            setTimeout(() => {
              onSuccess?.({ url: '#' });
            }, 1000);
          }}
          showUploadList={{
            showRemoveIcon: true,
            removeIcon: (file) => (
              <DeleteOutlined 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDoc(docType, file as UploadFile);
                }}
                style={{ color: '#ff4d4f' }}
              />
            ),
          }}
        >
          <Button icon={<UploadOutlined />}>上传文件</Button>
        </Upload>
        
        {fileList.length > 0 && (
          <List
            size="small"
            style={{ marginTop: 16 }}
            dataSource={fileList}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button 
                    key="preview" 
                    type="link" 
                    icon={<EyeOutlined />}
                    onClick={() => message.info(`预览: ${item.name}`)}
                  >
                    预览
                  </Button>,
                  <Button 
                    key="download" 
                    type="link" 
                    icon={<DownloadOutlined />}
                    onClick={() => message.info(`下载: ${item.name}`)}
                  >
                    下载
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={`${(item.size! / 1024 / 1024).toFixed(2)} MB · ${new Date().toLocaleString()}`}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    );
  };

  return (
    <Card title="企业信息管理">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="基本信息" key="basic">
          <Form 
            form={form} 
            layout="vertical" 
            style={{ maxWidth: 600, marginTop: 24 }}
          >
            <Form.Item
              label="企业名称"
              name="companyName"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="统一社会信用代码"
              name="creditCode"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="企业地址"
              name="address"
              rules={[{ required: true, message: '请输入企业地址' }]}
            >
              <Input placeholder="请输入企业地址" />
            </Form.Item>

            <Form.Item
              label="联系人姓名"
              name="contactName"
              rules={[{ required: true, message: '请输入联系人姓名' }]}
            >
              <Input placeholder="请输入联系人姓名" />
            </Form.Item>

            <Form.Item
              label="联系人手机号"
              name="contactPhone"
              rules={[
                { required: true, message: '请输入联系人手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号' }
              ]}
              extra="将作为登录账号，请确保唯一"
            >
              <Input placeholder="请输入11位手机号" maxLength={11} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" onClick={handleSaveBasic} loading={loading}>
                保存
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="资质资料" key="documents">
          <div style={{ marginTop: 24 }}>
            {documentTypes.map(type => 
              renderDocumentUpload(type.key, type.name, type.required)
            )}
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default CompanyInfoPage;
