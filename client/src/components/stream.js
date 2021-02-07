import React from "react";
//import { Route, Switch, BrowserRouter as Router} from "react-router-dom";
import getMemes from "../helper/getMemes.js";
import getAMemeById from "../helper/getAMemeById.js";


class MemeStream extends React.Component {
  constructor(props) {
    super(props);

         }

         componentDidMount(){
             this.props.MakeGetAMemeApicall();
          };



  render() {
  return (
      <div className="list-group">
        <h1>Ohayo!</h1>

        <h3>{this.props.isEmptyMessage}</h3>
        <h3>{this.props.errorMessage}</h3>
        <div className="row">
        {

          this.props.memes.map(function(meme,index) {
             return <div key={index} className="d-block col-lg-5 pl-3 mx-2 my-3 shadow-sm bg-white rounded">
                      <h3 className="list-group-item-heading">{meme.caption}</h3>
                      <p>{meme.name}</p>
                      <img className="card-img-top" src={meme.url} alt="img not found" />
                    </div>
          })
        }
        </div>
      </div>
  );
}
}

export default MemeStream;
