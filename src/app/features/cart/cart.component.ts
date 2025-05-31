import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { Cart, CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="cart-page animate-fade-in">
      <div class="container">
        <header class="page-header">
          <h1 class="page-title">Your Cart</h1>
          <p class="page-description" *ngIf="cart.items.length > 0">
            You have {{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'items' }} in your cart
          </p>
          <p class="page-description" *ngIf="cart.items.length === 0">
            Your cart is empty
          </p>
        </header>
        
        <div class="cart-empty" *ngIf="cart.items.length === 0">
          <p>You have no items in your cart.</p>
          <a routerLink="/products" class="btn btn-primary">Start Shopping</a>
        </div>
        
        <div class="cart-layout" *ngIf="cart.items.length > 0">
          <div class="cart-items">
            <div class="cart-item" *ngFor="let item of cart.items">
              <div class="item-image">
                <img [src]="item.product.images[0]" [alt]="item.product.name">
              </div>
              
              <div class="item-details">
                <h3 class="item-name">
                  <a [routerLink]="['/products', item.product.id]">{{ item.product.name }}</a>
                </h3>
                <p class="item-category">{{ item.product.category }}</p>
              </div>
              
              <div class="item-quantity">
                <button class="quantity-btn" (click)="decreaseQuantity(item)" [disabled]="item.quantity <= 1">-</button>
                <input 
                  type="number" 
                  [(ngModel)]="item.quantity" 
                  (change)="updateQuantity(item)"
                  min="1" 
                  [max]="item.product.stock" 
                  class="quantity-input"
                >
                <button class="quantity-btn" (click)="increaseQuantity(item)" [disabled]="item.quantity >= item.product.stock">+</button>
              </div>
              
              <div class="item-price">
                <span class="price">{{ getItemPrice(item) | currency }}</span>
                <span class="original-price" *ngIf="item.product.discountPrice">
                  {{ item.product.price | currency }}
                </span>
              </div>
              
              <div class="item-total">
                {{ getItemTotal(item) | currency }}
              </div>
              
              <button class="remove-btn" (click)="removeItem(item)">
                &times;
              </button>
            </div>
          </div>
          
          <div class="cart-summary">
            <h2 class="summary-title">Order Summary</h2>
            
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ cart.subtotal | currency }}</span>
            </div>
            
            <div class="summary-row">
              <span>Shipping</span>
              <span *ngIf="cart.shipping > 0">{{ cart.shipping | currency }}</span>
              <span *ngIf="cart.shipping === 0" class="free-shipping">Free</span>
            </div>
            
            <div class="summary-row">
              <span>Tax</span>
              <span>{{ cart.tax | currency }}</span>
            </div>
            
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ cart.total | currency }}</span>
            </div>
            
            <div class="summary-actions">
              <a routerLink="/checkout" class="btn btn-primary btn-lg checkout-btn">
                Proceed to Checkout
              </a>
              <a routerLink="/products" class="btn btn-outline continue-shopping">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      margin-top: 80px;
      padding-top: var(--space-8);
      padding-bottom: var(--space-16);
    }
    
    .page-header {
      text-align: center;
      margin-bottom: var(--space-8);
    }
    
    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: var(--space-2);
      color: var(--neutral-900);
    }
    
    .page-description {
      color: var(--neutral-600);
    }
    
    .cart-empty {
      text-align: center;
      padding: var(--space-16) 0;
      color: var(--neutral-600);
    }
    
    .cart-empty p {
      margin-bottom: var(--space-6);
    }
    
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-8);
    }
    
    .cart-items {
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }
    
    .cart-item {
      display: grid;
      grid-template-columns: auto 1fr auto auto auto auto;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-4);
      border-bottom: 1px solid var(--neutral-200);
      position: relative;
    }
    
    .cart-item:last-child {
      border-bottom: none;
    }
    
    .item-image {
      width: 80px;
      height: 80px;
      border-radius: var(--radius);
      overflow: hidden;
    }
    
    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .item-details {
      min-width: 0;
    }
    
    .item-name {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: var(--space-1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .item-name a {
      color: var(--neutral-900);
      text-decoration: none;
      transition: var(--transition-colors);
    }
    
    .item-name a:hover {
      color: var(--primary-600);
    }
    
    .item-category {
      font-size: 0.875rem;
      color: var(--neutral-500);
    }
    
    .item-quantity {
      display: flex;
      align-items: center;
      border: 1px solid var(--neutral-300);
      border-radius: var(--radius);
      overflow: hidden;
    }
    
    .quantity-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--neutral-100);
      border: none;
      cursor: pointer;
      font-size: 1rem;
      transition: var(--transition-all);
    }
    
    .quantity-btn:hover:not(:disabled) {
      background-color: var(--neutral-200);
    }
    
    .quantity-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .quantity-input {
      width: 40px;
      height: 32px;
      border: none;
      text-align: center;
      font-size: 0.875rem;
      -moz-appearance: textfield;
    }
    
    .quantity-input::-webkit-outer-spin-button,
    .quantity-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    .item-price {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    
    .price {
      font-weight: 500;
    }
    
    .original-price {
      font-size: 0.75rem;
      color: var(--neutral-500);
      text-decoration: line-through;
    }
    
    .item-total {
      font-weight: 600;
      color: var(--neutral-900);
    }
    
    .remove-btn {
      background: none;
      border: none;
      color: var(--neutral-500);
      font-size: 1.5rem;
      cursor: pointer;
      transition: var(--transition-colors);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
    }
    
    .remove-btn:hover {
      color: var(--error-600);
    }
    
    .cart-summary {
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      padding: var(--space-6);
    }
    
    .summary-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: var(--space-6);
      color: var(--neutral-900);
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: var(--space-2) 0;
    }
    
    .summary-row.total {
      font-size: 1.25rem;
      font-weight: 600;
      border-top: 1px solid var(--neutral-200);
      margin-top: var(--space-2);
      padding-top: var(--space-4);
    }
    
    .free-shipping {
      color: var(--success-600);
      font-weight: 500;
    }
    
    .summary-actions {
      margin-top: var(--space-6);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .checkout-btn,
    .continue-shopping {
      width: 100%;
      text-align: center;
    }
    
    @media (min-width: 1024px) {
      .cart-layout {
        grid-template-columns: 2fr 1fr;
        align-items: start;
      }
      
      .cart-item {
        grid-template-columns: 80px 1fr 120px 100px 100px 40px;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  };

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  getItemPrice(item: CartItem): number {
    return item.product.discountPrice || item.product.price;
  }

  getItemTotal(item: CartItem): number {
    return this.getItemPrice(item) * item.quantity;
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.product.stock) {
      this.cartService.updateQuantity(item.product.id, item.quantity + 1);
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    }
  }

  updateQuantity(item: CartItem): void {
    // Ensure quantity is valid
    if (item.quantity < 1) {
      item.quantity = 1;
    } else if (item.quantity > item.product.stock) {
      item.quantity = item.product.stock;
    }
    
    this.cartService.updateQuantity(item.product.id, item.quantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id);
  }
}