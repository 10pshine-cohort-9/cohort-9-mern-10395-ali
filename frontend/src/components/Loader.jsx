const Loader = () => (
  <div className="flex h-64 w-full items-center justify-center">
    <div 
      role="status"
      aria-label="Loading"
      className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-accent" 
    />
  </div>
);

export default Loader;