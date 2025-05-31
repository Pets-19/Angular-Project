import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="home-page animate-fade-in">
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">Discover the <span class="gradient-text">Magic</span> of Wonderland</h1>
            <p class="hero-subtitle">Enchanting products that bring wonder and delight to your everyday life</p>
            <div class="hero-actions">
              <a routerLink="/products" class="btn btn-primary btn-lg">Shop Now</a>
              <a routerLink="/products" [queryParams]="{filter: 'featured'}" class="btn btn-outline btn-lg">Explore Featured</a>
            </div>
          </div>
        </div>
      </section>
      
      <section class="features">
        <div class="container">
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">🌟</div>
              <h3 class="feature-title">Magical Selection</h3>
              <p class="feature-text">Curated products that spark joy and wonder</p>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">🎁</div>
              <h3 class="feature-title">Perfect Gifts</h3>
              <p class="feature-text">Find something special for everyone</p>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">✨</div>
              <h3 class="feature-title">Quality Crafted</h3>
              <p class="feature-text">Beautiful items made with care</p>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">🚚</div>
              <h3 class="feature-title">Fast Shipping</h3>
              <p class="feature-text">Delivered to your door with care</p>
            </div>
          </div>
        </div>
      </section>
      
      <section class="featured-products">
        <div class="container">
          <h2 class="section-title">Featured Products</h2>
          <p class="section-subtitle">Discover our most magical items</p>
          
          <div class="products-grid">
            <app-product-card 
              *ngFor="let product of featuredProducts" 
              [product]="product"
            ></app-product-card>
          </div>
          
          <div class="text-center mt-8">
            <a routerLink="/products" class="btn btn-outline">View All Products</a>
          </div>
        </div>
      </section>
      
      <section class="new-arrivals">
        <div class="container">
          <h2 class="section-title">New Arrivals</h2>
          <p class="section-subtitle">The latest additions to our collection</p>
          
          <div class="products-grid">
            <app-product-card 
              *ngFor="let product of newProducts" 
              [product]="product"
            ></app-product-card>
          </div>
        </div>
      </section>
      
      <section class="cta">
        <div class="container">
          <div class="cta-content">
            <h2 class="cta-title">Join Our Wonderland Community</h2>
            <p class="cta-text">Sign up for our newsletter to receive updates, exclusive offers, and magical inspiration.</p>
            <form class="newsletter-form">
              <input type="email" placeholder="Your email address" class="form-input">
              <button type="submit" class="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, var(--primary-50), var(--accent-100));
      padding: var(--space-16) 0;
      margin-top: 80px;
    }
    
    .hero-content {
      max-width: 700px;
      margin: 0 auto;
      text-align: center;
    }
    
    .hero-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700;
      margin-bottom: var(--space-4);
      color: var(--neutral-900);
    }
    
    .gradient-text {
      background: linear-gradient(135deg, var(--primary-600), var(--secondary-500));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.25rem);
      color: var(--neutral-700);
      margin-bottom: var(--space-8);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--space-4);
    }
    
    .features {
      padding: var(--space-16) 0;
      background-color: white;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: var(--space-8);
    }
    
    .feature-item {
      text-align: center;
      padding: var(--space-6);
      transition: var(--transition-transform);
    }
    
    .feature-item:hover {
      transform: translateY(-4px);
    }
    
    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: var(--space-4);
    }
    
    .feature-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: var(--space-2);
      color: var(--neutral-900);
    }
    
    .feature-text {
      color: var(--neutral-600);
    }
    
    .featured-products,
    .new-arrivals {
      padding: var(--space-16) 0;
      background-color: var(--neutral-50);
    }
    
    .new-arrivals {
      background-color: white;
    }
    
    .section-title {
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: var(--space-2);
      color: var(--neutral-900);
    }
    
    .section-subtitle {
      font-size: 1.125rem;
      text-align: center;
      color: var(--neutral-600);
      margin-bottom: var(--space-8);
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: var(--space-6);
    }
    
    .cta {
      padding: var(--space-16) 0;
      background: linear-gradient(135deg, var(--primary-100), var(--secondary-100));
    }
    
    .cta-content {
      max-width: 700px;
      margin: 0 auto;
      text-align: center;
    }
    
    .cta-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: var(--space-4);
      color: var(--neutral-900);
    }
    
    .cta-text {
      color: var(--neutral-700);
      margin-bottom: var(--space-6);
    }
    
    .newsletter-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      max-width: 500px;
      margin: 0 auto;
    }
    
    .mt-8 {
      margin-top: var(--space-8);
    }
    
    @media (min-width: 640px) {
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .newsletter-form {
        flex-direction: row;
      }
      
      .newsletter-form .form-input {
        flex: 1;
      }
    }
    
    @media (min-width: 1024px) {
      .features-grid {
        grid-template-columns: repeat(4, 1fr);
      }
      
      .products-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  newProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getFeaturedProducts(4).subscribe(products => {
      this.featuredProducts = products;
    });

    this.productService.getNewProducts(4).subscribe(products => {
      this.newProducts = products;
    });
  }
}