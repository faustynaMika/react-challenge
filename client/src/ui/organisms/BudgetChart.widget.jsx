import React from 'react';
import { useQuery } from 'react-query';
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box, Grid, Typography } from '@mui/material';

import { BudgetService } from 'api';
import { Card } from 'ui';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
);

export const BudgetChartWidget = () => {

  const budgetData = useQuery('findAllBudgets', () => BudgetService.findAll());

  const checkIfAllPercentsAreZero = (data) => {
    return data.every(item => item.currentSpendingPercent === 0);
  };

  return <Card>
    <Grid container>
      <Grid item xs={12}>
        <Box
          paddingBottom={1}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <Typography
            display={'flex-inline'}
            variant='h4'
            sx={{
              fontWeight: 'bold',
            }}
          >
            Budżet
          </Typography>
        </Box>
        <Box
          paddingBottom={3}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <Typography
            variant='subtitle1'
            sx={{
              color: 'gray',
            }}
            display={'flex-inline'}
          >
            Podsumowanie wydatków
          </Typography>
        </Box>
        {
          budgetData.isSuccess && budgetData.data.length > 0 && !checkIfAllPercentsAreZero(budgetData.data) ?
            <BudgetChart data={budgetData.data}/> :
            <Typography variant={'h5'} marginTop={4} align={'center'}>
              Brak wyników
            </Typography>
        }
      </Grid>
    </Grid>
  </Card>;
};

const BudgetChart = ({ data }) => {
  let chartData = {
    labels: data.map((row) => row.category.name),
    datasets: [
      {
        data: data.map((row) => row.currentSpendingPercent),
        backgroundColor: data.map((row) => row.category.color),
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Bar options={options} data={chartData}/>;
};
