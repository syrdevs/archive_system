import React from 'react'
import {Modal, Checkbox, Tooltip} from 'antd'
import { TiDocumentText } from 'react-icons/lib/ti';
import AntTable from '../AntTable'

const Basket = props => {
        const { basket, basketState, t } = props;
        let okBtnText, cancelBtnText;
        switch(localStorage.getItem('i18nextLng')) {
          case 'kz':
            okBtnText = 'Заказать';
            cancelBtnText = 'Болдырмау';
            break;
          case 'ru':
            okBtnText = 'Заказать';
            cancelBtnText = 'Отмена';
            break;
          default:
            okBtnText = 'Confirm';
            cancelBtnText = 'Cancel';
            break;
        }
        console.log('basket', basket);

        const data = basketState.map(item => {
            return {...item, createdDate: {...item, createdDate: (new Date()).toLocaleDateString("en-US")}, chooseCases: {...item}}
        });

        return <div>
                    <Modal title={ props.title }
                        visible={ props.show }
                        okText={ okBtnText }
                        cancelText={ cancelBtnText }
                        onCancel={ props.onCancel }
                        onOk={ props.onOk }
                        width={ props.width }
                    >
                    <AntTable
                                openedBy='Cases'
                                loading={false}
                                hidePagination={true}
                                columns={
                                    [
                                        {
                                            key: 'createdDate',
                                            title: 'Дата выбора',
                                            dataIndex: 'createdDate',
                                            width: '20%',
                                            render: obj => {
                                                return <div>
                                                <Tooltip
                                                  title={() =>
                                                    <div>
                                                      <div>{t('FUND_NUMB') + ': ' + obj.fundNumb}</div>
                                                      <div>{t('INVENT_NUMB') + ': ' + obj.inventNumb}</div>
                                                      <div>{t('CASE_NUMB') + ': ' + obj.caseNumb}</div>
                                                    </div>}
                                                  key={obj.key}
                                                  placement="left"
                                                >
                                                <div className="basketDropdown__list__icon"><TiDocumentText size={20}/></div>
                                                <label>{obj.createdDate}</label>
                                                </Tooltip>
                                                </div>
                                            }
                                        },
                                        {
                                            key: 'archivalCipher',
                                            title: t('ARCHIVALCIPHER'),
                                            dataIndex: 'archivalCipher',
                                            width: '25%'
                                        },
                                        {
                                            key: 'title',
                                            title: t('TITLE'),
                                            dataIndex: 'title',
                                            width: '25%'
                                        },
                                        {
                                            key: 'deadline',
                                            title: t('DEADLINE'),
                                            dataIndex: 'deadline',
                                            width: '20%'
                                        },
                                        {
                                            key: 'chooseCases',
                                            title: t('CHOOSECASES'),
                                            dataIndex: 'chooseCases',
                                            width: '10%',
                                            render: obj => {
                                                return <Checkbox onChange={() => props.handleListItemClick(obj)} checked={basket.some(el => el.key === obj.key)}/>
                                            }
                                        }
                                    ]
                                }
                                dataSource={Array.isArray(data) && data.length > 0 ? data : []}
                                changeSelectedRow={() => {}}
                            />
                    {/* <ul className="basketDropdown">
                      {
                        basketState.map(item =>
                          <Tooltip
                            title={() =>
                              <div>
                                <div>{t('FUND_NUMB') + ': ' + item.fundNumb}</div>
                                <div>{t('INVENT_NUMB') + ': ' + item.inventNumb}</div>
                                <div>{t('CASE_NUMB') + ': ' + item.caseNumb}</div>
                              </div>}
                            key={item.key}
                            placement="left"
                          >
                            <li className="basketDropdown__list" onClick={() => props.handleListItemClick(item)}>
                              <div className="basketDropdown__list__icon"><TiDocumentText size={20}/></div>
                              <div className="basketDropdown__list__name">{item.title}</div>
                              <div className="basketDropdown__list__check"><Checkbox checked={basket.some(el => el.key === item.key)}/></div>
                            </li>
                          </Tooltip>
                        )
                      }
                    </ul> */}
                    </Modal>
        </div>
}
  
export default Basket;