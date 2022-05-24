import * as PropTypes from 'prop-types';
import { Modal, CategorySelect } from 'ui';
import { TextField } from '@mui/material';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Controller, useForm } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import { CategoryService, LedgerService } from 'api';
import { useSnackbar } from 'notistack';

export const AddNewLedgerRecord = ({ type, open, handleClose }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  var title = ' ';
  switch (type) {
    case 'INCOME':
      title = 'Dodaj wpływ';
      break;
    case 'EXPENSE':
      title = 'Dodaj wydatek';
      break;
    default:
  }

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const categories = useQuery('findAllCategories', () =>
    CategoryService.findAll(),
  );

  const saveLedger = useMutation((data) => LedgerService.create(data));

  const resetAndClose = () => {
    reset();
    handleClose();
  };

  const submit = (data) => {
    saveLedger.mutate(
      {
        requestBody: {
          mode: type,
          amountInCents: data.ammount * 100,
          categoryId: data.category,
          title: data.name,
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries('findAllLedgers');
          await queryClient.invalidateQueries('findAllCategories');
          await queryClient.invalidateQueries('getSummary');
          await queryClient.invalidateQueries('findAllBudgets');

          if (type === 'INCOME') {
            enqueueSnackbar('Wpływ został dodany', { variant: `success` });
          } else {
            enqueueSnackbar('Wydatek został zapisany', { variant: `success` });
          }

          resetAndClose();
        },
        onError: () => {
          enqueueSnackbar('Wystąpił nieoczekiwany błąd', { variant: `error` });
        },
      },
    );
  };

  return (
    <Modal
      title={title}
      open={open}
      handleClose={() => {
        resetAndClose();
      }}
      onSubmit={handleSubmit(submit)}
      submitButtonDisabled={!isValid}
    >
      <Controller
        name={'name'}
        rules={{
          required: 'Nazwa nie może być pusta',
          validate: (value) => !!value.trim() || 'Nazwa nie może być pusta',
        }}
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            fullWidth
            helperText={errors.name?.message}
            onChange={onChange}
            value={value}
            label={'Nazwa'}
          />
        )}
      />
      <Controller
        name={'ammount'}
        control={control}
        rules={{
          required: 'Kwota nie może być pusta',
          min: {
            value: 1,
            message: 'Kwota musi być większa niż 0',
          },
          max: {
            value: 1000000,
            message: 'Kwota nie może być większa niż 1000000',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            fullWidth
            type="number"
            helperText={errors.ammount?.message}
            onChange={onChange}
            value={value}
            label={'Kwota'}
          />
        )}
      />
      {type === 'EXPENSE' && categories.isSuccess ? (
        <FormControl fullWidth sx={{ m: 1 }}>
          <Controller
            name={'category'}
            control={control}
            rules={{
              required: 'Kategoria nie może być pusta',
            }}
            defaultValue={null}
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

AddNewLedgerRecord.propTypes = {
  type: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
