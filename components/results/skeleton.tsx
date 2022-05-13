export default function ResultsSkeleton() {
  return (
    <div className="h-24 border-2 rounded-md mx-4 mt-4">
      <div className="flex animate-pulse flex-row items-center h-full justify-start space-x-5 px-4">
        <div className="w-16 bg-gray-300 h-16 rounded-full"></div>
        <div className="flex grow flex-col space-y-3">
          <div className="flex grow bg-gray-300 h-6 rounded-md"></div>
          <div className="flex grow mr-20 bg-gray-300 h-6 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
