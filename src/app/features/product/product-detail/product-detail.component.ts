import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
  template: `
    <div class="product-detail-page animate-fade-in">
      <div class="container" *ngIf="loading">
        <div class="loading-indicator">
          <p>Loading product details...</p>
        </div>
      </div>
      
      <div class="container" *ngIf="!loading && !product">
        <div class="error-message">
          <h2>Product Not Found</h2>
          <p>Sorry, the product you're looking for doesn't exist or has been removed.</p>
          <a routerLink="/products" class="btn btn-primary">Return to Shop</a>
        </div>
      </div>
      
      <div class="container" *ngIf="!loading && product">
        <div class="product-navigation">
          <a routerLink="/products" class="back-link">
            &larr; Back to Products
          </a>
        </div>
        
        <div class="product-layout">
          <div class="product-gallery">
            <div class="main-image-container">
              <img [src]="selectedImage" [alt]="product.name" class="main-image">
            </div>
            
            <div class="thumbnail-list" *ngIf="product.images.length > 1">
              <div 
                *ngFor="let image of product.images" 
                class="thumbnail-item"
                [class.active]="image === selectedImage"
                (click)="selectImage(image)"
              >
                <img [src]="image" [alt]="product.name" class="thumbnail-image">
              </div>
            </div>
          </div>
          
          <div class="product-info">
            <div class="product-badges">
              <span class="badge new" *ngIf="product.new">New</span>
              <span class="badge sale" *ngIf="product.discountPrice">Sale</span>
            </div>
            
            <h1 class="product-title">{{ product.name }}</h1>
            
            <div class="product-meta">
              <div class="product-rating">
                <div class="stars">
                  <span *ngFor="let star of getStars(product.rating)" class="star">★</span>
                </div>
                <span class="review-count">{{ product.reviews }} reviews</span>
              </div>
              
              <div class="product-category">
                Category: <a [routerLink]="['/products']" [queryParams]="{category: product.category}">{{ product.category }}</a>
              </div>
            </div>
            
            <div class="product-price">
              <span class="current-price" [class.discounted]="product.discountPrice">
                {{ product.discountPrice ? (product.discountPrice | currency) : (product.price | currency) }}
              </span>
              <span class="original-price" *ngIf="product.discountPrice">
                {{ product.price | currency }}
              </span>
              <span class="discount-percentage" *ngIf="product.discountPrice">
                {{ calculateDiscountPercentage(product.price, product.discountPrice) }}% off
              </span>
            </div>
            
            <div class="product-description">
              <p>{{ product.description }}</p>
            </div>
            
            <div class="product-actions">
              <div class="quantity-selector">
                <button class="quantity-btn" (click)="decreaseQuantity()" [disabled]="quantity <= 1">-</button>
                <input type="number" [(ngModel)]="quantity" min="1" [max]="product.stock" class="quantity-input">
                <button class="quantity-btn" (click)="increaseQuantity()" [disabled]="quantity >= product.stock">+</button>
              </div>
              
              <button 
                class="btn btn-primary add-to-cart-btn" 
                (click)="addToCart()"
                [disabled]="product.stock === 0"
              >
                {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
              </button>
            </div>
            
            <div class="stock-info" [class.low-stock]="product.stock < 5 && product.stock > 0" [class.in-stock]="product.stock >= 5">
              {{ getStockMessage() }}
            </div>
            
            <div class="product-details" *ngIf="product.details">
              <h3 class="details-title">Product Details</h3>
              
              <div class="details-grid">
                <div class="detail-item" *ngIf="product.details.dimensions">
                  <span class="detail-label">Dimensions:</span>
                  <span class="detail-value">{{ product.details.dimensions }}</span>
                </div>
                
                <div class="detail-item" *ngIf="product.details.weight">
                  <span class="detail-label">Weight:</span>
                  <span class="detail-value">{{ product.details.weight }}</span>
                </div>
                
                <div class="detail-item" *ngIf="product.details.materials && product.details.materials.length > 0">
                  <span class="detail-label">Materials:</span>
                  <span class="detail-value">{{ product.details.materials.join(', ') }}</span>
                </div>
              </div>
              
              <div class="colors-list" *ngIf="product.details.colors && product.details.colors.length > 0">
                <h4 class="colors-title">Available Colors:</h4>
                <div class="color-options">
                  <span 
                    *ngFor="let color of product.details.colors" 
                    class="color-option"
                    [class.selected]="selectedColor === color"
                    (click)="selectColor(color)"
                  >
                    {{ color }}
                  </span>
                </div>
              </div>
              
              <div class="features-list" *ngIf="product.details.features && product.details.features.length > 0">
                <h4 class="features-title">Features:</h4>
                <ul class="features">
                  <li *ngFor="let feature of product.details.features">{{ feature }}</li>
                </ul>
              </div>
            </div>
            
            <div class="product-tags" *ngIf="product.tags && product.tags.length > 0">
              <h4 class="tags-title">Tags:</h4>
              <div class="tags">
                <a 
                  *ngFor="let tag of product.tags" 
                  [routerLink]="['/products']" 
                  [queryParams]="{tags: tag}"
                  class="tag"
                >
                  {{ tag }}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="related-products" *ngIf="relatedProducts.length > 0">
          <h2 class="section-title">You May Also Like</h2>
          <div class="products-grid">
            <app-product-card 
              *ngFor="let relatedProduct of relatedProducts" 
              [product]="relatedProduct"
            ></app-product-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-page {
      margin-top: 80px;
      padding-top: var(--space-8);
      padding-bottom: var(--space-16);
    }
    
    .loading-indicator,
    .error-message {
      text-align: center;
      padding: var(--space-16) 0;
    }
    
    .error-message h2 {
      margin-bottom: var(--space-4);
    }
    
    .error-message p {
      margin-bottom: var(--space-6);
      color: var(--neutral-600);
    }
    
    .product-navigation {
      margin-bottom: var(--space-6);
    }
    
    .back-link {
      color: var(--neutral-600);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      transition: var(--transition-colors);
    }
    
    .back-link:hover {
      color: var(--primary-600);
    }
    
    .product-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-8);
      margin-bottom: var(--space-12);
    }
    
    .product-gallery {
      background-color: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-md);
    }
    
    .main-image-container {
      position: relative;
      aspect-ratio: 1 / 1;
      overflow: hidden;
    }
    
    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .main-image-container:hover .main-image {
      transform: scale(1.05);
    }
    
    .thumbnail-list {
      display: flex;
      padding: var(--space-4);
      gap: var(--space-2);
      overflow-x: auto;
    }
    
    .thumbnail-item {
      width: 80px;
      height: 80px;
      border-radius: var(--radius);
      overflow: hidden;
      cursor: pointer;
      transition: var(--transition-all);
      border: 2px solid transparent;
    }
    
    .thumbnail-item.active {
      border-color: var(--primary-500);
    }
    
    .thumbnail-item:hover {
      transform: translateY(-2px);
    }
    
    .thumbnail-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .product-info {
      padding: var(--space-4);
    }
    
    .product-badges {
      display: flex;
      gap: var(--space-2);
      margin-bottom: var(--space-4);
    }
    
    .badge {
      display: inline-block;
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .badge.new {
      background-color: var(--primary-100);
      color: var(--primary-700);
    }
    
    .badge.sale {
      background-color: var(--error-100);
      color: var(--error-700);
    }
    
    .product-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: var(--space-4);
      color: var(--neutral-900);
    }
    
    .product-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-6);
      margin-bottom: var(--space-4);
      color: var(--neutral-600);
    }
    
    .product-rating {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .stars {
      display: flex;
      color: var(--warning-400);
    }
    
    .review-count {
      font-size: 0.875rem;
    }
    
    .product-category a {
      color: var(--primary-600);
      text-decoration: none;
    }
    
    .product-category a:hover {
      text-decoration: underline;
    }
    
    .product-price {
      display: flex;
      align-items: baseline;
      gap: var(--space-3);
      margin-bottom: var(--space-6);
    }
    
    .current-price {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--neutral-900);
    }
    
    .current-price.discounted {
      color: var(--error-600);
    }
    
    .original-price {
      font-size: 1.25rem;
      color: var(--neutral-500);
      text-decoration: line-through;
    }
    
    .discount-percentage {
      font-size: 0.875rem;
      font-weight: 500;
      background-color: var(--error-100);
      color: var(--error-700);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius);
    }
    
    .product-description {
      margin-bottom: var(--space-6);
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .product-actions {
      display: flex;
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }
    
    .quantity-selector {
      display: flex;
      align-items: center;
      border: 1px solid var(--neutral-300);
      border-radius: var(--radius);
      overflow: hidden;
    }
    
    .quantity-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--neutral-100);
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
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
      width: 60px;
      height: 40px;
      border: none;
      text-align: center;
      font-size: 1rem;
      -moz-appearance: textfield;
    }
    
    .quantity-input::-webkit-outer-spin-button,
    .quantity-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    .add-to-cart-btn {
      flex: 1;
    }
    
    .add-to-cart-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .stock-info {
      margin-bottom: var(--space-6);
      font-size: 0.875rem;
    }
    
    .stock-info.in-stock {
      color: var(--success-600);
    }
    
    .stock-info.low-stock {
      color: var(--warning-500);
    }
    
    .product-details {
      border-top: 1px solid var(--neutral-200);
      padding-top: var(--space-6);
      margin-bottom: var(--space-6);
    }
    
    .details-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: var(--space-4);
      color: var(--neutral-900);
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-3);
      margin-bottom: var(--space-6);
    }
    
    .detail-item {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }
    
    .detail-label {
      font-weight: 500;
      color: var(--neutral-700);
    }
    
    .detail-value {
      color: var(--neutral-600);
    }
    
    .colors-title,
    .features-title,
    .tags-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: var(--space-3);
      color: var(--neutral-800);
    }
    
    .color-options {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      margin-bottom: var(--space-6);
    }
    
    .color-option {
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--neutral-300);
      border-radius: var(--radius);
      cursor: pointer;
      transition: var(--transition-all);
    }
    
    .color-option:hover {
      border-color: var(--primary-400);
    }
    
    .color-option.selected {
      background-color: var(--primary-100);
      border-color: var(--primary-500);
      color: var(--primary-700);
    }
    
    .features {
      list-style-type: disc;
      padding-left: var(--space-5);
      margin-bottom: var(--space-6);
      color: var(--neutral-700);
    }
    
    .features li {
      margin-bottom: var(--space-2);
    }
    
    .product-tags {
      border-top: 1px solid var(--neutral-200);
      padding-top: var(--space-6);
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }
    
    .tag {
      display: inline-block;
      padding: var(--space-1) var(--space-3);
      background-color: var(--neutral-100);
      border-radius: var(--radius-full);
      color: var(--neutral-700);
      font-size: 0.875rem;
      text-decoration: none;
      transition: var(--transition-all);
    }
    
    .tag:hover {
      background-color: var(--primary-100);
      color: var(--primary-700);
    }
    
    .related-products {
      margin-top: var(--space-12);
    }
    
    .section-title {
      font-size: 1.75rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: var(--space-8);
      color: var(--neutral-900);
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: var(--space-6);
    }
    
    @media (min-width: 640px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .details-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 1024px) {
      .product-layout {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        align-items: start;
      }
      
      .products-grid {
        grid-template-columns: repeat(4, 1fr);
      }
      
      .details-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  relatedProducts: Product[] = [];
  selectedImage: string = '';
  selectedColor: string = '';
  quantity: number = 1;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe(product => {
      this.loading = false;
      
      if (product) {
        this.product = product;
        this.selectedImage = product.images[0];
        
        if (product.details?.colors && product.details.colors.length > 0) {
          this.selectedColor = product.details.colors[0];
        }
        
        this.loadRelatedProducts(product);
      }
    });
  }

  loadRelatedProducts(product: Product): void {
    this.productService.getProducts().subscribe(products => {
      // Get products from the same category, excluding the current product
      const sameCategoryProducts = products.filter(p => 
        p.category === product.category && p.id !== product.id
      );
      
      // If we have enough products from the same category, use those
      if (sameCategoryProducts.length >= 4) {
        this.relatedProducts = sameCategoryProducts.slice(0, 4);
      } 
      // Otherwise, fill with other products
      else {
        const otherProducts = products.filter(p => 
          p.id !== product.id && !sameCategoryProducts.includes(p)
        );
        
        this.relatedProducts = [
          ...sameCategoryProducts,
          ...otherProducts.slice(0, 4 - sameCategoryProducts.length)
        ];
      }
    });
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product && this.quantity > 0 && this.product.stock > 0) {
      this.cartService.addToCart(this.product, this.quantity);
      
      // Optional: Show a success message or navigate to cart
      // For now, let's just reset the quantity
      this.quantity = 1;
    }
  }

  getStockMessage(): string {
    if (!this.product) return '';
    
    if (this.product.stock === 0) {
      return 'Out of Stock';
    } else if (this.product.stock < 5) {
      return `Low Stock: Only ${this.product.stock} left!`;
    } else {
      return 'In Stock';
    }
  }

  calculateDiscountPercentage(original: number, discounted: number): number {
    return Math.round(((original - discounted) / original) * 100);
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }
}