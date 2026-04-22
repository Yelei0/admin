import React, { useState } from 'react';
import { Card, Form, Input, Button, Radio, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

const ShipperCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdAccount, setCreatedAccount] = useState({ account: '', password: '' });

  const handleSubmit = async (values: any) => {
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
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);
    navigate('/shippers');
  };

  return (
    <Card title="创建托运企业" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
          <Input.TextArea placeholder="请输入企业地址（选填）" rows={3} />
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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate('/shippers')}>
            取消
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="创建成功"
        open={showSuccessModal}
        onOk={handleModalOk}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>托运企业创建成功！</p>
        <p><strong>登录账号：</strong>{createdAccount.account}</p>
        <p><strong>初始密码：</strong>{createdAccount.password}</p>
        <p style={{ color: '#999', fontSize: '12px' }}>请运营人员线下告知企业登录信息</p>
      </Modal>
    </Card>
  );
};

export default ShipperCreate;
