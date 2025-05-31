import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Cart } from '../../core/models/cart.model';
import { CustomerInfo, Order, PaymentInfo, ShippingAddress } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="checkout-page animate-fade-in">
      <div class="container">
        <header class="page-header">
          <h1 class="page-title">Checkout</h1>
          <p class="page-description">Complete your order</p>
        </header>
        
        <div class="checkout-empty" *ngIf="cart.items.length === 0">
          <p>Your cart is empty. Add some items before proceeding to checkout.</p>
          <a routerLink="/products" class="btn btn-primary">Start Shopping</a>
        </div>
        
        <div class="checkout-layout" *ngIf="cart.items.length > 0">
          <div class="checkout-main">
            <form (ngSubmit)="placeOrder()" #checkoutForm="ngForm">
              <div class="checkout-section">
                <h2 class="section-title">Customer Information</h2>
                
                <div class="form-row">
                  <div class="form-control">
                    <label for="firstName" class="form-label">First Name *</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      class="form-input" 
                      [(ngModel)]="customerInfo.firstName" 
                      required
                    >
                  </div>
                  
                  <div class="form-control">
                    <label for="lastName" class="form-label">Last Name *</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      class="form-input" 
                      [(ngModel)]="customerInfo.lastName" 
                      required
                    >
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-control">
                    <label for="email" class="form-label">Email *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      class="form-input" 
                      [(ngModel)]="customerInfo.email" 
                      required
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                    >
                  </div>
                  
                  <div class="form-control">
                    <label for="phone" class="form-label">Phone *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      class="form-input" 
                      [(ngModel)]="customerInfo.phone" 
                      required
                    >
                  </div>
                </div>
              </div>
              
              <div class="checkout-section">
                <h2 class="section-title">Shipping Address</h2>
                
                <div class="form-control">
                  <label for="addressLine1" class="form-label">Address Line 1 *</label>
                  <input 
                    type="text" 
                    id="addressLine1" 
                    name="addressLine1" 
                    class="form-input" 
                    [(ngModel)]="shippingAddress.addressLine1" 
                    required
                  >
                </div>
                
                <div class="form-control">
                  <label for="addressLine2" class="form-label">Address Line 2</label>
                  <input 
                    type="text" 
                    id="addressLine2" 
                    name="addressLine2" 
                    class="form-input" 
                    [(ngModel)]="shippingAddress.addressLine2"
                  >
                </div>
                
                <div class="form-row">
                  <div class="form-control">
                    <label for="city" class="form-label">City *</label>
                    <input 
                      type="text" 
                      id="city" 
                      name="city" 
                      class="form-input" 
                      [(ngModel)]="shippingAddress.city" 
                      required
                    >
                  </div>
                  
                  <div class="form-control">
                    <label for="state" class="form-label">State/Province *</label>
                    <input 
                      type="text" 
                      id="state" 
                      name="state" 
                      class="form-input" 
                      [(ngModel)]="shippingAddress.state" 
                      required
                    >
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-control">
                    <label for="zipCode" class="form-label">ZIP/Postal Code *</label>
                    <input 
                      type="text" 
                      id="zipCode" 
                      name="zipCode" 
                      class="form-input" 
                      [(ngModel)]="shippingAddress.zipCode" 
                      required
                    >
                  </div>
                  
                  <div class="form-control">
                    <label for="country" class="form-label">Country *</label>
                    <select 
                      id="country" 
                      name="country" 
                      class="form-select" 
                      [(ngModel)]="shippingAddress.country" 
                      required
                    >
                      <option value="">Select a country</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Japan">Japan</option>
                    </select>
                  </div>
                </div>
                
                <div class="form-control">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="useAsBilling" 
                      [(ngModel)]="useShippingAsBilling"
                    >
                    <span>Use shipping address as billing address</span>
                  </label>
                </div>
              </div>
              
              <div class="checkout-section" *ngIf="!useShippingAsBilling">
                <h2 class="section-title">Billing Address</h2>
                
                <div class="form-control">
                  <label for="billingAddressLine1" class="form-label">Address Line 1 *</label>
                  <input 
                    type="text" 
                    id="billingAddressLine1" 
                    name="billingAddressLine1" 
                    class="form-input" 
                    [(ngModel)]="billingAddress.addressLine1" 
                    required
                  >
                </div>
                
                <div class="form-control">
                  <label for="billingAddressLine2" class="form-label">Address Line 2</label>
                  <input 
                    type="text" 
                    id="billingAddressLine2" 
                    name="billingAddressLine2" 
                    class="form-input" 
                    [(ngModel)]="billingAddress.addressLine2"
                  >
                </div>
                
                <div class="form-row">
                  <div class="form-control">
                    <label for="billingCity" class="form-label">City *</label>
                    <input 
                      type="text" 
                      id="billingCity" 
                      name="billingCity" 
                      class="form-input" 
                      [(ngModel)]="billingAddress.city" 
                      required
                    >
                  </div>
                  
                  <div class="form-control">
                    <label for="billingState" class="form-label">State/Province *</label>
                    <input 
                      type="text" 
                      id="billingState" 
                      name="billingState" 
                      class="form-input" 
                      [(ngModel)]="billingAddress.state" 
                      required
                    >
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-control">
                    <label for="billingZipCode" class="form-label">ZIP/Postal Code *</label>
                    <input 
                      type="text" 
                      id="billingZipCode" 
                      name="billingZipCode" 
                      class="form-input" 
                      [(ngModel)]="billingAddress.zipCode" 
                      required
                    >
                  </div>
                  
                  <div class="form-control">
                    <label for="billingCountry" class="form-label">Country *</label>
                    <select 
                      id="billingCountry" 
                      name="billingCountry" 
                      class="form-select" 
                      [(ngModel)]="billingAddress.country" 
                      required
                    >
                      <option value="">Select a country</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Japan">Japan</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="checkout-section">
                <h2 class="section-title">Payment Information</h2>
                
                <div class="form-control">
                  <label for="cardNumber" class="form-label">Card Number *</label>
                  <input 
                    type="text" 
                    id="cardNumber" 
                    name="cardNumber" 
                    class="form-input" 
                    [(ngModel)]="paymentInfo.cardNumber" 
                    required
                    placeholder="XXXX XXXX XXXX XXXX"
                  >
                </div>
                
                <div class="form-control">
                  <label for="nameOnCard" class="form-label">Name on Card *</label>
                  <input 
                    type="text" 
                    id="nameOnCard" 
                    name="nameOnCard" 
                    class="form-input" 
                    [(ngModel)]="paymentInfo.nameOnCard" 
                    required
                  >
                </div>
                
                <div class="form-row">
                  <div class="form-control">
                    <label for="expiryDate" class="form-label">Expiry Date *</label>
                    <input 
                      type="text" 
                      id="expiryDate" 
                      name="expiryDate" 
                      class="form-input" 
                      [(ngModel)]="paymentInfo.expiryDate" 
                      required
                      placeholder="MM/YY"
                    >
                  </div>
                  
                  <div class="form-control">
                    <label for="cvv" class="form-label">CVV *</label>
                    <input 
                      type="text" 
                      id="cvv" 
                      name="cvv" 
                      class="form-input" 
                      [(ngModel)]="paymentInfo.cvv" 
                      required
                      placeholder="XXX"
                    >
                  </div>
                </div>
              </div>
              
              <div class="checkout-actions">
                <a routerLink="/cart" class="btn btn-outline">Back to Cart</a>
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg" 
                  [disabled]="submitting || !checkoutForm.form.valid"
                >
                  {{ submitting ? 'Processing...' : 'Place Order' }}
                </button>
              </div>
            </form>
          </div>
          
          <div class="checkout-sidebar">
            <div class="order-summary">
              <h2 class="summary-title">Order Summary</h2>
              
              <div class="summary-items">
                <div class="summary-item" *ngFor="let item of cart.items">
                  <div class="item-details">
                    <span class="item-quantity">{{ item.quantity }}x</span>
                    <span class="item-name">{{ item.product.name }}</span>
                  </div>
                  <span class="item-price">{{ (item.product.discountPrice || item.product.price) * item.quantity | currency }}</span>
                </div>
              </div>
              
              <div class="summary-divider"></div>
              
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
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page {
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
    
    .checkout-empty {
      text-align: center;
      padding: var(--space-16) 0;
      color: var(--neutral-600);
    }
    
    .checkout-empty p {
      margin-bottom: var(--space-6);
    }
    
    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-8);
    }
    
    .checkout-main {
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      padding: var(--space-6);
    }
    
    .checkout-section {
      margin-bottom: var(--space-8);
      padding-bottom: var(--space-6);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .checkout-section:last-of-type {
      border-bottom: none;
    }
    
    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: var(--space-4);
      color: var(--neutral-900);
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
    }
    
    .checkbox-label span {
      color: var(--neutral-700);
    }
    
    .checkout-actions {
      display: flex;
      justify-content: space-between;
      margin-top: var(--space-8);
    }
    
    .checkout-sidebar {
      position: sticky;
      top: 100px;
    }
    
    .order-summary {
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      padding: var(--space-6);
    }
    
    .summary-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: var(--space-4);
      color: var(--neutral-900);
    }
    
    .summary-items {
      margin-bottom: var(--space-4);
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: var(--space-2) 0;
    }
    
    .item-details {
      display: flex;
      gap: var(--space-2);
      max-width: 70%;
    }
    
    .item-quantity {
      color: var(--neutral-600);
    }
    
    .item-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .item-price {
      font-weight: 500;
    }
    
    .summary-divider {
      height: 1px;
      background-color: var(--neutral-200);
      margin: var(--space-4) 0;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: var(--space-2) 0;
    }
    
    .summary-row.total {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: var(--space-2);
      padding-top: var(--space-4);
      border-top: 1px solid var(--neutral-200);
    }
    
    .free-shipping {
      color: var(--success-600);
      font-weight: 500;
    }
    
    @media (min-width: 640px) {
      .form-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 1024px) {
      .checkout-layout {
        grid-template-columns: 2fr 1fr;
        align-items: start;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cart: Cart = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  };
  
  customerInfo: CustomerInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };
  
  shippingAddress: ShippingAddress = {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  };
  
  billingAddress: ShippingAddress = {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  };
  
  paymentInfo: PaymentInfo = {
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: ''
  };
  
  useShippingAsBilling: boolean = true;
  submitting: boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      
      // Redirect to cart if cart is empty
      if (cart.items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  placeOrder(): void {
    if (this.cart.items.length === 0) {
      return;
    }
    
    this.submitting = true;
    
    const order: Order = {
      customer: this.customerInfo,
      shippingAddress: this.shippingAddress,
      billingAddress: this.useShippingAsBilling ? this.shippingAddress : this.billingAddress,
      payment: this.paymentInfo,
      cart: this.cart,
      orderDate: new Date(),
      status: 'pending'
    };
    
    this.orderService.placeOrder(order).subscribe(
      (result) => {
        this.submitting = false;
        
        // Store the order ID in sessionStorage for the confirmation page
        sessionStorage.setItem('lastOrderId', result.id || '');
        
        // Navigate to confirmation page
        this.router.navigate(['/confirmation']);
      },
      (error) => {
        this.submitting = false;
        console.error('Error placing order:', error);
        // Handle error (show message, etc.)
      }
    );
  }
}