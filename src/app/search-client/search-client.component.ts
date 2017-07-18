import {Component} from '@angular/core';
import {ClientService} from './client.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search-client',
  templateUrl: './search-client.component.html',
  styleUrls: ['./search-client.component.css']
})
export class SearchClientComponent {

  public maskCNPJ = [/[0-9]/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/',
    /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  public clientCnpj = '';

  public searchClientError = '';

  public routerLink: Router;

  constructor(private clientService: ClientService, private router: Router) {
    this.routerLink = router;
  }

  public searchClient(): void {
    this.clientService.getClientIdByCNPJ(this.clientCnpj).subscribe(result => {
      this.routerLink.navigate(['/financeiro', result]);
    }, error => {
      this.searchClientError = error.json().message;
      setTimeout(() => {
        this.searchClientError = '';
      }, 2000);
    });
  }

}
