import moment from 'moment';

/*export const parseCube = cube => {
  const doTableName = Object.keys(cube).filter(key => key.includes('do'));
  if(doTableName.length === 1) {
    return cube[doTableName[0]].map(function(item, idx, arr){
      return {...item, props: cube.cube.filter(function(element, index, array) {
        return element[doTableName[0]] === item["id"];
      }, this).map(n, cube)
      }
    }, this);
  }
};

function n(item, idx, arr) {
  const dpTableName = Object.keys(this).filter(key => key.includes('dp') && key !== 'dp_q' && key !== 'dp_s');
  if(dpTableName.length === 1) {
    let propItem = this[dpTableName[0]].find(function (element, index, array) {
      return element.id === item[dpTableName[0]];
    });
    let propType = propItem.propType,
      typeProp = propType.typeProp,
      attrValType = propType.attribValType;
    switch (true) {
      case (typeProp === 1) :
        return;
      case (typeProp === 11) :
        return;
      case (typeProp === 21) :
        return {...propItem, value: item['valueNumb']};
      case (typeProp === 22) :
        return {...propItem, value: item['valueNumb']};
      case (typeProp === 31) :
        return {...propItem, value: item['valueStr'][localStorage.i18nextLng]};
      case (typeProp === 41) :
        return {...propItem, value: 'object'};
      case (typeProp === 51) :
        return {measure: propItem.measure, value: 'relObj'};
      case (typeProp === 61) :
        return {measure: propItem.measure, value: 'measure'};
      case (typeProp === 71) :
        return {measure: propItem.measure, value: 'complexProp'};
      default:
        return undefined;
    }
  }
}*/

const oneLevelCopy = (object) => ({...object});

export const parseCube_new = (cubeVal, fixedDim, colDimName, rowDimName, doTable, dpTable, doConst, dpConst) => {
  try {

    const doTableWithProps = doTable.map(item => ({ ...item, props: dpTable.map(oneLevelCopy) }));
    cubeVal.forEach(cubeValItem => {
      const prop = doTableWithProps.find(doItem => doItem['id'] === cubeValItem[doConst])['props'].find(dpItem => dpItem['id'] === cubeValItem[dpConst]);
      const propType = prop['typeProp'];
      switch (true) {
        case (propType === 1) :
          return;
        case (propType === 11 && prop.isUniq === 2):
          if(cubeValItem['idRef']) {
            if(!prop.values) prop.values = [];
            prop.values.push({value: cubeValItem['idRef'], label: (cubeValItem['name'][localStorage.getItem('i18nextLng')] || '')})
          }
          // if(!prop.value) prop.value = [];
          // if(!prop.refId) prop.refId = [];
          // cubeValItem['name'] ? prop.value.push(cubeValItem['name'][localStorage.getItem('i18nextLng')]) : prop.value.push('');
          // prop.refId.push(cubeValItem['idRef']);
          break;
        case (propType === 11) :
          prop.value = cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '';
          prop.refId = cubeValItem['idRef'];
          break;
        case (propType === 21) :
          prop.value = cubeValItem['valueNumb'];
          break;
        case (propType === 22) :
          prop.value = cubeValItem['valueNumb'];
          break;
        case (propType.toString().startsWith('31')) :
          switch (propType % 10) {
            case 1:
            case 5:
              if(prop.isUniq === 2) {
                if(!prop.values) prop.values = [];
                prop.values.push(cubeValItem['valueStr']);
              } else {
                prop.value = cubeValItem['valueStr'] ? cubeValItem['valueStr'][localStorage.getItem('i18nextLng')] : '';
                prop.valueLng = cubeValItem['valueStr'] ? cubeValItem['valueStr'] : null;
              }
              break;
            case 2:
            case 3:
            case 4:
              const date = moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD');
              prop.value = date.isValid() ? date.format('DD-MM-YYYY') : '';
              break;
            case 7:
              if(prop.isUniq === 2) {
                if(!prop.values) prop.values = [];
                cubeValItem['valueFile'] && prop.values.push(cubeValItem['valueFile'][localStorage.getItem('i18nextLng')]);
              } else {
                prop.value = cubeValItem['valueFile'] ? cubeValItem['valueFile'][localStorage.getItem('i18nextLng')] : '';
              }
              break;
            default: break;
          }
          break;
        case (propType === 41 && prop.isUniq === 2):
          if(cubeValItem['idRef']) {
            if(!prop.values) prop.values = [];
            prop.values.push({value: cubeValItem['idRef'], label: (cubeValItem['name'][localStorage.getItem('i18nextLng')] || '')})
          }
          break;
        case (propType === 41) :
          prop.value = cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '';
          prop.cube = cubeValItem;
          break;
        case (propType === 51) :
          prop.value = 'relObj';
          break;
        case (propType === 61) :
          prop.value = 'measure';
          break;
        case (propType === 71 && prop.isUniq === 2):
          if(cubeValItem['valueStr']) {
            console.log(cubeValItem);
            if(!prop.values) prop.values = [];
            prop.values.push({value: cubeValItem['valueStr'], id: (cubeValItem['id'] || '')})
          }
          break;
        case (propType === 71) :
          prop.value = cubeValItem['valueStr'] ? cubeValItem['valueStr'][localStorage.getItem('i18nextLng')] : '';
          prop.valueLng = cubeValItem['valueStr'] ? cubeValItem['valueStr'] : null;
          break;
        default:
          return;
      }
    });
    return doTableWithProps;
  } catch(err) {
    console.error(err);
    return []
  }
};

export const getPropMeta = (cubeProps, cnst) => {
  return cubeProps.find(prop => prop.prop === cnst.id);
};
