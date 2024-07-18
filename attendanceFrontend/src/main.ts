import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
export function getbaseurl(){
  return "http://localhost:3000/admin"

}
export function empbaseurl(){
  return "http://localhost:3000/employee"
}
 const provider=[
  {
    provide:'baseurl',useFactory:getbaseurl,desp:[]
  },
  {
    provide:'embaseurl',useFactory:empbaseurl,desp:[]
  }
 ]
platformBrowserDynamic(provider).bootstrapModule(AppModule)
  .catch(err => console.error(err));
