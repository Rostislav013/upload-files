import React, { Component }  from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        data: null  
      }
      console.log(this.state.selectedFile)
  }
  
  onChangeHandler=event=>{
      this.setState({
        selectedFile: event.target.files[0],
        loaded: 0,
      })
      console.log(this.state.selectedFile)
    console.log(event.target.files[0])
}




//onClickhandle  will execute onClickHandler which sends a request to the server. 
//The file from a state is appended as a file to FormData.
onClickHandler = () => {
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
      })
}

onClickShow = () => {
  axios.get('http://localhost:8000/files', {errorHandle: false}).then((response) => {
    console.log('Everything is awesome.');
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
    </div>
  );
}
}

export default App;
