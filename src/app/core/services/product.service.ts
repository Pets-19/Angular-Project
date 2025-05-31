import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { PRODUCTS } from '../data/mock-products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = PRODUCTS;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    // Simulate API call with delay
    return of(this.products).pipe(delay(500));
  }

  getProduct(id: number): Observable<Product | undefined> {
    // Simulate API call with delay
    return of(this.products.find(product => product.id === id)).pipe(delay(300));
  }

  getFeaturedProducts(limit: number = 6): Observable<Product[]> {
    return of(
      this.products
        .filter(product => product.featured)
        .slice(0, limit)
    ).pipe(delay(300));
  }

  getNewProducts(limit: number = 8): Observable<Product[]> {
    return of(
      this.products
        .filter(product => product.new)
        .slice(0, limit)
    ).pipe(delay(300));
  }

  searchProducts(query: string): Observable<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return of(
      this.products.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) || 
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    ).pipe(delay(300));
  }

  filterProducts(category?: string, minPrice?: number, maxPrice?: number, tags?: string[]): Observable<Product[]> {
    return of(
      this.products.filter(product => {
        // Category filter
        if (category && product.category !== category) {
          return false;
        }
        
        // Price filter
        if (minPrice !== undefined && product.price < minPrice) {
          return false;
        }
        
        if (maxPrice !== undefined && product.price > maxPrice) {
          return false;
        }
        
        // Tags filter
        if (tags && tags.length > 0) {
          return tags.some(tag => product.tags.includes(tag));
        }
        
        return true;
      })
    ).pipe(delay(300));
  }

  getCategories(): Observable<string[]> {
    return of([...new Set(this.products.map(product => product.category))]).pipe(delay(200));
  }

  getTags(): Observable<string[]> {
    const allTags = this.products.flatMap(product => product.tags);
    return of([...new Set(allTags)]).pipe(delay(200));
  }
}