import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];

  postsSub: Subscription;
  isLoginSub: Subscription;

  constructor(
    public postsService: PostsService,
    public authService: AuthService,
    public modalOpen: MatDialog
  ) { }
  addCommentForm: FormGroup;
  isLogin: boolean;

  ngOnInit(): void {
    this.addCommentForm = new FormGroup({
      comment: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)])
    })

    this.isLoginSub = this.authService.isLogin
      .subscribe(e => { this.isLogin = e });
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateLisetner()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      },
        (error) => {
          console.log("getPostUpdateLisetner", error.error);
        })
  }

  onDelete(id: string): void {
    this.postsService.deletePost(id);
  }

  onAdd(): void {
    this.modalOpen.open(CreateComponent);
  }

  onEdit(id): void {
    this.modalOpen.open(CreateComponent, {
      data: { id: id },
    });
  }

  onVote(id): void {
    this.postsService.upVote(id, this.authService.userId);
  }

  onKeep(id): void {
    this.postsService.addToMyKeeps(id, this.authService.userId);
  }

  onAddComment(form, postId): void {
    this.postsService.addComment(form, postId, this.authService.userName, this.authService.userProfileImage);
    this.addCommentForm.reset(); 
  }

  ngOnDestroy(): void {
    if (this.postsSub) this.postsSub.unsubscribe();
    if (this.isLoginSub) this.isLoginSub.unsubscribe();
  }
}