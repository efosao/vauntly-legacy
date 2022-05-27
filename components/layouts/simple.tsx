export function SimpleLayout({ children, title }): JSX.Element {
  return (
    <div className="m-auto max-w-7xl">
      <div className="p-8 m-4">
        {title ? (
          <h1 className="text-4xl font-extrabold text-indigo-400">{title}</h1>
        ) : null}
        {children}
      </div>
    </div>
  );
}
