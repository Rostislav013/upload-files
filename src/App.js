import React, { Component }  from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        data: null  
      };
     this.onChangeHandler = this.onChangeHandler.bind(this)
     this.onClickShow = this.onClickShow.bind(this) 
     this.componentDidMount = this.componentDidMount.bind(this) 
  }
  
  componentDidMount() {
    axios.get('http://localhost:8000/api', {errorHandle: false}).then((response) => {
      console.log(response.data);
      this.setState({
        data: response.data
      })
  }).catch((error) => {
      // handle this error here
      console.warn('Not good man :(');
  })
  }

  onChangeHandler=event=>{
      this.setState({
        selectedFile: event.target.files[0],
        loaded: 0,
      })
      console.log(this.state.selectedFile)
      console.log(event.target.files[0])
      axios.get('http://localhost:8000/api', {errorHandle: false}).then((response) => {
        console.log(response.data);
        this.setState({
        data: response.data
        })
      }).catch((error) => {
      // handle this error here
      console.warn('Not good man :(');
  })
}




//onClickhandle  will execute onClickHandler which sends a request to the server. 
//The file from a state is appended as a file to FormData.
onClickHandler = () => {
  if(this.state.selectedFile) {

  
  console.log(this.state.selectedFile.type)
  const data = new FormData() 
  data.append('file', this.state.selectedFile)
 
  axios.post("http://localhost:8000/upload", data, {       //Axios will send a request to the endpoint with a binary file in Form Data
    // receive two    parameter endpoint url ,form data
  })
       .then(res => { // then print response status
         console.log(res.statusText)
        }).catch((error) => {
          // handle this error here
          console.warn('Not good man :(');
      });
      this.onClickShow()
    } else{
      alert('Choose file to upload')
    }    
}

onClickShow = () => {
  axios.get('http://localhost:8000/api', {errorHandle: false}).then((response) => {
    console.log(response.data);
    this.setState({
      data: response.data
    })
}).catch((error) => {
    // handle this error here
    console.warn('Not good man :(');
})
}


  render() {
  return (
    <div className="App">
     <input type="file" name="file" onChange={this.onChangeHandler}/>
     <button type="button" onClick={this.onClickHandler}>Upload</button>
     
     {/*<a href='http://localhost:8000/files/1570724313793-UML.png' ><img src='http://localhost:8000/files/1570724313793-UML.png' style={{width: '200px'}}/></a>*/}
     <button type="button" onClick={this.onClickShow}>Show all</button>
     <div>
       <h3>Uploaded files</h3>
      {this.state.data ? this.state.data.map(value =>(
        <ul>
          <li><a href={`http://localhost:8000/files/${value}`}>{`${value}`}</a></li>
        </ul>
        
      )): 'hi'}
      
      </div>
    </div>
  );
}
}

export default App;
