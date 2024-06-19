import { OnInit, Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu', // Define o seletor do componente
    templateUrl: './app.menu.component.html' // Template do componente
})
export class AppMenuComponent implements OnInit {

    model: any[] = []; // Modelo de dados do menu

    constructor(public layoutService: LayoutService) { } // Injeta o serviço de layout

    ngOnInit() {
        // Inicializa o modelo de dados do menu
        this.model = [
            {
                label: 'Loja', // Rótulo do item de menu principal
                icon: 'pi pi-fw pi-shop', // Ícone do item de menu principal
                items: [
                    {
                        label: 'Cliente', // Rótulo do item de submenu
                        icon: 'pi pi-fw pi-user', // Ícone do item de submenu
                        routerLink: ['/pages/client'] // Rota do item de submenu
                    },
                    {
                        label: 'Pedido', // Rótulo do item de submenu
                        icon: 'pi pi-fw pi-cart-plus', // Ícone do item de submenu
                        routerLink: ['/pages/crud'] // Rota do item de submenu
                    },
                    {
                        label: 'Produto', // Rótulo do item de submenu
                        icon: 'pi pi-fw pi-box', // Ícone do item de submenu
                        routerLink: ['/pages/orders'] // Rota do item de submenu
                    },
                ]
            },
        ];
    }
}
