import React from 'react';
import { Tag, Button, Space } from 'antd';
import type { TableColumnConfig, DictConfig } from '../types/list-config';

// 货币格式化函数
const formatCurrency = (value: any): string => {
  if (value === null || value === undefined) return '-';
  const num = parseFloat(value);
  if (isNaN(num)) return '-';
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// 日期时间格式化函数
const formatDateTime = (value: any): string => {
  if (value === null || value === undefined) return '-';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '-';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 标签渲染函数
const renderTag = (value: any, dictKey: string, dicts: DictConfig): React.ReactNode => {
  if (value === null || value === undefined) return '-';
  const dict = dicts[dictKey];
  if (!dict) return value;
  const dictItem = dict[value];
  if (!dictItem) return value;
  return (
    <Tag color={dictItem.color}>
      {dictItem.label}
    </Tag>
  );
};

// 操作按钮渲染函数
const renderActions = (record: any, rowActions: string[], onAction: (action: string, record: any) => void): React.ReactNode => {
  return (
    <Space size="small">
      {rowActions.map(action => {
        let buttonText = '';
        let buttonType: 'primary' | 'default' | 'dashed' | 'text' | 'link' = 'default';
        let danger = false;
        
        switch (action) {
          case 'detail':
            buttonText = '查看详情';
            buttonType = 'text';
            break;
          case 'edit':
            buttonText = '编辑';
            buttonType = 'text';
            break;
          case 'delete':
            buttonText = '删除';
            buttonType = 'text';
            danger = true;
            break;
          case 'toggleStatus':
            buttonText = record.accountStatus === 'enabled' ? '禁用' : '启用';
            buttonType = 'text';
            danger = record.accountStatus === 'enabled';
            break;
          case 'documents':
            buttonText = '资料管理';
            buttonType = 'text';
            break;
          default:
            buttonText = action;
        }
        
        return (
          <Button 
            key={action} 
            type={buttonType} 
            danger={danger}
            onClick={() => onAction(action, record)}
          >
            {buttonText}
          </Button>
        );
      })}
    </Space>
  );
};

// 列类型映射函数
export const mapColumn = (
  column: TableColumnConfig,
  dicts: DictConfig,
  rowActions: string[],
  onAction: (action: string, record: any) => void
): any => {
  const { key, title, type, width, fixed, align, ellipsis, dictKey } = column;
  
  // 基础列配置
  const baseColumn = {
    title,
    dataIndex: key,
    key,
    width,
    fixed,
    align,
    ellipsis
  };
  
  // 根据类型添加渲染逻辑
  switch (type) {
    case 'text':
      return {
        ...baseColumn,
        render: (text: any) => text || '-'
      };
    
    case 'link':
      return {
        ...baseColumn,
        render: (text: any) => {
          if (!text) return '-';
          return (
            <a href={text} target="_blank" rel="noopener noreferrer">
              {text}
            </a>
          );
        }
      };
    
    case 'currency':
      return {
        ...baseColumn,
        render: (text: any) => formatCurrency(text)
      };
    
    case 'datetime':
      return {
        ...baseColumn,
        render: (text: any) => formatDateTime(text)
      };
    
    case 'tag':
      return {
        ...baseColumn,
        render: (text: any) => renderTag(text, dictKey || '', dicts)
      };
    
    case 'actions':
      return {
        ...baseColumn,
        render: (_: any, record: any) => renderActions(record, rowActions, onAction)
      };
    
    default:
      return baseColumn;
  }
};

