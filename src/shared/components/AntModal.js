import React, { Component } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

class AntModal extends Component {

  render() {
    let okBtnText, cancelBtnText;
    switch(localStorage.getItem('i18nextLng')) {
      case 'kz':
        okBtnText = 'Келісу';
        cancelBtnText = 'Болдырмау';
        break;
      case 'ru':
        okBtnText = 'Подтвердить';
        cancelBtnText = 'Отмена';
        break;
      default:
        okBtnText = 'Ok';
        cancelBtnText = 'Cancel';
        break;
    }

    return (
      <div>
        <Modal title={ this.props.title }
               visible={ this.props.visible }
               onCancel={ this.props.onCancel }
               onOk={ this.props.onOk }
               confirmLoading={ this.props.loading }
               width={ this.props.width }
               okText={ okBtnText }
               cancelText={ cancelBtnText }
               wrapClassName={ this.props.wrapClassName }
               maskClosable={this.props.maskClosable}
        >
          { this.props.children }
        </Modal>
      </div>
    );
  }
}

AntModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  width: PropTypes.number,
  title: PropTypes.string
};

export default AntModal;

