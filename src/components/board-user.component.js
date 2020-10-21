import React, { Component } from "react";

import UserService from "../services/user.service";
import HbaseService from "../services/hbase.service";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      role: 'untrusted',
      hbase: ""
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        console.log(response)
        this.setState({
          content: response.data,
          role: response.role
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    )
    HbaseService.getMetadata(0, 10).then(
      res => {
        console.log(res.data)
        this.setState({
          hbase: res.data
        })
      }
    )

  }

  handleDownload(s) {
    console.log(s)
  }

  getTable = (metadata)  => {
    if (this.state.role !== 'untrusted') {
      if (metadata) {
        return (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Data Source Name</th>
                <th scope="col">Filename</th>
                <th scope="col">Institution Name</th>
                <th scope="col">Disease</th>
                <th scope="col">Data Type</th>
                <th scope="col">Confidentiality</th>
                <th scope="col">Classification</th>
                <th scope="col">Validation</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
            {
            metadata.map((value, i) => {
                const row = value
                return (
                  <tr key={i}>
                    <td>{row["Data Source Name"]}</td>
                    <td>{row["filename"]}</td>
                    <td>{row["Institution Name"] ? row["Institution Name"] : "no_institucion_name"}</td>
                    <td>{row["Select disease"]}</td>
                    <td>{row["Data Type"]}</td>
                    <td>{row["Confidentiality"]}</td>
                    <td>{row["Classification"]}</td>
                    <td>{row["validation"] ? "valid" : "No"}</td>
                    <td><button onClick={() => this.handleDownload(row["key"])}>Download</button></td>
                  </tr>
              )})
            }
            </tbody>
          </table>
        )
      }
      return <p>Loading..</p>
    }
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>
        <section>
          {this.getTable(this.state.hbase)}
        </section>
      </div>
    )
  }
}
