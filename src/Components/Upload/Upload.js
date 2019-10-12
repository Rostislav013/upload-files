import React, { Component }  from 'react';
import axios from 'axios';
import './Upload.css';
import { styled } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';




const MyButton = styled(Button)({
  background: '#990ae3',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 32,
  padding: '0 10px',
  margin: '5px',
});

const MyInput = styled(Input)({
  height: 32,
  padding: '0 10px',
});



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
      selectedFile: event.target.files[0],  
      loaded: 0,
    });
  }


//onClickhandle  will execute onClickHandler which sends a request to the server. 
//The file from a state is appended as a file to FormData.
  onClickHandler = () => {
    if (this.state.selectedFile) {
      // here can add filter for file type to upload this.state.selectedFile.type
      const data = new FormData() 
      data.append('file', this.state.selectedFile)
 
      axios.post('/upload', data,  {
        headers: {
          'Content-Type': 'multipart/form-data'
        }}).then(res => { 
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
      
      //console.log(this.state.data)
    }).catch((error) => {
        console.warn(error);
    })
    

  
  }

  deleteFile = (title) => {
    axios.delete(`/upload/${title}`).catch( function(error) {
      console.log(error);
  });
    this.updateUploadedList();
  }

  downloadFile = (title) => {
    window.open(`http://localhost:8000/download/${title}`)
  }
 


  render() {
    
    
  return (
    <div className='func'> 
       <div className='upload-container'> 
        <MyInput type="file" name="file" onChange={this.onChangeHandler}  />
        <MyButton onClick={this.onClickHandler}>Upload</MyButton>
      </div>

     

      <div>
        <h3 style={{margin: '10px 20px'}}>Uploaded files</h3>
        {this.state.data ? this.state.data.map((title, key) => (
            <div key={key} className='files-container'>
              
              
                <div style={{width: '500px'}}>
                  <p style={{margin: '5px 20px'}}>{`${title}`}</p>
                </div>
                
                <div style={{margin: '5px 20px', }}>
                  <MyButton onClick={() => this.downloadFile(title)}>DOWNLOAD</MyButton>
                  <MyButton onClick={() => this.deleteFile(title)}>DELETE</MyButton>
                </div>
              
              
            </div>
          )): 'No files'}
        
      
        
      
      </div>
    </div>
  );
}
}

export default Upload;
