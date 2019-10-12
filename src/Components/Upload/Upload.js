import React, { Component }  from 'react';
import axios from 'axios';
import './Upload.css';


class Upload extends Component {
  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        data: null  
      };
     this.onChangeHandler = this.onChangeHandler.bind(this);
     this.updateUploadedList = this.updateUploadedList.bind(this);
     this.componentDidMount = this.componentDidMount.bind(this);
     this.deleteFile = this.deleteFile.bind(this);
  }
  
  componentDidMount() {
    this.updateUploadedList();
  };

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],  //console.log(this.state.selectedFile);
      loaded: 0,
    });
  }


//onClickhandle  will execute onClickHandler which sends a request to the server. 
//The file from a state is appended as a file to FormData.
  onClickHandler = () => {
    if (this.state.selectedFile) {
      console.log(this.state.selectedFile.type); //console type of uploaded file
      const data = new FormData() 
      data.append('file', this.state.selectedFile)
 
      axios.post('/upload', data, {       //Axios will send a request to the endpoint with a binary file in Form Data
      // receive two    parameter endpoint url ,form data
      }).then(res => { // then print response status
        console.log(res.statusText)
        this.updateUploadedList();
      }).catch((error) => {
        // handle this error here
        console.warn('post request not sent');
        });
      
    } else {
      alert('Choose file to upload')
    }    
  }

  updateUploadedList = () => {
    axios.get('/upload', {errorHandle: false}).then((response) => {
      
      this.setState({
        data: response.data
      })
      console.log(this.state.data)
    }).catch((error) => {
    // handle this error here
    console.warn('get request not sent');
    })
    

   

  }

  deleteFile = (value) => {
    axios.delete(`/upload/${value}`);
    this.updateUploadedList()
  }
  downloadFile = (value) => {
    //axios.delete(`/upload/${value}`);
    //console.log(value)
    window.open(`/download/${value}`)
    axios.get(`/download/${value}`);
    //this.updateUploadedList()
  }

  render() {
  return (
    <div>
      <input type="file" name="file" onChange={this.onChangeHandler}/>
      <button type="button" onClick={this.onClickHandler}>Upload</button>
      <div>
        <h3>Uploaded files</h3>
        {this.state.data ? this.state.data.map((value, key) =>(
        <ul>
          <li key={key}><a href={`http://localhost:8000/uploads/${value}`}>{`${value}`}</a></li>
          <button onClick={() => this.deleteFile(value)}>DELETE</button>
          <button onClick={() => this.downloadFile(value)}>DOWNLOAD</button>
        </ul>
        )): 'Loading'}
      
      </div>
    </div>
  );
}
}

export default Upload;
