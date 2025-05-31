import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-card">
      <div class="product-badge" *ngIf="product.new">New</div>
      <div class="product-badge sale" *ngIf="product.discountPrice">Sale</div>
      
      <a [routerLink]="['/products', product.id]" class="product-image-container">
        <img [src]="product.images[0]" [alt]="product.name" class="product-image">
      </a>
      
      <div class="product-content">
        <div class="product-category">{{ product.category }}</div>
        <h3 class="product-name">
          <a [routerLink]="['/products', product.id]">{{ product.name }}</a>
        </h3>
        
        <div class="product-price">
          <span class="current-price" [class.discounted]="product.discountPrice">
            {{ product.discountPrice ? (product.discountPrice | currency) : (product.price | currency) }}
          </span>
          <span class="original-price" *ngIf="product.discountPrice">
            {{ product.price | currency }}
          </span>
        </div>
        
        <div class="product-rating">
          <div class="stars">
            <span *ngFor="let star of getStars(product.rating)" class="star">★</span>
          </div>
          <span class="review-count">{{ product.reviews }} reviews</span>
        </div>
        
        <button class="btn btn-primary add-to-cart-btn" (click)="addToCart($event)">
          Add to Cart
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;
      transition: var(--transition-all);
      position: relative;
    }
    
    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
    }
    
    .product-badge {
      position: absolute;
      top: var(--space-4);
      left: var(--space-4);
      background-color: var(--primary-600);
      color: white;
      font-size: 0.75rem;
      font-weight: bold;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-full);
      z-index: 10;
    }
    
    .product-badge.sale {
      background-color: var(--error-500);
      left: auto;
      right: var(--space-4);
    }
    
    .product-image-container {
      display: block;
      position: relative;
      overflow: hidden;
      aspect-ratio: 1 / 1;
    }
    
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .product-card:hover .product-image {
      transform: scale(1.05);
    }
    
    .product-content {
      padding: var(--space-4);
    }
    
    .product-category {
      font-size: 0.75rem;
      color: var(--neutral-500);
      margin-bottom: var(--space-2);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .product-name {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: var(--space-2);
      line-height: 1.3;
    }
    
    .product-name a {
      color: var(--neutral-900);
      text-decoration: none;
      transition: var(--transition-colors);
    }
    
    .product-name a:hover {
      color: var(--primary-600);
    }
    
    .product-price {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
    }
    
    .current-price {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--neutral-900);
    }
    
    .current-price.discounted {
      color: var(--error-600);
    }
    
    .original-price {
      font-size: 0.875rem;
      color: var(--neutral-500);
      text-decoration: line-through;
    }
    
    .product-rating {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-4);
    }
    
    .stars {
      display: flex;
      color: var(--warning-400);
    }
    
    .review-count {
      font-size: 0.75rem;
      color: var(--neutral-500);
    }
    
    .add-to-cart-btn {
      width: 100%;
      transition: var(--transition-all);
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private cartService: CartService) {}

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(this.product, 1);
  }
}