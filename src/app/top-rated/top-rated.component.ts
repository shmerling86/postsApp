import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../posts/posts.service';
import { Subscription } from 'rxjs';
import { Post } from '../posts/post.model';

@Component({
  selector: 'app-top-rated',
  templateUrl: './top-rated.component.html',
  styleUrls: ['./top-rated.component.css']
})
export class TopRatedComponent implements OnInit, OnDestroy {

  postsSub: Subscription;
  posts: Post[];

  constructor(public postsService: PostsService) { }

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateLisetner()
      .subscribe((posts: Post[]) => {
        this.posts = posts.sort((a, b) => { return b.votes.length - a.votes.length });
      },
        (error) => {
          console.log("getPostUpdateLisetner", error.error);
        })
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

}
