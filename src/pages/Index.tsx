import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import DishCard from '@/components/DishCard';
import CartDrawer from '@/components/CartDrawer';
import { Dish, CartItem } from '@/types/restaurant';
import { useToast } from '@/hooks/use-toast';

const MOCK_DISHES: Dish[] = [
  {
    id: '1',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan, croutons and Caesar dressing',
    price: 12.99,
    oldPrice: 15.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop',
    category: 'Salads'
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with tomato, mozzarella and fresh basil',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
    category: 'Main Courses'
  },
  {
    id: '3',
    name: 'Grilled Salmon',
    description: 'Premium salmon fillet with vegetables and lemon butter sauce',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop',
    category: 'Main Courses'
  },
  {
    id: '4',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center and vanilla ice cream',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=400&fit=crop',
    category: 'Desserts'
  },
  {
    id: '5',
    name: 'Greek Salad',
    description: 'Tomatoes, cucumbers, olives, feta cheese with olive oil',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
    category: 'Salads'
  },
  {
    id: '6',
    name: 'Beef Burger',
    description: 'Juicy beef patty with cheese, lettuce, tomato and special sauce',
    price: 16.99,
    oldPrice: 19.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    category: 'Main Courses'
  }
];

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { toast } = useToast();

  const categories = ['All', ...Array.from(new Set(MOCK_DISHES.map(d => d.category)))];

  const filteredDishes = selectedCategory === 'All' 
    ? MOCK_DISHES 
    : MOCK_DISHES.filter(d => d.category === selectedCategory);

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

  const handleCheckout = () => {
    setIsCartOpen(false);
    toast({
      title: 'Checkout',
      description: 'Redirecting to payment...',
    });
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredDishes.map(dish => (
            <DishCard 
              key={dish.id} 
              dish={dish} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
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