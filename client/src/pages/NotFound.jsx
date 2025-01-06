import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { BsBox2 } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-[200px] font-bold text-gray-100 select-none"
            >
              404
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <BsBox2 className="text-8xl text-[#ff9500]" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            Oops! Looks Like This Page is Out of Stock
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you're looking for seems to be missing from our inventory. 
            Why not browse our collection or head back to the homepage?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={() => navigate('/home')}
            className="bg-[#ff9500] hover:bg-[#ff7800] text-white gap-2 min-w-[200px]"
          >
            <HiOutlineShoppingBag className="text-xl" />
            Continue Shopping
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="gap-2 min-w-[200px] border-gray-300"
          >
            <FiSearch className="text-xl" />
            Search Products
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-500"
        >
          Error Code: 404 - Page Not Found
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
