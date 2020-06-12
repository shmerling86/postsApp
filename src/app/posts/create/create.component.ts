import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { environment } from 'src/environments/environment';
import { Post } from '../post.model';
import { mimeType } from "../../mime-type.validator";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, OnDestroy {

  addForm: FormGroup;

  getPostSub: Subscription;
  isLoginSub: Subscription;

  mode: string = 'create';
  postId: string;
  imagePreview: string;

  post: Post;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private route: Router,
    private http: HttpClient,
    public postsService: PostsService,
    public authService: AuthService,
    public modalClose: MatDialogRef<CreateComponent>) { }

  ngOnInit(): void {
    this.isLoginSub = this.authService.isLogin
      .subscribe(isLogin => {
        if (!isLogin) this.route.navigate(["/"]);
      });

    this.addForm = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      description: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    if (this.data != null) {
      this.mode = 'edit';
      this.postId = this.data.id
      this.getPostSub = this.getPost(this.postId)
        .subscribe((post: Post) => {
          this.post = {
            title: post.title,
            description: post.description,
            date: post.date,
            lastModified: post.lastModified,
            imagePath: post.imagePath
          }
          this.addForm.setValue({
            title: this.post.title,
            description: this.post.description,
            image: this.post.imagePath
          })
        });
    } else {
      this.mode = 'create'
    }
  }

  getPost(postId) {
    return this.http.get(`${environment.apiUrl}/posts/${postId}`)
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.addForm.patchValue({ image: file });
    this.addForm.get("image").updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


  onSave() {
    if (this.addForm.invalid) {
      return;
    }
    if (this.mode === "create") {
      this.postsService.addPost(
        this.addForm.value.title,
        this.addForm.value.description,
        this.addForm.value.image,
        this.authService.userId,
        this.authService.userName,
        this.authService.userProfileImage
      );
    }
    else {
      this.postsService.updatePost(
        this.postId,
        this.addForm.value.title,
        this.addForm.value.description,
        this.addForm.value.image
      );
    }
    this.modalClose.close();
  }

  ngOnDestroy(): void {
    if (this.getPostSub) this.getPostSub.unsubscribe();
    this.isLoginSub.unsubscribe();
  }

}
