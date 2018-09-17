import React from "react";
import {
  Button,
  Table,
  Tree,
  Icon,
  Popconfirm,
  Input,
  DatePicker,
  message
} from "antd";
import { CSSTransition } from "react-transition-group";
import SiderCardLegalEntities from "../SiderCardLegalEntities";
import { isEmpty, map } from "lodash";
import Select from "react-select";
import SelectVirt from "react-virtualized-select";

import { SYSTEM_LANG_ARRAY } from "../../../../constants/constants";
import { connect } from "react-redux";
import {
  createObj,
  getCube,
  getObjFromProp,
  getObjListNew,
  getPropVal,
  updateCubeData
} from "../../../../actions/actions";
import moment from "moment";
import { getPropMeta, parseCube_new } from "../../../../utils/cubeParser";
import {
  CUBE_FOR_AF_CASE,
  CUBE_FOR_AF_INV
} from "../../../../constants/tofiConstants";
import LegalEntitiesInventoryProps from "./LegalEntitiesInventoryProps";
import Form_invTypePerm_uprDoc from "./forms/Form_invTypePerm_uprDoc";

/*eslint eqeqeq:0*/

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable ? (
      <Input
        style={{ margin: "-5px 0" }}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    ) : (
      value
    )}
  </div>
);

const TreeNode = Tree.TreeNode;

class LegalEntitiesInventoriesMain extends React.Component {
  //=============================================================forms===================================================
  /*buildTableColumns = (invType, documentType) => {
    const { invTypePerm, uprDoc, uprNTD, invTypeVideo, videoDoc,
      caseNumber, caseDbeg, caseDend, caseNumberOfPages, caseOCD, fundIndex, caseNotes, uprDocType, documentAuthor,
      addressee, question, terrain, documentDate, inaccurateDate, inaccurateDateFeature, day, month, year,
      numberOfOriginals, typeOfPaperCarrier, caseNomenItem, objectCode, projectName, projectStage, projectPartName,
      volumeNumber, yearOfCompletion, accountingUnitNumber, authorTitle, cameraOperator, artistOfTheWork,
      documentLanguage, dateOfRecording, timingOfVideoRecording, TypeAndFormatOfRecording, copy, original, numberOfVideoItems,
      compositionOfTextDocumentation,
    } = this.props.tofiConstants;
  };*/
  getRespForm = (invType, documentType) => {
    const {
      getPropVal,
      tofiConstants,
      t,
      uprDocTypeOptions,
      inaccurateDateFeatureOptions,
      typeOfPaperCarrierOptions
    } = this.props;
    const {
      invTypePerm,
      uprDoc,
      uprNTD,
      invTypeVideo,
      videoDoc
    } = tofiConstants;
    switch (true) {
      case invType == invTypePerm.id && documentType == uprDoc.id:
        return (
          <Form_invTypePerm_uprDoc
            uprDocTypeOptions={uprDocTypeOptions}
            inaccurateDateFeatureOptions={inaccurateDateFeatureOptions}
            typeOfPaperCarrierOptions={typeOfPaperCarrierOptions}
            getPropVal={getPropVal}
            tofiConstants={tofiConstants}
            t={t}
          />
        );
      case invType == invTypePerm.id && documentType == uprNTD.id:
        return <h1>form2</h1>;
      case invType == invTypeVideo.id && documentType == videoDoc.id:
        return <h1>form3</h1>;
      default:
        return <h1>no form specified</h1>;
    }
  };

  //=============================================================forms===================================================

  state = {
    data: [],
    loading: false,
    formData: {},
    treeData: [],
    hierarchyTreeData: [],
    selectedNode: {},
    openCard: false,
    openPropsForm: true,
    lInv: {},
    checkedKeys: [],
    hierarchyCheckedKeys: [],
    nomenOptions: []
  };

  onCheck = (checkedKeys, e) => {
    const lastCheckedKeys = checkedKeys.filter(
      key => e.checkedNodes.find(o => o.key === key).props.isLeaf
    );
    this.setState({ checkedKeys: lastCheckedKeys });
  };
  onHierarchyCheck = (checkedKeys, e) => {
    const lastCheckedKeys = checkedKeys.filter(
      key => e.checkedNodes.find(o => o.key === key).props.isLeaf
    );
    this.setState({ hierarchyCheckedKeys: lastCheckedKeys });
  };

  addNew = () => {
    this.setState({
      hierarchyTreeData: [
        ...this.state.hierarchyTreeData,
        {
          key: `newData_${this.state.hierarchyTreeData.length}`,
          parent: this.state.lInv.id,
          objClass: "structuralSubdivisionList",
          title: (
            <Input
              name={`newData_${this.state.hierarchyTreeData.length}`}
              onPressEnter={this.saveHierarchy}
            />
          )
        }
      ]
    });
  };
  addNewChild = type => {
    const newHierarchyTreeData = this.state.hierarchyTreeData.slice();
    const key = this.state.selectedNode.key;

    const row = this.getObject(newHierarchyTreeData, key);

    if (row) {
      switch (type) {
        case "structuralSubdivisionList":
          if (!row.children) row.children = [];
          row.children.push({
            key: `newData_${row.key}_${row.children.length}`,
            parent: key,
            objClass: "structuralSubdivisionList",
            title: (
              <Input
                name={`newData_${row.key}_${row.children.length}`}
                onPressEnter={this.saveHierarchy}
              />
            )
          });
          break;
        case "caseList":
          if (!row.children) row.children = [];
          this.state.checkedKeys.forEach(key => {
            const branch = this.getObject(this.state.treeData, key);
            console.log(branch, key);
            if (branch) {
              row.children.push({
                key,
                parent: row.key,
                objClass: "caseList",
                title: branch.title
              });
            }
          });
          break;
        default:
          break;
      }

      this.setState({
        data: newHierarchyTreeData,
        openCard: false,
        defaultExpandedKeys: [key]
      });
    }
  };

  saveHierarchy = e => {
    const newHierarchyTreeData = this.state.hierarchyTreeData.slice();
    const [key, value] = [e.target.name, e.target.value];
    const target = this.getObject(newHierarchyTreeData, key);

    if (target) {
      const { parent, objClass } = target;
      const name = {};
      SYSTEM_LANG_ARRAY.forEach(lang => {
        name[lang] = value;
      });
      const cube = {
        cubeSConst: "CubeForAF_Inv",
        doConst: "doForInv",
        dpConst: "dpForInv"
      };
      const obj = {
        name,
        fullName: name,
        clsConst: objClass,
        parent: parent.split("_")[1]
      };
      const hideCreateObj = message.loading("CREATING_NEW_OBJECT", 100);
      createObj(cube, obj)
        .then(res => {
          hideCreateObj();
          if (res.success) {
            target.key = res.data.idItemDO;
            message.success("OBJECT_CREATED_SUCCESSFULLY");
            target.title = value;
            this.setState({ hierarchyTreeData: newHierarchyTreeData });
          }
        })
        .catch(err => {
          hideCreateObj();
          console.error(err);
        });
    }
  };
  getObject = (theObject, key) => {
    let result = null;
    if (theObject instanceof Array) {
      for (let i = 0; i < theObject.length; i++) {
        result = this.getObject(theObject[i], key);
        if (result) return result;
      }
    } else if (theObject instanceof Object) {
      if (theObject.key == key) {
        return theObject;
      }
      result = this.getObject(theObject.children, key);
    } else return null;
    return result;
  };
  removeObject = (theObject, key) => {
    let result = null;
    if (theObject instanceof Array) {
      for (let i = 0; i < theObject.length; i++) {
        result = this.removeObject(theObject[i], key);
        if (result) {
          // eslint-disable-next-line
          theObject.forEach((item, idx) => {
            if (item.key === result.key) {
              theObject.splice(idx, 1);
              return;
            }
          });
        }
      }
    } else if (theObject instanceof Object) {
      if (theObject.key === key) {
        return theObject;
      }
      result = this.removeObject(theObject.children, key);
    } else return null;
    return result;
  };

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  };
  closeCard = () => {
    this.setState({ openCard: false });
  };
  /*handleChange(value, key, column) {
    const newData = this.state.data.slice();
    const target = this.getObject(newData, key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }*/

  stopPropagation = e => {
    e.stopPropagation();
  };
  /*save = key => {
    return e => {
      e.stopPropagation();
      const newData = this.state.data.slice();
      const target = this.getObject(newData, key);

      if (target) {
        const { parent, editable, cases, key, objClass, ...rest } = target;

        if(objClass === 'structuralSubdivisionList') {
          const name = {};
          SYSTEM_LANG_ARRAY.forEach(lang => {
            name[lang] = rest.fundIndex
          });
          const cube = {
            cubeSConst: 'CubeForAF_Inv',
            doConst: 'doForInv',
            dpConst: 'dpForInv'
          };
          const obj = {
            name,
            fullName: name,
            clsConst: objClass,
            parent: parent.split('_')[1]
          };
          if(target.key.startsWith('newData')) {
            const hideCreateObj = message.loading('CREATING_NEW_OBJECT', 0);
            createObj(cube, obj)
              .then(res => {
                hideCreateObj();
                if(res.success) {
                  target.key = res.data.idItemDO;
                  message.success('OBJECT_CREATED_SUCCESSFULLY');
                  delete target.editable;
                  this.setState({ data: newData });
                }
              }).catch(err => {
              hideCreateObj();
              console.log(err);
            });
          } else {
            this.onSaveCubeData({cube, obj}, {}, target.key, {name})
              .then(resp => {
                if(resp.success) {
                  delete target.editable;
                  this.setState({ data: newData });
                }
              }).catch(err => {
              console.log(err);
            });
          }
        }
        else {
          const name = {};
          SYSTEM_LANG_ARRAY.forEach(lang => {
            name[lang] = cases
          });
          const cube = {
            cubeSConst: 'CubeForAF_Case',
            doConst: 'doForCase',
            dpConst: 'dpForCase'
          };
          const obj = {
            name,
            fullName: name,
            clsConst: objClass,
            parent: parent.split('_')[1]
          };
          if(target.key.startsWith('newData')) {
            const hideCreateObj = message.loading('CREATING_NEW_OBJECT', 0);
            createObj(cube, obj)
              .then(res => {
                hideCreateObj();
                if(res.success) {
                  target.key = res.data.idItemDO;
                  const filters = {
                    filterDOAnd: [
                      {
                        dimConst: cube.doConst,
                        concatType: "and",
                        conds: [
                          {
                            ids: res.data.idItemDO
                          }
                        ]
                      }
                    ]
                  };
                  return this.props.getCube(cube.cubeSConst, JSON.stringify(filters));
                }
              })
              .then(() => {
                this.filters = null;
                return this.onSaveCubeData({cube, obj}, rest, target.key, {})
              })
              .then(resp => {
                if(resp.success) {
                  delete target.editable;
                  this.setState({ data: newData });
                }
              })
              .catch(err => {
              hideCreateObj();
              console.log(err);
            });
          } else {
            this.onSaveCubeData({cube, obj}, rest, target.key, {})
              .then(resp => {
                if(resp.success) {
                  delete target.editable;
                  this.setState({ data: newData });
                }
              }).catch(err => {
              console.log(err);
            });
          }
        }
      }
    }
  };*/
  remove = key => {
    const newData = this.state.data.slice();
    this.removeObject(newData, key);
    this.setState({ data: newData });
  };

  loadOptions = c => {
    return () => {
      if (!this.props[c + "Options"]) {
        this.props.getPropVal(c);
      }
    };
  };

  onSelect = (selectedKeys, info) => {
    if (info.node.props.dataRef.objClass === "caseList") {
      this.setState({
        selectedNode: {}
      });
      return;
    }
    if (!info.node.props.dataRef.key.startsWith("newData")) {
      this.setState({ selectedNode: info.node.props.dataRef });
    }
  };

  openArticles = () => {
    const invNomenValue = this.state.formData.invNomen.map(obj => obj.value);
    invNomenValue.forEach(val => {
      const fd = new FormData();
      fd.append("parent", String(val));
      fd.append("propConsts", "nomenIndex");
      getObjListNew(fd)
        .then(res => {
          if (res.success) {
            this.setState({
              loading: false,
              treeData: this.state.treeData.concat(
                res.data.map(o => ({
                  key: o.id,
                  title: o.name[this.lng],
                  isLeaf: !o.hasChild,
                  nomenIndex: o.nomenIndex && o.nomenIndex[this.lng]
                }))
              )
            });
          } else {
            console.log(res);
            this.setState({ loading: false, openCard: false });
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, openCard: false });
        });
      this.setState({ openCard: true, cardLoading: true });
    });
  };
  onLoadData = treeNode => {
    if (treeNode.props.dataRef.children) {
      return Promise.resolve({ success: true });
    }
    const fd = new FormData();
    fd.append("parent", treeNode.props.dataRef.key);
    fd.append("propConsts", "nomenIndex");
    return getObjListNew(fd)
      .then(res => {
        if (res.success) {
          treeNode.props.dataRef.children = res.data.map(o => ({
            key: o.id,
            title: o.name[this.lng],
            isLeaf: !o.hasChild,
            nomenIndex: o.nomenIndex && o.nomenIndex[this.lng]
            // perechenNote: o.perechenNote,
            // shelfLifeOfPerechen: o.shelfLifeOfPerechen
          }));
          this.setState({
            treeData: [...this.state.treeData]
          });
          return { success: true };
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  createNewObj = async (objVerData, values, objData) => {
    const hideCreateObj = message.loading("CREATING_NEW_OBJECT", 100);
    try {
      const createdObj = await createObj(objVerData.cube, objVerData.obj);
      hideCreateObj();
      if (createdObj.success) {
        const filters = {
          filterDOAnd: [
            {
              dimConst: objVerData.cube.doConst,
              concatType: "and",
              conds: [
                {
                  ids: createdObj.data.idItemDO
                }
              ]
            }
          ]
        };
        await this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(filters));
        const savedCubeData = await this.onSaveCubeData(
          objVerData,
          values,
          createdObj.data.idItemDO,
          objData
        );
        if (savedCubeData.success) {
          const { doForInv, dpForInv } = this.props.tofiConstants;
          this.setState({
            loading: false,
            formData: values,
            openPropsForm: false,
            lInv: parseCube_new(
              this.props.CubeForAF_Inv["cube"],
              [],
              "dp",
              "do",
              this.props.CubeForAF_Inv[`do_${doForInv.id}`],
              this.props.CubeForAF_Inv[`dp_${dpForInv.id}`],
              `do_${doForInv.id}`,
              `dp_${dpForInv.id}`
            )[0]
          });
        }
        return Promise.resolve();
      }
    } catch (err) {
      return Promise.reject();
      console.error(err);
    }
  };
  onSaveCubeData = (
    objVerData,
    { agreementProtocol, agreement2Protocol, approvalProtocol, ...values },
    doItemProp,
    objDataProp
  ) => {
    let datas = [];
    try {
      datas = [
        {
          own: [
            {
              doConst: objVerData.cube.doConst,
              doItem: doItemProp,
              isRel: "0",
              objData: objDataProp
            }
          ],
          props: map(values, (val, key) => {
            const propMetaData = getPropMeta(
              this.props[objVerData.cube.cubeSConst][
                "dp_" + this.props.tofiConstants[objVerData.cube.dpConst].id
              ],
              this.props.tofiConstants[key]
            );
            let value = val;
            if (
              (propMetaData.typeProp === 315 ||
                propMetaData.typeProp === 311 ||
                propMetaData.typeProp === 317) &&
              typeof val === "string"
            )
              value = { kz: val, ru: val, en: val };
            if (typeof val === "object" && val.value) value = String(val.value);
            if (typeof val === "object" && val.mode)
              propMetaData.mode = val.mode;
            if (propMetaData.isUniq === 2 && val[0] && val[0].value) {
              propMetaData.mode = val[0].mode;
              value = val.map(v => String(v.value)).join(",");
            }
            return {
              propConst: key,
              val: value,
              typeProp: String(propMetaData.typeProp),
              periodDepend: String(propMetaData.periodDepend),
              isUniq: String(propMetaData.isUniq),
              mode: propMetaData.mode
            };
          }),
          periods: [{ periodType: "0", dbeg: "1800-01-01", dend: "3333-12-31" }]
        }
      ];
    } catch (err) {
      console.error(err);
      return Promise.reject();
    }
    const hideLoading = message.loading("UPDATING_PROPS", 100);
    return updateCubeData(
      objVerData.cube.cubeSConst,
      moment().format("YYYY-MM-DD"),
      JSON.stringify(datas),
      {},
      { approvalProtocol, agreementProtocol, agreement2Protocol }
    )
      .then(res => {
        hideLoading();
        if (res.success) {
          message.success("PROPS_SUCCESSFULLY_UPDATED");
          if (this.filters) {
            this.setState({ loading: true });
            return this.props
              .getCube(objVerData.cube.cubeSConst, JSON.stringify(this.filters))
              .then(() => {
                this.setState({ loading: false });
                return { success: true };
              });
          } else {
            return { success: true };
          }
        } else {
          message.error("PROPS_UPDATING_ERROR");
          if (res.errors) {
            res.errors.forEach(err => {
              message.error(err.text);
            });
            return { success: false };
          }
        }
      })
      .catch(err => {
        console.error(err);
        return Promise.reject();
      });
  };

  render() {
    if (isEmpty(this.props.tofiConstants)) return null;
    const {
      openCard,
      openPropsForm,
      data,
      treeData,
      lInv,
      formData
    } = this.state;
    const {
      t,
      invTypeOptions,
      invCaseSystemOptions,
      documentTypeOptions,
      tofiConstants
    } = this.props;

    this.lng = localStorage.getItem("i18nextLng");
    return (
      <div className="LegalEntitiesInventoriesMain">
        <CSSTransition
          in={openPropsForm}
          timeout={300}
          classNames="card"
          unmountOnExit={false}
        >
          <div className="LegalEntitiesInventoriesMain__property">
            <LegalEntitiesInventoryProps
              tofiConstants={tofiConstants}
              lng={this.lng}
              user={this.props.user}
              createNewObj={this.createNewObj}
              t={t}
              getNomenOptions={() => {
                const fd = new FormData();
                fd.append(
                  "objId",
                  this.props.location.state.record.key.split("_")[1]
                );
                fd.append("propConst", "nomen");
                getObjFromProp(fd).then(res => {
                  if (res.success) {
                    this.setState({
                      nomenOptions:
                        res.data.length !== 0
                          ? res.data.map(option => ({
                              value: option.id,
                              label: option.name[this.lng]
                            }))
                          : []
                    });
                  }
                });
              }}
              record={
                this.props.location &&
                this.props.location.state &&
                this.props.location.state.record
              }
              nomenOptions={this.state.nomenOptions}
              invTypeOptions={invTypeOptions}
              documentTypeOptions={documentTypeOptions}
              invCaseSystemOptions={invCaseSystemOptions}
              loadOptions={this.loadOptions}
            />
          </div>
        </CSSTransition>
        <div className="LegalEntitiesInventoriesMain__table">
          <Button
            id="trigger"
            size="small"
            shape="circle"
            icon={openPropsForm ? "arrow-left" : "arrow-right"}
            onClick={() =>
              this.setState({ openPropsForm: !this.state.openPropsForm })
            }
          />
          <div className="LegalEntitiesInventoriesMain__table__heading">
            <div className="table-header">
              <Button onClick={this.addNew} disabled={!lInv.id}>
                {t("ADD")}
              </Button>
              <Button
                onClick={() => this.addNewChild("structuralSubdivisionList")}
                disabled={isEmpty(this.state.selectedNode)}
              >
                {t("ADD_FIRST_LEVEL_CHILD")}
              </Button>
              <Button
                onClick={this.openArticles}
                disabled={isEmpty(this.state.selectedNode)}
              >
                {t("ADD_SECOND_LEVEL_CHILD")}
              </Button>
              {lInv.name && (
                <h3
                  style={{
                    textAlign: "right",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    paddingRight: "10px"
                  }}
                >
                  {lInv.name.kz}
                </h3>
              )}
            </div>
          </div>
          <div className="LegalEntitiesInventoriesMain__table__body">
            <div className="LegalEntitiesInventoriesMain__table__body-tree">
              <Tree
                defaultExpandedKeys={this.state.defaultExpandedKeys}
                autoExpandParent
                defaultExpandAll
                onSelect={this.onSelect}
                showLine
              >
                {this.renderTreeNodes(this.state.hierarchyTreeData)}
              </Tree>
            </div>
            <div className="LegalEntitiesInventoriesMain__table__body-form">
              {this.getRespForm(
                formData.invType && formData.invType.value,
                formData.documentType && formData.documentType.value
              )}
            </div>
            <CSSTransition
              in={openCard}
              timeout={300}
              classNames="card"
              unmountOnExit
            >
              <SiderCardLegalEntities
                closer={
                  <Button
                    type="danger"
                    onClick={this.closeCard}
                    shape="circle"
                    icon="arrow-right"
                  />
                }
              >
                <Tree
                  checkable
                  loadData={this.onLoadData}
                  onCheck={this.onCheck}
                  checkedKeys={this.state.checkedKeys}
                >
                  {this.renderTreeNodes(treeData)}
                </Tree>
                <div className="ant-form-btns">
                  <Button onClick={() => this.addNewChild("caseList")}>
                    Сформировать
                  </Button>
                </div>
              </SiderCardLegalEntities>
            </CSSTransition>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    CubeForAF_Inv: state.cubes[CUBE_FOR_AF_INV],
    CubeForAF_Case: state.cubes[CUBE_FOR_AF_CASE],
    invTypeOptions: state.generalData.invType,
    invCaseSystemOptions: state.generalData.invCaseSystem,
    documentTypeOptions: state.generalData.documentType,
    typeOfPaperCarrierOptions: state.generalData.typeOfPaperCarrier,
    inaccurateDateFeatureOptions: state.generalData.inaccurateDateFeature,
    uprDocTypeOptions: state.generalData.uprDocType
  };
}

export default connect(
  mapStateToProps,
  { getPropVal, getCube }
)(LegalEntitiesInventoriesMain);
