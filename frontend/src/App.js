import React from "react";
//import { Route, Switch, BrowserRouter as Router} from "react-router-dom";
import MemeForm from "./components/form.js";
import MemeStream from "./components/stream.js";
import addMeme from "./helper/addMeme";
import getMemes from "./helper/getMemes.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
               memes: [],
               errorMessage: "",
               isEmptyMessage:"loading...",
           }

  }


  MakeGetAMemeApicall = () => {

    getMemes().then(data => {
      if(!data){
         this.setState({
           isEmptyMessage : "Onno!! No memes on stream :("
         })

      } else if (data.error) {
         console.log(data.error);
         this.setState({
           errorMessage : data.error,
           isEmptyMessage : "Seems there is an error in loading :("
         });
       } else {
         this.setState({
           memes : data,
           isEmptyMessage : ""
         });
       }
     });

  }

 render() {
  return (
    <div className="App">
    <div className="row navbar navbar-expand-sm bg-dark navbar-dark text-light">
      <h1>X-Meme Stream</h1>
    </div>
      <div className="container-fluid my-5 d-block">
       <div className="row">

       <div className="col-sm-12 col-md-12 col-lg-12 col-xl-5 justify-content-center">
        <MemeForm MakeGetAMemeApicall={this.MakeGetAMemeApicall} />
        </div>

        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-7 justify-content-end">
          <MemeStream MakeGetAMemeApicall={this.MakeGetAMemeApicall} memes={this.state.memes} errorMessage= {this.state.errorMessage}
          isEmptyMessage={this.state.isEmptyMessage} />
            </div>

        </div>

      </div>
    </div>
  );
}
}

export default App;
