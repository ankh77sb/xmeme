import React from "react";
import EditAMeme from "../helper/EditAMeme.js";
import '../index.css';
import MemeStream from './stream.js';



class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
               fields: {},
               errors: {},
               successMessage : "",
           }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleValidation = this.handleValidation.bind(this);

  }



  handleValidation(){
           let fields = this.state.fields;
           let errors = {};
           let formIsValid = true;

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
      EditAMeme({"id":this.props.id, "url":fields.url, "caption":fields.caption}).then(data => {
        console.log(data);
         if (data.error) {
           console.log(data.error);
           this.setState({
             successMessage : "Onnoo ! some error has occurred"
           });
         } else {
           this.setState({
             successMessage : "Yay! your meme is now edited ! Please RELOAD TO SEE CHANGES!!"
           });
         }
        });
        }else{
          this.setState({
            successMessage : "Onnoo ! this is not valid"
          });
        }

        this.props.MakeGetAMemeApicallFromParent();
  }

  render() {
    return (
      <div>
      <h4>Wanna edit?</h4>

      <form onSubmit={this.handleSubmit} className="form-group mx-2">
        <label>
          New caption  <br />
          <input className="form-control d-block"
            name="caption"
            type="text"
            placeholder="Caption"
            onChange={this.handleInputChange} />
            <span className="text-danger" >{this.state.errors.caption}<br/></span>
        </label>
        <br />
        <label>
          New Url  <br />
          <input className="form-control d-block"
            name="url"
            type="text"
            placeholder="Image Url"
            onChange={this.handleInputChange} />
            <span className="text-danger">{this.state.errors.url}<br/></span>
        </label>
         <br />
        <label>
        <input type="submit" value="Submit" />
        </label>
        <span>{this.state.successMessage}</span>
      </form>
      </div>
    );
  }
}

export default EditForm;
