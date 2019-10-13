import React, { Component }  from 'react';
import axios from 'axios';
import './Upload.css';
import { styled } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';






const MyButton = styled(Button)({
  background: '#990ae3',
  border: 0,
  borderRadius: 3,
  color: 'white',
  height: 32,
  padding: 0,
  marginLeft: '5px',
  marginTop: '5px',
  width: '100px'
});

class Upload extends Component {
  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        data: null,
        progress: 0, 
      };

     this.onChangeHandler = this.onChangeHandler.bind(this);
     this.updateUploadedList = this.updateUploadedList.bind(this);
     this.componentDidMount = this.componentDidMount.bind(this);
     this.deleteFile = this.deleteFile.bind(this);
     
  }
  
  componentDidMount() {
    this.updateUploadedList();
  }


  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],  
    });
  }


  onClickHandler = () => {
    const config = {
    onUploadProgress: progressEvent => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        this.setState({
          progress: percentCompleted
        });
      }
    }
    
    if (this.state.selectedFile) {                  // here can add filter for file type to upload this.state.selectedFile.type
      const data = new FormData() 
      data.append('file', this.state.selectedFile)
      axios.post('/upload', data, config, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
        }).then(res => { 
        console.log(res.statusText)
        this.updateUploadedList();
      }).catch((error) => {
          console.warn(`Post request not sent. Error message: ${error}`);
        });
    } else {
      alert('Choose file to upload')
    }  
    this.form.reset(); 
    
  }


  updateUploadedList = () => {
    axios.get('/upload', {errorHandle: false}).then((response) => {
      this.setState({data: response.data})
    }).catch((error) => {
      console.warn(`Get request not sent. ${error}`);
    })
  }

  
  deleteFile = async (title) => {
    try {
        const res = await axios.delete(`/upload/${title}`);
        console.log(res.status);
    } catch (err) {
        console.error(err);
    }
    setTimeout(function(){ this.updateUploadedList(); }.bind(this), 1000);
  }

  downloadFile = (title) => {
    window.open(`http://localhost:8000/download/${title}`)
  }


  render() {
   return (
    <div>
     <div className={this.state.progress === 100 || this.state.progress === 0 ? 'progress-bar hideMe' : 'progress-bar'}><LinearProgress variant="determinate" value={this.state.progress} /></div>
     <p className='basic-text'>Choose a file and click on UPLOAD button to upload the file</p>
      <div className='upload-container'> 
       
        <form ref={form => this.form = form}>
          <input type="file" name="file"  onChange={this.onChangeHandler} />
          <MyButton onClick={this.onClickHandler}>Upload</MyButton>
        </form>
        
      </div>
         
      <div>
        <h3 className='headerText'>Uploaded files</h3>
        {this.state.data ? this.state.data.map((title, key) => (
          <div key={key} className='files-container'>
              
            <div className='fileName-container' >
              <p className='basic-text'>{`${title.slice(14)}`}</p>
            </div>
                
            <div className='buttons-container'>
              <MyButton onClick={() => this.downloadFile(title)}>DOWNLOAD</MyButton>
              <MyButton onClick={() =>{ if (window.confirm(`Are you sure you want to delete ${title.slice(14)}?`)) this.deleteFile(title) }}>DELETE</MyButton>
            </div>
             
            </div>
          )) : 'Loading...'}
      </div>
    </div>
  );
 }
}

export default Upload;
