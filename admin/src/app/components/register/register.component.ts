import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
import { ClienteService } from 'src/app/service/cliente.service';
declare var iziToast:any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public admin : any ={
  };

  constructor(
    private _adminService:AdminService,
    private _router:Router
  ){
  }
  register(registerForm : NgForm){
    if(registerForm.valid){
      console.log(this.admin)
      this._adminService.registro_admin(this.admin).subscribe(
        response=>{
          console.log(response);
          iziToast.show({
            title :'SUCCESS',
            titleColor : '#1DC74C',
            color : '#FFF',
            class : 'text-success',
            position : 'topRight',
            message:'Se registro correctamente el cliente'
          });
          this.admin = {
            nombres:'',
            apellidos:'',
            email:'',
            password:'',
            telefono:'',
            rol:'',
            dni:''
          }
          this._router.navigate(['panel/registro'])
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
