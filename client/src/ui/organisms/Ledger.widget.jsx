import React from 'react';

import {
  ActionHeader,
  Card,
  Button,
  Table,
  Loader,
  Error,
  NoContent,
  Money,
  CategoryCell,
  LocalizedDate,
  AddNewLedgerRecord,
} from 'ui';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Grid } from '@mui/material';
import { LedgerService } from '../../api';
import { useQuery, useMutation } from 'react-query';
import { useState } from 'react';

export const LedgerWidget = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenRemoveModal = () => setOpenRemoveModal(true);
  const handleCloseRemoveModal = () => setOpenRemoveModal(false);

  const addCost = () => alert('Dodaje koszt');
  const removeCost = () => alert('Usuwam koszt');

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
            <LedgerTable></LedgerTable>
          </Grid>
        </Grid>
      </Card>

      <AddNewLedgerRecord
        type="INCOME"
        open={openAddModal}
        handleClose={handleCloseAddModal}
        onSubmit={addCost}
      />
      <AddNewLedgerRecord
        type="EXPENSE"
        open={openRemoveModal}
        handleClose={handleCloseRemoveModal}
        onSubmit={removeCost}
      />
    </>
  );
};

const LedgerTable = () => {
  const ledgers = useQuery('findAllLedgers', () => LedgerService.findAll());
  const remove = useMutation((deleteIds) => LedgerService.remove(deleteIds));

  const deleteRecords = (ids) => {
    remove.mutate(
      { ids },
      {
        onSuccess: () => {
          ledgers.refetch();
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
