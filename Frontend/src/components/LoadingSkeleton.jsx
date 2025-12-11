import { motion } from 'framer-motion';

export const CarCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-soft overflow-hidden"
    >
      {/* Image Skeleton */}
      <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
      
      {/* Content Skeleton */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};

