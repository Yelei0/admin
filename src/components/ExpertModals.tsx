import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

// 专业领域选项
const fieldOptions = [
  { label: '化学品运输', value: 'chemical_transport' },
  { label: '腐蚀品处理', value: 'corrosive' },
  { label: '气体泄漏处置', value: 'gas_leak' },
  { label: '火灾应急', value: 'fire' },
  { label: '环境保护', value: 'environment' },
  { label: '医疗急救', value: 'medical' },
];

// 创建专家弹窗
interface CreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ExpertCreateModal: React.FC<CreateModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 手机号校验规则
  const validatePhone = (_: any, value: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!value) {
      return Promise.reject(new Error('请输入手机号'));
    }
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error('请输入正确的11位手机号'));
    }
    return Promise.resolve();
  };

  // 身份证号校验规则
  const validateIdCard = (_: any, value: string) => {
    const idCardRegex = /^\d{17}[\dXx]$/;
    if (!value) {
      return Promise.reject(new Error('请输入身份证号'));
    }
    if (!idCardRegex.test(value)) {
      return Promise.reject(new Error('请输入正确的18位身份证号'));
    }
    return Promise.resolve();
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      // 模拟提交
      setTimeout(() => {
        setLoading(false);
        message.success('专家创建成功');
        form.resetFields();
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
      title="新增应急专家"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="提交"
      cancelText="取消"
      styles={{ body: { maxHeight: 'calc(90vh - 110px)', overflow: 'auto', paddingRight: '8px' } }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder="请输入专家姓名" />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="phone"
          rules={[{ validator: validatePhone }]}
        >
          <Input placeholder="请输入11位手机号" maxLength={11} />
        </Form.Item>

        <Form.Item
          label="身份证号"
          name="idCard"
          rules={[{ validator: validateIdCard }]}
        >
          <Input placeholder="请输入18位身份证号" maxLength={18} />
        </Form.Item>

        <Form.Item
          label="专业领域"
          name="field"
          rules={[{ required: true, message: '请选择专业领域' }]}
        >
          <Select placeholder="请选择专业领域">
            {fieldOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="所在单位"
          name="company"
          rules={[{ required: true, message: '请输入所在单位' }]}
        >
          <Input placeholder="请输入所在单位" />
        </Form.Item>

        <Form.Item
          label="证书号"
          name="certificateNo"
          rules={[{ required: true, message: '请输入证书号' }]}
        >
          <Input placeholder="请输入证书号" />
        </Form.Item>

        <Form.Item
          label="备注"
          name="remark"
        >
          <TextArea rows={3} placeholder="请输入备注信息" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// 编辑专家弹窗
interface EditModalProps {
  visible: boolean;
  record: any;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ExpertEditModal: React.FC<EditModalProps> = ({ visible, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue(record);
    }
  }, [visible, record, form]);

  // 手机号校验规则
  const validatePhone = (_: any, value: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!value) {
      return Promise.reject(new Error('请输入手机号'));
    }
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error('请输入正确的11位手机号'));
    }
    return Promise.resolve();
  };

  // 身份证号校验规则
  const validateIdCard = (_: any, value: string) => {
    const idCardRegex = /^\d{17}[\dXx]$/;
    if (!value) {
      return Promise.reject(new Error('请输入身份证号'));
    }
    if (!idCardRegex.test(value)) {
      return Promise.reject(new Error('请输入正确的18位身份证号'));
    }
    return Promise.resolve();
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      // 模拟提交
      setTimeout(() => {
        setLoading(false);
        message.success('专家信息更新成功');
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
      title="编辑应急专家"
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
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder="请输入专家姓名" />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="phone"
          rules={[{ validator: validatePhone }]}
        >
          <Input placeholder="请输入11位手机号" maxLength={11} />
        </Form.Item>

        <Form.Item
          label="身份证号"
          name="idCard"
          rules={[{ validator: validateIdCard }]}
        >
          <Input placeholder="请输入18位身份证号" maxLength={18} />
        </Form.Item>

        <Form.Item
          label="专业领域"
          name="field"
          rules={[{ required: true, message: '请选择专业领域' }]}
        >
          <Select placeholder="请选择专业领域">
            {fieldOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="所在单位"
          name="company"
          rules={[{ required: true, message: '请输入所在单位' }]}
        >
          <Input placeholder="请输入所在单位" />
        </Form.Item>

        <Form.Item
          label="证书号"
          name="certificateNo"
          rules={[{ required: true, message: '请输入证书号' }]}
        >
          <Input placeholder="请输入证书号" />
        </Form.Item>

        <Form.Item
          label="备注"
          name="remark"
        >
          <TextArea rows={3} placeholder="请输入备注信息" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// 删除专家确认弹窗
interface DeleteModalProps {
  visible: boolean;
  record: any;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ExpertDeleteModal: React.FC<DeleteModalProps> = ({ visible, record, onCancel, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('专家已删除');
      onConfirm();
    }, 500);
  };

  return (
    <Modal
      title="删除专家"
      open={visible}
      onOk={handleConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="确认删除"
      cancelText="取消"
      okButtonProps={{ danger: true }}
    >
      <p>确定要删除专家 <strong>{record?.name}</strong> 吗？</p>
      <p style={{ color: '#999' }}>删除后该专家将从列表中移除</p>
    </Modal>
  );
};
