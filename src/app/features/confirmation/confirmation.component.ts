import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="confirmation-page animate-fade-in">
      <div class="container">
        <div class="confirmation-card">
          <div class="success-icon">✓</div>
          
          <h1 class="confirmation-title">Thank You for Your Order!</h1>
          
          <p class="confirmation-message">
            Your order has been received and is being processed. 
            We've sent a confirmation email to <strong>{{ order?.customer?.email }}</strong>.
          </p>
          
          <div class="order-details" *ngIf="order">
            <div class="detail-row">
              <span class="detail-label">Order Number:</span>
              <span class="detail-value">{{ order.id }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Order Date:</span>
              <span class="detail-value">{{ order.orderDate | date:'medium' }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Order Status:</span>
              <span class="detail-value status-badge" [class]="'status-' + order.status">
                {{ formatStatus(order.status) }}
              </span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Payment Method:</span>
              <span class="detail-value">Credit Card (ending in {{ getLastFourDigits(order.payment.cardNumber) }})</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Shipping Address:</span>
              <span class="detail-value address">
                {{ formatAddress(order.shippingAddress) }}
              </span>
            </div>
          </div>
          
          <div class="order-summary" *ngIf="order">
            <h2 class="summary-title">Order Summary</h2>
            
            <div class="summary-items">
              <div class="summary-item" *ngFor="let item of order.cart.items">
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
              <span>{{ order.cart.subtotal | currency }}</span>
            </div>
            
            <div class="summary-row">
              <span>Shipping</span>
              <span *ngIf="order.cart.shipping > 0">{{ order.cart.shipping | currency }}</span>
              <span *ngIf="order.cart.shipping === 0" class="free-shipping">Free</span>
            </div>
            
            <div class="summary-row">
              <span>Tax</span>
              <span>{{ order.cart.tax | currency }}</span>
            </div>
            
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ order.cart.total | currency }}</span>
            </div>
          </div>
          
          <div class="confirmation-actions">
            <a routerLink="/products" class="btn btn-primary btn-lg">Continue Shopping</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-page {
      margin-top: 80px;
      padding-top: var(--space-8);
      padding-bottom: var(--space-16);
      background: linear-gradient(135deg, var(--primary-50), var(--accent-50));
      min-height: calc(100vh - 80px);
      display: flex;
      align-items: center;
    }
    
    .confirmation-card {
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      padding: var(--space-8);
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    
    .success-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--success-400), var(--success-600));
      color: white;
      font-size: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-6);
      box-shadow: var(--shadow-md);
    }
    
    .confirmation-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: var(--space-4);
      color: var(--neutral-900);
    }
    
    .confirmation-message {
      color: var(--neutral-600);
      margin-bottom: var(--space-8);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .order-details {
      background-color: var(--neutral-50);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      margin-bottom: var(--space-8);
      text-align: left;
    }
    
    .detail-row {
      display: flex;
      flex-direction: column;
      margin-bottom: var(--space-4);
    }
    
    .detail-label {
      font-weight: 600;
      color: var(--neutral-700);
      margin-bottom: var(--space-1);
    }
    
    .detail-value {
      color: var(--neutral-900);
    }
    
    .status-badge {
      display: inline-block;
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .status-pending {
      background-color: var(--warning-100);
      color: var(--warning-700);
    }
    
    .status-processing {
      background-color: var(--primary-100);
      color: var(--primary-700);
    }
    
    .status-shipped {
      background-color: var(--accent-100);
      color: var(--accent-700);
    }
    
    .status-delivered {
      background-color: var(--success-100);
      color: var(--success-700);
    }
    
    .status-cancelled {
      background-color: var(--error-100);
      color: var(--error-700);
    }
    
    .address {
      white-space: pre-line;
    }
    
    .order-summary {
      background-color: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--neutral-200);
      padding: var(--space-6);
      margin-bottom: var(--space-8);
      text-align: left;
    }
    
    .summary-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: var(--space-4);
      color: var(--neutral-900);
      text-align: center;
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
    
    .confirmation-actions {
      margin-top: var(--space-8);
    }
    
    @media (min-width: 768px) {
      .detail-row {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      
      .detail-label {
        margin-bottom: 0;
      }
    }
  `]
})
export class ConfirmationComponent implements OnInit {
  order: Order | undefined;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    const orderId = sessionStorage.getItem('lastOrderId');
    
    if (orderId) {
      this.orderService.getOrder(orderId).subscribe(order => {
        this.order = order;
      });
    }
  }

  formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getLastFourDigits(cardNumber: string): string {
    // Remove spaces and get last 4 digits
    return cardNumber.replace(/\s/g, '').slice(-4);
  }

  formatAddress(address: any): string {
    if (!address) return '';
    
    let formatted = address.addressLine1;
    
    if (address.addressLine2) {
      formatted += '\n' + address.addressLine2;
    }
    
    formatted += '\n' + address.city + ', ' + address.state + ' ' + address.zipCode;
    formatted += '\n' + address.country;
    
    return formatted;
  }
}