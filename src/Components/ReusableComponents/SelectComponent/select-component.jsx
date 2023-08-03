const SelectComponent = ({value, onChange, options}) => {
  return (
    <select value={value} onChange={onChange}  className="input_selection">
        <option value=''> select</option>
        {
          options.map(({name, value}) => <option key={value} value={value}>{name}</option>)
        }
      </select>
  )
}

export default SelectComponent