import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

export default function GenericSelect({
  value,
  onChange,
  options = [],
  label = 'Selecione uma opção',
  placeholder,
  width = 300,
  getOptionLabel = (option) =>
    option?.label ||
    option?.name ||
    option?.nome ||
    option?.title ||
    String(option),
  renderOption,
  disabled = false,
  required = false,
  error = false,
  helperText,
  multiple = false,
  freeSolo = false,
  autoHighlight = true,
  clearable = true,
  getOptionSelected,
  ...otherProps
}) {
  const handleChange = (event, newValue) => {
    if (onChange) {
      onChange(newValue)
    }
  }

  // Função para comparar opções (importante para objetos)
  const isOptionEqualToValue = (option, value) => {
    if (getOptionSelected) {
      return getOptionSelected(option, value)
    }

    // Se ambos são objetos, compare por ID ou referência
    if (typeof option === 'object' && typeof value === 'object') {
      if (option?.id && value?.id) {
        return option.id === value.id
      }
      return option === value
    }

    // Para valores primitivos
    return option === value
  }

  const defaultRenderOption = (props, option) => {
    const { key, ...optionProps } = props
    return (
      <Box key={key} component="li" {...optionProps}>
        {getOptionLabel(option)}
      </Box>
    )
  }

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderOption={renderOption || defaultRenderOption}
      autoHighlight={autoHighlight}
      disabled={disabled}
      multiple={multiple}
      freeSolo={freeSolo}
      disableClearable={!clearable}
      sx={{ width }}
      {...otherProps}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              autoComplete: 'new-password',
            },
          }}
        />
      )}
    />
  )
}

// Exemplo de uso:

// 1. Select simples com array de strings
/*
const [selectedCountry, setSelectedCountry] = useState('');
const countries = ['Brasil', 'Argentina', 'Chile', 'Uruguai'];

<GenericSelect
  value={selectedCountry}
  onChange={setSelectedCountry}
  options={countries}
  label="Escolha um país"
/>
*/

// 2. Select com array de objetos
/*
const [selectedUser, setSelectedUser] = useState(null);
const users = [
  { id: 1, name: 'João Silva', email: 'joao@email.com' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com' },
];

<GenericSelect
  value={selectedUser}
  onChange={setSelectedUser}
  options={users}
  label="Escolha um usuário"
  getOptionLabel={(option) => option.name}
/>
*/

// 3. Select com renderização customizada (como o original)
/*
const [selectedCountry, setSelectedCountry] = useState(null);
const countries = [
  { label: 'Brazil', code: 'BR', phone: '55' },
  { label: 'Argentina', code: 'AR', phone: '54' },
];

<GenericSelect
  value={selectedCountry}
  onChange={setSelectedCountry}
  options={countries}
  label="Choose a country"
  getOptionLabel={(option) => option.label}
  renderOption={(props, option) => {
    const { key, ...optionProps } = props;
    return (
      <Box
        key={key}
        component="li"
        sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
        {...optionProps}
      >
        <img
          loading="lazy"
          width="20"
          srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
          alt=""
        />
        {option.label} ({option.code}) +{option.phone}
      </Box>
    );
  }}
/>
*/

// 4. Select múltiplo
/*
const [selectedTags, setSelectedTags] = useState([]);
const tags = ['React', 'JavaScript', 'TypeScript', 'Node.js'];

<GenericSelect
  value={selectedTags}
  onChange={setSelectedTags}
  options={tags}
  label="Selecione as tecnologias"
  multiple={true}
/>
*/
