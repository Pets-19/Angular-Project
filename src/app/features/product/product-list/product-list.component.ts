import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
  template: `
    <div class="product-list-page animate-fade-in">
      <div class="container">
        <header class="page-header">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <p class="page-description">Discover our magical collection of products</p>
        </header>
        
        <div class="product-layout">
          <aside class="filters-sidebar">
            <div class="filters-header">
              <h3>Filters</h3>
              <button class="btn btn-sm" (click)="clearFilters()">Clear All</button>
            </div>
            
            <div class="filter-section">
              <h4 class="filter-title">Categories</h4>
              <ul class="filter-options">
                <li *ngFor="let category of categories">
                  <label class="filter-option">
                    <input 
                      type="radio" 
                      name="category" 
                      [value]="category" 
                      [checked]="selectedCategory === category"
                      (change)="onCategoryChange(category)"
                    >
                    <span>{{ category }}</span>
                  </label>
                </li>
              </ul>
            </div>
            
            <div class="filter-section">
              <h4 class="filter-title">Price Range</h4>
              <div class="price-inputs">
                <div class="price-input">
                  <label for="minPrice">Min</label>
                  <input 
                    type="number" 
                    id="minPrice" 
                    class="form-input" 
                    [(ngModel)]="minPrice" 
                    (change)="applyFilters()"
                    min="0"
                  >
                </div>
                <div class="price-input">
                  <label for="maxPrice">Max</label>
                  <input 
                    type="number" 
                    id="maxPrice" 
                    class="form-input" 
                    [(ngModel)]="maxPrice" 
                    (change)="applyFilters()"
                    min="0"
                  >
                </div>
              </div>
            </div>
            
            <div class="filter-section">
              <h4 class="filter-title">Popular Tags</h4>
              <div class="tags-list">
                <button 
                  *ngFor="let tag of popularTags" 
                  class="tag-button" 
                  [class.active]="selectedTags.includes(tag)"
                  (click)="toggleTag(tag)"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
          </aside>
          
          <div class="products-container">
            <div class="toolbar">
              <div class="search-box">
                <input 
                  type="text" 
                  class="form-input" 
                  placeholder="Search products..." 
                  [(ngModel)]="searchQuery"
                  (input)="onSearch()"
                >
              </div>
              
              <div class="sort-options">
                <label for="sort">Sort by:</label>
                <select id="sort" class="form-select" [(ngModel)]="sortOption" (change)="sortProducts()">
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="rating-desc">Top Rated</option>
                </select>
              </div>
            </div>
            
            <div *ngIf="loading" class="loading-indicator">
              <p>Loading products...</p>
            </div>
            
            <div *ngIf="!loading && filteredProducts.length === 0" class="no-products">
              <p>No products found matching your criteria.</p>
              <button class="btn btn-primary" (click)="clearFilters()">Clear Filters</button>
            </div>
            
            <div class="products-grid" *ngIf="!loading && filteredProducts.length > 0">
              <app-product-card 
                *ngFor="let product of filteredProducts" 
                [product]="product"
              ></app-product-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-list-page {
      margin-top: 80px;
      padding-top: var(--space-8);
      padding-bottom: var(--space-16);
    }
    
    .page-header {
      text-align: center;
      margin-bottom: var(--space-10);
    }
    
    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: var(--space-2);
      color: var(--neutral-900);
    }
    
    .page-description {
      color: var(--neutral-600);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .product-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-8);
    }
    
    .filters-sidebar {
      background-color: white;
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      box-shadow: var(--shadow-md);
      position: relative;
    }
    
    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .filter-section {
      margin-bottom: var(--space-6);
    }
    
    .filter-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: var(--space-3);
      color: var(--neutral-800);
    }
    
    .filter-options {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .filter-option {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
      cursor: pointer;
    }
    
    .filter-option span {
      color: var(--neutral-700);
    }
    
    .price-inputs {
      display: flex;
      gap: var(--space-2);
    }
    
    .price-input {
      flex: 1;
    }
    
    .price-input label {
      display: block;
      font-size: 0.875rem;
      margin-bottom: var(--space-1);
      color: var(--neutral-600);
    }
    
    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }
    
    .tag-button {
      background-color: var(--neutral-100);
      border: 1px solid var(--neutral-200);
      color: var(--neutral-700);
      font-size: 0.875rem;
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: var(--transition-all);
    }
    
    .tag-button:hover {
      background-color: var(--neutral-200);
    }
    
    .tag-button.active {
      background-color: var(--primary-100);
      border-color: var(--primary-300);
      color: var(--primary-700);
    }
    
    .toolbar {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }
    
    .search-box {
      flex: 1;
    }
    
    .sort-options {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .sort-options label {
      color: var(--neutral-700);
      white-space: nowrap;
    }
    
    .sort-options .form-select {
      min-width: 180px;
    }
    
    .loading-indicator,
    .no-products {
      text-align: center;
      padding: var(--space-12);
      color: var(--neutral-600);
    }
    
    .no-products .btn {
      margin-top: var(--space-4);
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: var(--space-6);
    }
    
    @media (min-width: 640px) {
      .toolbar {
        flex-direction: row;
      }
      
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 1024px) {
      .product-layout {
        grid-template-columns: 280px 1fr;
      }
      
      .products-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @media (min-width: 1280px) {
      .products-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  popularTags: string[] = [];
  
  // Filters
  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedTags: string[] = [];
  searchQuery: string = '';
  sortOption: string = 'name-asc';
  
  loading: boolean = true;
  pageTitle: string = 'All Products';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadTags();
    
    // Get filter parameters from URL
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        this.pageTitle = this.selectedCategory;
      }
      
      if (params['minPrice']) {
        this.minPrice = Number(params['minPrice']);
      }
      
      if (params['maxPrice']) {
        this.maxPrice = Number(params['maxPrice']);
      }
      
      if (params['tags']) {
        this.selectedTags = Array.isArray(params['tags']) 
          ? params['tags'] 
          : [params['tags']];
      }
      
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      
      if (params['sort']) {
        this.sortOption = params['sort'];
      }
      
      // Special filter for featured products
      if (params['filter'] === 'featured') {
        this.pageTitle = 'Featured Products';
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
      this.applyFilters();
      this.loading = false;
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadTags(): void {
    this.productService.getTags().subscribe(tags => {
      // Get the 10 most popular tags
      this.popularTags = tags.slice(0, 10);
    });
  }

  applyFilters(): void {
    // Start with all products
    let result = [...this.allProducts];
    
    // Apply category filter
    if (this.selectedCategory) {
      result = result.filter(product => product.category === this.selectedCategory);
    }
    
    // Apply price filters
    if (this.minPrice !== null) {
      result = result.filter(product => 
        (product.discountPrice || product.price) >= this.minPrice!
      );
    }
    
    if (this.maxPrice !== null) {
      result = result.filter(product => 
        (product.discountPrice || product.price) <= this.maxPrice!
      );
    }
    
    // Apply tag filters
    if (this.selectedTags.length > 0) {
      result = result.filter(product => 
        this.selectedTags.some(tag => product.tags.includes(tag))
      );
    }
    
    // Apply search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply featured filter from URL if present
    this.route.queryParams.subscribe(params => {
      if (params['filter'] === 'featured') {
        result = result.filter(product => product.featured);
      }
    });
    
    this.filteredProducts = result;
    this.sortProducts();
    
    // Update URL with filters
    this.updateUrlParams();
  }

  sortProducts(): void {
    switch (this.sortOption) {
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        this.filteredProducts.sort((a, b) => 
          (a.discountPrice || a.price) - (b.discountPrice || b.price)
        );
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => 
          (b.discountPrice || b.price) - (a.discountPrice || a.price)
        );
        break;
      case 'rating-desc':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    this.updateUrlParams();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.pageTitle = category;
    this.applyFilters();
  }

  toggleTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedTags = [];
    this.searchQuery = '';
    this.sortOption = 'name-asc';
    this.pageTitle = 'All Products';
    this.applyFilters();
  }

  private updateUrlParams(): void {
    const queryParams: any = {};
    
    if (this.selectedCategory) {
      queryParams.category = this.selectedCategory;
    }
    
    if (this.minPrice !== null) {
      queryParams.minPrice = this.minPrice;
    }
    
    if (this.maxPrice !== null) {
      queryParams.maxPrice = this.maxPrice;
    }
    
    if (this.selectedTags.length > 0) {
      queryParams.tags = this.selectedTags;
    }
    
    if (this.searchQuery) {
      queryParams.search = this.searchQuery;
    }
    
    if (this.sortOption !== 'name-asc') {
      queryParams.sort = this.sortOption;
    }
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }
}