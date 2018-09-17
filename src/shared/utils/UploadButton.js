import React from 'react';
import {Upload, Button, Icon, Modal} from 'antd';

class UploadButton extends React.Component {

  state = {
    modal: {
      visible: false,
      result: ''
    }
  };

  onClose = () => {
    this.setState({modal: {...this.state.modal, visible: false}})
  };

  selectFile = {
    en: 'Select file',
    ru: 'Выберите файл',
    kz: 'Файлды таңдаңыз'
  };

  render() {
    const props = {
      action: '//file/set',
      accept: 'image/*, application/pdf',
      onRemove: (file) => {
        const index = this.props.value.indexOf(file);
        const newFileList = this.props.value.slice();
        newFileList.splice(index, 1);
        this.props.onChange(newFileList);
      },
      onPreview: (file) => {

        if(file.type === 'application/pdf') {
          const newWindow = window.open();
          // const blob = new Blob([file], {type: 'application/pdf'});
          const url = URL.createObjectURL(file);
          newWindow.document.head.innerHTML += "<style> body {margin:0}</style>";
          newWindow.document.body.innerHTML = `<iframe style="box-sizing: border-box" src=${url} width="100%" height="100%" />`;
        }
        
        else {
          const fileReader = new FileReader();
          fileReader.onload = res => {
            this.setState({result: res.target.result, modal: {...this.state.modal, visible: true}})
          };
          fileReader.readAsDataURL(file)
        }

      },
      beforeUpload: (file, fileList) => {
        this.props.onChange([...this.props.value, ...fileList]);
        return false;
      },
      fileList: this.props.value,
      multiple: true
    };

    return (
      <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload"/> {this.selectFile[localStorage.getItem('i18nextLng')]}
          </Button>
        </Upload>
        <Modal
          visible={this.state.modal.visible}
          footer={null}
          onCancel={this.onClose}
          width="60%"
        >
          <img src={this.state.result} width='100%' alt="res"/>
        </Modal>
      </div>
    );
  }
}

export default UploadButton;