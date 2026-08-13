import { X, AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, noteTitle, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-sidebar/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl animate-fade-in">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <AlertTriangle size={32} />
        </div>
        <h3 className="mb-2 text-xl font-bold text-sidebar">Delete Note?</h3>
        <p className="mb-8 text-sm text-slate-500">
          Are you sure you want to delete <span className="font-bold text-sidebar">"{noteTitle}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-500 py-3 font-bold text-white hover:bg-red-600 shadow-lg shadow-red-200 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;