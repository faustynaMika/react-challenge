import React from 'react';

import { ActionHeader, Card, Page } from 'ui';
import { Grid } from '@mui/material';

import { BudgetService } from '../api';
import { useQuery, useMutation } from 'react-query';
import {
  Table,
  Loader,
  Error,
  NoContent,
  Button,
  Money,
  LocalizedDate,
  CategoryCell,
  AddNewBudgetRecord,
} from 'ui';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

export const BudgetPage = () => {
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  return (
    <Page title="Budżet">
      <Card
        title={
          <ActionHeader
            variant={'h1'}
            title="Twój budżet"
            renderActions={() => (
              <Button
                onClick={handleOpenAddModal}
                variant="contained"
                startIcon={<AddIcon />}
              >
                Zdefiniuj budżet
              </Button>
            )}
          />
        }
      >
        <Grid container>
          <Grid item xs={12}>
            <Budget></Budget>
          </Grid>
        </Grid>
      </Card>

      <AddNewBudgetRecord
        open={openAddModal}
        handleClose={handleCloseAddModal}
      />
    </Page>
  );
};

const Budget = () => {
  const budgets = useQuery('findAllBudgets', () => BudgetService.findAll());
  const remove = useMutation((deleteIds) => BudgetService.remove(deleteIds));
  const { enqueueSnackbar } = useSnackbar();

  const getStatus = (value) => {
    if (value.currentSpending === value.amountInCents) return 'Wykorzystany';
    else if (value.currentSpending > value.amountInCents) return 'Przekroczone';
    else if (value.currentSpending < value.amountInCents) return 'W normie';
  };

  const deleteRecords = (ids) => {
    remove.mutate(
      { ids },
      {
        onSuccess: () => {
          budgets.refetch();
          enqueueSnackbar('Element został usunięty', { variant: `success` });
        },
        onError: () => {
          enqueueSnackbar('Wystąpił nieoczekiwany błąd', { variant: `error` });
        },
      },
    );
  };

  const columns = [
    {
      id: 'nazwa',
      label: 'Nazwa',
      renderCell: (value) => (
        <CategoryCell color={value.category.color} name={value.category.name} />
      ),
    },
    {
      id: 'planowaneWydatki',
      label: 'Planowane wydatki',
      renderCell: (value) => <Money inCents={value.amountInCents} />,
    },
    {
      id: 'obecnaKwota',
      label: 'Obecna kwota',
      renderCell: (value) => <Money inCents={value.currentSpending} />,
    },
    { id: 'status', label: 'Status', renderCell: (value) => getStatus(value) },
    {
      id: 'dataUtworzenia',
      label: 'Data utworzenia',
      renderCell: (value) => <LocalizedDate date={value.createdAt} />,
    },
  ];

  if (budgets.isLoading) return <Loader />;

  if (budgets.isError) return <Error />;

  if (budgets.isSuccess && budgets.data.length > 0)
    return (
      <Table
        rows={budgets.data}
        getUniqueId={(row) => row.id}
        headCells={columns}
        deleteRecords={deleteRecords}
      />
    );
  else return <NoContent />;
};
