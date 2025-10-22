import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import DishCard from '@/components/DishCard';
import CartDrawer from '@/components/CartDrawer';
import { Dish, CartItem } from '@/types/restaurant';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';

const Index = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      setLoading(true);
      const data = await api.getMenu();
      setDishes(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load menu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(dishes.map(d => d.category)))];

  const filteredDishes = selectedCategory === 'All' 
    ? dishes 
    : dishes.filter(d => d.category === selectedCategory);

  const handleAddToCart = (dish: Dish) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === dish.id);
      if (existing) {
        return prev.map(item => 
          item.id === dish.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
    
    toast({
      title: 'Added to cart',
      description: `${dish.name} has been added to your cart`,
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => 
        prev.map(item => item.id === id ? { ...item, quantity } : item)
      );
    }
  };

  const handleCheckout = async () => {
    try {
      const orderData = {
        customerName: 'Guest User',
        customerPhone: '+1234567890',
        customerEmail: 'guest@restaurant.com',
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const result = await api.createOrder(orderData);
      
      setCartItems([]);
      setIsCartOpen(false);
      
      toast({
        title: 'Order placed!',
        description: `Order #${result.orderId} created successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create order',
        variant: 'destructive',
      });
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B6B] to-[#FFA94D] rounded-lg flex items-center justify-center">
              <Icon name="Utensils" size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FFA94D] bg-clip-text text-transparent">
              Restaurant Menu
            </h1>
          </div>
          
          <Button 
            variant="outline"
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <Icon name="ShoppingCart" size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF6B6B] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Our Menu</h2>
          <p className="text-gray-600">Choose from our delicious selection</p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B6B] data-[state=active]:to-[#FFA94D] data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredDishes.map(dish => (
              <DishCard 
                key={dish.id} 
                dish={dish} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      <CartDrawer 
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Index;