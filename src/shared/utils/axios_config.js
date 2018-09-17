import axios from 'axios';
import { forEach } from 'lodash';
import {CUBE_FOR_AF_FUND, CUBE_FOR_RR} from '../constants/tofiConstants';

axios.defaults.baseURL = `/${process.env.REACT_APP_APP_NAME}/a/archive/default`;

export const Auth = {
  login: (email, password) => {
      return (
        axios.get(`/${localStorage.getItem('i18nextLng')}/session/sessionIn?login=${email}&passwd=${password}`)
          .then(response => response.data)
    );
  },
  logout: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/Session/sessionOut`),
  getUser: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/session/aboutMe`)
      .then(response => response.data),
  regNewUser: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/researcher/insResearcher`, fd)
};

export const Test = {
  listPropValRef: obj =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/entity/listPropValRef?obj=${obj}`)
};

export const Cube = {
  getRRCube: filter => {
    if(!!filter) {
      return (
        axios.get(`/${localStorage.getItem('i18nextLng')}/cube/getCubeValues?cubeConst=${CUBE_FOR_RR}&filter=${filter}&dte=''`)
          .then(res => res.data.data)
      );
    } else {
      return (
        axios.get(`/${localStorage.getItem('i18nextLng')}/cube/getCubeValues?cubeConst=${CUBE_FOR_RR}&dte=''`)
          .then(res => res.data.data)
      );
    }
  },
  getAFCube: filter => {
    if(!!filter) {
      return (
        axios.get(`/${localStorage.getItem('i18nextLng')}/cube/getCubeValues?cubeConst=${CUBE_FOR_AF_FUND}&filter=${filter}&dte=''`)
          .then(res => res.data.data)
      );
    } else {
      return (
        axios.get(`/${localStorage.getItem('i18nextLng')}/cube/getCubeValues?cubeConst=${CUBE_FOR_AF_FUND}&dte=''`)
          .then(res => res.data.data)
      );
    }
  },
    getCube: (cubeSConst, filters, nodeWithChilds) => {
    const fd = new FormData();
    fd.append("cubeSConst", cubeSConst);
    fd.append("filters", filters);
    fd.append("nodeWithChilds", nodeWithChilds);
    // return axios.get(`/${localStorage.getItem('i18nextLng')}/cube/getInventory?cubeConst=${cubeConst}&${filter}&dte=''`)
    return axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd)
      .then(res => res.data);
  },
  updateCubeData: (cubeSConst, dte, datas, files) => {
    const fd = new FormData();
    fd.append("cubeSConst", cubeSConst);
    fd.append("dte", dte);
    fd.append("datas", datas);
    forEach(files, (fileArr, key) => {
      fileArr && fileArr.forEach((file, idx) => {
        file && fd.append(`files_${key}_${idx+1}`, file);
      });
    });
    return axios.post(`/${localStorage.getItem('i18nextLng')}/cube/saveCubeData`, fd)
      .then(res => res.data);
  },
  createObj: (cube, obj) => {
    const fd = new FormData();
    fd.append("cube", JSON.stringify(cube));
    fd.append("obj", JSON.stringify(obj));
    return axios.post(`/${localStorage.getItem('i18nextLng')}/cube/createObj`, fd)
      .then(res => res.data)
  },
  dObj: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/cube/dObj`, fd)
      .then(res => res.data)
};

export const General = {
  getFactorVal: CONST =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/factorVal/getFactorVal?factor=${CONST}`),
  getCountries: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/country/getCountries`),
  getCities: countryId =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/country/getCities?countryId=${countryId}`),
  getPropValById: id =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/archive/getPropVal?propId=${id}`)
      .then(res => res.data),
  getPropValByConst: propConst =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/archive/getPropVal?propConst=${propConst}`)
      .then(res => res.data),
  getAllConstants: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/utils/getAllConst`)
      .then(res => res.data),
  getObjVer: objId =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/obj/getVer?obj=${objId}`)
      .then(res => res.data),
  getFundCountData: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/archiveFund/getCounts`)
      .then(res => res.data),
  getCasesCount: (ids, cubeConst, dimConst) => {
    const fd = new FormData();
    fd.append('ids', ids);
    fd.append('cubeConst', cubeConst);
    fd.append('dimConst', dimConst);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/archiveFund/getCountCases`, fd)
      .then(res => res.data)
  },
  getAccessLevels: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/dict/getAccessLevel`)
      .then(res => res.data),
  getAllObjOfCls: (clsConst, dte, propConsts) =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/entity/getAllObjOfCls?clsConst=${clsConst}&dte=${dte}&propConsts=${propConsts}`)
      .then(res => res.data),
  insPropVal: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/insPropVal`, fd)
      .then(res => res.data),
  getObjList: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjList`, fd)
      .then(res => res.data),
  addObjVer: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/addObjVer`, fd)
      .then(res => res.data),
  getObjByObjVal: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/listObjByObjVal`, fd)
      .then(res => res.data),
  getObjByProp: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/listObjByProp`, fd)
      .then(res => res.data),
  getObjFromProp: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/listObjFromProp`, fd)
      .then(res => res.data),
  getValuesOfObjsWithProps: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getValuesOfObjsWithProps`, fd)
      .then(res => res.data),
  getObjListNew: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListNew`, fd)
      .then(res => res.data)
};

export const ArchiveFund = {
  getArchiveFundList: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/ArchiveFund/getFundList`)
      .then(response => response.data)
      .then(json => json.data),
  getFundCard: id =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/ArchiveFund/getFundCardMain?fundId=${id}`)
      .then(res => res.data)
      .then(data => data.data),
  getFundCardAnnotation: id =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/ArchiveFund/getFundCardAnnotation?fundId=${id}`)
      .then(res => res.data)
      .then(data => data.data),
  appendFund: fd => {
    return axios.post(`/${localStorage.getItem('i18nextLng')}/archiveFund/appendFund`, fd)
      .then(res => res.data)
  }
};

export const Works = {
  rabota1: idWork => {
    const fd = new FormData();
    fd.append('idWork', idWork);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/rabota1`, fd)
      .then(res => res.data)
  },
  rabotaExp: idWork => {
    const fd = new FormData();
    fd.append('idWork', idWork);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/rabotaExp`, fd)
      .then(res => res.data)
  },
  rabotaAcc: idWork => {
    const fd = new FormData();
    fd.append('idWork', idWork);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/rabotaAcc`, fd)
      .then(res => res.data)
  },
  addDerivativeWorks: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/addDerivativeWorks`, fd)
      .then(res => res.data),
  addDerivativeWorksExp: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/addDerivativeWorksExp`, fd)
      .then(res => res.data),
  addDerivativeWorksAcc: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/addDerivativeWorksAcc`, fd)
      .then(res => res.data),
  changeInvOC: (invFrom, invTo) => {
    const fd = new FormData();
    fd.append("invFrom", invFrom);
    fd.append("invTo", invTo);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/changeInvOC`, fd)
      .then(res => res.data)
  }
};
