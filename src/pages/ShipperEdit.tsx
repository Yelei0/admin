import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

const ShipperEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // 模拟获取企业数据
  useEffect(() => {
    setInitialLoading(true);
    // 模拟API调用延迟
    setTimeout(() => {
      const mockData = {
        id: id || 'SHP20240101001',
        companyName: '山东危化品运输有限公司',
        creditCode: '91370100MA3C5L8X3C',
        address: '山东省济南市高新区经十路123号',
        contactName: '张经理',
        contactPhone: '13800138001',
      };
      
      form.setFieldsValue(mockData);
      setInitialLoading(false);
    }, 500);
  }, [id, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    
    // 模拟手机号唯一性校验（排除当前企业）
    const mockExistingData = [
      { id: 'SHP20240101002', contactPhone: '13800138002' },
      { id: 'SHP20240101003', contactPhone: '13800138003' },
    ];

    const existingPhone = mockExistingData.find(
      item => item.contactPhone === values.contactPhone && item.id !== id
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
      navigate(`/shippers/detail/${id}`);
    }, 1000);
  };

  return (
    <Card title="编辑托运企业" loading={initialLoading} style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
          rules={[{ max: 200, message: '企业地址最多200个字符' }]}
        >
          <Input.TextArea placeholder="请输入企业地址" rows={3} />
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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate(`/shippers/detail/${id}`)}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ShipperEdit;
