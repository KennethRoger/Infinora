# Coupon Implementation Plan

## Current Status
- Basic coupon UI implemented in CartCard
- Need to restructure for multi-vendor support

## TODO
### 1. Local Storage Structure
```javascript
appliedCoupons = [
  {
    vendorId: "vendor123",
    productId: "product456",
    couponDiscount: 100,
    couponCode: "SAVE10"
  }
]
```

### 2. Required Changes
- Modify CartCard to support multiple coupon applications
- Store coupon data in localStorage
- Update ReviewPage.jsx to include coupon data in order payload
- Modify orderController.js to apply vendor-specific discounts during order creation

### 3. Implementation Steps
1. Create localStorage utility for coupon management
2. Update cart UI to show multiple applied coupons
3. Modify order creation flow to include coupon data
4. Update backend to handle per-vendor coupon discounts

### 4. Key Points to Remember
- Orders are created per vendor, not as bulk
- Users can apply multiple coupons (one per product)
- Discounts must be calculated in backend during order creation
