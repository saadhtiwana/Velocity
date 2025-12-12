import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-red-50/20"></div>

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Spinner Container */}
        <div className="relative w-20 h-20 mb-8">
          {/* Outer Ring - Spinning */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: '4px solid transparent',
              borderTopColor: '#DC2626',
              borderRightColor: '#DC2626',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Inner Ring - Counter Spinning */}
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{
              border: '3px solid transparent',
              borderBottomColor: '#FCA5A5',
              borderLeftColor: '#FCA5A5',
            }}
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Center Dot */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              className="w-2 h-2 bg-red-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>

        {/* Loading Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <motion.p
            className="text-sm text-gray-500 font-medium"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Loading your experience...
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
