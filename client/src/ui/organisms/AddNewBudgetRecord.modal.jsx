import * as PropTypes from 'prop-types';
import { Modal } from 'ui';

export const AddNewBudgetRecord = ({ open, handleClose, onSubmit }) => {
  return (
    <Modal
      title="Zdefiniuj budżet"
      open={open}
      handleClose={handleClose}
      onSubmit={onSubmit}
    />
  );
};

AddNewBudgetRecord.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
