import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order } from '../models/order.model';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];

  constructor(private cartService: CartService) {}

  placeOrder(order: Order): Observable<Order> {
    // Generate a random order ID
    const orderId = 'WL-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Create new order with ID and pending status
    const newOrder: Order = {
      ...order,
      id: orderId,
      status: 'pending'
    };
    
    // Store order in memory (in a real app, this would be sent to a backend)
    this.orders.push(newOrder);
    
    // Clear the cart after successful order
    this.cartService.clearCart();
    
    // Simulate API call with delay
    return of(newOrder).pipe(delay(1500));
  }

  getOrder(orderId: string): Observable<Order | undefined> {
    const order = this.orders.find(o => o.id === orderId);
    return of(order).pipe(delay(500));
  }

  getOrders(): Observable<Order[]> {
    return of(this.orders).pipe(delay(500));
  }
}