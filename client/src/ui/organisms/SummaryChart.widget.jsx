import React from 'react';
import { useQuery } from 'react-query';
import { ArcElement, Chart as ChartJS, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Box, Grid, Typography } from '@mui/material';

import { SummaryService } from 'api';
import { Card, CategoryCell, Money } from 'ui';

ChartJS.register(ArcElement, Legend);

export const SummaryChartWidget = () => {
  const summaryData = useQuery('getSummary', () => SummaryService.findAll());

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
            Saldo
          </Typography>
          <Typography
            display={'flex-inline'}
            variant='h3'
            sx={{
              fontWeight: 'bold',
            }}
          >
            <Money inCents={summaryData.data?.balance}/>
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
            Pozostała kwota
          </Typography>
        </Box>
        {summaryData.isSuccess && summaryData.data.spending.length > 0 ?
          <SummaryChart data={summaryData.data}/> :
          <Typography variant={'h5'} marginTop={4} align={'center'}>
            Brak wyników
          </Typography>
        }
      </Grid>
    </Grid>
  </Card>;
};

const SummaryChart = ({ data }) => {
  const options = {
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
        align: 'start',
        fullSize: true,
        labels: {
          position: 'left',
          boxWidth: 40,
          usePointStyle: true,
        },
      },
    },
  };

  let chartData = {
    labels: data.spending.map((row) => row.categoryName),
    datasets: [
      {
        data: data.spending.map((row) => row.amountInCents),
        backgroundColor: data.spending.map((row) => row.categoryColor),
      },
    ],
  };

  return <>
    <Doughnut data={chartData} options={options}/>
    <ul style={{ listStyleType: 'none' }}>
      {data.spending.map((row) => <li><CategoryCell color={row.categoryColor} name={row.categoryName}/></li>)}
    </ul>
  </>;

};
