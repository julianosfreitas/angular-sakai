// Importações necessárias para o componente
import { Component, OnInit } from '@angular/core';
import { Product } from './models/product.model'; // Importa o modelo Product
import { MessageService } from 'primeng/api'; // Importa o serviço de mensagens do PrimeNG
import { Table } from 'primeng/table'; // Importa a tabela do PrimeNG
import { ProductService } from './services/product.service'; // Importa o serviço de produto

@Component({
templateUrl: './crud.component.html', // Define o template do componente
providers: [MessageService] // Declara o MessageService como provedor do componente
})
export class CrudComponent implements OnInit {

    productDialog: boolean = false; // Controla a visibilidade do diálogo de produto

    deleteProductDialog: boolean = false; // Controla a visibilidade do diálogo de exclusão de produto

    deleteProductsDialog: boolean = false; // Controla a visibilidade do diálogo de exclusão de produtos selecionados

    products: Product[] = []; // Armazena a lista de produtos

    product: Product = {}; // Armazena o produto atualmente sendo criado ou editado

    selectedProducts: Product[] = []; // Armazena os produtos selecionados para exclusão

    submitted: boolean = false; // Indica se o formulário foi submetido

    cols: any[] = []; // Armazena as colunas da tabela

    statuses: any[] = []; // Armazena os possíveis status de inventário

    rowsPerPageOptions = [5, 10, 20]; // Opções de quantidade de linhas por página na tabela

    constructor(private productService: ProductService, private messageService: MessageService) { }

    ngOnInit() {
        // Obtém os produtos do serviço e os armazena na variável products
        this.productService.getProducts().subscribe((products: any) => {
            this.products = products;
            console.log(products);
        });

        // Define as colunas da tabela
        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        // Define os possíveis status de inventário
        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    openNew() {
        // Abre o diálogo para criar um novo produto
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        // Abre o diálogo para confirmar a exclusão dos produtos selecionados
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        // Abre o diálogo para editar um produto existente
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        // Abre o diálogo para confirmar a exclusão de um produto e o exclui
        this.deleteProductDialog = true;
        this.productService.deleteProduct(product.key);
        this.confirmDelete();
    }

    confirmDeleteSelected() {
        // Confirma a exclusão dos produtos selecionados
        this.deleteProductsDialog = false;
        this.selectedProducts.forEach(product => {
            this.productService.deleteProduct(product.key);
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedProducts = [];
    }

    confirmDelete() {
        // Confirma a exclusão de um produto
        this.deleteProductDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        this.product = {};
    }

    hideDialog() {
        // Fecha o diálogo de criação ou edição de produto
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        // Salva um novo produto ou atualiza um existente
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                // Atualiza o status de inventário do produto
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
                // Atualiza o produto no serviço
                this.productService.updateProduct(this.product.key, this.product);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                // Cria um novo produto
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = 'INSTOCK';
                this.productService.addProduct(this.product);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            // Atualiza a lista de produtos e fecha o diálogo
            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        // Encontra o índice de um produto pelo seu ID
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        // Gera um ID aleatório
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        // Aplica um filtro global na tabela
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
