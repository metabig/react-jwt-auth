import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import download_logo from '../download_logo.png'


export const DropzoneTag = (props) => {

  const onDrop = useCallback(acceptedFiles => {
    //console.log(acceptedFiles)
    props.onPropertyChange(props.uploadedFiles.concat(acceptedFiles))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.uploadedFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const getSize = (size) => {
    const measures = [" B", " KB", " MB", " GB"];
    for (var i = 0; i < 4; ++i) {
      if (size / 1000 < 1)
        return size.toFixed(2) + measures[i]
      size /= 1000;
    }
  }

  const deleteFileById = (i) => {
    var array = []
    for (var j = 0; j < props.uploadedFiles.length; ++j)
      if (i !== j)
        array.push(props.uploadedFiles[j])
    props.onPropertyChange(array)
  }


  return (
    <section className="file-container">
      <section className="upload-area" {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <section>
              <p>Drag'n'drop your files here</p>
              <img src={download_logo}
                className="download_logo"
                alt="download_logo" />
            </section>
        }
      </section>

      {
        props.uploadedFiles.map((file, i) => {
          //console.log(file)
          return (
            <section className="file-card" key={i}>
              <p className="file-title">{file.name}</p>
              <p className="file-size">{getSize(file.size)}</p>
              <section className="delete-container" onClick={() => deleteFileById(i)}>
                <section className="close" />
              </section>
            </section>
          );
        })
      }
    </section>

  );
}