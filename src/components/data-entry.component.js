import React, { useState, useEffect } from 'react'

import { useForm } from "react-hook-form"
import { Card } from './card.component'
import { DropzoneTag } from './dropzone.component'
import form_data from '../form-data.json'
import logo from '../alert.svg'
import '../App.css'
import * as HbaseConnector from '../services/HbaseConnector'
import AuthService from "../services/auth.service"


//TODO: Add token requirement for api upload
export default function App() {

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [displayMsg, setDisplayMsg] = useState({
    action: false,
    msg: "The files have been sent successfully"
  })
  const { register, handleSubmit, errors } = useForm()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState("untrusted")

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    if (user) setRole(user.role)
  }, [])
  const closeModal = () => {
    setDisplayMsg({
      action: false,
      msg: "The files have been sent successfully"
    })
  }



  const onSubmit = async (metadata) => {
    try {
      setLoading(true)
      const success = await HbaseConnector.sendToServer(uploadedFiles, metadata)
      setLoading(false)
      if (!success) throw new Error("Errors occurred uploading the files")
      setUploadedFiles([])
      setDisplayMsg({
        action: true,
        msg: "The files have been sent successfully"
      })

    } catch (error) {
      console.error(error)
      setDisplayMsg({
        action: true,
        msg: "Errors occurred uploading the files"
      })
    }
  }

  const onUploadedFilesChange = (e) => setUploadedFiles(e)

  const noFileUploaded = () => {
    return (!uploadedFiles.length) ?
      (<section className="tooltip">
        <img src={logo} className="alert-logo" alt="alert-logo" />
        <span className="tooltiptext">At least one file should be uploaded</span>
      </section>) : null
  }
  if (role === "trusted" || role === "admin")
    return (


      <section className="main-container">
        <form className="cards-container" onSubmit={handleSubmit(onSubmit)}>
          {
            form_data.cards.map((card, key) => {
              return (
                <Card card={card}
                  first={!key}
                  key={key}
                  reg={register}
                  errors={errors} />
              );
            })
          }
          <button disabled={!uploadedFiles.length} type="submit">Send</button>
          {noFileUploaded()}
        </form>
        <DropzoneTag uploadedFiles={uploadedFiles} onPropertyChange={(e) => onUploadedFilesChange(e)} />
        {(displayMsg.action) &&
          <section className="modal2">
            <p>{displayMsg.msg}</p>
            <button onClick={() => closeModal()}>Accept</button>
          </section>}
        {loading &&
          <section className="modal2">
            <p>Loading...</p>
          </section>}
      </section>
      
    );
    else return (
      <div className="container">
        <header className="jumbotron">
          <h3>Unauthorized access</h3>
        </header>
      </div>
    )
}