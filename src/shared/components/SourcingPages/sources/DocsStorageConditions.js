import React, { Component } from 'react';
import {Button, Form} from 'antd';
import { Field, reduxForm, initialize } from 'redux-form';
import {
  renderInput, renderSelect
} from '../../../utils/form_components';
import {getPropVal} from '../../../actions/actions';
import {isEmpty} from 'lodash';
import {parseCube_new} from '../../../utils/cubeParser';
import {connect} from 'react-redux';
import {
  HAS_ARCHIVE_STORE, HAS_DEVICES, HAS_FIRE_ALARM, HAS_READING_ROOM, HAS_SECURITY_ALARM_SYSTEM, LOCKERS,
  ROOM_HEATING,
  SHELVING
} from '../../../constants/tofiConstants';

/*eslint eqeqeq:0*/
class DocsStorageConditions extends Component {

  state = {
    data: [],
    filter: {
      [HAS_DEVICES + 'Loading']: false,
      [HAS_READING_ROOM + 'Loading']: false,
      [HAS_SECURITY_ALARM_SYSTEM + 'Loading']: false,
      [HAS_FIRE_ALARM + 'Loading']: false,
      [LOCKERS + 'Loading']: false,
      [SHELVING + 'Loading']: false,
      [ROOM_HEATING + 'Loading']: false,
      [HAS_ARCHIVE_STORE + 'Loading']: false
    }
  };

  onSubmit = values => {
    console.log(values)
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.orgSourceCubeSingle !== this.props.orgSourceCubeSingle) {
      const { doForFundAndIK, dpForFundAndIK } = nextProps.tofiConstants;
      this.setState({
        data: parseCube_new(
          nextProps.orgSourceCubeSingle['cube'],
          [],
          'dp',
          'do',
          nextProps.orgSourceCubeSingle[`do_${doForFundAndIK.id}`],
          nextProps.orgSourceCubeSingle[`dp_${dpForFundAndIK.id}`],
          `do_${doForFundAndIK.id}`,
          `dp_${dpForFundAndIK.id}`)[0] //only one element
      }, () => {
        const {dispatch, tofiConstants: {hasArchiveStore, numberOfRooms, roomArea, roomOccupancy, roomHeating, shelving,
          lockers, hasFireAlarm, hasSecurityAlarmSystem, hasReadingRoom, hasDevices, numberOfEmployees} } = nextProps;

        const hasArchiveStoreObj = this.state.data.props.find(element => element.prop == hasArchiveStore.id),
          numberOfRoomsObj = this.state.data.props.find(element => element.prop == numberOfRooms.id),
          roomAreaObj = this.state.data.props.find(element => element.prop == roomArea.id),
          roomOccupancyObj = this.state.data.props.find(element => element.prop == roomOccupancy.id),
          roomHeatingObj = this.state.data.props.find(element => element.prop == roomHeating.id),
          shelvingObj = this.state.data.props.find(element => element.prop == shelving.id),
          lockersObj = this.state.data.props.find(element => element.prop == lockers.id),
          hasFireAlarmObj = this.state.data.props.find(element => element.prop == hasFireAlarm.id),
          hasSecurityAlarmSystemObj = this.state.data.props.find(element => element.prop == hasSecurityAlarmSystem.id),
          hasReadingRoomObj = this.state.data.props.find(element => element.prop == hasReadingRoom.id),
          hasDevicesObj = this.state.data.props.find(element => element.prop == hasDevices.id),
          numberOfEmployeesObj = this.state.data.props.find(element => element.prop == numberOfEmployees.id);

        const initialValues = {
          hasArchiveStore: hasArchiveStoreObj && hasArchiveStoreObj.refId ? { value: hasArchiveStoreObj.refId, label: hasArchiveStoreObj.name[this.lng] } : null,
          numberOfRooms: numberOfRoomsObj ? numberOfRoomsObj.value || '' : '',
          roomArea: roomAreaObj ? roomAreaObj.value || '' : '',
          roomOccupancy: roomOccupancyObj ? roomOccupancyObj.value || '' : '',
          roomHeating: roomHeatingObj && roomHeatingObj.refId ? { value: roomHeatingObj.refId, label: roomHeatingObj.name[this.lng] } : null,
          shelving: shelvingObj && shelvingObj.refId ? { value: shelvingObj.refId, label: shelvingObj.name[this.lng] } : null,
          lockers: lockersObj && lockersObj.refId ? { value: lockersObj.refId, label: lockersObj.name[this.lng] } : null,
          hasFireAlarm: hasFireAlarmObj && hasFireAlarmObj.refId ? { value: hasFireAlarmObj.refId, label: hasFireAlarmObj.name[this.lng] } : null,
          hasSecurityAlarmSystem: hasSecurityAlarmSystemObj && hasSecurityAlarmSystemObj.refId ? { value: hasSecurityAlarmSystemObj.refId, label: hasSecurityAlarmSystemObj.name[this.lng] } : null,
          hasReadingRoom: hasReadingRoomObj && hasReadingRoomObj.refId ? { value: hasReadingRoomObj.refId, label: hasReadingRoomObj.name[this.lng] } : null,
          hasDevices: hasDevicesObj && hasDevicesObj.refId ? { value: hasDevicesObj.refId, label: hasDevicesObj.name[this.lng] } : null,
          numberOfEmployees: numberOfEmployeesObj ? numberOfEmployeesObj.value || '' : ''
        };
        dispatch(initialize('DocsStorageConditions', initialValues));
      })
    }
  }
  loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({filter: {...this.state.filter, [c+'Loading']: true}});
        this.props.getPropVal(c)
          .then(() => this.setState({filter: {...this.state.filter, [c+'Loading']: false}}));
      }
    }
  };

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    this.lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, dirty, submitting, error, reset, tofiConstants: {hasArchiveStore, numberOfRooms, roomArea, roomOccupancy, roomHeating, shelving,
      lockers, hasFireAlarm, hasSecurityAlarmSystem, hasReadingRoom, hasDevices, numberOfEmployees},
      hasArchiveStoreOptions, roomHeatingOptions, shelvingOptions, lockersOptions, hasFireAlarmOptions, hasSecurityAlarmSystemOptions, hasReadingRoomOptions, hasDevicesOptions} = this.props;

    return (
      <div className="DocsStorageConditions">
        <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}>
          {hasArchiveStore && <Field
            name="hasArchiveStore"
            component={ renderSelect }
            searchable={false}
            label={hasArchiveStore.name[this.lng]}
            onOpen={this.loadOptions(HAS_ARCHIVE_STORE)}
            isLoading={this.state.filter[HAS_ARCHIVE_STORE + 'Loading']}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            data={hasArchiveStoreOptions ? hasArchiveStoreOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
            // validate={required}
            // colon={true}
          />}
          {numberOfRooms && <Field
            name="numberOfRooms"
            component={ renderInput }
            placeholder={t('USER_FIO_PLACEHOLDER')}
            label={numberOfRooms.name[this.lng]}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
          />}
          {roomArea && <Field
            name="roomArea"
            component={ renderInput }
            label={roomArea.name[this.lng]}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
          />}
          {roomOccupancy && <Field
            name="roomOccupancy"
            component={ renderInput }
            label={roomOccupancy.name[this.lng]}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
          />}
          {roomHeating && <Field
            name="roomHeating"
            component={ renderSelect }
            searchable={false}
            label={roomHeating.name[this.lng]}
            onOpen={this.loadOptions(ROOM_HEATING)}
            isLoading={this.state.filter[ROOM_HEATING + 'Loading']}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            data={roomHeatingOptions ? roomHeatingOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
            // validate={requiredLabel}
            // colon={true}
          />}
          {shelving && <Field
            name="shelving"
            component={ renderSelect }
            multi
            searchable={false}
            label={shelving.name[this.lng]}
            onOpen={this.loadOptions(SHELVING)}
            isLoading={this.state.filter[SHELVING + 'Loading']}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            data={shelvingOptions ? shelvingOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
            // validate={requiredLabel}
            // colon={true}
          />}
          {lockers && <Field
            name="lockers"
            component={ renderSelect }
            label={lockers.name[this.lng]}
            onOpen={this.loadOptions(LOCKERS)}
            isLoading={this.state.filter[LOCKERS + 'Loading']}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            data={lockersOptions ? lockersOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
            // validate={requiredLabel}
            // colon={true}
          />}
          {hasFireAlarm && <Field
            name="hasFireAlarm"
            component={renderSelect}
            label={hasFireAlarm.name[this.lng]}
            onOpen={this.loadOptions(HAS_FIRE_ALARM)}
            isLoading={this.state.filter[HAS_FIRE_ALARM + 'Loading']}
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            data={hasFireAlarmOptions ? hasFireAlarmOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
            // validate={requiredDate}
            // colon={true}
          />}
          {hasSecurityAlarmSystem && <Field
            name="hasSecurityAlarmSystem"
            component={renderSelect}
            label={hasSecurityAlarmSystem.name[this.lng]}
            onOpen={this.loadOptions(HAS_SECURITY_ALARM_SYSTEM)}
            isLoading={this.state.filter[HAS_SECURITY_ALARM_SYSTEM + 'Loading']}
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            data={hasSecurityAlarmSystemOptions ? hasSecurityAlarmSystemOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
            // validate={requiredDate}
            // colon={true}
          />}
          {hasReadingRoom && <Field
            name="hasReadingRoom"
            component={renderSelect}
            label={hasReadingRoom.name[this.lng]}
            onOpen={this.loadOptions(HAS_READING_ROOM)}
            isLoading={this.state.filter[HAS_READING_ROOM + 'Loading']}
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            data={hasReadingRoomOptions ? hasReadingRoomOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
            // validate={requiredDate}
            // colon={true}
          />}
          {hasDevices && <Field
            name="hasDevices"
            component={renderSelect}
            label={hasDevices.name[this.lng]}
            onOpen={this.loadOptions(HAS_DEVICES)}
            isLoading={this.state.filter[HAS_DEVICES + 'Loading']}
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            data={hasDevicesOptions ? hasDevicesOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
            // validate={requiredDate}
            // colon={true}
          />}
          {numberOfEmployees && <Field
            name="numberOfEmployees"
            component={ renderInput }
            label={numberOfEmployees.name[this.lng]}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
          />}
          {dirty && <Form.Item className="ant-form-btns">
            <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
              {submitting ? t('LOADING...') : t('SAVE') }
            </Button>
            <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting} style={{marginLeft: '10px'}} onClick={reset}>
              {submitting ? t('LOADING...') : t('CANCEL') }
            </Button>
            {error && <span className="message-error"><i className="icon-error" />{error}</span>}
          </Form.Item>}
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    orgSourceCubeSingle: state.cubes['OrgSourceCubeSingle'],
    hasDevicesOptions: state.generalData[HAS_DEVICES],
    hasReadingRoomOptions: state.generalData[HAS_READING_ROOM],
    hasSecurityAlarmSystemOptions: state.generalData[HAS_SECURITY_ALARM_SYSTEM],
    hasFireAlarmOptions: state.generalData[HAS_FIRE_ALARM],
    lockersOptions: state.generalData[LOCKERS],
    shelvingOptions: state.generalData[SHELVING],
    roomHeatingOptions: state.generalData[ROOM_HEATING],
    hasArchiveStoreOptions: state.generalData[HAS_ARCHIVE_STORE]
  }
}

export default connect(mapStateToProps, { getPropVal })(reduxForm({ form: 'DocsStorageConditions', enableReinitialize: true })(DocsStorageConditions));
