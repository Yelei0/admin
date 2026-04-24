import React from 'react';
import { Card } from 'antd';

const CarrierPage: React.FC = () => {
  return (
    <Card
      title="承运商端"
      style={{
        height: 'calc(100vh - 48px)',
        margin: '-24px',
        borderRadius: 0
      }}
      styles={{
        body: {
          padding: 0,
          height: 'calc(100% - 56px)'
        }
      }}
    >
      <iframe
        src="https://rp.mockplus.cn/rps/le-wZox8C8o/uSKVs1GXS?"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="承运商端"
        allow="fullscreen"
      />
    </Card>
  );
};

export default CarrierPage;