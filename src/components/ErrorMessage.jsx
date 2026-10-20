export default function ErrorMessage({ message }) {
  return (
    <div className="text-center py-16 px-4">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-slate-600 dark:text-slate-300 font-medium">
        {message}
      </p>
    </div>
  );
}