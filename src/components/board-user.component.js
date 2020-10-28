import React, { useState, useEffect } from "react"

import AuthService from "../services/auth.service"
import UserService from "../services/user.service"
import HbaseService from "../services/hbase.service"
const converter = require('base64-arraybuffer')

export default function BoardUser() {
  const [content, setContent] = useState("")
  const [role, setRole] = useState("untrusted")
  const [hbase, setHbase] = useState("")

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user) setRole(user.role)
    UserService.getUserBoard().then(
      response => {
        setContent(response.data)
      },
      error => {
        setContent(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString())
            }
    )
    if(role === "admin" || role === "trusted")
      HbaseService.getMetadata(0, 50).then(
        res => {
          setHbase(res.data)
        }
      )  
  }, [role])
 

  const handleDownload = (filename, s) => {
    HbaseService.getData(s).then(res => {
      const data = res.data["$"]
      console.log(data)
      console.log(data.length)
      var FileSaver = require('file-saver');
      var blob = new Blob([converter.decode(res.data["$"])]);
      FileSaver.saveAs(blob, filename);
    })
  }

  const getTable = (metadata)  => {
    if (role !== 'untrusted') {
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
                    <td><button onClick={() => handleDownload(row["filename"], row["key"])}>Download</button></td>
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

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{content}</h3>
        </header>
        <section>
          {getTable(hbase)}
        </section>
      </div>
    )
}
