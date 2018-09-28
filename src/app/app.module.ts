import { removeSpecialChars } from './shared/removeSpecialChars';
import { AppRoutingModule } from './app-routing.module';
import { MoviesService } from './shared/movies.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    AppRoutingModule.components,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    removeSpecialChars,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [
    MoviesService,
    removeSpecialChars,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
