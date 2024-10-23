import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryItemModel } from '../models/items.model';
import { Config } from '../config';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private httpClient: HttpClient) {}

  public getInventoryItems(): Promise<InventoryItemModel[]> {
    return new Promise<InventoryItemModel[]>(async (resolve, reject) => {
      this.httpClient.get<InventoryItemModel[]>(Config.apiBaseUrl+'/items/').subscribe({
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
