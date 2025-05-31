import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header" [class.scrolled]="scrolled">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <a routerLink="/" class="logo-link">
              <span class="logo-text">Wonderland</span>
            </a>
          </div>
          
          <nav class="nav-desktop">
            <ul class="nav-list">
              <li class="nav-item">
                <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
              </li>
              <li class="nav-item">
                <a routerLink="/products" routerLinkActive="active" class="nav-link">Shop</a>
              </li>
            </ul>
          </nav>
          
          <div class="header-actions">
            <a routerLink="/cart" class="cart-link">
              <span class="cart-icon">🛒</span>
              <span class="cart-count" *ngIf="cartItemCount > 0">{{ cartItemCount }}</span>
            </a>
            <button class="menu-toggle" (click)="toggleMobileMenu()" aria-label="Toggle menu">
              <span class="menu-icon">☰</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="mobile-menu" [class.open]="mobileMenuOpen">
        <nav class="nav-mobile">
          <ul class="nav-list">
            <li class="nav-item">
              <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link" (click)="closeMobileMenu()">Home</a>
            </li>
            <li class="nav-item">
              <a routerLink="/products" routerLinkActive="active" class="nav-link" (click)="closeMobileMenu()">Shop</a>
            </li>
            <li class="nav-item">
              <a routerLink="/cart" routerLinkActive="active" class="nav-link" (click)="closeMobileMenu()">Cart</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      transition: var(--transition-all);
      background-color: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid transparent;
    }
    
    .header.scrolled {
      box-shadow: var(--shadow-md);
      background-color: white;
      border-bottom-color: var(--neutral-200);
    }
    
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80px;
    }
    
    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
    }
    
    .logo-text {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--primary-800);
      background: linear-gradient(135deg, var(--primary-600), var(--accent-500));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transition: var(--transition-all);
    }
    
    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: var(--space-6);
    }
    
    .nav-link {
      font-size: 1rem;
      font-weight: 500;
      color: var(--neutral-700);
      text-decoration: none;
      transition: var(--transition-colors);
      padding: var(--space-2) 0;
      position: relative;
    }
    
    .nav-link:hover, .nav-link.active {
      color: var(--primary-600);
    }
    
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--primary-600);
      transition: var(--transition-all);
    }
    
    .nav-link:hover::after, .nav-link.active::after {
      width: 100%;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }
    
    .cart-link {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
    }
    
    .cart-icon {
      font-size: 1.5rem;
    }
    
    .cart-count {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: var(--primary-600);
      color: white;
      font-size: 0.75rem;
      font-weight: bold;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .menu-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.5rem;
      color: var(--neutral-800);
    }
    
    .mobile-menu {
      display: none;
      background-color: white;
      box-shadow: var(--shadow-lg);
      position: fixed;
      top: 80px;
      left: 0;
      width: 100%;
      height: 0;
      overflow: hidden;
      transition: height 0.3s ease;
    }
    
    .mobile-menu.open {
      height: auto;
    }
    
    .nav-mobile .nav-list {
      flex-direction: column;
      padding: var(--space-6);
      gap: var(--space-4);
    }
    
    .nav-mobile .nav-link {
      display: block;
      padding: var(--space-2);
    }
    
    @media (max-width: 768px) {
      .nav-desktop {
        display: none;
      }
      
      .menu-toggle {
        display: block;
      }
      
      .mobile-menu {
        display: block;
      }
    }
  `]
})
export class HeaderComponent {
  scrolled = false;
  mobileMenuOpen = false;
  cartItemCount = 0;

  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.totalItems;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 10;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}