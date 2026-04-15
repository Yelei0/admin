import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Modal } from 'antd';
import { ExclamationCircleOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

const ChangePasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 校验新密码
  const validateNewPassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入新密码'));
    }
    if (value.length < 6 || value.length > 20) {
      return Promise.reject(new Error('密码长度应为6-20位'));
    }
    return Promise.resolve();
  };

  // 校验确认密码
  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value) {
        return Promise.reject(new Error('请确认新密码'));
      }
      if (value !== getFieldValue('newPassword')) {
        return Promise.reject(new Error('两次输入的密码不一致'));
      }
      return Promise.resolve();
    },
  });

  // 提交修改密码
  const handleSubmit = async () => {
    try {
      await form.validateFields();
      
      // 二次确认
      confirm({
        title: '确认修改密码？',
        icon: <ExclamationCircleOutlined />,
        content: '修改成功后需要重新登录',
        onOk() {
          setLoading(true);
          
          // 模拟提交
          setTimeout(() => {
            setLoading(false);
            message.success('密码修改成功，请重新登录');
            
            // 清除登录态并跳转到登录页
            // 实际项目中这里应该清除 token、cookie 等登录凭证
            setTimeout(() => {
              navigate('/login');
            }, 1500);
          }, 1000);
        },
      });
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Card title="修改密码" style={{ maxWidth: 500 }}>
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 24 }}
      >
        <Form.Item
          label="原密码"
          name="oldPassword"
          rules={[{ required: true, message: '请输入原密码' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入原密码"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="新密码"
          name="newPassword"
          rules={[{ validator: validateNewPassword }]}
          extra="密码长度6-20位，建议包含字母和数字"
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入新密码（6-20位）"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="确认新密码"
          name="confirmPassword"
          rules={[validateConfirmPassword]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请再次输入新密码"
            size="large"
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 32 }}>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            size="large"
            block
          >
            确认修改
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            onClick={handleReset}
            size="large"
            block
          >
            重置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ChangePasswordPage;
