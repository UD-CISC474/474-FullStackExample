import { Component } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { CommonModule } from '@angular/common';
import { InventoryItemModel } from '../../models/items.model';
import { MatCardModule } from '@angular/material/card';
import { ItemComponent } from "../../components/item/item.component";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ItemComponent,MatPaginatorModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public items:InventoryItemModel[]=[];
  public itemCount:number=0;
  public pageIndex:number=0;

  public get pageSize():number{
    return this.itemSvc.pageSize;
  }

  constructor(private itemSvc: ItemService) {
    this.loadData();
  }

  async loadData():Promise<void>{
    try{
    this.itemCount=await this.itemSvc.getInventoryCount();
    this.items=await this.itemSvc.getInventoryItems(this.pageIndex);
    }catch(err){
      console.error(err);
    }
  }
  handlePageEvent=(event:PageEvent)=>{
    console.log(event.pageIndex);
    this.pageIndex=event.pageIndex;
    this.loadData();
  }
}
