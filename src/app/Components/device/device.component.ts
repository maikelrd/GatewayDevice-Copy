import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ChildActivationStart } from '@angular/router';
import { GatewayDeviceService } from 'src/app/Services/gateway-device.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  listDevice:any[]=[];
  accion='Agregar';
  form:FormGroup;
  id:number|undefined; 

  constructor(private fb:FormBuilder, private _gatewayDeviceService:GatewayDeviceService) {
    this.form=this.fb.group({
      vendor:['',Validators.required],
      status:['',Validators.required],
      gatewaySerialNumber:['',Validators.required]
    })
   }

  ngOnInit(): void {
    this.getDevices();
  }

  getDevices(){
    this._gatewayDeviceService.getListDevices().subscribe(data=>{
      console.log(data);
      this.listDevice=data;
    },error=>{
      console.log(error);
    })    
  }

  saveDevice(){
    const device:any={
      vendor:this.form.get('vendor')?.value,
      status:this.form.get('status')?.value,
      gatewaySerialNumber:this.form.get('gatewaySerialNumber')?.value
    }

    if(this.id==undefined){
      //Add new gateway
      this._gatewayDeviceService.saveDevice(device).subscribe(data=>{
        this.getDevices();
        this.form.reset();
      },error=>{
        console.log(error);
      })      
    }else{
      device.uid=this.id;
      //edit gateway
      this._gatewayDeviceService.updateDevice(this.id,device).subscribe(data=>{
        this.form.reset();
        this.accion="Agregar";
        this.id=undefined;
        this.getDevices();
      },error=>{
        console.log(error);
      });      
    }
  }

  deleteDevice(id:number){
    this._gatewayDeviceService.deleteDevice(id).subscribe(data=>{
      this.getDevices();
    },error=>{
      console.log(error);
    })
  }

  editDevice(device:any){
    this.accion='Editar';
    this.id=device.uid;
    this.form.patchValue({
      vendor:device.vendor,
      status:device.status,
      gatewaySerialNumber:device.gatewaySerialNumber      
    })  
    
  }

}
