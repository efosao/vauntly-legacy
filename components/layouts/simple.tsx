export function SimpleLayout({ children }): JSX.Element {
  return (
    <div className="bg-white m-auto h-screen w-10/12 rounded-lg">
      <div className="p-8 m-4">{children}</div>
    </div>
  );
}
