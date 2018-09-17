import * as axios from '../utils/axios_config';
import {
  LOGOUT_SUCCESS,
  LOGIN_SUCCESS, REDIRECT,
  GET_RRCUBE_SUCCESS,
  ADD_CASE_TO_BASKET,
  LOGIN_FAILED,
  REMOVE_CASE_FROM_BASKET,
  GET_FACTOR_VAL_SUCCESS,
  GET_COUNTRIES_SUCCESS,
  GET_CITIES_SUCCESS,
  GET_ARCHIVE_FUND_LIST_SUCCESS,
  GET_AFCUBE_SUCCESS,
  GET_ALL_TOFI_CONSTANTS,
  GLOBAL_ERROR,
  GET_CUBE_SUCCESS, GET_OBJ_VER_SUCCESS,
  GET_PROP_VAL,
  GET_ACCESS_LEVEL,
  GET_ALL_OBJ_OF_CLS, GET_OBJ_BY_OBJ_VAL
} from './actionTypes';
import { push } from 'react-router-redux'


export const getFundCard = id => {
  return axios.ArchiveFund.getFundCard(id);
};

export const getPropValById = id => {
  return axios.General.getPropValById(id)
};

export const getPropValByConst = propConst => {
  return axios.General.getPropValByConst(propConst)
};

export const getFundCardAnnotation = id => {
  return axios.ArchiveFund.getFundCardAnnotation(id);
};

export const getFundCountData  = () => {
  return axios.General.getFundCountData()
    .then(json => json.data)
};

export const getCasesCount = (ids, cubeConst, dimConst) => {
  return axios.General.getCasesCount(ids, cubeConst, dimConst)
    .then(json => json.data)
};

export const appendFund = fd => {
  return axios.ArchiveFund.appendFund(fd)
    .then(json => json.data);
};

export const createObj = (cube, obj) => {
  return axios.Cube.createObj(cube, obj)
}

export const getAccessLevels = () => dispatch => {
  return axios.General.getAccessLevels()
    .then(json => dispatch(
      {
        type: GET_ACCESS_LEVEL,
        payload: json.data
      }
    ))
};

function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS
  }
}

function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    user,
  }
}

function getFactorValSuccess(data, CONST) {
  return {
    type: GET_FACTOR_VAL_SUCCESS,
    factorVal: CONST,
    data
  }
}
function getPropValSuccess(data, CONST) {
  return {
    type: GET_PROP_VAL,
    propVal: CONST,
    data
  }
}

function getCountriesSuccess(data) {
  return {
    type: GET_COUNTRIES_SUCCESS,
    countriesList: data
  }
}

function getCitiesSuccess(data) {
  return {
    type: GET_CITIES_SUCCESS,
    citiesList: data
  }
}

// not in use
/*export function getRRCubeSuccess(cube) {
  return {
    type: GET_RRCUBE_SUCCESS,
    cube
  }
}*/

function getAFCubeWithFundsSuccess(cube) {
  return {
    type: GET_AFCUBE_SUCCESS,
    name: 'funds',
    cube
  }
}

function getCubeSuccess(cubeConst, cube, options) {
  return {
    type: GET_CUBE_SUCCESS,
    cubeConst,
    cube,
    options
  }
}

function getRRCubeWithInventoriesSuccess(cube) {
  return {
    type: GET_RRCUBE_SUCCESS,
    name: 'inventories',
    cube
  }
}

function getRRCubeWithCasesSuccess(cube) {
  return {
    type: GET_RRCUBE_SUCCESS,
    name: 'cases',
    cube
  }
}

function getArchiveFundListSuccess(data) {
  return {
    type: GET_ARCHIVE_FUND_LIST_SUCCESS,
    data
  }
}

function getObjVerSuccess(verArr, objName='unset') {
  return {
    type: GET_OBJ_VER_SUCCESS,
    verArr,
    objName
  }
}

function getAllObjOfClsSuccess(objects, clsConst) {
  return {
    type: GET_ALL_OBJ_OF_CLS,
    objects,
    clsConst
  }
}

export const getObjByObjVal = (fd, reduxName) => dispatch =>
  axios.General.getObjByObjVal(fd)
    .then(res => {
      if(res.success) {
        return dispatch({
          type: GET_OBJ_BY_OBJ_VAL,
          data: res.data,
          reduxName
        })
      } else {
        throw res.errors
      }}
    );

export const getObjByProp = fd =>
  axios.General.getObjByProp(fd);

export const getObjFromProp = fd =>
  axios.General.getObjFromProp(fd);

export const getAllObjOfCls = (clsConst, dte='', propConsts) => dispatch => {
  return axios.General.getAllObjOfCls(clsConst, dte, propConsts)
    .then(res => {
      if(res.success) {
        return dispatch(getAllObjOfClsSuccess(res.data, clsConst));
      }
    })
};

export const dObj = fd =>
  axios.Cube.dObj(fd);

export const insPropVal = fd =>
  axios.General.insPropVal(fd)

export const addObjVer = fd =>
  axios.General.addObjVer(fd)

export const getObjList = fd =>
  axios.General.getObjList(fd)

export const getObjListNew = fd =>
  axios.General.getObjListNew(fd)

export const onAppLoad = () => dispatch => {
  return axios.Auth.getUser()
    .then(res => {
      if(res.success) {
        return dispatch(loginSuccess(res.data))
      } else {
        throw res.errors[0].text
      }
    });
};

export const listPropValRef = obj => {
  return axios.Test.listPropValRef(obj)
    .then(res => console.log(res))
    .catch(err => console.log(err))
};

export const changeInvOC = (invFrom, invTo) => {
  return axios.Works.changeInvOC(invFrom, invTo)
};

export const logout = () => dispatch => {
  return axios.Auth.logout()
    .then(() => dispatch(logoutSuccess()))
    .catch(err => console.log(err));
};

export const login = (login, password) => dispatch => {
  return axios.Auth.login(login, password)
    .then(res => {
      if(res.success) {
        dispatch(loginSuccess(res.data))
      } else {
        throw res.errors[0].text
      }
    });
    // .then( user => dispatch(loginSuccess(user)))
};

export const redirect = () => dispatch => {
  dispatch({
    type: REDIRECT
  })
};

export const addCaseToBasket = selectedCase => dispatch => {
  dispatch({
    type: ADD_CASE_TO_BASKET,
    selectedCase
  })
};

export const removeCaseFromBasket = selectedCase => dispatch => {
  dispatch({
    type: REMOVE_CASE_FROM_BASKET,
    selectedCase
  })
};

//not in use

/*export const fundsLoaded = () => dispatch => {
  const filter = '[{tableNameId:"do_1002", parent:"0"}]';
  return axios.Cube.getRRCube(filter)
    .then(cube => dispatch(getRRCubeWithFundsSuccess(cube)))
    .catch(err => console.log(err));
};*/

export const inventoriesLoaded = fundId => dispatch => {
  const filter = `[{tableNameId:"do_1002", parent:"${fundId}"}]`;
  return axios.Cube.getRRCube(filter)
    .then(cube => dispatch(getRRCubeWithInventoriesSuccess(cube)))
    .catch(err => console.log(err));
};

export const getObjVer = (objId, objName) => dispatch => {
  return axios.General.getObjVer(objId)
    .then(json => dispatch(getObjVerSuccess(json.data, objName)))
};

export const getObjVer_new = objId => {
  return axios.General.getObjVer(objId)
};

export const casesLoaded = inventId => dispatch => {
  const filter = `[{tableNameId:"do_1002", parent:"${inventId}"}]`;
  return axios.Cube.getRRCube(filter)
    .then(cube => dispatch(getRRCubeWithCasesSuccess(cube)))
    .catch(err => console.log(err));
};

export const getAFFundsCube = () => dispatch => {
  const filter = '[{tableNameId:"do_1005", parent:"0"}]';
  return axios.Cube.getAFCube(filter)
    .then(cube => dispatch(getAFCubeWithFundsSuccess(cube)))
    .catch(err => console.log(err));
};

export const getCube = (cubeSConst='', filters="", options={}) => dispatch => {
  return axios.Cube.getCube(cubeSConst, filters, options.nodeWithChilds)
    .then(res => res.data)
    .then(cube => dispatch(getCubeSuccess(cubeSConst, cube, options)))
};

export const updateCubeData = (cubeSConst='', dte='', datas='', options={}, files) => {
  return axios.Cube.updateCubeData(cubeSConst, dte, datas, files)
};

export const factorValLoaded = CONST => dispatch => {
  return axios.General.getFactorVal(CONST)
    .then(res => res.data)
    .then(json => dispatch(getFactorValSuccess(json.data, CONST)))
};

export const getPropVal = CONST => dispatch => {
  return axios.General.getPropValByConst(CONST)
    .then(json => dispatch(getPropValSuccess(json.data, CONST)))
};

export const countriesLoaded = () => dispatch => {
  return axios.General.getCountries()
    .then(res => res.data)
    .then(json => dispatch(getCountriesSuccess(json.data)))
};

export const citiesLoaded = countryId => dispatch => {
  return axios.General.getCities(countryId)
    .then(res => res.data)
    .then(json => dispatch(getCitiesSuccess(json.data)))
};

export const regNewUserSuccess = fd => dispatch => {
  return axios.Auth.regNewUser(fd)
};

export const getArchiveFundList = () => dispatch => {
  return axios.ArchiveFund.getArchiveFundList()
    .then(data => dispatch(getArchiveFundListSuccess(data)))
};

export const getAllConstants = () => dispatch => {
  return axios.General.getAllConstants()
    .then(json => json.data)
    .then(constants => {
      dispatch({
        type: GET_ALL_TOFI_CONSTANTS,
        constants
      });
      dispatch({
        type: GLOBAL_ERROR,
        text: ''
      })
    })
    .catch(() => {
      dispatch({
        type: GLOBAL_ERROR,
        text: 'Ошибка получения констант!'
      })
    })
};

export const redirectWithPush = path => dispatch => {
  dispatch(push(path));
};

export const getValuesOfObjsWithProps = fd =>
  axios.General.getValuesOfObjsWithProps(fd)


//////////////////////////////////////////// WORKS ////////////////////////////////////////////

export const rabota1 = idWork =>
  axios.Works.rabota1(idWork);

export const rabotaExp = idWork =>
  axios.Works.rabotaExp(idWork);

export const rabotaAcc = idWork =>
  axios.Works.rabotaAcc(idWork);

export const addDerivativeWorks = fd =>
  axios.Works.addDerivativeWorks(fd);

export const addDerivativeWorksExp = fd =>
  axios.Works.addDerivativeWorksExp(fd);

export const addDerivativeWorksAcc = fd =>
  axios.Works.addDerivativeWorksAcc(fd);

//////////////////////////////////////////// WORKS ////////////////////////////////////////////

