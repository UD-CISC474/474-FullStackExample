import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryItemModel } from '../models/items.model';
import { Config } from '../config';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private httpClient: HttpClient) {}
  public pageSize:number=Config.pageSize;

  public getInventoryCount(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.httpClient.get<{count:number}>(`${Config.apiBaseUrl}/items/count`).subscribe({
        next: (data) => {
          resolve(data.count);
        },
        error: (err) => {
          reject(err);
        },
      })
    });
  }
  public getInventoryItems(page:number): Promise<InventoryItemModel[]> {
    const start=page*this.pageSize;
    const end=start+this.pageSize-1;
    return new Promise<InventoryItemModel[]>(async (resolve, reject) => {
      this.httpClient.get<InventoryItemModel[]>(`${Config.apiBaseUrl}/items/?start=${start}&end=${end}`).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      })
    });
  }
}
