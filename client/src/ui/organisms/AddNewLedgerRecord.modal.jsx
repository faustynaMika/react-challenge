import * as PropTypes from 'prop-types';
import { Modal } from 'ui';

export const AddNewLedgerRecord = ({ type, open, handleClose, onSubmit }) => {
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
  return (
    <Modal
      title={title}
      open={open}
      handleClose={handleClose}
      onSubmit={onSubmit}
    />
  );
};

AddNewLedgerRecord.propTypes = {
  type: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
