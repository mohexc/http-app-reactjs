import React, { Component } from "react";
import axios from 'axios'
import "./App.css";

const apiEndpoint = 'https://jsonplaceholder.typicode.com/posts?_limit=10'
const apiEndpoint2 = 'https://jsonplaceholder.typicode.com/posts'

class App extends Component {
  state = {
    posts: []
  };

  async componentDidMount() {
    //? pending > resolved (sucess) or reject (failue)
    // const promise = axios.get('https://jsonplaceholder.typicode.com/posts')
    // const response = await promise
    // console.log(response)
    //? refactor
    const { data: posts } = await axios.get(apiEndpoint)
    this.setState({ posts })
  }


  handleAdd = async () => {
    console.log("Add");
    const obj = { title: 'a', body: 'b' }
    const { data: post } = await axios.post(apiEndpoint, obj)

    const posts = [post, ...this.state.posts]
    this.setState({ posts })
  };

  handleUpdate = async post => {
    post.title = "UPDATED"
    // const { data } = await axios.put(apiEndpoint2 + '/' + post.id, post)
    // axios.patch(apiEndpoint2 + '/' +post.id, {title: post.title})
    // console.log(data)

    await axios.put(apiEndpoint2 + "/" + post.id, post)
    const posts = [...this.state.posts]
    const index = posts.indexOf(post)
    posts[index] = { ...post }
    this.setState({ posts })
  };

  handleDelete = async post => {
    await axios.delete(apiEndpoint2 + '/' + post.id)
    const posts = this.state.posts.filter(p => p.id !== post.id)
    this.setState({ posts })

  };

  render() {
    return (
      <React.Fragment>
        <button className="btn btn-primary my-3" onClick={ this.handleAdd }>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            { this.state.posts.map(post => (
              <tr key={ post.id }>
                <td>{ post.title }</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={ () => this.handleUpdate(post) }
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={ () => this.handleDelete(post) }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
