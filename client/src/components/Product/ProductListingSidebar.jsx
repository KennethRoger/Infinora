import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

export default function ProductListingSidebar({ filters, setFilters, sortBy, setSortBy }) {
  const [priceRange, setPriceRange] = useState(filters.priceRange);
  const defaultPriceRange = [0, 10000];

  const handleMinPriceChange = (value) => {
    const [newMin] = value;
    if (newMin <= priceRange[1]) {
      setPriceRange([newMin, priceRange[1]]);
      setFilters(prev => ({
        ...prev,
        priceRange: [newMin, prev.priceRange[1]]
      }));
    }
  };

  const handleMaxPriceChange = (value) => {
    const [newMax] = value;
    if (newMax >= priceRange[0]) {
      setPriceRange([priceRange[0], newMax]);
      setFilters(prev => ({
        ...prev,
        priceRange: [prev.priceRange[0], newMax]
      }));
    }
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      rating: Number(rating)
    }));
  };

  const handleAvailabilityChange = (availability) => {
    setFilters(prev => ({
      ...prev,
      availability
    }));
  };

  const resetFilters = () => {
    setPriceRange(defaultPriceRange);
    setFilters({
      priceRange: defaultPriceRange,
      categories: [],
      rating: 0,
      availability: 'all'
    });
    setSortBy('default');
  };

  const resetPriceRange = () => {
    setPriceRange(defaultPriceRange);
    setFilters(prev => ({
      ...prev,
      priceRange: defaultPriceRange
    }));
  };

  // Count active filters
  const activeFilterCount = [
    priceRange[0] !== defaultPriceRange[0] || priceRange[1] !== defaultPriceRange[1],
    filters.categories.length > 0,
    filters.rating > 0,
    filters.availability !== 'all',
    sortBy !== 'default'
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 bg-gray-50+ p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Filters</h2>
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-2">
            {activeFilterCount} active
          </Badge>
        )}
      </div>

      {/* Sort By */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Sort By</h3>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Price Range</h3>
          {(priceRange[0] !== defaultPriceRange[0] || priceRange[1] !== defaultPriceRange[1]) && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={resetPriceRange}
              className="h-8 px-2 text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
        <div className="px-2 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Minimum Price</label>
            <Slider
              value={[priceRange[0]]}
              onValueChange={handleMinPriceChange}
              min={0}
              max={10000}
              step={100}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Maximum Price</label>
            <Slider
              value={[priceRange[1]]}
              onValueChange={handleMaxPriceChange}
              min={0}
              max={10000}
              step={100}
              className="mt-2"
            />
          </div>
          <div className="flex justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Min: </span>
              <span className="font-medium">₹{priceRange[0].toLocaleString()}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Max: </span>
              <span className="font-medium">₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {['Electronics', 'Fashion', 'Home', 'Books'].map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <Label 
                htmlFor={category}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Rating</h3>
        <Select value={filters.rating} onValueChange={handleRatingChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select rating..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={0}>All Ratings</SelectItem>
            <SelectItem value={4}>4★ & above</SelectItem>
            <SelectItem value={3}>3★ & above</SelectItem>
            <SelectItem value={2}>2★ & above</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Availability</h3>
        <Select value={filters.availability} onValueChange={handleAvailabilityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select availability..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear All Filters */}
      {activeFilterCount > 0 && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={resetFilters}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
}