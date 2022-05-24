import React, { useState } from 'react';

import {
  ActionHeader,
  AddNewLedgerRecord,
  Button,
  Card,
  CategoryCell,
  Error,
  Loader,
  LocalizedDate,
  Money,
  NoContent,
  Table,
} from 'ui';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Grid } from '@mui/material';
import { LedgerService } from '../../api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';

export const LedgerWidget = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenRemoveModal = () => setOpenRemoveModal(true);
  const handleCloseRemoveModal = () => setOpenRemoveModal(false);

  return (
    <>
      <Card
        title={
          <ActionHeader
            variant={'h1'}
            title="Portfel"
            renderActions={() => (
              <Box
                paddingBottom={3}
                spacing={{
                  xs: 3,
                  md: 0,
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddModal}
                >
                  Wpłać
                </Button>
                <Button
                  onClick={handleOpenRemoveModal}
                  sx={{
                    marginLeft: '20px',
                  }}
                  variant="outlined"
                  startIcon={<RemoveIcon />}
                >
                  Wypłać
                </Button>
              </Box>
            )}
          />
        }
      >
        <Grid container>
          <Grid item xs={12}>
            <LedgerTable />
          </Grid>
        </Grid>
      </Card>

      <AddNewLedgerRecord
        type="INCOME"
        open={openAddModal}
        handleClose={handleCloseAddModal}
      />
      <AddNewLedgerRecord
        type="EXPENSE"
        open={openRemoveModal}
        handleClose={handleCloseRemoveModal}
      />
    </>
  );
};

const LedgerTable = () => {
  const queryClient = useQueryClient();

  const ledgers = useQuery('findAllLedgers', () => LedgerService.findAll());
  const remove = useMutation((deleteIds) => LedgerService.remove(deleteIds));
  const { enqueueSnackbar } = useSnackbar();

  const deleteRecords = (ids) => {
    remove.mutate(
      { ids },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries('findAllLedgers');
          await queryClient.invalidateQueries('findAllCategories');
          await queryClient.invalidateQueries('findAllBudgets');
          await queryClient.invalidateQueries('getSummary');
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
      renderCell: (value) => value.title,
    },
    {
      id: 'kategoria',
      label: 'Kategoria',
      renderCell: (value) => (
        <CategoryCell color={value.category.color} name={value.category.name} />
      ),
    },
    {
      id: 'data',
      label: 'Data',
      renderCell: (value) => <LocalizedDate date={value.createdAt} />,
    },
    {
      id: 'kwota',
      label: 'Kwota',
      renderCell: (value) => {
        var prefix = '';
        var style = {};

        switch (value.mode) {
          case 'INCOME':
            style = {
              color: 'green',
            };
            prefix = '+';
            break;
          case 'EXPENSE':
            style = {
              color: 'red',
            };
            prefix = '-';
            break;
          default:
        }

        return (
          <Box component="span" sx={style}>
            {prefix}
            <Money inCents={value.amountInCents} />
          </Box>
        );
      },
    },
  ];

  if (ledgers.isLoading) return <Loader />;

  if (ledgers.isError) return <Error />;

  if (ledgers.isSuccess && ledgers.data.length > 0)
    return (
      <Table
        rows={ledgers.data}
        getUniqueId={(row) => row.id}
        headCells={columns}
        deleteRecords={deleteRecords}
      />
    );

  return <NoContent />;
};
