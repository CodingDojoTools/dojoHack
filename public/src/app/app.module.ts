import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { RegisterMembersComponent } from './register-members/register-members.component';
import { DynamicComponent } from './dynamic/dynamic.component';
import { AddressComponent } from './dynamic/address/address.component';
import { HttpService } from './http.service';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    RegisterMembersComponent,
    DynamicComponent,
    AddressComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
