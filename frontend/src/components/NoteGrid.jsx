import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import NoteCard from './NoteCard';
import EmptyState from './EmptyState';

const NoteGrid = ({ notes, onDelete }) => {
  const gridRef = useRef(null);

  useLayoutEffect(() => {
    if (notes.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from('.note-animate', {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }, gridRef);
      return () => ctx.revert();
    }
  }, [notes.length]);

  if (notes.length === 0) return <EmptyState />;

  return (
    <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <div key={note.id} className="note-animate">
          <NoteCard note={note} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
};

export default NoteGrid;