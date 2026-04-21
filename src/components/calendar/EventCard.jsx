import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export default function EventCard({ event, style }) {
  const handleClick = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('openEventModal', { detail: { event } }));
  };

  // Main Card Draggable (Move)
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `event-${event.id}`,
    data: { event }
  });

  // Top Resize Handle
  const topResize = useDraggable({
    id: `resize-top-${event.id}`,
    data: { event }
  });

  // Bottom Resize Handle
  const bottomResize = useDraggable({
    id: `resize-btm-${event.id}`,
    data: { event }
  });

  let adjustedStyle = { ...style };
  
  if (transform) {
    adjustedStyle.transform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
    adjustedStyle.zIndex = 50;
    adjustedStyle.opacity = 0.8;
  }
  
  // When resizing, we don't want to visually move the whole card right away, 
  // but it's simpler to either let it move temporarily or calculate the height.
  // Actually, dnd-kit `transform` on the handles doesn't bubble if we don't apply it to the main card.
  // The state will snap correctly onDragEnd.

  return (
    <div
      ref={setNodeRef}
      onDoubleClick={handleClick}
      className={`absolute rounded border shadow-sm px-1.5 py-0.5 text-xs overflow-hidden transition-colors ${transform ? 'cursor-grabbing' : 'cursor-pointer'}`}
      style={{
        ...adjustedStyle,
        backgroundColor: event.color || '#1a73e8',
        color: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        position: 'absolute'
      }}
    >
      {/* Top resize handle */}
      <div 
        ref={topResize.setNodeRef}
        {...topResize.listeners}
        {...topResize.attributes}
        className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize z-10 hover:bg-white/30"
        onDoubleClick={(e) => e.stopPropagation()}
      />

      {/* Draggable body */}
      <div 
        {...listeners} 
        {...attributes} 
        className="h-full w-full"
      >
        <div className="font-semibold truncate pointer-events-none">{event.title || '(No title)'}</div>
        <div className="truncate text-[10px] opacity-90 pointer-events-none">
          {new Date(event.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          &nbsp;-&nbsp;
          {new Date(event.end).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </div>
      </div>

      {/* Bottom resize handle */}
      <div 
        ref={bottomResize.setNodeRef}
        {...bottomResize.listeners}
        {...bottomResize.attributes}
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize z-10 hover:bg-white/30"
        onDoubleClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
