import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, DatePicker, InputNumber, message, Table, Tag, Timeline, Card, Descriptions } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

// 货物字典
const cargoOptions = [
  { label: '液氯', value: 'LC001' },
  { label: '硫酸', value: 'LS001' },
  { label: '液氨', value: 'LA001' },
  { label: '硝酸', value: 'XS001' },
  { label: '盐酸', value: 'YS001' },
  { label: '氢氧化钠', value: 'QOH001' },
];

// 时间段选项
const timeSlotOptions = [
  { label: '00:00-04:00', value: '00:00-04:00' },
  { label: '04:00-08:00', value: '04:00-08:00' },
  { label: '08:00-12:00', value: '08:00-12:00' },
  { label: '12:00-16:00', value: '12:00-16:00' },
  { label: '16:00-20:00', value: '16:00-20:00' },
  { label: '20:00-24:00', value: '20:00-24:00' },
];

// 模拟专家数据
const mockExperts = [
  { id: 'EXP001', name: '张安全', phone: '13800138001', field: '化学品运输' },
  { id: 'EXP002', name: '李防护', phone: '13800138002', field: '腐蚀品处理' },
  { id: 'EXP003', name: '王应急', phone: '13800138003', field: '气体泄漏处置' },
  { id: 'EXP004', name: '赵消防', phone: '13800138004', field: '火灾应急' },
  { id: 'EXP005', name: '孙环保', phone: '13800138005', field: '环境保护' },
  { id: 'EXP006', name: '周医疗', phone: '13800138006', field: '医疗急救' },
];

// 状态字典
const statusDict: Record<string, { label: string; color: string }> = {
  draft: { label: '草稿', color: 'default' },
  pending: { label: '待审批', color: 'orange' },
  approved: { label: '已通过', color: 'green' },
  rejected: { label: '已驳回', color: 'red' },
  executed: { label: '已执行', color: 'blue' },
  cancelled: { label: '已取消', color: 'gray' },
};

// 创建批次计划弹窗
interface CreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const BatchPlanCreateModal: React.FC<CreateModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 校验是否选择了专家
      if (!values.expertId) {
        message.error('请至少选择1名应急专家');
        return;
      }

      setLoading(true);

      // 模拟检查同一日期+时间段是否重复
      const mockExistingPlans = [
        { planDate: '2024-01-20', timeSlot: '08:00-12:00' },
      ];

      const isDuplicate = mockExistingPlans.some(
        plan => plan.planDate === values.planDate.format('YYYY-MM-DD') && plan.timeSlot === values.timeSlot
      );

      if (isDuplicate) {
        message.error('该日期和时间段已存在计划，不可重复提交');
        setLoading(false);
        return;
      }

      // 模拟提交
      setTimeout(() => {
        setLoading(false);
        message.success('批次计划创建成功');
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
      title="新增批次计划"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={700}
      okText="提交"
      cancelText="取消"
      styles={{ body: { maxHeight: 'calc(90vh - 110px)', overflow: 'auto', paddingRight: '8px' } }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="计划日期"
          name="planDate"
          rules={[{ required: true, message: '请选择计划日期' }]}
        >
          <DatePicker style={{ width: '100%' }} placeholder="请选择计划日期" />
        </Form.Item>

        <Form.Item
          label="时间段"
          name="timeSlot"
          rules={[{ required: true, message: '请选择时间段' }]}
        >
          <Select placeholder="请选择时间段">
            {timeSlotOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="车数"
          name="vehicleCount"
          rules={[{ required: true, message: '请输入车数' }]}
        >
          <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="请输入车数" />
        </Form.Item>

        <Form.Item
          label="货物名称"
          name="cargoCode"
          rules={[{ required: true, message: '请选择货物名称' }]}
        >
          <Select placeholder="请选择货物名称">
            {cargoOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="应急专家"
          name="expertId"
          rules={[{ required: true, message: '请选择应急专家' }]}
          extra="选择后将生成专家信息快照，后续专家库变更不影响该计划"
        >
          <Select placeholder="请选择应急专家">
            {mockExperts.map(expert => (
              <Option key={expert.id} value={expert.id}>
                {expert.name} - {expert.field} - {expert.phone}
              </Option>
            ))}
          </Select>
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

// 编辑批次计划弹窗
interface EditModalProps {
  visible: boolean;
  record: any;
  onCancel: () => void;
  onSuccess: () => void;
}

export const BatchPlanEditModal: React.FC<EditModalProps> = ({ visible, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        ...record,
        planDate: record.planDate ? dayjs(record.planDate) : null,
      });
    }
  }, [visible, record, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 校验是否选择了专家
      if (!values.expertId) {
        message.error('请至少选择1名应急专家');
        return;
      }

      setLoading(true);

      // 模拟提交
      setTimeout(() => {
        setLoading(false);
        message.success('批次计划更新成功');
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

  // 只有草稿或已驳回状态可编辑
  const canEdit = record?.status === 'draft' || record?.status === 'rejected';

  if (!canEdit && visible) {
    return (
      <Modal
        title="编辑批次计划"
        open={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>关闭</Button>
        ]}
      >
        <p>当前状态为{statusDict[record?.status]?.label || record?.status}，不可编辑</p>
        <p>只有草稿或已驳回状态的计划可以编辑</p>
      </Modal>
    );
  }

  return (
    <Modal
      title="编辑批次计划"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={700}
      okText="保存"
      cancelText="取消"
      styles={{ body: { maxHeight: 'calc(90vh - 110px)', overflow: 'auto', paddingRight: '8px' } }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="计划编号"
          name="planNo"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="计划日期"
          name="planDate"
          rules={[{ required: true, message: '请选择计划日期' }]}
        >
          <DatePicker style={{ width: '100%' }} placeholder="请选择计划日期" />
        </Form.Item>

        <Form.Item
          label="时间段"
          name="timeSlot"
          rules={[{ required: true, message: '请选择时间段' }]}
        >
          <Select placeholder="请选择时间段">
            {timeSlotOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="车数"
          name="vehicleCount"
          rules={[{ required: true, message: '请输入车数' }]}
        >
          <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="请输入车数" />
        </Form.Item>

        <Form.Item
          label="货物名称"
          name="cargoCode"
          rules={[{ required: true, message: '请选择货物名称' }]}
        >
          <Select placeholder="请选择货物名称">
            {cargoOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="应急专家"
          name="expertId"
          rules={[{ required: true, message: '请选择应急专家' }]}
          extra="选择后将生成专家信息快照，后续专家库变更不影响该计划"
        >
          <Select placeholder="请选择应急专家">
            {mockExperts.map(expert => (
              <Option key={expert.id} value={expert.id}>
                {expert.name} - {expert.field} - {expert.phone}
              </Option>
            ))}
          </Select>
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

// 批次计划详情弹窗
interface DetailModalProps {
  visible: boolean;
  record: any;
  onCancel: () => void;
  onEdit: () => void;
}

export const BatchPlanDetailModal: React.FC<DetailModalProps> = ({ visible, record, onCancel, onEdit }) => {
  if (!record) return null;

  // 关联承运计划表格列
  const carrierPlanColumns = [
    { title: '承运企业', dataIndex: 'carrierCompany', key: 'carrierCompany' },
    { title: '车牌号', dataIndex: 'plateNo', key: 'plateNo' },
    { title: '驾驶员', dataIndex: 'driver', key: 'driver' },
    { title: '执行状态', dataIndex: 'status', key: 'status', render: (status: string) => (
      <Tag color={status === 'completed' ? 'green' : status === 'in_progress' ? 'blue' : 'default'}>
        {status === 'completed' ? '已完成' : status === 'in_progress' ? '执行中' : '待执行'}
      </Tag>
    )},
  ];

  // 模拟关联承运计划数据
  const carrierPlanData = [
    { id: 'CP001', carrierCompany: '北京危化运输公司', plateNo: '京A12345', driver: '王师傅', status: 'completed' },
    { id: 'CP002', carrierCompany: '天津安全物流', plateNo: '津B67890', driver: '李师傅', status: 'in_progress' },
    { id: 'CP003', carrierCompany: '河北危运集团', plateNo: '冀C11111', driver: '张师傅', status: 'pending' },
  ];

  const canEdit = record?.status === 'draft' || record?.status === 'rejected';

  return (
    <Modal
      title="批次计划详情"
      open={visible}
      onCancel={onCancel}
      width={900}
      styles={{ body: { maxHeight: 'calc(90vh - 110px)', overflow: 'auto', paddingRight: '8px' } }}
      footer={[
        canEdit && (
          <Button key="edit" type="primary" onClick={onEdit}>
            编辑
          </Button>
        ),
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
      ]}
    >
      {/* 审批流转节点 */}
      <Card title="审批流转" style={{ marginBottom: 16 }}>
        <Timeline>
          {record.approvalFlow?.map((flow: any, index: number) => (
            <Timeline.Item key={index}>
              <p><strong>{flow.node}</strong> - {flow.operator} - {flow.time}</p>
              {flow.comment && <p style={{ color: '#666' }}>{flow.comment}</p>}
            </Timeline.Item>
          )) || <p>暂无审批记录</p>}
        </Timeline>
      </Card>

      {/* 计划基本信息 */}
      <Card title="计划信息" style={{ marginBottom: 16 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="计划编号">{record.planNo}</Descriptions.Item>
          <Descriptions.Item label="计划日期">{record.planDate}</Descriptions.Item>
          <Descriptions.Item label="时间段">{record.timeSlot}</Descriptions.Item>
          <Descriptions.Item label="车数">{record.vehicleCount}</Descriptions.Item>
          <Descriptions.Item label="货物名称">{record.cargoName}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusDict[record.status]?.color}>{statusDict[record.status]?.label}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="应急专家">{record.expertName}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{record.createTime}</Descriptions.Item>
        </Descriptions>
        {record.remark && (
          <Descriptions column={1} style={{ marginTop: 16 }}>
            <Descriptions.Item label="备注">{record.remark}</Descriptions.Item>
          </Descriptions>
        )}
        {record.approvalComment && (
          <Descriptions column={1} style={{ marginTop: 16 }}>
            <Descriptions.Item label="审批意见">{record.approvalComment}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      {/* 关联承运计划 */}
      <Card title="关联承运具体计划列表">
        <Table
          columns={carrierPlanColumns}
          dataSource={carrierPlanData}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </Modal>
  );
};

// 取消计划确认弹窗
interface CancelModalProps {
  visible: boolean;
  record: any;
  onCancel: () => void;
  onConfirm: () => void;
}

export const BatchPlanCancelModal: React.FC<CancelModalProps> = ({ visible, record, onCancel, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('计划已取消');
      onConfirm();
    }, 500);
  };

  return (
    <Modal
      title="取消计划"
      open={visible}
      onOk={handleConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="确认取消"
      cancelText="返回"
      okButtonProps={{ danger: true }}
    >
      <p>确定要取消计划 <strong>{record?.planNo}</strong> 吗？</p>
      <p style={{ color: '#999' }}>取消后计划状态将变更为"已取消"，不可恢复</p>
    </Modal>
  );
};
