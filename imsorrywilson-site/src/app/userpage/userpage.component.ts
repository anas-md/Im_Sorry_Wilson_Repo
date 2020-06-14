import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { Users } from '../Users';
import { Posts } from '../Posts';
import { PostsService } from '../posts.service';
import { DataSend } from '../data';
import { ReadVarExpr } from '@angular/compiler';
import { rejects } from 'assert';
import { splitAtColon } from '@angular/compiler/src/util';


@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css']
})
export class UserpageComponent implements OnInit {

  constructor(private router: Router, private userservice: UsersService, private postservice:PostsService) { }

  user:Users = {
    id: 7,
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    pic: null
  }

  searchedUser:Users = {
    id: 0,
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    pic: null
  }

  home:number = 0; //0 for user page, 1 for settings page, 2 for search //3 for user profile page

  posts:Posts[];

  post:Posts={
    id:0,
    userID: this.user.id,
    post:"",
    pic: null,
    likeCount: 0,
    postDate:""
  }
  
  ngOnInit(): void {
    this.user = this.userservice.getIndividualUser();
    this.postservice.getPostData().subscribe(res => this.posts = res);
  }

  charactersRemaining = '200';
  current = '';
  updateCountdown(){
    this.charactersRemaining = (199 - this.current.length).toString();
  }

  homie(){
    this.home = 0;
  }
  settings(){
    this.home = 1;
  }
  
  searchUName:"";
  search(f){
    this.home = 2;
    this.userservice.searchForUser(f.value).subscribe(res => this.searchedUser = res);
  }
  profile(){
    this.home = 3;
  }

  changeFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  imagePreview:any;
  postPic:any;
  fileChange(event){
    this.postPic = event.target.files[0];
    if(event.target.value){
      const file = event.target.files[0];
      this.changeFile(file).then((base64:string):any=>{
       this.imagePreview = [base64];
        this.postPic = base64;
        this.post.pic = this.postPic.split(',')[1];
      })
    }
  }
  image;
  postIt(){
    this.post.userID = this.user.id;
    this.post.post = this.current;
    this.postservice.newPost(this.post).subscribe();
  }

  data:DataSend={
    firstName: this.user.firstName,
    lastName:this.user.lastName,
    email:this.user.email,
    pic: this.user.pic,
    username:this.user.username
  }
    
  fileChange1(event){
    this.postPic = event.target.files[0];
    if(event.target.value){
      const file = event.target.files[0];
      this.changeFile(file).then((base64:string):any=>{
       this.imagePreview = [base64];
        this.postPic = base64;
        this.user.pic = this.postPic.split(',')[1];
      })
    }
  }
  updateInfo(){
    this.data.firstName = this.user.firstName;
    this.data.lastName = this.user.lastName;
    this.data.email = this.user.email;
    this.data.pic = this.user.pic;
    this.data.username = this.user.username;
    
    this.userservice.updateInfo(this.data).subscribe();
  }

  vPassword = "";
  isHidden = true;
  verifyPassword(){
    if (this.vPassword == this.user.password){
      this.isHidden = false;
    }else{
      window.alert('Password does not match');
    }
  }

  newPassword = "";
  updatePassword(){
    console.log(this.newPassword);
    this.user.password = this.newPassword;
    console.log(this.user.password);
    this.userservice.updatePassword(this.user).subscribe();
  }
  radioStatus:boolean = true;
  like(event,id,like){
    this.radioStatus = !event;
    console.log(event);
    console.log(id);
    console.log(like);
    if(event == true){
     this.postservice.likePost(id).subscribe();
    }else if(event == false){
      this.postservice.unLikePost(id).subscribe();
    }
  }

  logout(){
    this.router.navigate(['login']);
  }
}
