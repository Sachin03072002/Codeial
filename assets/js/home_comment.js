//this class would be initialized for every post on the page
// 1. when the page loads
// 2. creationm of every post dynamically via ajax
class PoatComments{
    //constructor is used to initialize the instance of the class whemever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);
        this.createComment(postId);
        let self=this;
        //cal for all the existing comments
        $(' .delete-comment-button',this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }
    createComment(postId){
        let pSelf=this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self=this;
            $.ajax({
                type:'post',
                url:'/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    let newComment=pSelf.newCommentForm(data.data.comment);
                    $(`#post-comments-${postId}`).append(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));
                    new Noty(
                        {
                            theme: relax,
                            text: 'Comment Added',
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1500
                        }
                    ).show();
                },error: function(error){
                    console.log(error.responseText);
                }

            });
        });
    }

    newCommentDom(comment){
        //added a class 'delete-comment-button' to the delete comment link and also id to the comment list
        return $(`<li id="post-comment-${comment._id}">

                
        <p>
           
                <small>
                    <a class="delete-comment-button" href="/comments/destroy/<%= comment.id %>">
                        X    
                    </a>
                </small>
             
            ${comment.content}
        </p>
        <br>
        <small>
            ${comment.user.name}
        </small>
        </li>`);
    }
    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                    new Noty(
                        {
                            theme: relax,
                            text: 'Comment Deleted',
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1500
                        }
                    ).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
}