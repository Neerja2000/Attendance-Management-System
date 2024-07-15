import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
export function getbaseurl(){
  return "http://localhost:3000/admin"
}
 const provider=[
  {
    provide:'baseurl',useFactory:getbaseurl,desp:[]
  }
 ]
platformBrowserDynamic(provider).bootstrapModule(AppModule)
  .catch(err => console.error(err));
