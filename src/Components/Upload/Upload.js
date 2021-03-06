import React, { Component } from "react";
import axios from "axios";
import { styled } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

import "./Upload.css";

const MyButton = styled(Button)({
  background: "#990ae3",
  border: 0,
  borderRadius: 3,
  color: "white",
  height: 32,
  padding: 0,
  marginLeft: "5px",
  marginTop: "5px",
  width: "100px",
});

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      data: null,
      progress: 0,
      delButton: false,
      buttonUplod: false,
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.updateUploadedList = this.updateUploadedList.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  componentDidMount() {
    this.updateUploadedList();
  }

  updateUploadedList = () => {
    axios
      .get("/upload", { errorHandle: false })
      .then((response) => {
        this.setState({ data: response.data });
        console.log("updated");
      })
      .catch((error) => {
        console.warn(`Get request not sent. ${error}`);
      });
    this.setState({
      buttonUplod: false, //activate upload button
    });
    setTimeout(
      function () {
        this.setState({ delButton: false });
      }.bind(this),
      1000
    ); //activate delete button after 1 second
  };

  onChangeHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0], // event.target.files[0] holds the actual file and its details
    });
  };

  onClickHandler = () => {
    const config = {
      onUploadProgress: (progressEvent) => {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        ); // value of progress bar
        this.setState({
          progress: percentCompleted,
        });
      },
    };
    // send file to server
    if (this.state.selectedFile) {
      // here can add filter for file type to upload this.state.selectedFile.type
      this.setState({
        buttonUplod: true, //disable upload button
      });
      const data = new FormData(); //FormData() - interface to construct a set of key/value pairs representing form fields and their values
      data.append("file", this.state.selectedFile); // append value of this.state.selectedFile to 'file' name
      axios
        .post("/upload", data, config, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.statusText);
          this.updateUploadedList();
        })
        .catch((error) => {
          console.warn(`Post request not sent. Error message: ${error}`);
        });
    } else {
      alert("Choose a file to upload");
    }
    this.form.reset();
  };

  deleteFile = async (title) => {
    try {
      const res = await axios.delete(`/upload/${title}`);

      if (res.status === 204) {
        this.updateUploadedList();
      }
    } catch (err) {
      console.error(err);
    }
  };

  downloadFile = (title) => {
    window.open(`http://localhost:8000/download/${title}`);
  };

  render() {
    return (
      <div>
        <div
          className={
            this.state.progress === 100 || this.state.progress === 0
              ? "progress-bar hideMe"
              : "progress-bar"
          }
        >
          <LinearProgress variant="determinate" value={this.state.progress} />
        </div>
        <p className="basic-text">
          Choose a file and click on UPLOAD button to upload the file
        </p>
        <div className="upload-container">
          <form ref={(form) => (this.form = form)}>
            <input type="file" name="file" onChange={this.onChangeHandler} />
            <MyButton
              onClick={this.onClickHandler}
              disabled={this.state.buttonUplod}
            >
              Upload
            </MyButton>
          </form>
        </div>

        <div>
          <h3 className="headerText">Uploaded files</h3>
          {this.state.data
            ? this.state.data.map((title, key) => (
                <div key={key} className="files-container">
                  <div className="fileName-container">
                    <p className="basic-text">{`${title.slice(14)}`}</p>
                  </div>

                  <div className="buttons-container">
                    <MyButton onClick={() => this.downloadFile(title)}>
                      DOWNLOAD
                    </MyButton>
                    <MyButton
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete ${title.slice(
                              14
                            )}?`
                          )
                        )
                          this.deleteFile(title);
                      }}
                      disabled={this.state.delButton}
                    >
                      DELETE
                    </MyButton>
                  </div>
                </div>
              ))
            : "Loading..."}
        </div>
      </div>
    );
  }
}

export default Upload;
