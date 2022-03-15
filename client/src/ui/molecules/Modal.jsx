import * as PropTypes from 'prop-types';
import React from 'react';
import { Modal as MuiModal } from '@mui/material';
import { Card, CardHeader, CardContent, CardActions } from '@mui/material';
import { Button } from 'ui/atoms/Button';

export const Modal = ({
  children,
  title,
  open,
  handleClose,
  onSubmit,
  submitButtonDisabled = false,
}) => {
  console.log(onSubmit);

  return (
    <MuiModal onBackdropClick={handleClose} open={open} onClose={handleClose}>
      <Card
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '30%',
        }}
      >
        <CardHeader title={title} />
        <CardContent>{children}</CardContent>
        <CardActions
          sx={{
            justifyContent: 'flex-end',
          }}
        >
          <Button
            type="submit"
            onClick={() => onSubmit()}
            variant="outlined"
            disabled={submitButtonDisabled}
          >
            Zapisz
          </Button>
          <Button
            onClick={handleClose}
            sx={{
              marginLeft: '20px',
            }}
            variant="outlined"
          >
            Anuluj
          </Button>
        </CardActions>
      </Card>
    </MuiModal>
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
