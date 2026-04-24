import React from 'react';
import { Card } from 'antd';

const DriverAppPersonVehicleBindingPage: React.FC = () => {
  return (
    <Card
      title="人车绑定"
      style={{
        height: 'calc(100vh - 48px)',
        margin: '-24px',
        borderRadius: 0
      }}
      styles={{
        body: {
          padding: 24,
          height: 'calc(100% - 56px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto'
        }
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <img 
          src="/admin/人车绑定.png" 
          alt="人车绑定" 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%',
            objectFit: 'contain'
          }} 
        />
      </div>
    </Card>
  );
};

export default DriverAppPersonVehicleBindingPage;