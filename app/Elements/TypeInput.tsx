import React from 'react'
import Select from 'react-select'
import Creatable, {useCreatable} from 'react-select/creatable'
import { SelectableInputType } from '../assets/Types'

const colorStyles = {
  control: (baseStyles, { isDisabled, isFocused, isSelected }) => ({
      ...baseStyles,
      boxShadow: "none",
      border: "1px solid var(--smallAccent)",
      fontSize: 13,
      borderRadius: 2,
      backgroundColor: isDisabled
      ? "var(--lightBackground)"
      : isFocused
      ? "var(--smallAccent)"
      : "var(--lightBackground)"
  }),

  singleValue: (baseStyles) => ({
      ...baseStyles,
      borderWidth: 0,
      fontSize: 13,
      padding: "5px 0",
      borderRadius: 2,
      color: "var(--text)",
  }),

  valueContainer: (baseStyles) => ({
      ...baseStyles,
      borderWidth: 0,
      padding: 5,
      fontSize: 13,
      borderRadius: 2,
      color: "var(--text)"
  }),

  input: (baseStyles) => ({
    ...baseStyles,
    color: "var(--text)"
  }),

  menu: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: "var(--background)",
      margin: 10,
      fontSize: 13
  }),

  option: (baseStyles, { isDisabled, isFocused, isSelected }) => ({
      ...baseStyles,
      borderRadius: 2,
      fontSize: 13,
      color: isDisabled
      ? undefined
      : isSelected
      ? "var(--background)"
      : isFocused
      ? "var(--background)"
      : undefined,
      backgroundColor: isDisabled
      ? undefined
      : isSelected
      ? "var(--primaryColor)"
      : isFocused
      ? "var(--mediumAccent)"
      : undefined
  }),
  
}

export default function TypeInput({options, defaultValue, onChange, disabled=false, placeholder="select...",width=150}:SelectableInputType) {

  if(disabled) {
    return (
      <div>
        <input disabled value={defaultValue} onChange={onChange}/>
      </div>
    )
  }

    return (   
        <div style={{minWidth: width}}>
          <Select options={options}
          onChange={(v) => onChange((v as any).value)}
          isDisabled={disabled}
          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
          placeholder={placeholder}
          defaultInputValue={defaultValue || ""}
          styles={colorStyles}
            />
        </div>
    )
}

export function  CreatableTypeInput({options, defaultValue, onChange, disabled=false, placeholder="select...", onCreate, width=150}) {

  if(disabled) {
    return (
      <div>
        <input disabled value={defaultValue} onChange={onChange}/>
      </div>
    )
  }

    return (   
        <div style={{minWidth: width}}>
          <Creatable options={options}
          onCreateOption={onCreate}
          onChange={(v) => onChange((v as any).value)}
          isDisabled={disabled}
          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
          placeholder={placeholder}
          defaultInputValue={defaultValue || ""}
          styles={colorStyles}
            />
        </div>
    ) 

}