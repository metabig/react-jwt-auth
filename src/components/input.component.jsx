import React from 'react';
import logo from '../alert.svg'

export const Input = (props) => {

  const inputProp = props.input_data;
  const register = props.register;
  const label = inputProp.label;


  const selectChanged = (value) => {
    if (inputProp.custom_function === "chagas_fnc")
      props.onPropertyChange(value === "Chagas disease")
    else if (inputProp.custom_function === "shared_fnc")
      props.onPropertyChange(value === "Shareable with WHO and 3rd parties")
    else if (inputProp.custom_function === "open_aviability"
      || inputProp.custom_function === "publication_aviability")
      props.onPropertyChange(value === "Yes")
  }

  const getInput = (type, required) => {

    if (type === "select")
      return (
        <select name={label}
          onChange={(e) => selectChanged(e.target.value)}
          ref={
            register({
              required: required ? "Required" : false
            })
          }>
          {
            inputProp.options.map((option, i) => {
              return (<option value={option} key={i}>{option}</option>)
            })
          }
        </select>
      )
    if (type === "textarea")
      return (<textarea className={(props.errors[label]) ? "input-error" : ""}
        name={label}
        ref={
          register({
            required: required ? "Required" : false
          })
        }
      />)
    if (type === "noinput")
      return <h2 className="inSectionTitle">{label.concat(":")}</h2>;


    return (
      <input className={(props.errors[label]) ? "input-error" : ""}
        name={label}
        type={type}
        ref={
          register({
            required: required ? "Required" : false
          })
        }
      />
    )
  }

  return (
    <section>
      {props.input_data.type !== "noinput" && <label>{label.concat(":")}</label> }
      {getInput(props.input_data.type, props.input_data.required === undefined && false)} 
      {props.errors[label] &&
        <section className="tooltip">
          <img src={logo} className="alert-logo" alt="alert-logo" />
          <span className="tooltiptext">{props.errors[label].message}</span>
        </section>

      }
    </section>
  );
}