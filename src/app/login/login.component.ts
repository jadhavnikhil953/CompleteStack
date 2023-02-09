import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as crypto from "crypto-js";
import{ MatDialog} from '@angular/material/dialog';
import { DialogContentExampleDialog } from '../practice/practice.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public uname: any = "";
  public pw: any = "";
  constructor( private dataService : DataService, private dialogRef : MatDialog) { }

  ngOnInit(): void {
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
            console.log(data)
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
          });
        }
    }
  }

}