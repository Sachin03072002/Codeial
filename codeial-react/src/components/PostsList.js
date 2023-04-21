import { render } from 'ejs';
import lib from 'package.json';
import React from 'react';
 import axios from 'axios';
class PostList extends React.Component{
    constructor(pros){
        super(props);

        this.state={
            posts: []
        }

        this.getPosts();
    }

    get Posts(){
        axios.get('http://localhost:8000/api/v1/posts').then((data) => {this.setState({posts: data.data.posts})});
    }
        
        render(){
            return (
                <div>
                    <h1>Codeial Post</h1>
                    <ul>
                        {
                            this.state.posts.map((post)=> <Post post={post} key={post._id}></Post>)
                        }
                    </ul>
                </div>
            );
        }
}

export default PostList;
