import { Component } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { CommonModule } from '@angular/common';
import { InventoryItemModel } from '../../models/items.model';
import { MatCardModule } from '@angular/material/card';
import { ItemComponent } from "../item/item.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public items:InventoryItemModel[]=[];
  constructor(private itemSvc: ItemService) {
    this.itemSvc
      .getInventoryItems()
      .then((items) => {
        this.items=[...items,...items,...items,...items,...items,...items,...items,...items,...items];
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
