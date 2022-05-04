import React, { Component } from "react";

class Main extends Component {
  // error = ""
  render() {
    return (
      <div id="content" className="mt-3">
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Presence Marked</th>
              <th scope="col">Presence Verified</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {window.web3.utils.fromWei(this.props.bankBalance, "Ether")} DAI
              </td>
              <td>
                {window.web3.utils.fromWei(this.props.omniBalance, "Ether")}{" "}
                OMNI
              </td>
            </tr>
          </tbody>
        </table>
        <div className="card mb-4">
          <div className="card-body">
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                onClick={(event) => {
                  event.preventDefault();
                  let amount;
                  amount = '1'
                  amount = window.web3.utils.toWei(amount, "Ether");
                  this.props.stakeTokens(amount);}}
              >
                Mark Presence!
              </button>
              <form className="mb-3" onSubmit={(event) => {
                event.preventDefault()
                let address
                address = this.input.value.toString()
                if(address == this.props.account){
                  window.alert(
                    "Can't Verify Yourself"
                  );
                }else{
                  this.props.verifyTokens(address)
                }
      
                
              }}>
              <div>
                <br></br>
                <br></br>
                <label className="float-left text-muted"><b>Verify Presence</b></label>
              </div>
               <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input) => { this.input = input }}
                  className="form-control form-control-lg"
                  placeholder="Address"
                  required />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Verify</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
