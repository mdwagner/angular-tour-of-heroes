import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  hero: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  async getHero() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.hero = await this.heroService.getHero(id);
  }

  goBack() {
    this.location.back();
  }

  save() {
    this.heroService.updateHero(this.hero).then(() => this.goBack());
  }
}
