import { Component, OnInit } from '@angular/core';
import { CourrierService } from '../services/courrier.service';

@Component({
  selector: 'app-achive',
  templateUrl: './achive.component.html',
  styleUrls: ['./achive.component.scss']
})
export class AchiveComponent implements OnInit {
  archives: any[] = [];

  constructor(private courrierService: CourrierService) {}

  ngOnInit(): void {
    this.courrierService.getArchives().subscribe(data => {
      this.archives = data;
    });
  }
}
