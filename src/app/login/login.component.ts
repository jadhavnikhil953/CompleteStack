import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as crypto from "crypto-js";
import{ MatDialog} from '@angular/material/dialog';
import { DialogContentExampleDialog } from '../practice/practice.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public uname: any = "";
  public pw: any = "";
  public uname_new: any = "";
  public pw_new: any = "";
  public pw_repeat: any = "";

  constructor( private dataService : DataService, private dialogRef : MatDialog, private router : Router) { }

  ngOnInit(): void {
  }

  signUp(){
    if(this.pw_new == this.pw_repeat){
      let encryptedPassword = crypto.AES.encrypt(this.pw_new, "MySecretKey").toString();
      this.dataService.signUp({uname:this.uname_new, cipher:encryptedPassword}).subscribe((data:any) =>{
        let dialog = this.dialogRef.open(DialogContentExampleDialog, {
          data: {
            message: data.message
          }
        });
        dialog.afterClosed().subscribe(result => {
          //console.log(`Dialog result: ${result}`);
          let isVisible = document.getElementById('signup');
          isVisible?.style.setProperty('display','none');
        });
      });
    }
    else{
      let dialog = this.dialogRef.open(DialogContentExampleDialog, {
        data: {
          message: "Password doesn't match"
        }
      });
      dialog.afterClosed().subscribe(result => {
        //console.log(`Dialog result: ${result}`);
      });
    }
  }

  login(){
    if(this.uname == ""){
    // This is to display dialog box

    let dialog = this.dialogRef.open(DialogContentExampleDialog, {
        data: {
          message: 'Please enter username'
        }
      });
    dialog.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
    }
    else{
      if(this.pw == ""){
        // This is to display dialog box
    
        let dialog = this.dialogRef.open(DialogContentExampleDialog, {
            data: {
              message: 'Please enter password'
            }
          });
        dialog.afterClosed().subscribe(result => {
          //console.log(`Dialog result: ${result}`);
        });
        }   
        else{
          // This is login api call
          let encryptedPassword = crypto.AES.encrypt(this.pw, "MySecretKey").toString();
          this.dataService.login({uname:this.uname,cipher:encryptedPassword}).subscribe((data:any) =>{
            //console.log(data)
            if(!data.success){
                let dialog = this.dialogRef.open(DialogContentExampleDialog, {
                  data: {
                    message: data.message
                  }
                });
                dialog.afterClosed().subscribe(result => {
                  //console.log(`Dialog result: ${result}`);
                });
            }
            else{
              this.dataService.setCurrentUser(data.user);
              console.log(this.dataService.getCurrentUser())
              this.router.navigate(['practice']);
            }
          });
        }
    }
  }

}
