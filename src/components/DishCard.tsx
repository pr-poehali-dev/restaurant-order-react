import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dish } from '@/types/restaurant';

interface DishCardProps {
  dish: Dish;
  onAddToCart: (dish: Dish) => void;
}

export default function DishCard({ dish, onAddToCart }: DishCardProps) {
  return (
    <Card className="overflow-hidden hover-scale group">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={dish.image} 
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{dish.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{dish.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">${dish.price.toFixed(2)}</span>
            {dish.oldPrice && (
              <span className="text-sm text-gray-400 line-through">${dish.oldPrice.toFixed(2)}</span>
            )}
          </div>
          <Button 
            onClick={() => onAddToCart(dish)}
            className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-medium"
          >
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
