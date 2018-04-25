import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Client} from '../search-client/client';
import {ClientService} from '../search-client/client.service';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent implements OnInit {

  public client: Client;

  constructor(private route: ActivatedRoute, private router: Router, private clientService: ClientService) {
    this.client = new Client();
  }

  ngOnInit() {
    this.clientService.view(this.route.snapshot.params['clientId']).subscribe(result => {
      this.client = result;
    });
  }

  public goToSearchClient(): void {
    this.router.navigate(['/']);
  }

}
