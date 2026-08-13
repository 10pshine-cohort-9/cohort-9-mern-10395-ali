const Alert = ({ message, type = 'error' }) => (
  <div className={`mb-6 animate-fade-in rounded-xl border p-4 text-sm font-medium ${
    type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
  }`}>
    {message}
  </div>
);
export default Alert;