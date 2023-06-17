import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { MapComponent } from "./views/map/map.component";

const routes: Routes = [
  { path: "map", component: MapComponent },
  { path: "**", redirectTo: "/map", pathMatch: "prefix" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
