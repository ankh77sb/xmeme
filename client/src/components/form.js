import React from "react";
import addMeme from "../helper/addMeme.js";
import '../index.css';
import MemeStream from './stream.js';


class MemeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
               fields: {},
               errors: {}
           }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }

  handleValidation(){
           let fields = this.state.fields;
           let errors = {};
           let formIsValid = true;

           //Name validation
           if(!fields["name"]){
              formIsValid = false;
              errors["name"] = "Cannot be empty";
           }

           //Caption validation
           if(!fields["caption"]){
              formIsValid = false;
              errors["caption"] = "Cannot be empty";
           }

           //Url validation
           if(!fields["url"]){
              formIsValid = false;
              errors["url"] = "Cannot be empty";
           }


          this.setState({errors: errors});
          return formIsValid;
      }



  handleInputChange(event) {
    let fields = this.state.fields;
    const target = event.target;
    const value =  target.value;
    const name = target.name;
    fields[name] = value;

    this.setState({
      fields: fields
    });
  }

  handleSubmit(event) {
   event.preventDefault();
    if(this.handleValidation()){
      let fields = this.state.fields;
      addMeme({name:fields.name, caption:fields.caption, url:fields.url}).then(data => {
         if (data.error) {
           console.log(data.error);
           this.setState({
             successMessage : "Onnoo ! some error has occurred"
           });
         } else {
           this.setState({
             successMessage : "Yay! your meme is now on the stream !"
           });
           this.props.MakeGetAMemeApicall();
         }
        });
    }else{
      this.setState({
        successMessage : "Onnoo ! this is not valid"
      });
    }
    //addMeme();

  }

  render() {
    return (
      <div className="h-75 pr-3 py-3 bg-light text-dark position-lg-fixed position-fixer">
      <h2>Everyone loves Memes</h2>
      <h1><b>Do you have one to share ??</b></h1>
      <br />
      <form onSubmit={this.handleSubmit} className="form-group mx-2">
        <label className="col-12 mx-2" >
          What do I call you, Meme king?  <br />
          <input className="form-control d-block"
            name="name"
            type="text"
            placeholder="Name"
            onChange={this.handleInputChange} />
            <span className="text-danger">{this.state.errors.name}<br/></span>
        </label>
        <br />
        <label className="col-12 mx-2">
          Honour us with your humour!  <br />
          <input className="form-control d-block"
            name="caption"
            type="text"
            placeholder="Caption"
            onChange={this.handleInputChange} />
            <span className="text-danger" >{this.state.errors.caption}<br/></span>
        </label>
        <br />
        <label className="col-12 mx-2">
          Where do I find the meme?  <br />
          <input className="form-control d-block"
            name="url"
            type="text"
            placeholder="Image Url"
            onChange={this.handleInputChange} />
            <span className="text-danger">{this.state.errors.url}<br/></span>
        </label>
         <br />
        <label className="col-12 mx-2">
        <input type="submit" value="Submit" />
        </label>
        <span>{this.state.successMessage}</span>
      </form>
      </div>
    );
  }
}

export default MemeForm;
