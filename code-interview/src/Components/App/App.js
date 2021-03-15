import React from 'react';
import './App.css';

// https://randomuser.me/api
class User extends React.Component {
  render() {
    return (
      <div>
        <img src={this.props.picture} />
        <p>{this.props.name}</p>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      userList: [],
      currentPage: 1
    };

    this.incrementCount = this.incrementCount.bind(this);
    this.decrementCount = this.decrementCount.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.processUsers = this.processUsers.bind(this);
  }

  incrementCount() {
    this.setState({counter: this.state.counter + 1});
  }

  decrementCount() {
    this.setState({counter: this.state.counter - 1});
  }

  lastPage() {
    if (this.state.currentPage !== 1) {
      this.setState(
        {
          userList: [],
          currentPage: this.state.currentPage - 1
        }
      );

      this.processUsers();
    }
  }

  nextPage() {
    this.setState(
      {
        userList: [],
        currentPage: this.state.currentPage + 1
      }
    );

    this.processUsers();
  }

  fetchUsers() {
    return fetch(`https://randomuser.me/api?page=${this.state.currentPage}`).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.results) {
        return jsonResponse.results;
      }
    })
  }

  processUsers() {
    this.fetchUsers().then(results => {
      let userList = this.state.userList;

      results.map(result => {
        if (!userList.some(user => user.userName !== `${result.name.first} ${result.name.last}`)) {
          userList.push({
            userName: `${result.name.first} ${result.name.last}`,
            userPicture: result.picture.large
          });  
        }
        
        this.setState({ userList: userList });
      })
    });
  }

  componentDidMount() {
    this.processUsers();
  }

  render() {
    return (
      <div className="App">
        <h1>This is my test</h1>
        <button onClick={this.incrementCount}>Increment Counter</button>
        <button onClick={this.decrementCount}>Decrement Counter</button>
        <label>{this.state.counter}</label>


        <pre>
          {
            this.state.userList.map(user => {
              return (<User name={user.userName} picture={user.userPicture} />);
            })
          }

          <button onClick={this.lastPage}>Last</button>
          <button onClick={this.nextPage}>Next</button>
        </pre>
      </div>
      
    );
  }
}

export default App;
