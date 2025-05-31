import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">Wonderland</h3>
            <p class="footer-description">
              Discover magical products that bring wonder and joy to everyday life.
            </p>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-heading">Shop</h4>
            <ul class="footer-links">
              <li><a routerLink="/products" [queryParams]="{category: 'Home Decor'}">Home Decor</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'Kitchen'}">Kitchen</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'Bath & Body'}">Bath & Body</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'Accessories'}">Accessories</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-heading">Help</h4>
            <ul class="footer-links">
              <li><a href="#">Shipping & Returns</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-heading">Contact</h4>
            <ul class="footer-links">
              <li><a href="mailto:info&#64;wonderlandstore.com">info&#64;wonderlandstore.com</a></li>
              <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
              <li>123 Magic Lane, Wonderland</li>
              <li>Follow us on social media</li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p class="copyright">
            &copy; 2025 Wonderland Store. All rights reserved.
          </p>
          <div class="payment-methods">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayPal</span>
            <span>Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--neutral-100);
      padding: var(--space-12) 0 var(--space-4);
      margin-top: var(--space-16);
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: var(--space-8);
      margin-bottom: var(--space-8);
    }
    
    .footer-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: var(--space-2);
      background: linear-gradient(135deg, var(--primary-600), var(--accent-500));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .footer-description {
      color: var(--neutral-600);
      max-width: 300px;
    }
    
    .footer-heading {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: var(--space-4);
      color: var(--neutral-900);
    }
    
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-links li {
      margin-bottom: var(--space-2);
    }
    
    .footer-links a {
      color: var(--neutral-600);
      text-decoration: none;
      transition: var(--transition-colors);
    }
    
    .footer-links a:hover {
      color: var(--primary-600);
    }
    
    .footer-bottom {
      padding-top: var(--space-6);
      border-top: 1px solid var(--neutral-200);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--space-4);
    }
    
    .copyright {
      color: var(--neutral-500);
      font-size: 0.875rem;
    }
    
    .payment-methods {
      display: flex;
      gap: var(--space-3);
      color: var(--neutral-400);
      font-size: 0.875rem;
    }
    
    @media (min-width: 640px) {
      .footer-content {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .footer-bottom {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
    }
    
    @media (min-width: 1024px) {
      .footer-content {
        grid-template-columns: 2fr repeat(3, 1fr);
      }
    }
  `]
})
export class FooterComponent {}