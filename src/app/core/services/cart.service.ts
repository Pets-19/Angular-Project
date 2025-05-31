import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private TAX_RATE = 0.07; // 7% tax rate
  private SHIPPING_THRESHOLD = 100; // Free shipping for orders over $100
  private SHIPPING_COST = 10; // $10 shipping cost for orders under threshold

  private initialCart: Cart = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  };

  private cartSubject = new BehaviorSubject<Cart>(this.initialCart);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    // Load cart from localStorage if available
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        this.cartSubject.next(parsedCart);
      } catch (e) {
        console.error('Error parsing saved cart', e);
        this.cartSubject.next(this.initialCart);
      }
    }
  }

  private saveCart(cart: Cart): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private recalculateCart(cart: Cart): Cart {
    // Count total items
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    
    // Calculate subtotal
    cart.subtotal = cart.items.reduce(
      (total, item) => total + (item.product.discountPrice || item.product.price) * item.quantity, 
      0
    );
    
    // Calculate shipping
    cart.shipping = cart.subtotal >= this.SHIPPING_THRESHOLD ? 0 : this.SHIPPING_COST;
    
    // Calculate tax
    cart.tax = cart.subtotal * this.TAX_RATE;
    
    // Calculate total
    cart.total = cart.subtotal + cart.shipping + cart.tax;
    
    return cart;
  }

  getCart(): Observable<Cart> {
    return this.cart$;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update existing item quantity
      const updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      
      const updatedCart = {
        ...currentCart,
        items: updatedItems
      };
      
      const recalculatedCart = this.recalculateCart(updatedCart);
      this.cartSubject.next(recalculatedCart);
      this.saveCart(recalculatedCart);
    } else {
      // Add new item
      const newItem: CartItem = {
        product,
        quantity
      };
      
      const updatedCart = {
        ...currentCart,
        items: [...currentCart.items, newItem]
      };
      
      const recalculatedCart = this.recalculateCart(updatedCart);
      this.cartSubject.next(recalculatedCart);
      this.saveCart(recalculatedCart);
    }
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.filter(item => item.product.id !== productId);
    
    const updatedCart = {
      ...currentCart,
      items: updatedItems
    };
    
    const recalculatedCart = this.recalculateCart(updatedCart);
    this.cartSubject.next(recalculatedCart);
    this.saveCart(recalculatedCart);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.map(item => 
      item.product.id === productId 
        ? { ...item, quantity } 
        : item
    );
    
    const updatedCart = {
      ...currentCart,
      items: updatedItems
    };
    
    const recalculatedCart = this.recalculateCart(updatedCart);
    this.cartSubject.next(recalculatedCart);
    this.saveCart(recalculatedCart);
  }

  clearCart(): void {
    this.cartSubject.next(this.initialCart);
    localStorage.removeItem('cart');
  }
}