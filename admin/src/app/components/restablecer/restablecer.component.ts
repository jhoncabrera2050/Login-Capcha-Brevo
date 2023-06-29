import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
declare var iziToast:any;
@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.component.html',
  styleUrls: ['./restablecer.component.css']
})
export class RestablecerComponent {
  public admin : any ={
  };

  constructor(
    private _adminService:AdminService,
    private _router:Router
  ){
  }
  restablecer(restablecerForm : NgForm){
    if(restablecerForm.valid){
      console.log(this.admin)
      this._adminService.restablecercontraseña(this.admin).subscribe(
        response=>{
          console.log(response);
          iziToast.show({
            title :'SUCCESS',
            titleColor : '#1DC74C',
            color : '#FFF',
            class : 'text-success',
            position : 'topRight',
            message:'Se restablecio correctamente la contraseña'
          });
          this.admin = {
            email:'',
            password:''
          }
          console.log(this.admin)
          this._router.navigate(['/panel'])
        },error=>{
          console.log(error);
        }
      )
    }else{
      iziToast.show({
        title :'ERROR',
        titleColor : '#FF0000',
        class : 'text-danger',
        position : 'topRight',
        message:'los datos del formulario no son validos'
      });
    }
}
}
