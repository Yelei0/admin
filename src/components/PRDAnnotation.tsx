import React, { useState, useRef, useEffect } from 'react';
import './PRDAnnotation.css';

interface AnnotationProps {
  id: number;
  title: string;
  content: React.ReactNode;
  position?: { top?: string; right?: string; bottom?: string; left?: string };
}

const PRDAnnotation: React.FC<AnnotationProps> = ({ id, title, content, position }) => {
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!dragging) setVisible(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(true);
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && tooltipRef.current) {
      e.stopPropagation();
      tooltipRef.current.style.left = `${e.clientX - offset.x}px`;
      tooltipRef.current.style.top = `${e.clientY - offset.y}px`;
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging]);

  return (
    <span
      className="prd-annotation-badge"
      style={position}
      onMouseEnter={handleMouseEnter}
    >
      {id}
      {visible && (
        <div
          ref={tooltipRef}
          className="prd-annotation-tooltip"
          onMouseDown={handleMouseDown}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="prd-annotation-header">
            <span className="prd-annotation-badge-small">{id}</span>
            <span className="prd-annotation-title">需求描述：{title}</span>
            <button
              className="prd-annotation-close"
              onClick={(e) => {
                e.stopPropagation();
                setVisible(false);
              }}
            >
              ×
            </button>
          </div>
          <div className="prd-annotation-content">
            {content}
          </div>
        </div>
      )}
    </span>
  );
};

export default PRDAnnotation;
