import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostsService } from '../posts/posts.service';
import { AuthService } from '../auth/auth.service';
import { Post } from '../posts/post.model';

@Component({
  selector: 'app-keeps',
  templateUrl: './keeps.component.html',
  styleUrls: ['./keeps.component.css']
})

export class KeepsComponent implements OnInit, OnDestroy {

  postsSub: Subscription;
  isLoginSub: Subscription;

  isLogin: Boolean;
  isLoading: Boolean = false;

  keeps: Post[] = [];

  constructor(public postsService: PostsService, public authService: AuthService) { }

  ngOnInit(): void  {
    this.getUserSavedPosts();
  }

  getUserSavedPosts(): void {
    this.isLoginSub = this.authService.isLogin
      .subscribe(e => { this.isLogin = e });
    if (!this.isLogin) return

    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateLisetner()
      .subscribe((posts: Post[]) => {
        posts.forEach(post => {
          post.userKeepsIDs.forEach(id => {
            if (id === this.authService.userId) this.keeps.push(post);
          });
        })
        this.isLoading = false;
      },
        (error) => {
          console.log("getPostUpdateLisetner", error.error);
        })
  }

  unKeepPost(id): void  {
    this.keeps = this.keeps.filter(keep => keep._id !== id);
    this.postsService.unKeepPost(id);
  }

  ngOnDestroy(): void {
    if (this.postsSub) this.postsSub.unsubscribe();
    if (this.isLoginSub) this.isLoginSub.unsubscribe();
  }

}
