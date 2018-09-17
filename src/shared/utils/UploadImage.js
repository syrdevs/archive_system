import { Upload, Icon, Modal } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    console.log('fileList', fileList);
    this.setState({ fileList });
  };

  beforeUpload = (file, files) => {
    // this.props.getFile({[this.props.fieldName]: file});
    const reader = new FileReader();
    this.props.onChange(file);
    reader.addEventListener('load', () => {
      this.setState( ({ fileList }) =>
        ({ fileList: [...fileList, Object.assign(file, {thumbUrl: reader.result})] })
      )
    });
    reader.readAsDataURL(file);
    return false;
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{this.props.uploadText}</div>
      </div>
    );
    return (
        <div className={`clearfix ${this.props.className}`}>
          <Upload
            multiple
            action="/file/set"
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            accept=".jpeg, .png, .pdf, .jpg"
            beforeUpload={this.beforeUpload}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
    );
  }
}

PicturesWall.propTypes = {
  getFile: PropTypes.func,
  uploadText: PropTypes.string,
  // fieldName: PropTypes.string.isRequired
};

export default PicturesWall;
