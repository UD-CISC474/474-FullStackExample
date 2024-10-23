import { Component, Input } from '@angular/core';
import { emptyItem, InventoryItemModel } from '../../models/items.model';
import { LoginService } from '../../services/login.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  @Input() item: InventoryItemModel=emptyItem;

  public canAddToCart:boolean=false;

  constructor(private _authSvc:LoginService) {    
    _authSvc.loggedIn.subscribe((loggedIn:boolean)=>{
      this.canAddToCart=loggedIn;
  });
}

}
