
const SkeletonLoader = () => {
  return (
    <div className="profile-page">
      {/* Back Button Skeleton */}
      <div className="py-5 flex items-center space-x-2 animate-pulse">
        <div className="w-4 h-4 bg-gray-300 rounded" />
        <div className="w-20 h-4 bg-gray-300 rounded" />
      </div>

      {/* Profile Box Skeleton */}
      <div className="profile-container">
        <div className="flex flex-col justify-between items-center space-y-2 animate-pulse">
          <div className="profile-image-container">
            <div className="w-24 h-24 rounded-full bg-gray-300" />
          </div>
          <div className="w-48 h-6 bg-gray-300 rounded" />
        </div>

        <div className="profile-content-section space-y-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
          ))}
        </div>

        <hr className='text-gray-300 my-6' />

        {/* Last Marked and Critical */}
        <div className="last-marked-plus-isCritical space-y-2 animate-pulse">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-gray-300 rounded mr-2" />
            <div className="w-40 h-4 bg-gray-300 rounded" />
          </div>
          <div className="w-32 h-4 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Subject Table Heading Skeleton */}
      <div className="student-subjects mt-10 animate-pulse">
        <div className="w-2/3 h-5 bg-gray-300 rounded mb-4" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </div>

      {/* Calendar Skeleton */}
      <div className="student-calendar mt-10 animate-pulse">
        <div className="w-1/2 h-5 bg-gray-300 rounded mb-4" />
        <div className="grid grid-cols-7 gap-2">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
