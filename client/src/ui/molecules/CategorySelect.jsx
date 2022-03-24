import { Select, MenuItem, InputLabel } from '@mui/material';
import * as PropTypes from 'prop-types';
import React from 'react';
import { CategoryCell } from './CategoryCell';

export const CategorySelect = ({ data, value, onChange, label }) => {
  return (
    <>
      <InputLabel id="category">{label}</InputLabel>
      <Select value={value} label={label} onChange={onChange}>
        {data?.map((value) => (
          <MenuItem key={value.id} value={value.id}>
            <CategoryCell name={value.name} color={value.color} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

CategorySelect.propTypes = {
  data: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
};
