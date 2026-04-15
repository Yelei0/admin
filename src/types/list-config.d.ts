// 搜索配置项类型
export interface SearchConfigItem {
  key: string;
  label: string;
  type: 'input' | 'select' | 'dateRange';
  placeholder?: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
}

// 表格列配置类型
export interface TableColumnConfig {
  key: string;
  title: string;
  type: 'text' | 'link' | 'currency' | 'datetime' | 'tag' | 'actions';
  width?: number;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
  dictKey?: string;
}

// 字典项类型
export interface DictItem {
  label: string;
  color: string;
  variant: 'filled' | 'outlined' | 'borderless';
}

// 字典配置类型
export interface DictConfig {
  [key: string]: {
    [value: string]: DictItem;
  };
}

// 表格配置类型
export interface TableConfig {
  rowKey: string;
  columns: TableColumnConfig[];
  dicts: DictConfig;
}

// 操作配置类型
export interface ActionsConfig {
  row: string[];
  batch: string[];
}

// 分页配置类型
export interface PaginationConfig {
  defaultPageSize: number;
  showSizeChanger: boolean;
  showTotal: boolean;
}

// 页面元数据类型
export interface PageMeta {
  title: string;
  description: string;
}

// 完整的配置文件类型
export interface ListConfig {
  pageMeta: PageMeta;
  searchConfig: SearchConfigItem[];
  tableConfig: TableConfig;
  mockData: any[];
  actions: ActionsConfig;
  pagination: PaginationConfig;
}

// 通用列表页面的 props 类型
export interface GenericListPageProps {
  configPath: string;
}