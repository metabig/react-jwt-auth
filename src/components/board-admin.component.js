import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";

export default function BoardAdmin() {
  const [content, setContent] = useState("")
  const [untrusteds, setUntrusteds] = useState([])
  

  useEffect(() => {
    UserService.getAdminBoard().then(
      response => {
        setContent(response.data.msg)
        setUntrusteds(response.data.untrusteds)
      },
      error => {
        setContent({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }, [])

  const handleValidateAction = () => {
    console.log("Validate!")
  }

  const getTable = (data) => {
    return <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Username</th>
                <th scope="col">Institution Name</th>
                <th scope="col">E-mail</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
            {
            data.map((value, i) => {
                const row = value
                return (
                  <tr key={i}>
                    <td>{row["_id"]}</td>
                    <td>{row["username"]}</td>
                    <td>{row["Institution Name"] ? row["Institution Name"] : "no_institucion_name"}</td>
                    <td>{row["email"]}</td>
                    <td><button onClick={() => handleValidateAction()}>Validate User</button></td>
                  </tr>
              )})
            }
            </tbody>
          </table>
  }


  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
      <section>{getTable(untrusteds)}</section>
    </div>
  );

}
