const ImportSummary = ({ results, onClose }) => (
  <div className="mb-6 flex items-center justify-between rounded-xl bg-accent/5 p-4 border border-accent/10 animate-fade-in">
    <p className="text-sm font-medium text-accent">
      Import complete: <span className="font-bold">{results.imported}</span> added, 
      <span className="font-bold ml-1">{results.skipped}</span> skipped.
    </p>
    <button onClick={onClose} className="text-xs font-bold uppercase text-accent hover:underline">Dismiss</button>
  </div>
);

export default ImportSummary;