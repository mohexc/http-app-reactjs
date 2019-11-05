import React, { Component } from "react";
import { ToastContainer } from 'react-toastify'
import http from './services/httpService'
import config from './config.json'
import "react-toastify/dist/ReactToastify.css"
import "./App.css";


class App extends Component {
  state = {
    posts: [],
    query: ''
  };

  async componentDidMount() {
    //? pending > resolved (sucess) or reject (failue)
    // const promise = http.get('https://jsonplaceholder.typicode.com/posts')
    // const response = await promise
    // console.log(response)
    //? refactor
    const { data: posts } = await http.get(config.apiEndpoint)
    this.setState({ posts })
  }


  handleAdd = async () => {
    const obj = { title: 'a', body: 'b' }
    const { data: post } = await http.post(config.apiEndpoint, obj)

    const posts = [post, ...this.state.posts]
    this.setState({ posts })
  };

  handleUpdate = async post => {
    const originalPosts = this.state.posts
    post.title = "UPDATED"
    // const { data } = await http.put(config.apiEndpoint2 + '/' + post.id, post)
    // http.patch(config.apiEndpoint2 + '/' +post.id, {title: post.title})
    // console.log(data)
    const posts = [...this.state.posts]
    const index = posts.indexOf(post)
    posts[index] = { ...post }
    this.setState({ posts })
    try {
      await http.put(config.apiEndpoint2 + "/" + post.id, post)
      throw new Error("")
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        alert('This post has already been deleted')
      // alert("Something failed while deleting a post!")
      this.setState({ posts: originalPosts })
    }
  };

  handleDelete = async post => {
    const originalPosts = this.state.posts

    const posts = this.state.posts.filter(p => p.id !== post.id)
    this.setState({ posts })

    try {
      const result = await http.delete('s' + config.apiEndpoint2 + '/' + post.id)
      console.log(result)
      throw new Error("")
    }
    catch (ex) {
      // console.log("HANDLE DELETE CATCH BLOCK")
      if (ex.response && ex.response.status === 404)
        alert('This post has already been deleted')
      // alert("Something failed while deleting a post!")
      this.setState({ posts: originalPosts })
    }
  };

  handleQuery = () => { }

  //? ex.request, ex.reponse
  //? Expected (404: not found, 400: bad request) - CLIENT ERRORS
  //? - Display a specific error message
  //? Unexpected (network down, server down, db down, bug)
  //? - Log them
  //? - Display a generic and firenly error message

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <input
          type="text"
          className="form-control col-6"
          placeholder="Serch...."
          value={ this.state.query }
          onChange={ () => this.handleQuery() } /> <br />
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
