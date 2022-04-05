import * as PropTypes from 'prop-types';
import { Modal, CategorySelect } from 'ui';
import { TextField } from '@mui/material';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Controller, useForm } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import { BudgetService, CategoryService } from 'api';
import { useEffect } from 'react';
export const AddNewBudgetRecord = ({ open, handleClose }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  const queryClient = useQueryClient();

  const categories = useQuery('findCategoriesForBudget', () =>
    CategoryService.findAll(true),
  );

  const refetchCategories = () => {
    queryClient.invalidateQueries(['findCategoriesForBudget']);
  };

  useEffect(() => {
    reset();
    refetchCategories();
  }, [open]);

  const saveBudget = useMutation((data) => BudgetService.create(data));

  const resetAndClose = () => {
    reset();
    handleClose();
  };

  const submit = (data) => {
    saveBudget.mutate(
      {
        requestBody: {
          amountInCents: data.ammount * 100,
          categoryId: data.category,
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries('findAllBudgets');
          resetAndClose();
        },
      },
    );
  };

  return (
    <Modal
      title="Zdefiniuj budżet"
      open={open}
      handleClose={resetAndClose}
      onSubmit={handleSubmit(submit)}
      submitButtonDisabled={!isValid}
    >
      <FormControl fullWidth sx={{ m: 1 }}>
        <Controller
          name={'ammount'}
          control={control}
          rules={{
            required: 'Kwota nie może być pusta',
            min: {
              value: 0,
              message: 'Kwota musi być większa niż 0',
            },
            max: {
              value: 1000000,
              message: 'Kwota nie może być większa niż 1000000',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextField
              type="number"
              helperText={errors.ammount?.message}
              onChange={onChange}
              value={value}
              label={'Kwota'}
            />
          )}
        />
      </FormControl>
      {categories.isSuccess ? (
        <FormControl fullWidth sx={{ m: 1 }}>
          <Controller
            name={'category'}
            control={control}
            rules={{
              required: 'Kategoria nie może być pusta',
            }}
            defaultValue={
              categories.data?.length > 0 ? categories.data[0].id : '0'
            }
            render={({ field: { onChange, value } }) => (
              <CategorySelect
                value={value}
                label="Kategoria"
                onChange={onChange}
                data={categories.data}
              />
            )}
          />
        </FormControl>
      ) : (
        ''
      )}
    </Modal>
  );
};

AddNewBudgetRecord.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
