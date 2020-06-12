import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { environment } from 'src/environments/environment';
import { ErrorComponent } from '../error/error.component';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  posts: Post[] = [];
  private userKeepsIDs: string[] = [];
  private postsUpdated = new Subject<Post[]>();


  constructor(private http: HttpClient, public errorMsg: MatDialog) { }

  getPosts() {
    this.http.get<{ message: string, posts: Post[] }>(`${environment.apiUrl}/posts`)
      .subscribe(posts => {
        this.posts = posts.posts.slice().reverse();
        this.postsUpdated.next([...this.posts])
      },
        (error) => {
          const dialogRef = this.errorMsg.open(ErrorComponent, {
            data: { message: error.message },
          });
          console.log("getPosts", error.message, error.error.message);
        })
  }

  getPostUpdateLisetner() {
    return this.postsUpdated.asObservable();
  }


  addPost(title: string, description: string, image: File, creator: string, creatorName: string, profileImage: string) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("description", description);
    postData.append("image", image, title);
    postData.append("creator", creator);
    postData.append("creatorName", creatorName);
    postData.append("profileImage", profileImage);

    this.http
      .post<{ message: string, post: { _doc: Post } }>(
        `${environment.apiUrl}/posts/`,
        postData
      )
      .subscribe((res) => {
        this.posts.push(res.post._doc);
        this.postsUpdated.next([...this.posts]);
        this.getPosts();
      },
        (error) => {
          console.log("addPostErr", error);
          const dialogRef = this.errorMsg.open(ErrorComponent, {
            data: { message: error.error.message },
          });
        });
  }

  updatePost(id: string, title: string, description: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("description", description);
      postData.append("image", image, title);
    } else {
      postData = {
        _id: id,
        title: title,
        description: description,
        imagePath: image
      };
    }
    this.http.put(`${environment.apiUrl}/posts/${id}`, postData)
      .subscribe((responseData: { post: Post }) => {
        this.updateOnePost(responseData, id);
      },
        (error) => {
          console.log("updatePost", error);
          const dialogRef = this.errorMsg.open(ErrorComponent, {
            data: { message: error.error.message },
          });
        });
  }

  updateOnePost(responseData, id) {
    const lastUpdatedPosts = [...this.posts];
    const oldPostIndex = lastUpdatedPosts.findIndex(e => e._id === id);
    if (responseData.post) {
      lastUpdatedPosts[oldPostIndex] = responseData.post;
    } else {
      lastUpdatedPosts[oldPostIndex].votes = responseData.votes;
    }
    this.posts = lastUpdatedPosts;
    this.postsUpdated.next([...this.posts]);
    this.getPosts();
  }

  deletePost(id: string) {
    this.http.delete(`${environment.apiUrl}/posts/${id}`)
      .subscribe((deletePostRes) => {
        const posts: Post[] = this.posts.filter(post => post._id !== id);
        this.posts = posts
        this.postsUpdated.next([...this.posts]);
        this.getPosts();
      },
        (error) => {
          console.log("deletePost", error);
          const dialogRef = this.errorMsg.open(ErrorComponent, {
            data: { message: error.error.message },
          });
        });
  }

  upVote(id: string, voter: string) {
    const postVoted: Post[] = this.posts.filter(post => post._id === id);
    const votes = postVoted[0].votes;
    if (votes.includes(voter)) return
    this.http.patch(`${environment.apiUrl}/posts/${id}`, { votes: votes })
      .subscribe(responseData => {
        this.updateOnePost(responseData, id);
      },
        (error) => {
          console.log("upVote", error);
          const dialogRef = this.errorMsg.open(ErrorComponent, {
            data: { message: error.error.message },
          });
        });
  }

  addToMyKeeps(postId, userId) {
    if (this.userKeepsIDs.includes(userId)) return
    this.http.patch(`${environment.apiUrl}/posts/keeps/add/${postId}`, { userKeepsIDs: this.userKeepsIDs })
      .subscribe((res: { message: string }) => {
        const dialogRef = this.errorMsg.open(ErrorComponent, {
          data: { message: res.message },
        });
      },
        (err) => {
          console.log(err);
        })
  }

  unKeepPost(postId) {
    this.http.patch(`${environment.apiUrl}/posts/keeps/unkeep/${postId}`, { userKeepsIDs: this.userKeepsIDs })
      .subscribe((res: { message: string }) => {
        console.log(res.message)
      },
        (err) => {
          console.log(err);
        })
  }

  addComment(form, postId, user, userProfileImage) {
    if (form.invalid) return;
    const postRef: Post[] = this.posts.filter(post => post._id === postId);
    const comment = { content: form.value.comment, creator: user, date: new Date(), userProfileImage: userProfileImage };
    const comments = postRef[0].comments;

    this.http.patch(`${environment.apiUrl}/posts/comments/${postId}`, { comments: comments, newComment: comment })
      .subscribe((res: { message: string, comments: object[] }) => {
        const lastShotPosts = [...this.posts];
        const lastShotPostsIndex = lastShotPosts.findIndex(e => e._id === postId);
        lastShotPosts[lastShotPostsIndex].comments = res.comments
        this.posts = lastShotPosts;
        this.postsUpdated.next([...this.posts]);
      }, (err) => {
        console.log(err);
      })
  }

}
